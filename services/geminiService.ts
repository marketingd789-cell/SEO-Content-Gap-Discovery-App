import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WebsiteAnalysis, GeneratedContent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to robustly extract JSON from potential Markdown or conversational text
const cleanJson = (text: string): string => {
  // 1. Try to extract from code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // 2. If no code blocks, look for the outermost JSON object {}
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  
  // 3. Fallback
  return text.trim();
};

export const analyzeWebsite = async (url: string): Promise<WebsiteAnalysis> => {
  // Upgraded to Pro for complex multi-step analysis and reasoning
  const model = "gemini-3-pro-preview"; 

  const prompt = `
    I need a comprehensive SEO & Content Strategy analysis for the website: ${url}.
    
    Step 1: Analyze the User's Website (${url}).
    - Identify its main product categories.
    - **CRITICAL**: Check for a /blog, /news, or /insights section. Identify the main topics, themes, or specific articles they currently have. If they have no blog, explicitly note that in the data.

    Step 2: Find top 3 organic competitors.
    - For each competitor, analyze their **Blog & Content Strategy**. What specific topics are they writing about that drive traffic?
    - Identify their top keywords.

    Step 3: Perform a "Content Gap Analysis" (Focus on Blogs).
    - Compare competitor blog themes against ${url}'s content.
    - Identify specific **Blog Topics** that competitors have written about but ${url} is missing.
    - **CRITICAL**: Provide a list of **at least 20 distinct blog post opportunities** that would help the user rank better.
    - Identify missing product categories.

    Return the result strictly in the following JSON format. Do not add any conversational text or markdown formatting outside the JSON:
    {
      "url": "${url}",
      "websiteScore": 50, // Estimate visibility score (0-100)
      "categories": ["Product Category 1", "Product Category 2"],
      "blogThemes": ["Current Blog Theme 1", "Current Blog Theme 2"], // If none, return empty array
      "competitors": [
        {
          "name": "Competitor Name",
          "url": "competitor.com",
          "topKeywords": ["keyword1", "keyword2"],
          "strengths": ["Reason they rank well"],
          "visibilityScore": 85,
          "blogThemes": ["Competitor Blog Theme 1", "Competitor Blog Theme 2"]
        }
      ],
      "opportunities": [
        {
          "id": "unique_id_1",
          "title": "Specific Blog Title to Write",
          "type": "blog", // or "product_category"
          "difficulty": "Medium",
          "reason": "Competitor X covers this topic extensively, you have 0 pages on it.",
          "targetKeyword": "main keyword"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
        // Note: responseMimeType cannot be used with googleSearch tool
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No analysis data received from Gemini.");
    }

    console.log("Gemini Raw Response:", text); // Keep for debugging
    const cleanedText = cleanJson(text);
    const parsed = JSON.parse(cleanedText);

    // Validate and fill defaults to prevent UI crashes
    return {
        url: parsed.url || url,
        websiteScore: typeof parsed.websiteScore === 'number' ? parsed.websiteScore : 50,
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        blogThemes: Array.isArray(parsed.blogThemes) ? parsed.blogThemes : [],
        competitors: Array.isArray(parsed.competitors) ? parsed.competitors : [],
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : []
    } as WebsiteAnalysis;

  } catch (error: any) {
    console.error("Analysis failed:", error);
    // Return a more user-friendly error if it's a JSON parse issue
    if (error instanceof SyntaxError) {
        throw new Error("Received malformed data from AI agent. Please try again.");
    }
    throw new Error(error.message || "Failed to analyze website. Please try again.");
  }
};

export const generateOptimizedContent = async (
  topic: string, 
  keyword: string,
  type: string
): Promise<GeneratedContent> => {
  const model = "gemini-3-pro-preview"; 

  const prompt = `
    Act as a world-class SEO Content Writer and expert in GEO (Generative Engine Optimization).
    
    Target Topic: "${topic}"
    Target Keyword: "${keyword}"
    Content Type: ${type}
    
    Goal: Create content that ranks in AI Overviews (Google SGE, Gemini, ChatGPT Search) and search engines.
    
    GEO & SEO Strategy:
    1. **Direct Answer Optimization**: Start with a clear, concise definition or answer to the core query (approx 40-60 words) immediately after the H1. This targets the "snapshot".
    2. **Structured Knowledge**: Use bullet points, numbered lists, and comparison tables. AI models prefer structured data.
    3. **Authority & Citations**: Include expert insights or mention statistics to build trust.
    4. **Comprehensive Coverage**: Cover related entities and "People Also Ask" questions as H2s or H3s.
    5. **Fluency & Simplicity**: Use simple sentence structures. Avoid fluff.
    6. **Meta Data Optimization**:
       - **Title Tag**: Create a high-CTR title (under 60 chars) that strictly includes the primary keyword "${keyword}".
       - **Meta Description**: Write a persuasive summary (under 160 chars) that includes the primary keyword "${keyword}" and a clear value proposition.
    
    Format Requirements:
    - Use proper Markdown (H1, H2, H3, Bold, Lists, Tables).
    - Length: 800-1200 words.
    
    Output strictly in this JSON format:
    {
      "title": "GEO Optimized Title",
      "metaDescription": "Click-worthy meta description under 160 chars",
      "targetKeywords": ["${keyword}", "semantic keyword 1", "semantic keyword 2"],
      "content": "Full markdown content here..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            content: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text) as GeneratedContent;
  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("Failed to generate content.");
  }
};

import React, { useState } from 'react';
import { WebsiteAnalysis, GeneratedContent, AppState, ContentOpportunity } from './types';
import { analyzeWebsite, generateOptimizedContent } from './services/geminiService';
import AnalysisDashboard from './components/AnalysisDashboard';
import ContentGenerator from './components/ContentGenerator';
import { Layout, Globe, Search, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<WebsiteAnalysis | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('Initializing AI agents...');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic URL validation
    let formattedUrl = url;
    if (!url.startsWith('http')) {
        formattedUrl = `https://${url}`;
    }

    setState(AppState.ANALYZING);
    setLoadingMsg("Scanning website for products and blog content...");
    
    // Simulate loading steps for UX
    setTimeout(() => setLoadingMsg("Analyzing competitor blog strategies..."), 2500);
    setTimeout(() => setLoadingMsg("Identifying content gaps and missing topics..."), 5000);

    try {
      const data = await analyzeWebsite(formattedUrl);
      setAnalysisData(data);
      setState(AppState.RESULTS);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during analysis.');
      setState(AppState.ERROR);
    }
  };

  const handleGenerateContent = async (opportunity: ContentOpportunity) => {
    setState(AppState.GENERATING_CONTENT);
    setLoadingMsg(`Drafting optimized content for "${opportunity.title}"...`);
    
    try {
      const content = await generateOptimizedContent(
        opportunity.title,
        opportunity.targetKeyword,
        opportunity.type
      );
      setGeneratedContent(content);
    } catch (err: any) {
      setErrorMsg('Failed to generate content. Please try again.');
      // Revert to dashboard on error
      setState(AppState.RESULTS);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setAnalysisData(null);
    setGeneratedContent(null);
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Layout className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">GEO Strategist</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-md border border-green-200">
                Gemini 2.5 Flash + 3 Pro
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {state === AppState.IDLE && (
          <div className="max-w-2xl mx-auto mt-20 text-center animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Dominate Search with <span className="text-blue-600">Generative AI</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Enter your website URL to instantly analyze competitors, identify content gaps, and generate high-ranking, GEO-optimized articles.
            </p>
            
            <form onSubmit={handleAnalyze} className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg shadow-blue-900/5 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 transition-colors flex items-center gap-2"
              >
                Analyze <Search size={16} />
              </button>
            </form>

            <div className="mt-12 flex justify-center gap-8 text-slate-400">
                <div className="flex flex-col items-center gap-2">
                    <Search size={24} />
                    <span className="text-xs font-medium">Competitor Analysis</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Layout size={24} />
                    <span className="text-xs font-medium">Gap Detection</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Sparkles size={24} />
                    <span className="text-xs font-medium">GEO Content</span>
                </div>
            </div>
          </div>
        )}

        {(state === AppState.ANALYZING || state === AppState.GENERATING_CONTENT) && (
          <div className="flex flex-col items-center justify-center mt-32 animate-pulse">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                <Loader2 className="text-blue-600 animate-spin relative z-10" size={64} />
            </div>
            <h3 className="mt-8 text-xl font-semibold text-slate-800">{loadingMsg}</h3>
            <p className="mt-2 text-slate-500 text-sm">Powered by Google Gemini</p>
          </div>
        )}

        {state === AppState.ERROR && (
           <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <AlertTriangle className="mx-auto text-red-500 mb-4" size={32} />
              <h3 className="text-lg font-bold text-red-700 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-6">{errorMsg}</p>
              <button 
                onClick={reset}
                className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Try Again
              </button>
           </div>
        )}

        {state === AppState.RESULTS && analysisData && (
          <AnalysisDashboard 
            data={analysisData} 
            onGenerate={handleGenerateContent} 
          />
        )}

        {state === AppState.GENERATING_CONTENT && generatedContent && (
            // Wait for generation to finish to show content, effectively managed by state transition below
            // This block is technically reachable only after state transitions back if we didn't use a separate state
            // But for this flow, we render the ContentGenerator component when we have content
            null
        )}

        {/* When we have content, we override the dashboard view or show it in a dedicated view. 
            For simplicity, let's treat GENERATING_CONTENT as a loading state, 
            and introduce a CONTENT_VIEW state or just render conditionally. 
            Let's adjust the logic: if we have generatedContent, show it.
        */}
        {generatedContent && state !== AppState.GENERATING_CONTENT && (
            <ContentGenerator 
                content={generatedContent} 
                onBack={() => {
                    setGeneratedContent(null);
                    setState(AppState.RESULTS);
                }} 
            />
        )}
      </main>
    </div>
  );
};

export default App;
import React from 'react';
import { WebsiteAnalysis, ContentOpportunity } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, TrendingUp, Search, FileText, AlertCircle, CheckCircle, BarChart3, BookOpen, Layers } from 'lucide-react';

interface Props {
  data: WebsiteAnalysis;
  onGenerate: (opp: ContentOpportunity) => void;
}

const AnalysisDashboard: React.FC<Props> = ({ data, onGenerate }) => {
  
  // Use real visibility scores from the analysis
  const chartData = [
    { name: 'Your Site', score: data.websiteScore, color: '#3b82f6' },
    ...data.competitors.map((c, i) => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      score: c.visibilityScore,
      color: '#94a3b8'
    }))
  ].sort((a, b) => b.score - a.score); // Sort by score to show ranking

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Categories Found</p>
              <h3 className="text-2xl font-bold text-slate-900">{data.categories.length}</h3>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.categories.slice(0, 3).map((cat, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Your Blog Themes</p>
              <h3 className="text-2xl font-bold text-slate-900">{data.blogThemes.length}</h3>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.blogThemes.length > 0 ? (
                data.blogThemes.slice(0, 2).map((theme, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    {theme}
                </span>
                ))
            ) : (
                <span className="text-xs text-slate-400 italic">No blog content detected</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Missing Opportunities</p>
              <h3 className="text-2xl font-bold text-slate-900">{data.opportunities.length}</h3>
            </div>
          </div>
           <p className="text-sm text-slate-400 mt-2">Gaps found in blog & products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Competitor Analysis */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
             Competitor Content Strategy
          </h2>
          <div className="space-y-6">
            {data.competitors.map((comp, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800">{comp.name}</h3>
                    <a href={`https://${comp.url}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500">
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Writing About:</p>
                    <div className="flex flex-wrap gap-2">
                        {comp.blogThemes && comp.blogThemes.length > 0 ? (
                            comp.blogThemes.slice(0, 3).map((theme, t) => (
                                <span key={t} className="text-xs text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded">
                                    {theme}
                                </span>
                            ))
                        ) : (
                             <span className="text-xs text-slate-400">No blog themes detected</span>
                        )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Strength:</span> {comp.strengths[0]}
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end gap-2 min-w-[100px]">
                   <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                     Rank Priority
                   </span>
                   <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <BarChart3 size={12} />
                      Visibility: <span className="font-bold text-slate-700">{comp.visibilityScore}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Market Visibility Score</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Estimated search visibility and dominance (0-100).
          </p>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Content Gaps & Blog Opportunities</h2>
          <p className="text-slate-500 text-sm">Competitors are writing about these topics, but you are not.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Opportunity</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Strategy</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{opp.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Target: {opp.targetKeyword}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                      ${opp.type === 'blog' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'}`}>
                      {opp.type === 'blog' ? 'Missing Blog' : 'Product Page'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium
                      ${opp.difficulty === 'High' ? 'text-red-600' : opp.difficulty === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
                      {opp.difficulty === 'High' ? <AlertCircle size={12}/> : <CheckCircle size={12}/>}
                      {opp.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {opp.reason}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onGenerate(opp)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
import React, { useState, useEffect } from 'react';
import { PromptInput } from '../components/PromptInput';
import { ModelSelector } from '../components/ModelSelector';
import { ResultTable } from '../components/ResultTable';
import { RadarChart } from '../components/RadarChart';
import { ResponseComparisonPanel } from '../components/ResponseComparisonPanel';
import { ApiKeysModal, ApiKeys } from '../components/ApiKeysModal';
import { HistorySidebar, HistoryItem } from '../components/HistorySidebar';
import { HistoryDetailModal } from '../components/HistoryDetailModal';
import { HelpModal } from '../components/HelpModal';
import { RefereeVerdict } from '../components/RefereeVerdict';
import { evaluatePrompt } from '../services/apiClient';
import { exportToCSV } from '../utils/exportUtils';
import { Activity, AlertCircle, Settings, History as HistoryIcon, Download, BookOpen } from 'lucide-react';

export function Dashboard() {
  const [selectedModels, setSelectedModels] = useState<string[]>(["Gemini", "GPT"]);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: '', deepseek: '', groq: '', anthropic: '', gemini: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load API Keys
    const savedKeys = localStorage.getItem('llm_api_keys');
    if (savedKeys) {
      try { setApiKeys(JSON.parse(savedKeys)); } catch (e) {}
    }

    // Load History
    const savedHistory = localStorage.getItem('llm_eval_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
  }, []);

  const handleSaveKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem('llm_api_keys', JSON.stringify(keys));
  };

  const handleSaveToHistory = (prompt: string, models: string[], results: any[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      prompt,
      models,
      results
    };
    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(updatedHistory);
    localStorage.setItem('llm_eval_history', JSON.stringify(updatedHistory));
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('llm_eval_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
      setHistory([]);
      localStorage.removeItem('llm_eval_history');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
  };

  const handleSubmit = async (prompt: string, reference: string) => {
    if (selectedModels.length === 0) {
      setError("Vui lòng chọn ít nhất một mô hình.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setCurrentPrompt(prompt);

    try {
      const data = await evaluatePrompt(prompt, selectedModels, reference, apiKeys);
      setResults(data.results);
      handleSaveToHistory(prompt, selectedModels, data.results);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đánh giá.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">AI Nexus Evaluation Platform</h1>
              {apiKeys.useMockMode && (
                <span className="hidden">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Đang bật Chế độ Giả lập (Mock Mode)
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Hướng dẫn sử dụng"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Lịch sử"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Cấu hình API Keys"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
            <ModelSelector selectedModels={selectedModels} onChange={setSelectedModels} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            {results.length > 0 && (
              <div className="h-full">
                <RadarChart data={results} />
              </div>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RefereeVerdict results={results} />
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Kết quả chi tiết</h2>
              <button 
                onClick={() => exportToCSV(results, currentPrompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                Xuất CSV
              </button>
            </div>
            <ResultTable data={results} />
            <ResponseComparisonPanel data={results} />
          </div>
        )}
      </main>

      <ApiKeysModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveKeys}
        initialKeys={apiKeys}
      />

      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />

      <HistoryDetailModal 
        item={selectedHistoryItem}
        onClose={() => setSelectedHistoryItem(null)}
      />

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

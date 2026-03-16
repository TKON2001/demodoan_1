import React from 'react';

interface ModelSelectorProps {
  selectedModels: string[];
  onChange: (models: string[]) => void;
}

const AVAILABLE_MODELS = ["Gemini", "GPT", "Claude", "DeepSeek", "Llama"];

export function ModelSelector({ selectedModels, onChange }: ModelSelectorProps) {
  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      onChange(selectedModels.filter(m => m !== model));
    } else {
      onChange([...selectedModels, model]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Chọn mô hình đánh giá</h3>
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_MODELS.map(model => (
          <label
            key={model}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
              selectedModels.includes(model)
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selectedModels.includes(model)}
              onChange={() => toggleModel(model)}
            />
            <span className="font-medium">{model}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Edit2, Save, X, Check } from 'lucide-react';
import { renderVisualization } from './VisualDesignerView';
import type { VisualizationSuggestion } from '@shared/types/agent.types';

interface EditableVisualizationProps {
  visualization: VisualizationSuggestion;
  onSave?: (editedVisualization: VisualizationSuggestion) => void;
  isEditable?: boolean;
}

export function EditableVisualization({
  visualization,
  onSave,
  isEditable = true,
}: EditableVisualizationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(visualization.title);
  const [editedDescription, setEditedDescription] = useState(visualization.description);
  const [editedAnnotations, setEditedAnnotations] = useState<string[]>(
    visualization.annotations || []
  );

  const handleSave = () => {
    const editedVisualization: VisualizationSuggestion = {
      ...visualization,
      title: editedTitle,
      description: editedDescription,
      annotations: editedAnnotations,
    };
    
    setIsEditing(false);
    if (onSave) {
      onSave(editedVisualization);
    }
  };

  const handleCancel = () => {
    setEditedTitle(visualization.title);
    setEditedDescription(visualization.description);
    setEditedAnnotations(visualization.annotations || []);
    setIsEditing(false);
  };

  const handleAnnotationChange = (index: number, value: string) => {
    const newAnnotations = [...editedAnnotations];
    newAnnotations[index] = value;
    setEditedAnnotations(newAnnotations);
  };

  const addAnnotation = () => {
    setEditedAnnotations([...editedAnnotations, '']);
  };

  const removeAnnotation = (index: number) => {
    setEditedAnnotations(editedAnnotations.filter((_, i) => i !== index));
  };

  if (!isEditable) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {renderVisualization(visualization, {}, undefined, undefined)}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50">
        <h4 className="font-semibold text-gray-800">个性化可视化</h4>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            <span>编辑</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>取消</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标注</label>
              <div className="space-y-2">
                {editedAnnotations.map((annotation, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={annotation}
                      onChange={(e) => handleAnnotationChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeAnnotation(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAnnotation}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  + 添加标注
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                保存后，这个个性化可视化将作为您对这个问题理解的专属回答
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{editedTitle}</h3>
              <p className="text-gray-600">{editedDescription}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 mb-4">
              {renderVisualization(visualization, {}, undefined, undefined)}
            </div>

            {editedAnnotations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">关键点</h4>
                {editedAnnotations.map((annotation, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{annotation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

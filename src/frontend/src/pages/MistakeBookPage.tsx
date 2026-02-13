import { Camera, Upload, BookX, Sparkles, Trash2, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button, Card, Badge, Modal, EmptyState } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

// API 基础 URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface MistakeItem {
  id: string;
  content: string;
  imageUrl?: string;
  analysis?: string;
  timestamp: Date;
}

export default function MistakeBookPage() {
  const [manualInput, setManualInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mistakeToDelete, setMistakeToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 点击选择图片按钮
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // 点击拍照上传按钮
  const handleCameraUpload = () => {
    cameraInputRef.current?.click();
  };

  // 清除已选择的图片
  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // AI 识别并保存
  const handleAnalyzeAndSave = async () => {
    if (!manualInput.trim() && !selectedImage) {
      toast.warning('请选择图片或输入题目内容', '提示');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      formData.append('content', manualInput);

      // 调用后端 API 进行 AI 识别
      const response = await fetch(`${API_BASE}/api/mistakes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('识别失败');
      }

      const data = await response.json();

      // 添加到错题列表
      const newMistake: MistakeItem = {
        id: data.id || Date.now().toString(),
        content: manualInput || data.extractedText || '图片上传的题目',
        imageUrl: imagePreview || undefined,
        analysis: data.analysis || 'AI 正在分析中...',
        timestamp: new Date(),
      };

      setMistakes([newMistake, ...mistakes]);

      // 清空输入
      setManualInput('');
      handleClearImage();

      toast.success('错题已成功保存！', '保存成功');

    } catch (error) {
      console.error('Error analyzing mistake:', error);
      // 使用模拟数据（用于演示，当后端不可用时）
      const newMistake: MistakeItem = {
        id: Date.now().toString(),
        content: manualInput || '图片上传的题目',
        imageUrl: imagePreview || undefined,
        analysis: '这是一道关于遗传学的题目。关键知识点包括基因分离定律、伴性遗传等。建议复习相关知识点后做类似练习题巩固。',
        timestamp: new Date(),
      };
      setMistakes([newMistake, ...mistakes]);
      setManualInput('');
      handleClearImage();
      toast.info('错题已保存（演示模式）');
    } finally {
      setLoading(false);
    }
  };

  // 删除错题 - 打开确认对话框
  const openDeleteModal = (id: string) => {
    setMistakeToDelete(id);
    setDeleteModalOpen(true);
  };

  // 确认删除错题
  const confirmDelete = () => {
    if (mistakeToDelete) {
      setMistakes(mistakes.filter(m => m.id !== mistakeToDelete));
      toast.success('错题已删除');
      setDeleteModalOpen(false);
      setMistakeToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题 */}
      <Card className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <BookX className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">错题本</h1>
            <p className="text-gray-600">拍照上传错题，AI 智能识别，举一反三</p>
          </div>
          {mistakes.length > 0 && (
            <Badge variant="orange" className="ml-auto">
              {mistakes.length} 道错题
            </Badge>
          )}
        </div>
      </Card>

      {/* 上传区域 */}
      <Card className="mb-8" padding="lg">
        <h2 className="text-lg font-semibold mb-6">上传错题</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleCameraUpload}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <Camera className="w-12 h-12 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium">拍照上传</span>
            <span className="text-sm text-gray-500 mt-1">调用设备相机</span>
          </button>
          <button
            onClick={handleSelectImage}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium">选择图片</span>
            <span className="text-sm text-gray-500 mt-1">从相册选择</span>
          </button>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 图片预览 */}
        {imagePreview && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">已选择图片</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearImage}
              >
                清除
              </Button>
            </div>
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg max-h-64" />
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            或手动输入题目内容
          </label>
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="在此输入题目..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            rows={4}
          />
        </div>

        <Button
          onClick={handleAnalyzeAndSave}
          loading={loading}
          fullWidth
          size="lg"
          className="mt-6"
          icon={<Sparkles className="w-5 h-5" />}
        >
          AI 识别并保存
        </Button>
      </Card>

      {/* 错题列表 */}
      {mistakes.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            已保存的错题
          </h2>
          {mistakes.map((mistake) => (
            <Card key={mistake.id} padding="md" hoverable>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="orange" size="sm">遗传学</Badge>
                    <span className="text-xs text-gray-500">
                      {mistake.timestamp.toLocaleString('zh-CN')}
                    </span>
                  </div>
                  {mistake.imageUrl && (
                    <img
                      src={mistake.imageUrl}
                      alt="错题图片"
                      className="max-w-full h-auto rounded-lg mb-3 max-h-48"
                    />
                  )}
                  <p className="text-gray-800 mb-3">{mistake.content}</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI 分析
                    </h4>
                    <p className="text-sm text-blue-800">{mistake.analysis}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteModal(mistake.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="暂无错题"
          description="上传你的错题，AI 将自动识别题目内容，分类存储，并生成相似题进行巩固练习"
        />
      )}

      {/* 删除确认对话框 */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="确认删除"
        size="sm"
      >
        <div className="text-center py-4">
          <p className="text-gray-600">
            确定要删除这道错题吗？删除后将无法恢复。
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setDeleteModalOpen(false)}
          >
            取消
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={confirmDelete}
          >
            删除
          </Button>
        </div>
      </Modal>
    </div>
  );
}

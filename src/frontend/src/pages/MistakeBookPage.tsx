import { Camera, Upload, BookX, Sparkles } from 'lucide-react';

export default function MistakeBookPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-orange-100 rounded-lg">
            <BookX className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">错题本</h1>
            <p className="text-gray-600">拍照上传错题，AI 智能识别，举一反三</p>
          </div>
        </div>
      </div>

      {/* 上传区域 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-lg font-semibold mb-6">上传错题</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Camera className="w-12 h-12 text-gray-400 mb-4" />
            <span className="font-medium">拍照上传</span>
            <span className="text-sm text-gray-500 mt-1">调用设备相机</span>
          </button>
          <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="font-medium">选择图片</span>
            <span className="text-sm text-gray-500 mt-1">从相册选择</span>
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">或手动输入题目内容</p>
          <textarea
            placeholder="在此输入题目..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            rows={4}
          />
        </div>

        <button className="w-full btn-primary mt-6 py-3">AI 识别并保存</button>
      </div>

      {/* 错题列表占位 */}
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">暂无错题</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          上传你的错题，AI 将自动识别题目内容，分类存储，并生成相似题进行巩固练习
        </p>
      </div>
    </div>
  );
}

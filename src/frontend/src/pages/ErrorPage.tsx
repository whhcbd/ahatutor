import { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertOctagon, WifiOff, Search, Home, ArrowLeft } from 'lucide-react';

type ErrorStatus = 404 | 500 | 503 | 'network' | 'unknown';

export default function ErrorPage() {
  const error = useRouteError();
  const errorStatus: ErrorStatus = isRouteErrorResponse(error)
    ? (error.status as ErrorStatus)
    : 'unknown';

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  const errorConfig = {
    404: {
      icon: Search,
      title: '页面未找到',
      description: '抱歉，您访问的页面不存在或已被移除。',
      suggestion: '您可以检查网址是否正确，或返回首页继续浏览。',
    },
    500: {
      icon: AlertOctagon,
      title: '服务器错误',
      description: '抱歉，服务器遇到了一些问题。',
      suggestion: '请稍后再试，如果问题持续存在，请联系技术支持。',
    },
    503: {
      icon: WifiOff,
      title: '服务暂时不可用',
      description: '服务正在进行维护或升级。',
      suggestion: '请稍后再试，感谢您的耐心等待。',
    },
    network: {
      icon: WifiOff,
      title: '网络连接失败',
      description: '无法连接到服务器，请检查您的网络连接。',
      suggestion: '确保您的设备已连接到互联网后重试。',
    },
    unknown: {
      icon: AlertOctagon,
      title: '发生错误',
      description: '抱歉，应用程序遇到了意外错误。',
      suggestion: '请尝试刷新页面或返回首页。',
    },
  };

  const config = errorConfig[errorStatus] || errorConfig.unknown;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* 错误图标 */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <Icon className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* 错误信息 */}
        <div className="text-center mb-8">
          {errorStatus !== 'network' && errorStatus !== 'unknown' && (
            <div className="text-8xl font-bold text-gray-200 mb-4">{errorStatus}</div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{config.title}</h1>
          <p className="text-lg text-gray-600 mb-2">{config.description}</p>
          <p className="text-sm text-gray-500">{config.suggestion}</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            刷新页面
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium border border-gray-200"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
        </div>

        {/* 其他页面链接 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">或访问其他页面</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/speed" className="text-sm text-blue-600 hover:text-blue-700">
              速通模式
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/depth" className="text-sm text-blue-600 hover:text-blue-700">
              深度模式
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/visualize" className="text-sm text-blue-600 hover:text-blue-700">
              概念可视化
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/mistakes" className="text-sm text-blue-600 hover:text-blue-700">
              错题本
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

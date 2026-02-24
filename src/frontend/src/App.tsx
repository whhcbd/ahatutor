import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, Loading } from './components/ui';
import { ToastContainer } from './components/ui/Toast';
import Layout from './components/Layout/Layout';

// 使用 React.lazy 进行代码分割，首页保留直接加载以提升首屏速度
const HomePage = lazy(() => import('./pages/HomePage'));
const SpeedModePage = lazy(() => import('./pages/SpeedModePage'));
const DepthModePage = lazy(() => import('./pages/DepthModePage'));
const VisualizePage = lazy(() => import('./pages/VisualizePage'));
const MistakeBookPage = lazy(() => import('./pages/MistakeBookPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// 页面加载组件
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loading size="lg" text="加载中..." />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ToastContainer />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/speed" element={<SpeedModePage />} />
                <Route path="/depth" element={<DepthModePage />} />
                <Route path="/visualize" element={<VisualizePage />} />
                <Route path="/mistakes" element={<MistakeBookPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

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
const NarrativePage = lazy(() => import('./pages/NarrativePage'));
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

// 带有 Suspense 的路由包装器
function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
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
        <BrowserRouter>
          <ToastContainer />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={
                  <LazyRoute>
                    <HomePage />
                  </LazyRoute>
                } />
                <Route path="/speed" element={
                  <LazyRoute>
                    <SpeedModePage />
                  </LazyRoute>
                } />
                <Route path="/depth" element={
                  <LazyRoute>
                    <DepthModePage />
                  </LazyRoute>
                } />
                <Route path="/visualize" element={
                  <LazyRoute>
                    <VisualizePage />
                  </LazyRoute>
                } />
                <Route path="/narrative" element={
                  <LazyRoute>
                    <NarrativePage />
                  </LazyRoute>
                } />
                <Route path="/mistakes" element={
                  <LazyRoute>
                    <MistakeBookPage />
                  </LazyRoute>
                } />
                <Route path="/report" element={
                  <LazyRoute>
                    <ReportPage />
                  </LazyRoute>
                } />
                <Route path="*" element={
                  <LazyRoute>
                    <ErrorPage />
                  </LazyRoute>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

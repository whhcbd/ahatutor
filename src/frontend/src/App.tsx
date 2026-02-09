import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import SpeedModePage from './pages/SpeedModePage';
import DepthModePage from './pages/DepthModePage';
import VisualizePage from './pages/VisualizePage';
import NarrativePage from './pages/NarrativePage';
import MistakeBookPage from './pages/MistakeBookPage';
import ReportPage from './pages/ReportPage';
import Layout from './components/Layout/Layout';

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/speed" element={<SpeedModePage />} />
            <Route path="/depth" element={<DepthModePage />} />
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/narrative" element={<NarrativePage />} />
            <Route path="/mistakes" element={<MistakeBookPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

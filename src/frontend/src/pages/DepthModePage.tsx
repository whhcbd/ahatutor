import { useState, useEffect } from 'react';
import { Network, Sparkles, Search, BookOpen } from 'lucide-react';
import { KnowledgeGraph } from '../components/Visualization';
import type { GraphNode, GraphEdge } from '../components/Visualization/KnowledgeGraph';

// API 基础 URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function DepthModePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({
    nodes: [],
    edges: [],
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [learningPath, setLearningPath] = useState<string[]>([]);

  // 从知识库获取图谱数据
  const fetchGraphData = async (rootNode?: string) => {
    try {
      const params = new URLSearchParams();
      if (rootNode) params.append('root', rootNode);
      if (searchQuery) params.append('domain', searchQuery);

      const response = await fetch(`${API_BASE}/graph/visualize?${params}`);
      if (!response.ok) throw new Error('Failed to fetch graph data');

      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  // 搜索概念并构建知识树
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // 调用 Agent 探索前置知识
      const agentResponse = await fetch(`${API_BASE}/agent/explore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: searchQuery,
          maxDepth: 3,
        }),
      });

      if (!agentResponse.ok) throw new Error('Agent request failed');

      const agentData = await agentResponse.json();

      // 构建知识图谱
      const buildResponse = await fetch(`${API_BASE}/graph/build-from-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: searchQuery,
          tree: agentData,
        }),
      });

      if (buildResponse.ok) {
        // 获取更新后的图谱数据
        await fetchGraphData();

        // 获取学习路径
        const pathResponse = await fetch(`${API_BASE}/graph/path`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: searchQuery,
            to: '基础',
            algorithm: 'breadth',
          }),
        });

        if (pathResponse.ok) {
          const pathData = await pathResponse.json();
          setLearningPath(pathData);
        }
      }
    } catch (error) {
      console.error('Error searching concept:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 初始加载图谱数据
  useEffect(() => {
    fetchGraphData();
  }, []);

  // 处理节点点击
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Network className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">深度模式</h1>
            <p className="text-gray-600">系统化学习，构建知识图谱</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold mb-2">反向知识树</h3>
            <p className="text-sm text-gray-600">自动构建学习路径，从基础到目标概念</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-2">知识图谱</h3>
            <p className="text-sm text-gray-600">可视化知识点关联关系</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <h3 className="font-semibold mb-2">复习计划</h3>
            <p className="text-sm text-gray-600">艾宾浩斯遗忘曲线科学复习</p>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入你想学习的遗传学概念，如：伴性遗传、孟德尔定律..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSearching}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? '探索中...' : '探索知识'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 知识图谱可视化 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">知识图谱</h2>
            {graphData.nodes.length > 0 ? (
              <KnowledgeGraph
                data={graphData}
                onNodeClick={handleNodeClick}
                width={700}
                height={500}
              />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500">输入概念开始探索知识图谱</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="space-y-6">
          {/* 节点详情 */}
          {selectedNode && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">节点详情</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">名称</span>
                  <p className="font-medium">{selectedNode.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">类型</span>
                  <p className="font-medium">{selectedNode.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">等级</span>
                  <p className="font-medium">{selectedNode.level}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">掌握度</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${selectedNode.mastery}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedNode.mastery}%</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                开始学习
              </button>
            </div>
          )}

          {/* 学习路径 */}
          {learningPath.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                学习路径
              </h3>
              <div className="space-y-2">
                {learningPath.map((nodeId, index) => {
                  const node = graphData.nodes.find((n) => n.id === nodeId);
                  return node ? (
                    <div
                      key={nodeId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1">{node.name}</span>
                      <span className="text-xs text-gray-500">Lv.{node.level}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* 统计信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">图谱统计</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">总节点数</span>
                <span className="font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">关系数</span>
                <span className="font-medium">{graphData.edges.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

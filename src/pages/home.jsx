// @ts-ignore;
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore;
import { Search, Plus, Filter } from 'lucide-react';
// @ts-ignore;
import { Input, Button, Badge } from '@/components/ui';

// @ts-ignore;
import { WxTemplateCard } from '@/components/WxTemplateCard';
// @ts-ignore;
import { WxTabBar } from '@/components/WxTabBar';
export default function HomePage(props) {
  const {
    $w,
    style
  } = props;
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const categories = ['全部', '女生', '男生', '情侣', '亲子', '全家福', '情头'];

  // 生成模拟模板数据
  const generateMockTemplates = (start, count) => {
    const tags = ['女生', '男生', '情侣', '亲子', '全家福', '情头'];
    const templates = [];
    let currentId = start;
    while (templates.length < count) {
      // 跳过ID为1、2、3的模板
      if (currentId === 1 || currentId === 2 || currentId === 3) {
        currentId++;
        continue;
      }
      const templateTags = [];
      const tagCount = Math.floor(Math.random() * 3) + 1;
      const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
      for (let j = 0; j < tagCount; j++) {
        templateTags.push(shuffledTags[j]);
      }
      templates.push({
        id: currentId,
        name: `模板 ${currentId}`,
        image: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&sig=${currentId}`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        usageCount: Math.floor(Math.random() * 5000) + 100,
        tags: templateTags
      });
      currentId++;
    }
    return templates;
  };

  // 初始化数据
  useEffect(() => {
    // 从本地存储加载数据
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
      setLoading(false);
    } else {
      // 生成初始数据
      const initialTemplates = generateMockTemplates(4, 30);
      setTemplates(initialTemplates);
      localStorage.setItem('templates', JSON.stringify(initialTemplates));
      setLoading(false);
    }

    // 微信小程序分享配置
    if (typeof wx !== 'undefined') {
      // 设置分享
      if (wx.showShareMenu) {
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      }

      // 监听分享
      if (wx.onShareAppMessage) {
        wx.onShareAppMessage(() => ({
          title: '姓氏头像制作 - 专属你的个性头像',
          desc: '一键生成专属姓氏头像，支持多种字体和样式',
          path: '/pages/home/home',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        }));
      }
    }
  }, []);

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const newTemplates = generateMockTemplates(templates.length + 4, 15);
      const updatedTemplates = [...templates, ...newTemplates];
      setTemplates(updatedTemplates);
      localStorage.setItem('templates', JSON.stringify(updatedTemplates));
      setPage(prev => prev + 1);
      if (updatedTemplates.length >= 100) setHasMore(false);
      setLoading(false);
    }, 800);
  }, [templates.length, loading, hasMore]);

  // 滚动加载
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory || template.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // 处理模板点击
  const handleTemplateClick = template => {
    $w.utils.navigateTo({
      pageId: 'edit',
      params: {
        templateId: template.id,
        templateImage: template.image
      }
    });
  };

  // 处理上传模板
  const handleUploadTemplate = () => {
    $w.utils.navigateTo({
      pageId: 'adminUpload'
    });
  };
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索姓氏模板..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        
        {/* 分类筛选 */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">分类</span>
            <Button variant="ghost" size="sm" onClick={() => setShowFilter(!showFilter)} className="text-gray-500">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {showFilter && <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(category => <Badge key={category} variant={selectedCategory === category ? "default" : "outline"} className={`cursor-pointer whitespace-nowrap px-3 py-1 text-sm transition-all duration-200 ${selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500'}`} onClick={() => setSelectedCategory(category)}>
                  {category}
                </Badge>)}
            </div>}
        </div>
      </div>

      {/* 模板网格 */}
      <div className="px-4 py-4">
        {loading && templates.length === 0 ? <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => <div key={i} className="bg-gray-200 rounded-lg animate-pulse" style={{
          aspectRatio: '1'
        }} />)}
          </div> : <div className="grid grid-cols-3 gap-3">
            {filteredTemplates.map(template => <WxTemplateCard key={template.id} template={template} onClick={handleTemplateClick} />)}
          </div>}
        
        {loading && templates.length > 0 && <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>}
        
        {!hasMore && templates.length > 0 && <div className="text-center py-4 text-gray-500">已经加载全部模板</div>}
      </div>

      {/* 管理员上传按钮 */}
      {isAdmin && <Button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg z-20 transition-all duration-200 active:scale-95" onClick={handleUploadTemplate}>
          <Plus className="w-6 h-6" />
        </Button>}

      {/* 底部导航 */}
      <WxTabBar activeTab="home" onTabChange={tab => {
      if (tab !== 'home' && tab !== 'share') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
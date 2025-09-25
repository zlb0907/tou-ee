// @ts-ignore;
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore;
import { Search, Plus, Home, Heart, User, Share2, ArrowLeft, Download } from 'lucide-react';

// 简化版组件
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors ${className} ${variant === 'outline' ? 'border border-gray-300 hover:border-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
    {children}
  </button>;
const Input = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 ${className}`} />;
const Badge = ({
  children,
  onClick,
  className = '',
  active = false
}) => <button onClick={onClick} className={`px-3 py-1 text-sm rounded-full transition-colors ${className} ${active ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-600 hover:border-orange-500'}`}>
    {children}
  </button>;
const TemplateCard = ({
  template,
  onClick
}) => <div className="relative cursor-pointer group" onClick={onClick}>
    <img src={template.image} alt={template.name} className="w-full h-full object-cover rounded-lg" />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
    <div className="absolute bottom-1 left-1 right-1">
      <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
        {template.usageCount}次使用
      </div>
    </div>
  </div>;
const TabBar = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [{
    id: 'index',
    icon: Home,
    label: '首页'
  }, {
    id: 'favorites',
    icon: Heart,
    label: '收藏'
  }, {
    id: 'profile',
    icon: User,
    label: '我的'
  }, {
    id: 'share',
    icon: Share2,
    label: '分享'
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className="flex flex-col items-center py-2 px-4" onClick={() => {
          if (tab.id === 'share') {
            if (window.wx) {
              window.wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
              });
              window.wx.shareAppMessage({
                title: '姓氏头像制作',
                desc: '一键生成专属姓氏头像',
                path: '/pages/index/index',
                imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
              });
            } else {
              alert('请在微信小程序内使用分享功能');
            }
          } else {
            onTabChange(tab.id);
          }
        }}>
              <Icon className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
            </button>;
      })}
      </div>
    </div>;
};
export default function HomePage(props) {
  const {
    $w
  } = props;
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAdmin] = useState(true);
  const categories = ['全部', '女生', '男生', '情侣', '亲子', '全家福', '情头'];
  const generateMockTemplates = (start, count) => {
    const tags = ['女生', '男生', '情侣', '亲子', '全家福', '情头'];
    return Array.from({
      length: count
    }, (_, i) => ({
      id: start + i,
      name: '',
      image: `https://images.unsplash.com/photo-${1578662996442 + start + i}?w=400&h=400&fit=crop`,
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
      usageCount: Math.floor(Math.random() * 5000) + 100,
      tags: tags.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    }));
  };
  useEffect(() => {
    setTimeout(() => {
      setTemplates(generateMockTemplates(1, 30));
      setLoading(false);
    }, 1000);
  }, []);
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const newTemplates = generateMockTemplates(templates.length + 1, 15);
      setTemplates(prev => [...prev, ...newTemplates]);
      setPage(prev => prev + 1);
      if (templates.length >= 100) setHasMore(false);
      setLoading(false);
    }, 1000);
  }, [templates.length, loading, hasMore]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory || template.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });
  const handleTemplateClick = template => {
    $w.utils.navigateTo({
      pageId: 'edit',
      params: {
        templateId: template.id
      }
    });
  };
  const handleUploadTemplate = () => {
    $w.utils.navigateTo({
      pageId: 'adminUpload'
    });
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索姓氏模板..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => <Badge key={category} active={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
                {category}
              </Badge>)}
          </div>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="px-4 py-4">
        {loading && templates.length === 0 ? <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => <div key={i} className="bg-gray-200 rounded-lg animate-pulse" style={{
          aspectRatio: '1'
        }} />)}
          </div> : <div className="grid grid-cols-3 gap-3">
            {filteredTemplates.map(template => <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />)}
          </div>}
        {loading && templates.length > 0 && <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>}
        {!hasMore && templates.length > 0 && <div className="text-center py-4 text-gray-500">已经加载全部模板</div>}
      </div>

      {/* 管理员上传按钮 */}
      {isAdmin && <Button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg z-20" onClick={handleUploadTemplate}>
          <Plus className="w-6 h-6" />
        </Button>}

      {/* 底部导航 */}
      <TabBar activeTab="index" onTabChange={tab => {
      if (tab !== 'index' && tab !== 'share') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
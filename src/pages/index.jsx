// @ts-ignore;
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore;
import { Search, Plus } from 'lucide-react';
// @ts-ignore;
import { Input, Button, Badge } from '@/components/ui';

import { TemplateCard } from '@/components/TemplateCard';
import { TabBar } from '@/components/TabBar';
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
  const categories = ['全部', '女生', '男生', '情侣', '亲子', '全家福', '情头'];
  const generateMockTemplates = (start, count) => {
    const tags = ['女生', '男生', '情侣', '亲子', '全家福', '情头'];
    const templates = [];
    for (let i = start; i < start + count; i++) {
      const templateTags = [];
      const tagCount = Math.floor(Math.random() * 3) + 1;
      const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
      for (let j = 0; j < tagCount; j++) {
        templateTags.push(shuffledTags[j]);
      }
      templates.push({
        id: i,
        name: '',
        image: `https://images.unsplash.com/photo-${1578662996442 + i}?w=400&h=400&fit=crop`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        usageCount: Math.floor(Math.random() * 5000) + 100,
        tags: templateTags
      });
    }
    return templates;
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
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索姓氏模板..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => <Badge key={category} variant={selectedCategory === category ? "default" : "outline"} className={`cursor-pointer whitespace-nowrap px-3 py-1 text-sm ${selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-300 text-gray-600 hover:border-orange-500'}`} onClick={() => setSelectedCategory(category)}>
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
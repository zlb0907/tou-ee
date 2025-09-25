// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Search, Filter } from 'lucide-react';
// @ts-ignore;
import { Input, Button } from '@/components/ui';

import { TemplateCard } from '@/components/TemplateCard';
import { TabBar } from '@/components/TabBar';
export default function GalleryPage(props) {
  const {
    $w,
    style
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('全部');
  const styles = ['全部', '传统', '现代', '可爱', '商务', '节日', '水墨', '卡通'];
  const templates = [{
    id: 1,
    name: '传统福字',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    category: '传统',
    usageCount: 1234
  }, {
    id: 2,
    name: '现代简约',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=300&h=300&fit=crop',
    category: '现代',
    usageCount: 856
  }, {
    id: 3,
    name: '可爱卡通',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
    category: '可爱',
    usageCount: 2341
  }, {
    id: 4,
    name: '商务风格',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop',
    category: '商务',
    usageCount: 567
  }, {
    id: 5,
    name: '春节主题',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop',
    category: '节日',
    usageCount: 3456
  }, {
    id: 6,
    name: '水墨风格',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=300&h=300&fit=crop',
    category: '水墨',
    usageCount: 789
  }, {
    id: 7,
    name: '卡通动漫',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    category: '卡通',
    usageCount: 1567
  }, {
    id: 8,
    name: '新春贺岁',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=300&h=300&fit=crop',
    category: '节日',
    usageCount: 2890
  }];
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === '全部' || template.category === selectedStyle;
    return matchesSearch && matchesStyle;
  });
  const handleTemplateClick = template => {
    $w.utils.navigateTo({
      pageId: 'edit',
      params: {
        templateId: template.id
      }
    });
  };
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索模板..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        
        {/* 风格筛选 */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {styles.map(style => <Button key={style} variant={selectedStyle === style ? "default" : "outline"} size="sm" className={`whitespace-nowrap ${selectedStyle === style ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-300 text-gray-600 hover:border-orange-500'}`} onClick={() => setSelectedStyle(style)}>
                {style}
              </Button>)}
          </div>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map(template => <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />)}
        </div>
      </div>

      {/* 底部导航 */}
      <TabBar activeTab="gallery" onTabChange={tab => {
      if (tab !== 'gallery') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
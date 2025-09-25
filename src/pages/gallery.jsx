// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Grid, List } from 'lucide-react';

// 简化版组件
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors ${className} ${variant === 'outline' ? 'border border-gray-300 hover:border-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
    {children}
  </button>;
export default function GalleryPage(props) {
  const {
    $w
  } = props;
  const [viewMode, setViewMode] = useState('grid');
  const [templates] = useState([{
    id: 1,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }, {
    id: 3,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }, {
    id: 4,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }, {
    id: 5,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }, {
    id: 6,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  }]);
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleTemplateClick = template => {
    $w.utils.navigateTo({
      pageId: 'edit',
      params: {
        templateId: template.id
      }
    });
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="outline" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">模板库</h1>
          <div className="flex gap-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} className="p-2">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} className="p-2">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="px-4 py-4">
        <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {templates.map(template => <div key={template.id} className="relative cursor-pointer group" onClick={() => handleTemplateClick(template)}>
              <img src={template.image} alt="模板" className={`w-full object-cover rounded-lg ${viewMode === 'list' ? 'h-32' : ''}`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
            </div>)}
        </div>
      </div>
    </div>;
}
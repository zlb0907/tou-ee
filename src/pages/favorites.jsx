// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Heart } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

// @ts-ignore;
import { TemplateCard } from '@/components/TemplateCard';
// @ts-ignore;
import { TabBar } from '@/components/TabBar';
export default function FavoritesPage(props) {
  const {
    $w,
    style
  } = props;
  const [favorites, setFavorites] = useState([]);
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  useEffect(() => {
    // 加载收藏数据
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favs);
  }, []);
  const handleTemplateClick = template => {
    $w.utils.navigateTo({
      pageId: 'edit',
      params: {
        templateId: template.id,
        templateImage: template.image
      }
    });
  };
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">我的收藏</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 收藏列表 */}
      <div className="px-4 py-4">
        {favorites.length === 0 ? <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无收藏模板</p>
            <Button variant="outline" className="mt-4" onClick={() => {
          $w.utils.navigateTo({
            pageId: 'home'
          });
        }}>
              去首页看看
            </Button>
          </div> : <div className="grid grid-cols-3 gap-3">
            {favorites.map(template => <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />)}
          </div>}
      </div>

      {/* 底部导航 */}
      <TabBar activeTab="favorites" onTabChange={tab => {
      if (tab !== 'favorites' && tab !== 'share') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
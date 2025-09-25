// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

// @ts-ignore;
import { WxTemplateCard } from '@/components/WxTemplateCard';
// @ts-ignore;
import { WxTabBar } from '@/components/WxTabBar';
export default function FavoritesPage(props) {
  const {
    $w,
    style
  } = props;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(favs);
      setLoading(false);
    };
    loadFavorites();

    // 监听storage变化，实时更新收藏列表
    const handleStorageChange = () => {
      loadFavorites();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 处理返回
  const handleBack = () => {
    $w.utils.navigateBack();
  };

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

  // 清空收藏
  const handleClearFavorites = () => {
    if (favorites.length === 0) return;
    if (confirm('确定要清空所有收藏吗？')) {
      localStorage.setItem('favorites', '[]');
      setFavorites([]);

      // 微信小程序振动反馈
      if (typeof wx !== 'undefined' && wx.vibrateShort) {
        wx.vibrateShort();
      }
    }
  };
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">我的收藏</h1>
          {favorites.length > 0 && <Button variant="ghost" size="icon" onClick={handleClearFavorites} className="text-red-500 active:scale-95">
              <Trash2 className="w-5 h-5" />
            </Button>}
        </div>
      </div>

      {/* 收藏列表 */}
      <div className="px-4 py-4">
        {loading ? <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => <div key={i} className="bg-gray-200 rounded-lg animate-pulse" style={{
          aspectRatio: '1'
        }} />)}
          </div> : favorites.length === 0 ? <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">暂无收藏模板</p>
            <p className="text-sm text-gray-400 mb-6">点击模板上的爱心图标收藏喜欢的模板</p>
            <Button variant="outline" className="mt-4" onClick={() => {
          $w.utils.navigateTo({
            pageId: 'home'
          });
        }}>
              去首页看看
            </Button>
          </div> : <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                共收藏 {favorites.length} 个模板
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {favorites.map(template => <WxTemplateCard key={template.id} template={template} onClick={handleTemplateClick} />)}
            </div>
          </>}
      </div>

      {/* 底部导航 */}
      <WxTabBar activeTab="favorites" onTabChange={tab => {
      if (tab !== 'favorites' && tab !== 'share') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
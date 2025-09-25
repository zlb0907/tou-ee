// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Heart, Home, User } from 'lucide-react';

// 简化版组件
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors ${className} ${variant === 'outline' ? 'border border-gray-300 hover:border-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
    {children}
  </button>;
const TemplateCard = ({
  template,
  onClick
}) => <div className="relative cursor-pointer group" onClick={onClick}>
    <img src={template.image} alt={template.name} className="w-full h-full object-cover rounded-lg" />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
  </div>;
export default function FavoritesPage(props) {
  const {
    $w
  } = props;
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favs);
  }, []);
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
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="outline" onClick={handleBack} className="p-2">
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
            <Button variant="outline" className="mt-4" onClick={() => $w.utils.navigateTo({
          pageId: 'index'
        })}>
              去首页看看
            </Button>
          </div> : <div className="grid grid-cols-3 gap-3">
            {favorites.map(template => <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />)}
          </div>}
      </div>

      {/* 底部导航 - 简化版 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center py-2 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'index'
        })}>
            <Home className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center py-2 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'favorites'
        })}>
            <Heart className="w-6 h-6 text-orange-500" />
          </button>
          <button className="flex flex-col items-center py-2 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'profile'
        })}>
            <User className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
    </div>;
}
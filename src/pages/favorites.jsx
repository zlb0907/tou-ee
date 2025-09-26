// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

import { View, Text, ScrollView } from '@tarojs/components';
import { ArrowLeft, Heart, Trash2 } from '@tarojs/icons';
import Taro from '@tarojs/taro';
import { WxTemplateCard } from '@/components/WxTemplateCard';
import { WxTabBar } from '@/components/WxTabBar';
// Taro页面配置
FavoritesPage.config = {
  navigationBarTitleText: '我的收藏'
};
export default FavoritesPage;
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      const favs = Taro.getStorageSync('favorites') || [];
      setFavorites(favs);
      setLoading(false);
    };
    loadFavorites();

    // 监听storage变化，实时更新收藏列表
    Taro.onStorageChange(loadFavorites);
    return () => {
      Taro.offStorageChange(loadFavorites);
    };
  }, []);

  // 处理返回
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 处理模板点击
  const handleTemplateClick = template => {
    Taro.navigateTo({
      url: `/pages/edit/index?templateId=${template.id}&templateImage=${encodeURIComponent(template.image)}`
    });
  };

  // 清空收藏
  const handleClearFavorites = () => {
    if (favorites.length === 0) return;
    Taro.showModal({
      title: '提示',
      content: '确定要清空所有收藏吗？',
      success: res => {
        if (res.confirm) {
          Taro.setStorageSync('favorites', []);
          setFavorites([]);
          Taro.vibrateShort();
        }
      }
    });
  };
  return <View className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <View className="sticky top-0 z-10 bg-white shadow-sm">
        <View className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Text className="text-lg font-medium">我的收藏</Text>
          {favorites.length > 0 && <Button variant="ghost" size="icon" onClick={handleClearFavorites} className="text-red-500 active:scale-95">
              <Trash2 className="w-5 h-5" />
            </Button>}
        </View>
      </View>

      {/* 收藏列表 */}
      <View className="px-4 py-4">
        {loading ? <View className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => <View key={i} className="bg-gray-200 rounded-lg animate-pulse" style={{
          aspectRatio: '1'
        }} />)}
          </View> : favorites.length === 0 ? <View className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 mb-2">暂无收藏模板</Text>
            <Text className="text-sm text-gray-400 mb-6">点击模板上的爱心图标收藏喜欢的模板</Text>
            <Button variant="outline" className="mt-4" onClick={() => {
          Taro.navigateTo({
            url: '/pages/home/index'
          });
        }}>
              去首页看看
            </Button>
          </View> : <>
            <View className="mb-4 flex items-center justify-between">
              <Text className="text-sm text-gray-600">
                共收藏 {favorites.length} 个模板
              </Text>
            </View>
            <View className="grid grid-cols-3 gap-3">
              {favorites.map(template => <WxTemplateCard key={template.id} template={template} onClick={handleTemplateClick} />)}
            </View>
          </>}
      </View>

      {/* 底部导航 */}
      <WxTabBar activeTab="favorites" onTabChange={tab => {
      if (tab !== 'favorites' && tab !== 'share') {
        Taro.navigateTo({
          url: `/pages/${tab}/index`
        });
      }
    }} />
    </View>;
}
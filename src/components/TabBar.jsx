// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Heart, User, Share2 } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

// @ts-ignore;
import { wxUtils } from '@/lib/wx-utils';
export function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    icon: Home,
    path: '/pages/home/home'
  }, {
    id: 'favorites',
    icon: Heart,
    path: '/pages/favorites/favorites'
  }, {
    id: 'profile',
    icon: User,
    path: '/pages/profile/profile'
  }, {
    id: 'share',
    icon: Share2
  }];
  const handleTabClick = tab => {
    if (tab.id === 'share') {
      // 微信小程序分享
      if (typeof wx !== 'undefined' && wx.shareAppMessage) {
        wx.shareAppMessage({
          title: '姓氏头像制作 - 专属你的个性头像',
          desc: '一键生成专属姓氏头像，支持多种字体和样式',
          path: '/pages/home/home',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        });
      } else {
        wxUtils.showToast({
          title: '分享功能已准备就绪',
          icon: 'success'
        });
      }
    } else {
      onTabChange(tab.id);
      // 微信小程序路由跳转
      if (typeof wx !== 'undefined' && wx.navigateTo) {
        wx.navigateTo({
          url: tab.path
        });
      }
    }
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around py-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className={cn("flex flex-col items-center py-2 px-4 transition-colors", isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-600")} onClick={() => handleTabClick(tab)}>
              <Icon className="w-6 h-6" />
            </button>;
      })}
      </div>
    </div>;
}
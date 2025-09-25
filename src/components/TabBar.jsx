// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Heart, User, Share2 } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    icon: Home
  }, {
    id: 'favorites',
    icon: Heart
  }, {
    id: 'profile',
    icon: User
  }, {
    id: 'share',
    icon: Share2
  }];
  const handleShare = () => {
    // 微信小程序分享
    if (typeof wx !== 'undefined' && wx.shareAppMessage) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      wx.shareAppMessage({
        title: '姓氏头像制作 - 专属你的个性头像',
        desc: '一键生成专属姓氏头像，支持多种字体和样式',
        path: '/pages/index/index',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
      });
    } else {
      // 浏览器环境模拟分享
      if (navigator.share) {
        navigator.share({
          title: '姓氏头像制作',
          text: '一键生成专属姓氏头像',
          url: window.location.href
        }).catch(error => {
          console.log('分享失败:', error);
          alert('分享功能已触发！请在移动设备或微信小程序内使用完整分享功能');
        });
      } else {
        alert('分享功能已准备就绪！请在微信小程序内使用完整分享功能');
      }
    }
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className={cn("flex flex-col items-center py-2 px-4 transition-colors", isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-600")} onClick={() => {
          if (tab.id === 'share') {
            handleShare();
          } else {
            onTabChange(tab.id);
          }
        }}>
              <Icon className="w-6 h-6" />
            </button>;
      })}
      </div>
    </div>;
}
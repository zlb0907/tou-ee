// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Heart, User, Share2 } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function WxTabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
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
  const handleShare = () => {
    // 微信小程序分享
    if (typeof wx !== 'undefined') {
      if (wx.showShareMenu) {
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      }
      if (wx.shareAppMessage) {
        wx.shareAppMessage({
          title: '姓氏头像制作 - 专属你的个性头像',
          desc: '一键生成专属姓氏头像，支持多种字体和样式',
          path: '/pages/home/home',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        });
      }
    } else {
      // 浏览器环境模拟分享
      if (navigator.share) {
        navigator.share({
          title: '姓氏头像制作',
          text: '一键生成专属姓氏头像',
          url: window.location.href
        }).catch(() => {
          // 用户取消分享
        });
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('链接已复制到剪贴板');
        });
      }
    }
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around py-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className={cn("flex flex-col items-center py-2 px-4 transition-all duration-200", isActive ? "text-orange-500 scale-105" : "text-gray-400 hover:text-gray-600 active:scale-95")} onClick={() => {
          if (tab.id === 'share') {
            handleShare();
          } else {
            onTabChange(tab.id);
            // 微信小程序振动反馈
            if (typeof wx !== 'undefined' && wx.vibrateShort) {
              wx.vibrateShort();
            }
          }
        }}>
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-xs">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}
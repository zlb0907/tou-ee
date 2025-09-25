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
    id: 'index',
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
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className="flex flex-col items-center py-2 px-4" onClick={() => {
          if (tab.id === 'share') {
            // 微信小程序分享
            if (window.wx) {
              window.wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
              });
              window.wx.shareAppMessage({
                title: '姓氏头像制作',
                desc: '一键生成专属姓氏头像',
                path: '/pages/index/index',
                imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
              });
            } else {
              alert('请在微信小程序内使用分享功能');
            }
          } else {
            onTabChange(tab.id);
          }
        }}>
              <Icon className={cn("w-6 h-6 transition-colors", isActive ? "text-orange-500" : "text-gray-400")} />
            </button>;
      })}
      </div>
    </div>;
}
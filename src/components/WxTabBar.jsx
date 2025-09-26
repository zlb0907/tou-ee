// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';

import { View, Text } from '@tarojs/components';
import { Home, Heart, User, Share2 } from '@tarojs/icons';
import Taro from '@tarojs/taro';
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
    // Taro分享
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  };
  return <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <View className="flex justify-around py-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <View key={tab.id} className={cn("flex flex-col items-center py-2 px-4 transition-all duration-200", isActive ? "text-orange-500 scale-105" : "text-gray-400 hover:text-gray-600 active:scale-95")} onClick={() => {
          if (tab.id === 'share') {
            handleShare();
          } else {
            onTabChange(tab.id);
            // Taro振动反馈
            Taro.vibrateShort();
          }
        }}>
              <Icon className="w-5 h-5 mb-0.5" />
              <Text className="text-xs">{tab.label}</Text>
            </View>;
      })}
      </View>
    </View>;
}
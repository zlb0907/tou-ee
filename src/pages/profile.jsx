// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Settings, Heart, Download, User, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent } from '@/components/ui';

import { TabBar } from '@/components/TabBar';
export default function ProfilePage(props) {
  const {
    $w,
    style
  } = props;
  const [user] = useState({
    name: '微信用户',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    createdCount: 128,
    favoriteCount: 45
  });
  const menuItems = [{
    icon: Download,
    label: '我的作品',
    count: user.createdCount,
    action: 'myWorks'
  }, {
    icon: Heart,
    label: '我的收藏',
    count: user.favoriteCount,
    action: 'favorites'
  }, {
    icon: Settings,
    label: '设置',
    action: 'settings'
  }];
  const handleMenuClick = action => {
    switch (action) {
      case 'myWorks':
        $w.utils.navigateTo({
          pageId: 'myWorks'
        });
        break;
      case 'favorites':
        $w.utils.navigateTo({
          pageId: 'favorites'
        });
        break;
      case 'settings':
        $w.utils.navigateTo({
          pageId: 'settings'
        });
        break;
    }
  };
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 用户信息头部 */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 pt-12 pb-8">
        <div className="px-4 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-white text-xl font-semibold">{user.name}</h2>
          <p className="text-orange-100 text-sm mt-1">已创建 {user.createdCount} 个头像</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-4 -mt-6">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-500">{user.createdCount}</p>
                <p className="text-sm text-gray-600">已创建</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{user.favoriteCount}</p>
                <p className="text-sm text-gray-600">已收藏</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 菜单列表 */}
      <div className="px-4 mt-6 space-y-2">
        {menuItems.map((item, index) => <Card key={index} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => handleMenuClick(item.action)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.count && <p className="text-sm text-gray-500">{item.count} 个</p>}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>)}
      </div>

      {/* 底部导航 */}
      <TabBar activeTab="profile" onTabChange={tab => {
      if (tab !== 'profile') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
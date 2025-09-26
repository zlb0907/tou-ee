// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, Input } from '@/components/ui';

import { View, Text, Image } from '@tarojs/components';
import { Settings, Heart, Download, User, ChevronRight, Camera, Edit3, LogOut } from '@tarojs/icons';
import Taro from '@tarojs/taro';
import { WxTabBar } from '@/components/WxTabBar';
// Taro页面配置
ProfilePage.config = {
  navigationBarTitleText: '个人中心'
};
export default ProfilePage;
export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '微信用户',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    createdCount: 0,
    favoriteCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  // 菜单项
  const menuItems = [{
    icon: Download,
    label: '我的作品',
    count: user.createdCount,
    action: 'myWorks',
    color: 'bg-blue-500'
  }, {
    icon: Heart,
    label: '我的收藏',
    count: user.favoriteCount,
    action: 'favorites',
    color: 'bg-red-500'
  }, {
    icon: Settings,
    label: '设置',
    action: 'settings',
    color: 'bg-gray-500'
  }];

  // 初始化用户数据
  useEffect(() => {
    // 从本地存储加载用户信息
    const savedUser = Taro.getStorageSync('user');
    if (savedUser) {
      setUser(savedUser);
      setEditName(savedUser.name);
    } else {
      setEditName(user.name);
    }

    // 统计数据
    const favorites = Taro.getStorageSync('favorites') || [];
    const createdWorks = Taro.getStorageSync('createdWorks') || [];
    setUser(prev => ({
      ...prev,
      favoriteCount: favorites.length,
      createdCount: createdWorks.length
    }));
  }, []);

  // 处理菜单点击
  const handleMenuClick = action => {
    switch (action) {
      case 'myWorks':
        Taro.navigateTo({
          url: '/pages/myWorks/index'
        });
        break;
      case 'favorites':
        Taro.navigateTo({
          url: '/pages/favorites/index'
        });
        break;
      case 'settings':
        Taro.navigateTo({
          url: '/pages/settings/index'
        });
        break;
    }
  };

  // 处理编辑用户名
  const handleEditName = () => {
    if (isEditing) {
      if (editName.trim()) {
        const updatedUser = {
          ...user,
          name: editName.trim()
        };
        setUser(updatedUser);
        Taro.setStorageSync('user', updatedUser);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setEditName(user.name);
    }
  };

  // 处理头像更换
  const handleAvatarChange = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0];
        const updatedUser = {
          ...user,
          avatar: tempFilePath
        };
        setUser(updatedUser);
        Taro.setStorageSync('user', updatedUser);
      }
    });
  };

  // 处理退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除用户数据
          Taro.removeStorageSync('user');
          // 重置为默认用户
          setUser({
            name: '微信用户',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            createdCount: 0,
            favoriteCount: 0
          });
          Taro.vibrateShort();
        }
      }
    });
  };
  return <View className="min-h-screen bg-gray-50 pb-20">
      {/* 用户信息头部 */}
      <View className="bg-gradient-to-r from-orange-400 to-orange-600 pt-12 pb-8">
        <View className="px-4 text-center">
          <View className="relative inline-block mb-3">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <View onClick={handleAvatarChange} className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center active:scale-95">
              <Camera className="w-3 h-3 text-gray-600" />
            </View>
          </View>
          
          <View className="flex items-center justify-center gap-2">
            {isEditing ? <View className="flex items-center gap-2">
                <Input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/20 text-white placeholder-white/70 px-2 py-1 rounded text-center max-w-32" placeholder="输入昵称" autoFocus />
                <Button size="sm" variant="ghost" onClick={handleEditName} className="text-white hover:bg-white/20">
                  保存
                </Button>
              </View> : <View className="flex items-center gap-2">
                <Text className="text-white text-xl font-semibold">{user.name}</Text>
                <Button size="sm" variant="ghost" onClick={handleEditName} className="text-white hover:bg-white/20">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </View>}
          </View>
          <Text className="text-orange-100 text-sm mt-1">已创建 {user.createdCount} 个头像</Text>
        </View>
      </View>

      {/* 统计卡片 */}
      <View className="px-4 -mt-6">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <View className="grid grid-cols-2 gap-4 text-center">
              <View className="bg-orange-50 rounded-lg p-3">
                <Text className="text-2xl font-bold text-orange-500">{user.createdCount}</Text>
                <Text className="text-sm text-gray-600">已创建</Text>
              </View>
              <View className="bg-red-50 rounded-lg p-3">
                <Text className="text-2xl font-bold text-red-500">{user.favoriteCount}</Text>
                <Text className="text-sm text-gray-600">已收藏</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 菜单列表 */}
      <View className="px-4 mt-6 space-y-2">
        {menuItems.map((item, index) => <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100" onClick={() => handleMenuClick(item.action)}>
              <View className="flex items-center gap-3">
                <View className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </View>
                <View>
                  <Text className="font-medium">{item.label}</Text>
                  {item.count !== undefined && <Text className="text-sm text-gray-500">{item.count} 个</Text>}
                </View>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>)}
      </View>

      {/* 退出登录 */}
      <View className="px-4 mt-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100" onClick={handleLogout}>
            <View className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-white" />
            </View>
            <Text className="font-medium text-red-500">退出登录</Text>
          </CardContent>
        </Card>
      </View>

      {/* 底部导航 */}
      <WxTabBar activeTab="profile" onTabChange={tab => {
      if (tab !== 'profile') {
        Taro.navigateTo({
          url: `/pages/${tab}/index`
        });
      }
    }} />
    </View>;
}
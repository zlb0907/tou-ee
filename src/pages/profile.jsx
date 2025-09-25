// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Settings, Heart, Download, User, ChevronRight, Camera, Edit3, LogOut } from 'lucide-react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent } from '@/components/ui';

// @ts-ignore;
import { WxTabBar } from '@/components/WxTabBar';
export default function ProfilePage(props) {
  const {
    $w,
    style
  } = props;
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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setEditName(JSON.parse(savedUser).name);
    } else {
      setEditName(user.name);
    }

    // 统计数据
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const createdWorks = JSON.parse(localStorage.getItem('createdWorks') || '[]');
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

  // 处理编辑用户名
  const handleEditName = () => {
    if (isEditing) {
      if (editName.trim()) {
        const updatedUser = {
          ...user,
          name: editName.trim()
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setEditName(user.name);
    }
  };

  // 处理头像更换
  const handleAvatarChange = () => {
    // 微信小程序选择图片
    if (typeof wx !== 'undefined' && wx.chooseImage) {
      wx.chooseImage({
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
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      });
    } else {
      // 浏览器环境模拟
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = event => {
            const updatedUser = {
              ...user,
              avatar: event.target.result
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // 清除用户数据
      localStorage.removeItem('user');
      // 重置为默认用户
      setUser({
        name: '微信用户',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        createdCount: 0,
        favoriteCount: 0
      });

      // 微信小程序振动反馈
      if (typeof wx !== 'undefined' && wx.vibrateShort) {
        wx.vibrateShort();
      }
    }
  };
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 用户信息头部 */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 pt-12 pb-8">
        <div className="px-4 text-center">
          <div className="relative inline-block mb-3">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <button onClick={handleAvatarChange} className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center active:scale-95">
              <Camera className="w-3 h-3 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {isEditing ? <div className="flex items-center gap-2">
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/20 text-white placeholder-white/70 px-2 py-1 rounded text-center max-w-32" placeholder="输入昵称" autoFocus />
                <Button size="sm" variant="ghost" onClick={handleEditName} className="text-white hover:bg-white/20">
                  保存
                </Button>
              </div> : <div className="flex items-center gap-2">
                <h2 className="text-white text-xl font-semibold">{user.name}</h2>
                <Button size="sm" variant="ghost" onClick={handleEditName} className="text-white hover:bg-white/20">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>}
          </div>
          <p className="text-orange-100 text-sm mt-1">已创建 {user.createdCount} 个头像</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-4 -mt-6">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-orange-500">{user.createdCount}</p>
                <p className="text-sm text-gray-600">已创建</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-500">{user.favoriteCount}</p>
                <p className="text-sm text-gray-600">已收藏</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 菜单列表 */}
      <div className="px-4 mt-6 space-y-2">
        {menuItems.map((item, index) => <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100" onClick={() => handleMenuClick(item.action)}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.count !== undefined && <p className="text-sm text-gray-500">{item.count} 个</p>}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>)}
      </div>

      {/* 退出登录 */}
      <div className="px-4 mt-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100" onClick={handleLogout}>
            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-red-500">退出登录</p>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <WxTabBar activeTab="profile" onTabChange={tab => {
      if (tab !== 'profile') {
        $w.utils.navigateTo({
          pageId: tab
        });
      }
    }} />
    </div>;
}
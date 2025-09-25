// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, User, Settings, Heart, Share2, LogOut, Home } from 'lucide-react';

// 简化版组件
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors ${className} ${variant === 'outline' ? 'border border-gray-300 hover:border-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
    {children}
  </button>;
const Card = ({
  children,
  className = ''
}) => <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>;
export default function ProfilePage(props) {
  const {
    $w
  } = props;
  const [user] = useState({
    name: '微信用户',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    templates: 12,
    favorites: 28
  });
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const menuItems = [{
    icon: User,
    label: '个人信息',
    action: () => {}
  }, {
    icon: Heart,
    label: '我的收藏',
    action: () => $w.utils.navigateTo({
      pageId: 'favorites'
    })
  }, {
    icon: Share2,
    label: '分享小程序',
    action: () => {
      if (window.wx) {
        window.wx.shareAppMessage({
          title: '姓氏头像制作',
          desc: '一键生成专属姓氏头像',
          path: '/pages/index/index'
        });
      }
    }
  }, {
    icon: Settings,
    label: '设置',
    action: () => {}
  }, {
    icon: LogOut,
    label: '退出登录',
    action: () => {}
  }];
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="outline" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">个人中心</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 用户信息 */}
      <div className="px-4 py-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <img src={user.avatar} alt="用户头像" className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">已创建 {user.templates} 个模板</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 统计信息 */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{user.templates}</div>
            <div className="text-sm text-gray-500">我的模板</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{user.favorites}</div>
            <div className="text-sm text-gray-500">收藏模板</div>
          </Card>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-4">
        <Card>
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => <button key={index} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50" onClick={item.action}>
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{item.label}</span>
              </button>)}
          </div>
        </Card>
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
            <Heart className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center py-2 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'profile'
        })}>
            <User className="w-6 h-6 text-orange-500" />
          </button>
        </div>
      </div>
    </div>;
}
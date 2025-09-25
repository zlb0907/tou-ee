// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, User, Settings, Heart, Share2, LogOut, Home, Edit3, Star, Download } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

// 自定义卡片组件
const Card = ({
  children,
  className = ''
}) => <div className={cn('bg-white rounded-lg shadow-sm border border-gray-100', className)}>
    {children}
  </div>;

// 菜单项组件
const MenuItem = ({
  icon: Icon,
  label,
  onClick,
  className = ''
}) => <button onClick={onClick} className={cn('w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors', className)}>
    <Icon className="w-5 h-5 text-gray-600" />
    <span className="text-sm text-gray-800 flex-1 text-left">{label}</span>
    <div className="w-2 h-2 bg-gray-300 rounded-full" />
  </button>;

// 统计卡片组件
const StatCard = ({
  value,
  label,
  icon: Icon,
  className = ''
}) => <Card className={cn('p-4 text-center', className)}>
    <div className="flex items-center justify-center mb-2">
      <Icon className="w-5 h-5 text-orange-500 mr-2" />
      <div className="text-2xl font-bold text-orange-600">{value}</div>
    </div>
    <div className="text-sm text-gray-600">{label}</div>
  </Card>;
export default function ProfilePage(props) {
  const {
    $w,
    style
  } = props;
  const [user] = useState({
    name: '微信用户',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    templates: 12,
    favorites: 28,
    downloads: 156
  });
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleShare = () => {
    if (window.wx) {
      window.wx.shareAppMessage({
        title: '姓氏头像制作 - 专属定制',
        desc: '一键生成个性化姓氏头像，展现独特风格',
        path: '/pages/index/index',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
      });
    } else {
      // 浏览器环境模拟分享
      if (navigator.share) {
        navigator.share({
          title: '姓氏头像制作',
          text: '发现这款超好用的姓氏头像制作工具！',
          url: window.location.href
        }).catch(() => {
          alert('分享已取消');
        });
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('链接已复制到剪贴板，快去分享吧！');
        }).catch(() => {
          alert('请手动复制链接分享');
        });
      }
    }
  };
  const menuItems = [{
    icon: User,
    label: '个人信息',
    action: () => console.log('个人信息')
  }, {
    icon: Heart,
    label: '我的收藏',
    action: () => $w.utils.navigateTo({
      pageId: 'favorites'
    })
  }, {
    icon: Download,
    label: '下载记录',
    action: () => console.log('下载记录')
  }, {
    icon: Star,
    label: '我的作品',
    action: () => console.log('我的作品')
  }, {
    icon: Settings,
    label: '设置',
    action: () => console.log('设置')
  }];
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">个人中心</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className="px-4 py-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={user.avatar} alt="用户头像" className="w-20 h-20 rounded-full border-4 border-orange-100" />
              <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full">
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500">专注姓氏头像创作</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 统计信息网格 */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={user.templates} label="我的模板" icon={Edit3} />
          <StatCard value={user.favorites} label="收藏模板" icon={Heart} />
          <StatCard value={user.downloads} label="下载次数" icon={Download} />
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-4">
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => <MenuItem key={index} icon={item.icon} label={item.label} onClick={item.action} />)}
          </div>
        </Card>
      </div>

      {/* 优化的分享按钮 */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button onClick={handleShare} className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center">
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center py-1 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'index'
        })}>
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">首页</span>
          </button>
          <button className="flex flex-col items-center py-1 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'favorites'
        })}>
            <Heart className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">收藏</span>
          </button>
          <button className="flex flex-col items-center py-1 px-4" onClick={() => $w.utils.navigateTo({
          pageId: 'profile'
        })}>
            <User className="w-6 h-6 text-orange-500" />
            <span className="text-xs text-orange-500 mt-1">我的</span>
          </button>
        </div>
      </div>
    </div>;
}
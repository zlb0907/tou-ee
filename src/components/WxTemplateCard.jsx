// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';
// @ts-ignore;
import { Button, Badge } from '@/components/ui';

import { View, Text, Image } from '@tarojs/components';
import { Heart } from '@tarojs/icons';
import Taro from '@tarojs/taro';
export function WxTemplateCard({
  template,
  onClick
}) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    // 检查是否已收藏
    const favorites = Taro.getStorageSync('favorites') || [];
    setLiked(favorites.some(f => f.id === template.id));
  }, [template.id]);
  const handleLike = e => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);

    // 更新本地存储
    const favorites = Taro.getStorageSync('favorites') || [];
    if (newLiked) {
      if (!favorites.find(f => f.id === template.id)) {
        favorites.push(template);
      }
    } else {
      const index = favorites.findIndex(f => f.id === template.id);
      if (index > -1) favorites.splice(index, 1);
    }
    Taro.setStorageSync('favorites', favorites);

    // Taro振动反馈
    Taro.vibrateShort();
  };
  const handleMakeAvatar = e => {
    e.stopPropagation();
    onClick(template);
  };
  const tags = template?.tags || [];
  const displayTags = tags.slice(0, 2);
  const remainingTags = tags.length > 2 ? tags.length - 2 : 0;
  return <View className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-transform hover:scale-105 active:scale-95" onClick={() => onClick(template)}>
      <View className="relative">
        <Image src={template?.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'} className="w-full h-full object-cover" style={{
        aspectRatio: '1'
      }} mode="aspectFill" lazyLoad />
        
        {/* 收藏按钮 */}
        <View className="absolute top-1 right-1">
          <View className={cn("p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm", liked ? "bg-red-500 text-white scale-110" : "bg-white/80 text-gray-600 hover:bg-white/90")} onClick={handleLike}>
            <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
          </View>
        </View>
        
        {/* 标签 */}
        {tags.length > 0 && <View className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
            {displayTags.map((tag, index) => <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5 bg-white/90 text-gray-700 backdrop-blur-sm">
                {tag}
              </Badge>)}
            {remainingTags > 0 && <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-white/90 text-gray-700 backdrop-blur-sm">
                +{remainingTags}
              </Badge>}
          </View>}
      </View>
      
      <View className="p-2">
        <Text className="text-xs text-gray-500">
          {template?.usageCount || 0} 次使用
        </Text>
        
        <Button size="sm" className="w-full mt-2 h-7 px-2 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-full transition-all duration-200 active:scale-95" onClick={handleMakeAvatar}>
          制作
        </Button>
      </View>
    </View>;
}
// @ts-ignore;
import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Text } from 'lucide-react';

import { View, Canvas } from '@tarojs/components';
import { Download, RotateCcw } from '@tarojs/icons';
import Taro from '@tarojs/taro';
export function WxImageEditor({
  templateImage,
  textContent,
  fontSize,
  fontColor,
  fontFamily,
  onImageGenerated
}) {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);
    try {
      const ctx = canvas.getContext('2d');
      const img = canvas.createImage();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = templateImage;
      });

      // 设置Canvas尺寸
      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制背景图片
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 绘制文字
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.textRendering = 'optimizeLegibility';

      // 添加文字阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(textContent, canvas.width / 2, canvas.height / 2);

      // 生成图片数据
      const dataURL = canvas.toDataURL('image/png', 1.0);
      onImageGenerated(dataURL);
    } catch (error) {
      console.error('生成图片失败:', error);
      Taro.showToast({
        title: '生成图片失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  useEffect(() => {
    if (templateImage && textContent) {
      generateImage();
    }
  }, [templateImage, textContent, fontSize, fontColor, fontFamily]);
  return <View className="relative">
      <Canvas ref={canvasRef} style={{
      display: 'none'
    }} canvasId="imageEditor" type="2d" />
      
      <View className="flex gap-2 justify-center mt-4">
        <Button onClick={generateImage} disabled={isGenerating} className="bg-orange-500 hover:bg-orange-600 text-white px-6">
          {isGenerating ? <View className="flex items-center gap-2">
              <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <Text>生成中...</Text>
            </View> : <>
              <RotateCcw className="w-4 h-4 mr-2" />
              <Text>重新生成</Text>
            </>}
        </Button>
      </View>
    </View>;
}
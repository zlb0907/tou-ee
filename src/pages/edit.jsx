// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { View, Text, Image, Canvas } from '@tarojs/components';
import { ArrowLeft, Download, Palette, Type, Sliders } from '@tarojs/icons';
import Taro from '@tarojs/taro';
import { WxImageEditor } from '@/components/WxImageEditor';
// Taro页面配置
EditPage.config = {
  navigationBarTitleText: '编辑头像'
};
export default EditPage;
export default function EditPage() {
  // 获取路由参数
  const router = Taro.useRouter();
  const templateId = router.params.templateId || '4';
  const templateImage = decodeURIComponent(router.params.templateImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop');

  // 状态管理
  const [textContent, setTextContent] = useState('张');
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('kaiti');
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(4);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 字体选项
  const systemFonts = [{
    value: 'kaiti',
    label: '楷体'
  }, {
    value: 'songti',
    label: '宋体'
  }, {
    value: 'heiti',
    label: '黑体'
  }, {
    value: 'fangsong',
    label: '仿宋'
  }, {
    value: 'lishu',
    label: '隶书'
  }, {
    value: 'yahei',
    label: '微软雅黑'
  }];

  // 颜色选项
  const colorOptions = ['#000000', '#FFFFFF', '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'];

  // 处理返回
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 处理保存
  const handleSave = async () => {
    if (textContent.length < minLength || textContent.length > maxLength) {
      Taro.showToast({
        title: `文字长度不符合要求：${textContent} (${minLength}-${maxLength}字)`,
        icon: 'none'
      });
      return;
    }
    if (!generatedImage) {
      Taro.showToast({
        title: '请先生成图片',
        icon: 'none'
      });
      return;
    }
    setIsSaving(true);
    try {
      // Taro环境保存图片
      const fs = Taro.getFileSystemManager();
      const tempFilePath = `${Taro.env.USER_DATA_PATH}/temp_${Date.now()}.png`;
      fs.writeFileSync(tempFilePath, generatedImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      // 保存到相册
      Taro.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          Taro.showToast({
            title: '头像已保存到相册',
            icon: 'success'
          });
          // 清理临时文件
          fs.unlinkSync(tempFilePath);
        },
        fail: err => {
          console.error('保存失败:', err);
          Taro.showToast({
            title: '保存失败，请检查权限设置',
            icon: 'none'
          });
        },
        complete: () => {
          setIsSaving(false);
        }
      });
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
      setIsSaving(false);
    }
  };

  // 处理图片生成
  const handleImageGenerated = dataURL => {
    setGeneratedImage(dataURL);
  };

  // 初始化字体
  useEffect(() => {
    // 根据模板ID设置默认字体
    const fontMap = {
      '4': 'kaiti',
      '5': 'songti',
      '6': 'heiti',
      '7': 'fangsong'
    };
    setFontFamily(fontMap[templateId] || 'kaiti');
  }, [templateId]);
  return <View className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <View className="sticky top-0 z-10 bg-white shadow-sm">
        <View className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Text className="text-lg font-medium">编辑头像</Text>
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} className="active:scale-95">
            {isSaving ? <View className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
          </Button>
        </View>
      </View>

      {/* 预览区域 */}
      <View className="px-4 py-4">
        <View className="bg-white rounded-lg shadow-sm overflow-hidden">
          <View className="relative" style={{
          aspectRatio: '1'
        }}>
            {/* 背景图片 */}
            <Image src={templateImage} className="w-full h-full object-cover" mode="aspectFill" />
            
            {/* 文字预览 */}
            <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Text className="font-bold select-none" style={{
              fontSize: `${fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
                {textContent}
              </Text>
            </View>
          </View>
        </View>
        
        {/* 图片编辑器 */}
        <WxImageEditor templateImage={templateImage} textContent={textContent} fontSize={fontSize} fontColor={fontColor} fontFamily={fontFamily} onImageGenerated={handleImageGenerated} />
      </View>

      {/* 编辑工具 */}
      <View className="px-4 space-y-4 pb-20">
        {/* 文字输入 */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-orange-500" />
            <Text className="text-sm font-medium text-gray-700">姓氏</Text>
          </View>
          <Input type="text" value={textContent} onChange={e => setTextContent(e.target.value.slice(0, maxLength))} maxLength={maxLength} className="text-center text-lg" placeholder="输入姓氏" />
          <Text className="text-xs text-gray-500 mt-1 text-center">
            {textContent.length}/{maxLength}字
          </Text>
        </View>

        {/* 字体设置 */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-orange-500" />
            <Text className="text-sm font-medium text-gray-700">字体设置</Text>
          </View>
          
          <View className="space-y-3">
            <View>
              <Text className="text-xs text-gray-600 mb-1 block">字体</Text>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemFonts.map(font => <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </View>
            
            <View>
              <Text className="text-xs text-gray-600 mb-1 block">
                字体大小: {fontSize}px
              </Text>
              <Slider value={[fontSize]} onValueChange={([value]) => setFontSize(value)} min={20} max={100} step={1} className="w-full" />
            </View>
            
            <View>
              <Text className="text-xs text-gray-600 mb-1 block">字体颜色</Text>
              <View className="grid grid-cols-5 gap-2">
                {colorOptions.map(color => <View key={color} className="w-8 h-8 rounded-full border-2 transition-all duration-200 active:scale-95" style={{
                backgroundColor: color,
                borderColor: fontColor === color ? color : 'transparent',
                boxShadow: fontColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none'
              }} onClick={() => setFontColor(color)} />)}
              </View>
            </View>
          </View>
        </View>

        {/* 字数限制 */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-orange-500" />
            <Text className="text-sm font-medium text-gray-700">字数限制</Text>
          </View>
          
          <View className="grid grid-cols-2 gap-3">
            <View>
              <Text className="text-xs text-gray-600">最小字数</Text>
              <Input type="number" value={minLength} onChange={e => setMinLength(parseInt(e.target.value) || 1)} min={1} max={10} className="h-9" />
            </View>
            <View>
              <Text className="text-xs text-gray-600">最大字数</Text>
              <Input type="number" value={maxLength} onChange={e => setMaxLength(parseInt(e.target.value) || 4)} min={1} max={10} className="h-9" />
            </View>
          </View>
        </View>

        {/* 保存按钮 */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition-all duration-200 active:scale-95" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <View className="flex items-center justify-center gap-2">
              <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <Text>保存中...</Text>
            </View> : '保存头像'}
        </Button>
      </View>
    </View>;
}
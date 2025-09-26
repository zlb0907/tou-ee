// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Textarea, Card, CardContent, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { View, Text, Image, ScrollView } from '@tarojs/components';
import { ArrowLeft, Upload, Image as ImageIcon, Type, Settings, X, Plus } from '@tarojs/icons';
import Taro from '@tarojs/taro';
// Taro页面配置
AdminUploadPage.config = {
  navigationBarTitleText: '上传模板'
};
export default AdminUploadPage;
export default function AdminUploadPage() {
  // 状态管理
  const [uploadedImage, setUploadedImage] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState(['情侣']);
  const [editableAreas, setEditableAreas] = useState([]);
  const [customFonts, setCustomFonts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // 新区域默认值
  const [newArea, setNewArea] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 40,
    defaultText: '张',
    minLength: 1,
    maxLength: 4,
    fontFamily: 'kaiti'
  });

  // 可用标签和字体
  const availableTags = ['女生', '男生', '情侣', '亲子', '全家福', '情头'];
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
  }];

  // 处理返回
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 处理图片上传
  const handleImageUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0];
        setUploadedImage(tempFilePath);
      },
      fail: err => {
        console.error('选择图片失败:', err);
        Taro.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  };

  // 处理字体上传
  const handleFontUpload = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['ttf', 'otf'],
      success: res => {
        const file = res.tempFiles[0];
        const fontName = file.name.replace(/\.(ttf|otf)$/i, '');
        const fontUrl = file.path;
        const newFont = {
          value: fontName,
          label: fontName,
          url: fontUrl
        };
        setCustomFonts(prev => [...prev, newFont]);

        // 创建字体样式
        const style = document.createElement('style');
        style.innerHTML = `
          @font-face {
            font-family: '${fontName}';
            src: url(${fontUrl}) format('truetype');
          }
        `;
        document.head.appendChild(style);
        Taro.showToast({
          title: `字体 ${fontName} 已上传并可用`,
          icon: 'success'
        });
      },
      fail: err => {
        console.error('选择字体文件失败:', err);
        Taro.showToast({
          title: '请上传 TTF 或 OTF 格式的字体文件',
          icon: 'none'
        });
      }
    });
  };

  // 添加编辑区域
  const handleAddArea = () => {
    if (editableAreas.length < 5) {
      setEditableAreas([...editableAreas, {
        ...newArea,
        id: Date.now()
      }]);
    }
  };

  // 更新编辑区域
  const handleAreaChange = (id, field, value) => {
    setEditableAreas(areas => areas.map(area => area.id === id ? {
      ...area,
      [field]: value
    } : area));
  };

  // 删除编辑区域
  const handleRemoveArea = id => {
    setEditableAreas(areas => areas.filter(area => area.id !== id));
  };

  // 切换标签
  const handleTagToggle = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // 提交模板
  const handleSubmit = async () => {
    if (!uploadedImage || !templateName || editableAreas.length === 0) {
      Taro.showToast({
        title: '请上传图片、填写模板名称并添加至少一个可编辑区域',
        icon: 'none'
      });
      return;
    }
    setIsUploading(true);
    try {
      // 创建模板数据
      const templateData = {
        id: Date.now(),
        name: templateName,
        description,
        image: uploadedImage,
        tags: selectedTags,
        category: selectedTags.includes('情侣') ? '情侣' : selectedTags[0] || '其他',
        editableAreas,
        customFonts,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };

      // 保存到本地存储
      const templates = Taro.getStorageSync('templates') || [];
      templates.unshift(templateData);
      Taro.setStorageSync('templates', templates);

      // 更新首页数据
      const homeTemplates = Taro.getStorageSync('homeTemplates') || [];
      homeTemplates.unshift({
        id: templateData.id,
        name: templateData.name,
        image: templateData.image,
        category: templateData.category,
        usageCount: 0,
        tags: templateData.tags
      });
      Taro.setStorageSync('homeTemplates', homeTemplates);
      Taro.showToast({
        title: '模板上传成功！',
        icon: 'success'
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('上传失败:', error);
      Taro.showToast({
        title: '上传失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 所有可用字体
  const allFonts = [...systemFonts, ...customFonts];
  return <View className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <View className="sticky top-0 z-10 bg-white shadow-sm">
        <View className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Text className="text-lg font-medium">上传模板</Text>
          <Button size="sm" onClick={handleSubmit} disabled={isUploading} className="bg-orange-500 hover:bg-orange-600">
            {isUploading ? '发布中...' : '发布'}
          </Button>
        </View>
      </View>

      {/* 图片上传 */}
      <View className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                模板图片 <Text className="text-red-500">*</Text>
              </Text>
              <View className="relative">
                {uploadedImage ? <View className="relative">
                    <Image src={uploadedImage} className="w-full rounded-lg" style={{
                  aspectRatio: '1'
                }} mode="aspectFill" />
                    <View className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={handleImageUpload} className="bg-white/90 backdrop-blur-sm">
                        更换
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setUploadedImage(null)} className="bg-red-500/90 backdrop-blur-sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </View>
                  </View> : <View onClick={handleImageUpload} className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <Text className="text-sm text-gray-500">点击上传图片</Text>
                    <Text className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大 5MB</Text>
                  </View>}
              </View>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  模板名称 <Text className="text-red-500">*</Text>
                </Text>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="例如：新春福字模板" />
              </View>
              
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">模板描述</Text>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="简单描述模板特点..." rows={2} />
              </View>
              
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-2">标签</Text>
                <View className="flex flex-wrap gap-2">
                  {availableTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer transition-all duration-200 ${selectedTags.includes(tag) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300 hover:border-orange-500'}`} onClick={() => handleTagToggle(tag)}>
                      {tag}
                    </Badge>)}
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 字体上传 */}
      <View className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <Text className="font-medium mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              自定义字体
            </Text>
            <Button size="sm" variant="outline" className="w-full" onClick={handleFontUpload}>
              <Upload className="w-4 h-4 mr-2" />
              上传自定义字体
            </Button>
            
            {customFonts.length > 0 && <View className="mt-3">
                <Text className="text-sm text-gray-600 mb-2">已上传字体：</Text>
                <View className="flex flex-wrap gap-2">
                  {customFonts.map(font => <Badge key={font.value} variant="secondary" className="bg-blue-100 text-blue-700">
                      {font.label}
                    </Badge>)}
                </View>
              </View>}
          </CardContent>
        </Card>
      </View>

      {/* 可编辑区域设置 */}
      <View className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <View className="flex justify-between items-center mb-4">
              <Text className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                可编辑文字区域 <Text className="text-red-500">*</Text>
              </Text>
              <Text className="text-sm text-gray-500">{editableAreas.length}/5</Text>
            </View>

            {editableAreas.map((area, index) => <View key={area.id} className="mb-3 p-3 border rounded-lg bg-gray-50">
                <View className="flex justify-between items-center mb-2">
                  <Text className="text-sm font-medium">区域 {index + 1}</Text>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveArea(area.id)} className="text-red-500 hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </Button>
                </View>
                <View className="grid grid-cols-2 gap-2 text-sm">
                  <View>
                    <Text className="text-xs text-gray-600">默认文字</Text>
                    <Input value={area.defaultText} onChange={e => handleAreaChange(area.id, 'defaultText', e.target.value)} className="h-8 text-sm" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">字体</Text>
                    <Select value={area.fontFamily} onValueChange={value => handleAreaChange(area.id, 'fontFamily', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allFonts.map(font => <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">最小字数</Text>
                    <Input type="number" value={area.minLength} onChange={e => handleAreaChange(area.id, 'minLength', parseInt(e.target.value) || 1)} min={1} max={10} className="h-8 text-sm" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">最大字数</Text>
                    <Input type="number" value={area.maxLength} onChange={e => handleAreaChange(area.id, 'maxLength', parseInt(e.target.value) || 4)} min={1} max={10} className="h-8 text-sm" />
                  </View>
                </View>
              </View>)}

            {editableAreas.length < 5 && <View className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <View className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <View>
                    <Text className="text-xs text-gray-600">默认文字</Text>
                    <Input value={newArea.defaultText} onChange={e => setNewArea({
                  ...newArea,
                  defaultText: e.target.value
                })} className="h-8 text-sm" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">字体</Text>
                    <Select value={newArea.fontFamily} onValueChange={value => setNewArea({
                  ...newArea,
                  fontFamily: value
                })}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allFonts.map(font => <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">最小字数</Text>
                    <Input type="number" value={newArea.minLength} onChange={e => setNewArea({
                  ...newArea,
                  minLength: parseInt(e.target.value) || 1
                })} min={1} max={10} className="h-8 text-sm" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-600">最大字数</Text>
                    <Input type="number" value={newArea.maxLength} onChange={e => setNewArea({
                  ...newArea,
                  maxLength: parseInt(e.target.value) || 4
                })} min={1} max={10} className="h-8 text-sm" />
                  </View>
                </View>
                <Button size="sm" variant="outline" onClick={handleAddArea} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  添加区域
                </Button>
              </View>}
          </CardContent>
        </Card>
      </View>

      {/* 预览说明 */}
      <View className="px-4 pb-20">
        <Card>
          <CardContent className="p-4">
            <Text className="font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              使用说明
            </Text>
            <View className="text-sm text-gray-600 space-y-1">
              <Text>• 上传 1:1 正方形图片效果最佳</Text>
              <Text>• 至少添加 1 个可编辑文字区域</Text>
              <Text>• 用户只能在指定区域修改文字</Text>
              <Text>• 最多支持 5 个可编辑区域</Text>
              <Text>• 可以为每个区域设置不同的字体</Text>
              <Text>• 所有数据将保存在本地，无需服务器</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>;
}
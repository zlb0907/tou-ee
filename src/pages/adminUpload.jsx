// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Upload, Image, Type, Settings, X, Plus } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Textarea, Card, CardContent, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

export default function AdminUploadPage(props) {
  const {
    $w,
    style
  } = props;

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
    $w.utils.navigateBack();
  };

  // 处理图片上传
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      // 检查文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理字体上传
  const handleFontUpload = e => {
    const file = e.target.files[0];
    if (file && (file.type === 'font/ttf' || file.type === 'font/otf' || file.name.endsWith('.ttf') || file.name.endsWith('.otf'))) {
      const fontName = file.name.replace(/\.(ttf|otf)$/i, '');
      const fontUrl = URL.createObjectURL(file);
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
      alert(`字体 ${fontName} 已上传并可用`);
    } else {
      alert('请上传 TTF 或 OTF 格式的字体文件');
    }
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
      alert('请上传图片、填写模板名称并添加至少一个可编辑区域');
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
      const templates = JSON.parse(localStorage.getItem('templates') || '[]');
      templates.unshift(templateData);
      localStorage.setItem('templates', JSON.stringify(templates));

      // 更新首页数据
      const homeTemplates = JSON.parse(localStorage.getItem('homeTemplates') || '[]');
      homeTemplates.unshift({
        id: templateData.id,
        name: templateData.name,
        image: templateData.image,
        category: templateData.category,
        usageCount: 0,
        tags: templateData.tags
      });
      localStorage.setItem('homeTemplates', JSON.stringify(homeTemplates));
      alert('模板上传成功！');
      $w.utils.navigateBack();
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 所有可用字体
  const allFonts = [...systemFonts, ...customFonts];
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">上传模板</h1>
          <Button size="sm" onClick={handleSubmit} disabled={isUploading} className="bg-orange-500 hover:bg-orange-600">
            {isUploading ? '发布中...' : '发布'}
          </Button>
        </div>
      </div>

      {/* 图片上传 */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模板图片 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {uploadedImage ? <div className="relative">
                    <img src={uploadedImage} alt="模板预览" className="w-full rounded-lg" style={{
                  aspectRatio: '1',
                  objectFit: 'cover'
                }} />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => document.getElementById('imageUpload').click()} className="bg-white/90 backdrop-blur-sm">
                        更换
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setUploadedImage(null)} className="bg-red-500/90 backdrop-blur-sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div> : <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">点击上传图片</span>
                    <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大 5MB</span>
                  </label>}
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  模板名称 <span className="text-red-500">*</span>
                </label>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="例如：新春福字模板" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板描述</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="简单描述模板特点..." rows={2} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer transition-all duration-200 ${selectedTags.includes(tag) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-300 hover:border-orange-500'}`} onClick={() => handleTagToggle(tag)}>
                      {tag}
                    </Badge>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 字体上传 */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              自定义字体
            </h3>
            <Button size="sm" variant="outline" className="w-full" onClick={() => document.getElementById('fontUpload').click()}>
              <Upload className="w-4 h-4 mr-2" />
              上传自定义字体
            </Button>
            <input id="fontUpload" type="file" onChange={handleFontUpload} accept=".ttf,.otf" className="hidden" />
            
            {customFonts.length > 0 && <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">已上传字体：</p>
                <div className="flex flex-wrap gap-2">
                  {customFonts.map(font => <Badge key={font.value} variant="secondary" className="bg-blue-100 text-blue-700">
                      {font.label}
                    </Badge>)}
                </div>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* 可编辑区域设置 */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                可编辑文字区域 <span className="text-red-500">*</span>
              </h3>
              <span className="text-sm text-gray-500">{editableAreas.length}/5</span>
            </div>

            {editableAreas.map((area, index) => <div key={area.id} className="mb-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">区域 {index + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveArea(area.id)} className="text-red-500 hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="text-xs text-gray-600">默认文字</label>
                    <Input value={area.defaultText} onChange={e => handleAreaChange(area.id, 'defaultText', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">字体</label>
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
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最小字数</label>
                    <Input type="number" value={area.minLength} onChange={e => handleAreaChange(area.id, 'minLength', parseInt(e.target.value) || 1)} min={1} max={10} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最大字数</label>
                    <Input type="number" value={area.maxLength} onChange={e => handleAreaChange(area.id, 'maxLength', parseInt(e.target.value) || 4)} min={1} max={10} className="h-8 text-sm" />
                  </div>
                </div>
              </div>)}

            {editableAreas.length < 5 && <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <label className="text-xs text-gray-600">默认文字</label>
                    <Input value={newArea.defaultText} onChange={e => setNewArea({
                  ...newArea,
                  defaultText: e.target.value
                })} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">字体</label>
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
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最小字数</label>
                    <Input type="number" value={newArea.minLength} onChange={e => setNewArea({
                  ...newArea,
                  minLength: parseInt(e.target.value) || 1
                })} min={1} max={10} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最大字数</label>
                    <Input type="number" value={newArea.maxLength} onChange={e => setNewArea({
                  ...newArea,
                  maxLength: parseInt(e.target.value) || 4
                })} min={1} max={10} className="h-8 text-sm" />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleAddArea} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  添加区域
                </Button>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* 预览说明 */}
      <div className="px-4 pb-20">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              使用说明
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 上传 1:1 正方形图片效果最佳</li>
              <li>• 至少添加 1 个可编辑文字区域</li>
              <li>• 用户只能在指定区域修改文字</li>
              <li>• 最多支持 5 个可编辑区域</li>
              <li>• 可以为每个区域设置不同的字体</li>
              <li>• 所有数据将保存在本地，无需服务器</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>;
}
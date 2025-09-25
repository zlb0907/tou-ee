// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Upload, Image, Type, Settings, Trash2, Plus } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Textarea, Card, CardContent, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

export default function AdminUploadPage(props) {
  const {
    $w,
    style
  } = props;
  const [uploadedImage, setUploadedImage] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState(['情侣']);
  const [editableAreas, setEditableAreas] = useState([]);
  const [newArea, setNewArea] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 40,
    defaultText: '张',
    minLength: 1,
    maxLength: 4
  });
  const [customFonts, setCustomFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('kaiti');
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
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => setUploadedImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };
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
      setSelectedFont(fontName);
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
  const handleAddArea = () => {
    if (editableAreas.length < 5) {
      setEditableAreas([...editableAreas, {
        ...newArea,
        id: Date.now()
      }]);
    }
  };
  const handleAreaChange = (id, field, value) => {
    setEditableAreas(areas => areas.map(area => area.id === id ? {
      ...area,
      [field]: value
    } : area));
  };
  const handleRemoveArea = id => {
    setEditableAreas(areas => areas.filter(area => area.id !== id));
  };
  const handleTagToggle = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const handleSubmit = () => {
    if (!uploadedImage || !templateName || editableAreas.length === 0) {
      alert('请上传图片、填写模板名称并添加至少一个可编辑区域');
      return;
    }
    const templateData = {
      name: templateName,
      description,
      image: uploadedImage,
      tags: selectedTags,
      category: selectedTags.includes('情侣') ? '情侣' : selectedTags[0] || '其他',
      editableAreas,
      fontFamily: selectedFont,
      customFonts: customFonts,
      usageCount: 0
    };
    console.log('上传模板:', templateData);
    alert('模板上传成功！');
    $w.utils.navigateBack();
  };
  const allFonts = [...systemFonts, ...customFonts];
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">上传模板</h1>
          <Button size="sm" onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600">
            发布
          </Button>
        </div>
      </div>

      {/* 图片上传 */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">模板图片</label>
              <div className="relative">
                {uploadedImage ? <div className="relative">
                    <img src={uploadedImage} alt="模板预览" className="w-full rounded-lg" style={{
                  aspectRatio: '1',
                  objectFit: 'cover'
                }} />
                    <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => document.getElementById('imageUpload').click()}>
                      更换
                    </Button>
                  </div> : <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">点击上传图片</span>
                  </label>}
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="例如：新春福字模板" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板描述</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="简单描述模板特点..." rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-300'}`} onClick={() => handleTagToggle(tag)}>
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
              模板字体
            </h3>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allFonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => document.getElementById('fontUpload').click()}>
              <Upload className="w-4 h-4 mr-1" />
              上传自定义字体
            </Button>
            <input id="fontUpload" type="file" accept=".ttf,.otf" onChange={handleFontUpload} className="hidden" />
          </CardContent>
        </Card>
      </div>

      {/* 可编辑区域设置 */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                可编辑文字区域
              </h3>
              <span className="text-sm text-gray-500">{editableAreas.length}/5</span>
            </div>

            {editableAreas.map((area, index) => <div key={area.id} className="mb-3 p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">区域 {index + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveArea(area.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="text-xs text-gray-600">默认文字</label>
                    <Input value={area.defaultText} onChange={e => handleAreaChange(area.id, 'defaultText', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最小字数</label>
                    <Input type="number" value={area.minLength} onChange={e => handleAreaChange(area.id, 'minLength', parseInt(e.target.value))} min={1} max={10} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最大字数</label>
                    <Input type="number" value={area.maxLength} onChange={e => handleAreaChange(area.id, 'maxLength', parseInt(e.target.value))} min={1} max={10} className="h-8 text-sm" />
                  </div>
                </div>
              </div>)}

            {editableAreas.length < 5 && <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="text-xs text-gray-600">默认文字</label>
                    <Input value={newArea.defaultText} onChange={e => setNewArea({
                  ...newArea,
                  defaultText: e.target.value
                })} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最小字数</label>
                    <Input type="number" value={newArea.minLength} onChange={e => setNewArea({
                  ...newArea,
                  minLength: parseInt(e.target.value)
                })} min={1} max={10} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">最大字数</label>
                    <Input type="number" value={newArea.maxLength} onChange={e => setNewArea({
                  ...newArea,
                  maxLength: parseInt(e.target.value)
                })} min={1} max={10} className="h-8 text-sm" />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleAddArea} className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-1" />
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
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>;
}
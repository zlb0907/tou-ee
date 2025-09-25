// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Upload, Image, Type, Plus, Trash2 } from 'lucide-react';

// 简化版组件
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default'
}) => <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors ${className} ${variant === 'outline' ? 'border border-gray-300 hover:border-orange-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
    {children}
  </button>;
const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = ''
}) => <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 ${className}`} />;
const Textarea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = ''
}) => <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 ${className}`} />;
export default function AdminUploadPage(props) {
  const {
    $w
  } = props;
  const [uploadedImage, setUploadedImage] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState(['情侣']);
  const [fontFamily, setFontFamily] = useState('kaiti');
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
  const handleTagToggle = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const handleSubmit = () => {
    if (!uploadedImage || !templateName) {
      alert('请上传图片并填写模板名称');
      return;
    }
    alert('模板上传成功！');
    $w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="outline" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">上传模板</h1>
          <Button onClick={handleSubmit} className="px-4 py-2">
            发布
          </Button>
        </div>
      </div>

      {/* 图片上传 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">模板图片</label>
            <div className="relative">
              {uploadedImage ? <div className="relative">
                  <img src={uploadedImage} alt="模板预览" className="w-full rounded-lg" style={{
                aspectRatio: '1',
                objectFit: 'cover'
              }} />
                  <Button variant="outline" className="absolute top-2 right-2 text-sm" onClick={() => document.getElementById('imageUpload').click()}>
                    更换
                  </Button>
                </div> : <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                  <Image className="w-8 h-8 text-gray-400 mb-2" />
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
                {availableTags.map(tag => <button key={tag} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedTags.includes(tag) ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-600 hover:border-orange-500'}`} onClick={() => handleTagToggle(tag)}>
                    {tag}
                  </button>)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模板字体</label>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                {systemFonts.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Type className="w-4 h-4" />
            使用说明
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 上传 1:1 正方形图片效果最佳</li>
            <li>• 填写模板名称和描述</li>
            <li>• 选择适合的标签分类</li>
            <li>• 设置默认字体样式</li>
          </ul>
        </div>
      </div>
    </div>;
}
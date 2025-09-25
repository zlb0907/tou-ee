// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Type } from 'lucide-react';

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
const Slider = ({
  value,
  onValueChange,
  min,
  max,
  step
}) => <input type="range" min={min} max={max} step={step} value={value[0]} onChange={e => onValueChange([parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />;
const Select = ({
  children,
  value,
  onValueChange
}) => <select value={value} onChange={e => onValueChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
    {children}
  </select>;
export default function EditPage(props) {
  const {
    $w
  } = props;
  const templateId = $w.page.dataset.params?.templateId || '1';
  const [textContent, setTextContent] = useState('张');
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('kaiti');
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(4);
  const [templateData, setTemplateData] = useState(null);
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
  const handleSave = () => {
    if (textContent.length < minLength || textContent.length > maxLength) {
      alert(`文字长度不符合要求：${minLength}-${maxLength}字`);
      return;
    }
    alert('头像已保存到相册！');
  };
  const loadTemplateData = async () => {
    try {
      const mockTemplate = {
        id: templateId,
        name: '新春福字模板',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        fontFamily: 'kaiti',
        editableAreas: [{
          id: 1,
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          text: '福',
          minLength: 1,
          maxLength: 2
        }],
        customFonts: []
      };
      setTemplateData(mockTemplate);
      setFontFamily(mockTemplate.fontFamily || 'kaiti');
      setTextContent(mockTemplate.editableAreas?.[0]?.text || '张');
      setMinLength(mockTemplate.editableAreas?.[0]?.minLength || 1);
      setMaxLength(mockTemplate.editableAreas?.[0]?.maxLength || 4);
    } catch (error) {
      console.error('加载模板失败:', error);
      setFontFamily('kaiti');
    }
  };
  useEffect(() => {
    loadTemplateData();
  }, [templateId]);
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="outline" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">编辑头像</h1>
          <Button onClick={handleSave} className="p-2">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 模板预览区域 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative bg-gradient-to-br from-orange-100 to-orange-200" style={{
          aspectRatio: '1'
        }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold" style={{
              fontSize: `${fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              left: '50%',
              top: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)'
            }}>
                {textContent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑控制区域 */}
      <div className="px-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
          <Input value={textContent} onChange={e => setTextContent(e.target.value.slice(0, maxLength))} maxLength={maxLength} className="text-center text-lg" />
          <p className="text-xs text-gray-500 mt-1">{textContent.length}/{maxLength}字</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">字数限制</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">最小字数</label>
              <Input type="number" value={minLength} onChange={e => setMinLength(parseInt(e.target.value))} min={1} max={10} />
            </div>
            <div>
              <label className="text-xs text-gray-600">最大字数</label>
              <Input type="number" value={maxLength} onChange={e => setMaxLength(parseInt(e.target.value))} min={1} max={10} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">字体</label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            {systemFonts.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
          <Slider value={[fontSize]} onValueChange={([value]) => setFontSize(value)} min={20} max={100} step={1} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">字体颜色</label>
          <div className="flex gap-2">
            {['#000000', '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444'].map(color => <button key={color} className="w-8 h-8 rounded-full border-2" style={{
            backgroundColor: color,
            borderColor: fontColor === color ? color : 'transparent'
          }} onClick={() => setFontColor(color)} />)}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button className="w-full" onClick={handleSave}>
          保存头像
        </Button>
      </div>
    </div>;
}
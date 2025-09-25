// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Palette, Type, Sliders } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

// @ts-ignore;
import { WxImageEditor } from '@/components/WxImageEditor';
export default function EditPage(props) {
  const {
    $w,
    style
  } = props;

  // 获取参数
  const templateId = $w.page.dataset.params?.templateId || '4';
  const templateImage = $w.page.dataset.params?.templateImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop';

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
    $w.utils.navigateBack();
  };

  // 处理保存
  const handleSave = async () => {
    if (textContent.length < minLength || textContent.length > maxLength) {
      alert(`文字长度不符合要求：${textContent} (${minLength}-${maxLength}字)`);
      return;
    }
    if (!generatedImage) {
      alert('请先生成图片');
      return;
    }
    setIsSaving(true);
    try {
      // 微信小程序环境
      if (typeof wx !== 'undefined') {
        // 将base64转换为临时文件
        const fs = wx.getFileSystemManager();
        const tempFilePath = `${wx.env.USER_DATA_PATH}/temp_${Date.now()}.png`;
        fs.writeFileSync(tempFilePath, generatedImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        // 保存到相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: () => {
            alert('头像已保存到相册');
            // 清理临时文件
            fs.unlinkSync(tempFilePath);
          },
          fail: err => {
            console.error('保存失败:', err);
            alert('保存失败，请检查权限设置');
          },
          complete: () => {
            setIsSaving(false);
          }
        });
      } else {
        // 浏览器环境
        const link = document.createElement('a');
        link.download = `姓氏头像_${textContent}_${Date.now()}.png`;
        link.href = generatedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('头像已下载');
        setIsSaving(false);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
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
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">编辑头像</h1>
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} className="active:scale-95">
            {isSaving ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative" style={{
          aspectRatio: '1'
        }}>
            {/* 背景图片 */}
            <img src={templateImage} alt="模板背景" className="w-full h-full object-cover" />
            
            {/* 文字预览 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bold select-none" style={{
              fontSize: `${fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
                {textContent}
              </span>
            </div>
          </div>
        </div>
        
        {/* 图片编辑器 */}
        <WxImageEditor templateImage={templateImage} textContent={textContent} fontSize={fontSize} fontColor={fontColor} fontFamily={fontFamily} onImageGenerated={handleImageGenerated} />
      </div>

      {/* 编辑工具 */}
      <div className="px-4 space-y-4 pb-20">
        {/* 文字输入 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">姓氏</label>
          </div>
          <Input type="text" value={textContent} onChange={e => setTextContent(e.target.value.slice(0, maxLength))} maxLength={maxLength} className="text-center text-lg" placeholder="输入姓氏" />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {textContent.length}/{maxLength}字
          </p>
        </div>

        {/* 字体设置 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">字体设置</label>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">字体</label>
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
            </div>
            
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                字体大小: {fontSize}px
              </label>
              <Slider value={[fontSize]} onValueChange={([value]) => setFontSize(value)} min={20} max={100} step={1} className="w-full" />
            </div>
            
            <div>
              <label className="text-xs text-gray-600 mb-1 block">字体颜色</label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map(color => <button key={color} className="w-8 h-8 rounded-full border-2 transition-all duration-200 active:scale-95" style={{
                backgroundColor: color,
                borderColor: fontColor === color ? color : 'transparent',
                boxShadow: fontColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none'
              }} onClick={() => setFontColor(color)} />)}
              </div>
            </div>
          </div>
        </div>

        {/* 字数限制 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">字数限制</label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">最小字数</label>
              <Input type="number" value={minLength} onChange={e => setMinLength(parseInt(e.target.value) || 1)} min={1} max={10} className="h-9" />
            </div>
            <div>
              <label className="text-xs text-gray-600">最大字数</label>
              <Input type="number" value={maxLength} onChange={e => setMaxLength(parseInt(e.target.value) || 4)} min={1} max={10} className="h-9" />
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition-all duration-200 active:scale-95" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              保存中...
            </div> : '保存头像'}
        </Button>
      </div>
    </div>;
}
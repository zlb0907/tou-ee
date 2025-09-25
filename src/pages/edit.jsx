// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Download } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent } from '@/components/ui';

// @ts-ignore;
import { wxUtils } from '@/lib/wx-utils';
export default function EditPage(props) {
  const {
    $w,
    style
  } = props;

  // 从URL参数获取templateId
  const templateId = typeof wx !== 'undefined' ? wx.getCurrentPages().pop().options.templateId : $w.page.dataset.params?.templateId || '1';
  const [textContent, setTextContent] = useState('张');
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('kaiti');
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(4);
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
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack();
    } else {
      $w.utils.navigateBack();
    }
  };
  const handleSave = () => {
    if (textContent.length < minLength || textContent.length > maxLength) {
      wxUtils.showToast({
        title: `文字长度不符合要求：${textContent} (${minLength}-${maxLength}字)`,
        icon: 'none'
      });
      return;
    }

    // 微信小程序保存到相册
    if (typeof wx !== 'undefined' && wx.canvasToTempFilePath) {
      const query = wx.createSelectorQuery();
      query.select('#preview-canvas').fields({
        node: true,
        size: true
      }).exec(res => {
        const canvas = res[0].node;
        wx.canvasToTempFilePath({
          canvas,
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wxUtils.showToast({
                  title: '头像已保存到相册',
                  icon: 'success'
                });
              },
              fail: () => {
                wxUtils.showToast({
                  title: '保存失败，请重试',
                  icon: 'error'
                });
              }
            });
          }
        });
      });
    } else {
      wxUtils.showToast({
        title: '头像已保存',
        icon: 'success'
      });
    }
  };

  // 根据模板ID自动选择字体
  useEffect(() => {
    setFontFamily('kaiti');
  }, [templateId]);
  return <div style={style} className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">编辑头像</h1>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 预览区域 */}
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
            {/* 微信小程序 canvas */}
            {typeof wx !== 'undefined' && <canvas id="preview-canvas" className="absolute inset-0 w-full h-full" style={{
            display: 'none'
          }} />}
          </div>
        </div>
      </div>

      {/* 编辑工具 */}
      <div className="px-4 space-y-4 pb-20">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
          <Input type="text" value={textContent} onChange={e => setTextContent(e.target.value.slice(0, maxLength))} maxLength={maxLength} className="text-center text-lg" />
          <p className="text-xs text-gray-500 mt-1">
            {textContent.length}/{maxLength}字
          </p>
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

        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
          保存头像
        </Button>
      </div>
    </div>;
}
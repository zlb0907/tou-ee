
// 微信小程序工具函数 - 优化版本
export const wxUtils = {
  // 页面跳转
  navigateTo: (url) => {
    if (typeof wx !== 'undefined' && wx.navigateTo) {
      wx.navigateTo({ url });
    } else {
      // 浏览器环境模拟
      console.log('模拟跳转到:', url);
      // 这里可以添加浏览器环境的路由逻辑
    }
  },
  
  redirectTo: (url) => {
    if (typeof wx !== 'undefined' && wx.redirectTo) {
      wx.redirectTo({ url });
    } else {
      console.log('模拟重定向到:', url);
    }
  },
  
  navigateBack: () => {
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack();
    } else {
      console.log('模拟返回上一页');
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  },
  
  // 文件操作
  chooseImage: (options = {}) => {
    return new Promise((resolve, reject) => {
      if (typeof wx !== 'undefined' && wx.chooseImage) {
        wx.chooseImage({
          count: options.count || 1,
          sizeType: options.sizeType || ['original', 'compressed'],
          sourceType: options.sourceType || ['album', 'camera'],
          success: resolve,
          fail: reject
        });
      } else {
        // 浏览器环境模拟
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = options.count > 1;
        input.onchange = (e) => {
          const files = Array.from(e.target.files);
          resolve({ 
            tempFilePaths: files.map(file => URL.createObjectURL(file)),
            tempFiles: files
          });
        };
        input.click();
      }
    });
  },
  
  // 数据存储 - 优化版本
  setStorage: (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      if (typeof wx !== 'undefined' && wx.setStorage) {
        wx.setStorage({ key, data: serializedData });
      } else {
        localStorage.setItem(key, serializedData);
      }
    } catch (error) {
      console.error('存储数据失败:', error);
    }
  },
  
  getStorage: (key) => {
    return new Promise((resolve) => {
      try {
        if (typeof wx !== 'undefined' && wx.getStorage) {
          wx.getStorage({
            key,
            success: (res) => {
              try {
                resolve(JSON.parse(res.data));
              } catch (e) {
                resolve(res.data);
              }
            },
            fail: () => resolve(null)
          });
        } else {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(data);
            }
          } else {
            resolve(null);
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        resolve(null);
      }
    });
  },
  
  // 删除存储
  removeStorage: (key) => {
    try {
      if (typeof wx !== 'undefined' && wx.removeStorage) {
        wx.removeStorage({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('删除数据失败:', error);
    }
  },
  
  // 清空存储
  clearStorage: () => {
    try {
      if (typeof wx !== 'undefined' && wx.clearStorage) {
        wx.clearStorage();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  },
  
  // 分享功能
  showShareMenu: () => {
    if (typeof wx !== 'undefined' && wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },
  
  // Toast提示 - 优化版本
  showToast: (options) => {
    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: options.title || '操作成功',
        icon: options.icon || 'success',
        duration: options.duration || 2000,
        mask: options.mask || false
      });
    } else {
      // 浏览器环境使用alert或自定义toast
      if (options.title) {
        alert(options.title);
      }
    }
  },
  
  // 显示加载提示
  showLoading: (options = {}) => {
    if (typeof wx !== 'undefined' && wx.showLoading) {
      wx.showLoading({
        title: options.title || '加载中...',
        mask: options.mask || true
      });
    }
  },
  
  // 隐藏加载提示
  hideLoading: () => {
    if (typeof wx !== 'undefined' && wx.hideLoading) {
      wx.hideLoading();
    }
  },
  
  // 振动反馈
  vibrateShort: () => {
    if (typeof wx !== 'undefined' && wx.vibrateShort) {
      wx.vibrateShort();
    }
  },
  
  vibrateLong: () => {
    if (typeof wx !== 'undefined' && wx.vibrateLong) {
      wx.vibrateLong();
    }
  },
  
  // 获取系统信息
  getSystemInfo: () => {
    return new Promise((resolve) => {
      if (typeof wx !== 'undefined' && wx.getSystemInfo) {
        wx.getSystemInfo({
          success: resolve,
          fail: () => resolve({})
        });
      } else {
        resolve({
          platform: 'browser',
          system: navigator.platform,
          version: navigator.userAgent
        });
      }
    });
  },
  
  // 网络状态
  getNetworkType: () => {
    return new Promise((resolve) => {
      if (typeof wx !== 'undefined' && wx.getNetworkType) {
        wx.getNetworkType({
          success: resolve,
          fail: () => resolve({ networkType: 'unknown' })
        });
      } else {
        resolve({ networkType: navigator.onLine ? 'wifi' : 'none' });
      }
    });
  },
  
  // 剪贴板操作
  setClipboardData: (data) => {
    return new Promise((resolve, reject) => {
      if (typeof wx !== 'undefined' && wx.setClipboardData) {
        wx.setClipboardData({
          data,
          success: resolve,
          fail: reject
        });
      } else {
        navigator.clipboard.writeText(data).then(resolve).catch(reject);
      }
    });
  },
  
  // 图片保存到相册
  saveImageToPhotosAlbum: (filePath) => {
    return new Promise((resolve, reject) => {
      if (typeof wx !== 'undefined' && wx.saveImageToPhotosAlbum) {
        wx.saveImageToPhotosAlbum({
          filePath,
          success: resolve,
          fail: reject
        });
      } else {
        // 浏览器环境下载
        const link = document.createElement('a');
        link.download = `image_${Date.now()}.png`;
        link.href = filePath;
        link.click();
        resolve();
      }
    });
  }
};

// 导出常用工具函数
export const storage = {
  set: (key, data) => wxUtils.setStorage(key, data),
  get: (key) => wxUtils.getStorage(key),
  remove: (key) => wxUtils.removeStorage(key),
  clear: () => wxUtils.clearStorage()
};

export const toast = {
  success: (title) => wxUtils.showToast({ title, icon: 'success' }),
  error: (title) => wxUtils.showToast({ title, icon: 'error' }),
  loading: (title) => wxUtils.showLoading({ title }),
  hide: () => wxUtils.hideLoading()
};

export const feedback = {
  vibrate: () => wxUtils.vibrateShort(),
  vibrateLong: () => wxUtils.vibrateLong()
};

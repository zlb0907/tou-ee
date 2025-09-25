
// 微信小程序工具函数
export const wxUtils = {
  // 页面跳转
  navigateTo: (url) => {
    if (typeof wx !== 'undefined' && wx.navigateTo) {
      wx.navigateTo({ url });
    } else {
      window.location.href = url;
    }
  },
  
  redirectTo: (url) => {
    if (typeof wx !== 'undefined' && wx.redirectTo) {
      wx.redirectTo({ url });
    } else {
      window.location.replace(url);
    }
  },
  
  navigateBack: () => {
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack();
    } else {
      window.history.back();
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
          resolve({ tempFilePaths: files.map(file => URL.createObjectURL(file)) });
        };
        input.click();
      }
    });
  },
  
  // 数据存储
  setStorage: (key, data) => {
    if (typeof wx !== 'undefined' && wx.setStorage) {
      wx.setStorage({ key, data });
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },
  
  getStorage: (key) => {
    if (typeof wx !== 'undefined' && wx.getStorage) {
      return new Promise((resolve) => {
        wx.getStorage({
          key,
          success: (res) => resolve(res.data),
          fail: () => resolve(null)
        });
      });
    } else {
      return Promise.resolve(JSON.parse(localStorage.getItem(key)));
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
  
  // Toast提示
  showToast: (options) => {
    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast(options);
    } else {
      alert(options.title || '操作成功');
    }
  }
};

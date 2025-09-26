
// Taro工具函数 - 优化版本
import Taro from '@tarojs/taro';

export const taroUtils = {
  // 页面跳转
  navigateTo: (url) => {
    Taro.navigateTo({ url });
  },
  
  redirectTo: (url) => {
    Taro.redirectTo({ url });
  },
  
  navigateBack: () => {
    Taro.navigateBack();
  },
  
  // 文件操作
  chooseImage: (options = {}) => {
    return new Promise((resolve, reject) => {
      Taro.chooseImage({
        count: options.count || 1,
        sizeType: options.sizeType || ['original', 'compressed'],
        sourceType: options.sourceType || ['album', 'camera'],
        success: resolve,
        fail: reject
      });
    });
  },
  
  // 数据存储 - 优化版本
  setStorage: (key, data) => {
    try {
      Taro.setStorageSync(key, data);
    } catch (error) {
      console.error('存储数据失败:', error);
    }
  },
  
  getStorage: (key) => {
    try {
      return Taro.getStorageSync(key);
    } catch (error) {
      console.error('获取数据失败:', error);
      return null;
    }
  },
  
  // 删除存储
  removeStorage: (key) => {
    try {
      Taro.removeStorageSync(key);
    } catch (error) {
      console.error('删除数据失败:', error);
    }
  },
  
  // 清空存储
  clearStorage: () => {
    try {
      Taro.clearStorageSync();
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  },
  
  // 分享功能
  showShareMenu: () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  // Toast提示 - 优化版本
  showToast: (options) => {
    Taro.showToast({
      title: options.title || '操作成功',
      icon: options.icon || 'success',
      duration: options.duration || 2000,
      mask: options.mask || false
    });
  },
  
  // 显示加载提示
  showLoading: (options = {}) => {
    Taro.showLoading({
      title: options.title || '加载中...',
      mask: options.mask !== false
    });
  },
  
  // 隐藏加载提示
  hideLoading: () => {
    Taro.hideLoading();
  },
  
  // 振动反馈
  vibrateShort: () => {
    Taro.vibrateShort();
  },
  
  vibrateLong: () => {
    Taro.vibrateLong();
  },
  
  // 获取系统信息
  getSystemInfo: () => {
    return new Promise((resolve) => {
      Taro.getSystemInfo({
        success: resolve,
        fail: () => resolve({})
      });
    });
  },
  
  // 网络状态
  getNetworkType: () => {
    return new Promise((resolve) => {
      Taro.getNetworkType({
        success: resolve,
        fail: () => resolve({ networkType: 'unknown' })
      });
    });
  },
  
  // 剪贴板操作
  setClipboardData: (data) => {
    return new Promise((resolve, reject) => {
      Taro.setClipboardData({
        data,
        success: resolve,
        fail: reject
      });
    });
  },
  
  // 图片保存到相册
  saveImageToPhotosAlbum: (filePath) => {
    return new Promise((resolve, reject) => {
      Taro.saveImageToPhotosAlbum({
        filePath,
        success: resolve,
        fail: reject
      });
    });
  },

  // 获取路由参数
  getRouterParams: () => {
    const router = Taro.useRouter();
    return router.params || {};
  },

  // 显示模态框
  showModal: (options) => {
    return new Promise((resolve) => {
      Taro.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: resolve
      });
    });
  },

  // 显示操作菜单
  showActionSheet: (options) => {
    return new Promise((resolve) => {
      Taro.showActionSheet({
        itemList: options.itemList || [],
        success: resolve
      });
    });
  }
};

// 导出常用工具函数
export const storage = {
  set: (key, data) => taroUtils.setStorage(key, data),
  get: (key) => taroUtils.getStorage(key),
  remove: (key) => taroUtils.removeStorage(key),
  clear: () => taroUtils.clearStorage()
};

export const toast = {
  success: (title) => taroUtils.showToast({ title, icon: 'success' }),
  error: (title) => taroUtils.showToast({ title, icon: 'error' }),
  loading: (title) => taroUtils.showLoading({ title }),
  hide: () => taroUtils.hideLoading()
};

export const feedback = {
  vibrate: () => taroUtils.vibrateShort(),
  vibrateLong: () => taroUtils.vibrateLong()
};

export default taroUtils;

// pages/fishDetail/fishDetail.js
import { FishData } from '../../data/FishData2/FishDataAll';
import { getFishCollectionById } from '../../data/FishData2/FishCollection';

Page({
  data: {
    fishId: '',
    fishInfo: null,
    collectionInfo: null,
    fishImageUrl: '', // 鱼图片URL
    isUsingDefaultImage: false, // 是否使用默认图片
    rarityNames: {
      'COMMON': '普通',
      'UNCOMMON': '少见',
      'RARE': '稀有',
      'EPIC': '史诗',
      'MYTHIC': '传说',
      'BOSS': 'BOSS',
      'WASTE': '杂物'
    },
    touchStartX: 0, // 记录触摸开始的X坐标
    touchEndX: 0,    // 记录触摸结束的X坐标
    // 图片展示相关
    serverImages: [], // 服务器图片列表
    showImageModal: false, // 是否显示图片放大模态框
    currentImageUrl: '', // 当前放大显示的图片URL
    imageLoadError: false, // 图片加载错误状态
    showNoImagesText: true // 是否显示无图片文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    if (!id) {
      wx.showToast({
        title: '鱼类ID无效',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    this.setData({ fishId: id });
    this.loadFishDetail(id);
  },

  /**
   * 加载鱼类详细信息
   */
  loadFishDetail(fishId) {
    // 查找鱼类数据
    const fishInfo = FishData.find(fish => fish.id === fishId);
    if (!fishInfo) {
      wx.showToast({
        title: '未找到鱼类信息',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 获取收集信息
    const collectionInfo = getFishCollectionById(fishId);
    
    // 设置鱼图片URL，使用服务器图片
    const fishImageUrl = fishInfo.Image || fishInfo.defImage;
    
    this.setData({
      fishInfo,
      collectionInfo,
      fishImageUrl,
      isUsingDefaultImage: false
    });

    // 加载服务器图片
    this.loadServerImages(fishId);

    console.log('[鱼类详情] 加载鱼类信息', fishInfo.name);
  },

  /**
   * 处理图片加载错误
   */
  handleImageError() {
    // 如果已经在使用默认图片，不再处理
    if (this.data.isUsingDefaultImage) return;
    
    // 图片加载失败，使用本地默认图片
    const { fishInfo } = this.data;
    if (fishInfo && fishInfo.defImage) {
      console.log('[鱼类详情] 图片加载失败，使用默认图片');
      this.setData({
        fishImageUrl: fishInfo.defImage,
        isUsingDefaultImage: true
      });
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },
  
  /**
   * 触摸开始事件
   */
  touchStart(e) {
    this.setData({
      touchStartX: e.changedTouches[0].clientX
    });
  },
  
  /**
   * 触摸结束事件
   */
  touchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const moveDistance = touchEndX - this.data.touchStartX;
    
    // 如果向右滑动超过100px，则返回上一页
    if (moveDistance > 100) {
      this.goBack();
    }
    
    this.setData({
      touchEndX: touchEndX
    });
  },

  /**
   * 加载服务器图片
   */
  loadServerImages(fishId) {
    const baseUrl = 'https://anglertest.xyz/game/fish/fishpic/';
    const imageUrls = [];
    
    // 尝试加载多张图片（假设最多有5张图片，编号为1-5）
    for (let i = 1; i <= 5; i++) {
      const imageUrl = `${baseUrl}${fishId}/${i}.png`;
      imageUrls.push({
        url: imageUrl,
        index: i,
        loaded: false,
        error: false
      });
    }
    
    console.log('开始加载图片，fishId:', fishId);
    console.log('图片URLs:', imageUrls.map(item => item.url));
    
    this.setData({
      serverImages: imageUrls,
      showNoImagesText: true
    });
    
    // 预加载图片以检查是否存在
    this.preloadImages(imageUrls);
  },

  /**
   * 预加载图片检查是否存在
   */
  preloadImages(imageUrls) {
    console.log('开始预加载图片，总数:', imageUrls.length);
    imageUrls.forEach((imageItem, index) => {
      console.log(`正在检查图片 ${index + 1}:`, imageItem.url);
      wx.getImageInfo({
        src: imageItem.url,
        success: (res) => {
          console.log(`图片 ${index + 1} 加载成功:`, imageItem.url, res);
          const updatedImages = [...this.data.serverImages];
          updatedImages[index].loaded = true;
          this.setData({
            serverImages: updatedImages
          });
          this.updateNoImagesTextStatus();
        },
        fail: (err) => {
          console.log(`图片 ${index + 1} 加载失败:`, imageItem.url, err);
          const updatedImages = [...this.data.serverImages];
          updatedImages[index].error = true;
          this.setData({
            serverImages: updatedImages
          });
          this.updateNoImagesTextStatus();
        }
      });
    });
  },

  /**
   * 更新无图片文本显示状态
   */
  updateNoImagesTextStatus() {
    const { serverImages } = this.data;
    const hasValidImages = serverImages.some(item => item.loaded && !item.error);
    const loadedCount = serverImages.filter(item => item.loaded).length;
    const errorCount = serverImages.filter(item => item.error).length;
    
    console.log('更新图片显示状态:');
    console.log('- 总图片数:', serverImages.length);
    console.log('- 成功加载:', loadedCount);
    console.log('- 加载失败:', errorCount);
    console.log('- 有效图片:', hasValidImages);
    console.log('- 显示无图片文本:', !hasValidImages);
    
    this.setData({
      showNoImagesText: !hasValidImages
    });
  },

  /**
   * 点击图片放大显示
   */
  onImageTap(e) {
    const { url } = e.currentTarget.dataset;
    this.setData({
      showImageModal: true,
      currentImageUrl: url
    });
  },

  /**
   * 关闭图片模态框
   */
  closeImageModal() {
    this.setData({
      showImageModal: false,
      currentImageUrl: ''
    });
  },

  /**
   * 处理服务器图片加载错误
   */
  onServerImageError(e) {
    const { index } = e.currentTarget.dataset;
    const updatedImages = [...this.data.serverImages];
    updatedImages[index].error = true;
    this.setData({
      serverImages: updatedImages
    });
    this.updateNoImagesTextStatus();
  }
});
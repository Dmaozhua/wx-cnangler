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
    touchEndX: 0    // 记录触摸结束的X坐标
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
  }
});
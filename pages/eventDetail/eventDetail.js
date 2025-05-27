// pages/eventDetail/eventDetail.js
const FishEvents = require('../../data/FishData2/FishEvents.js');
const { getEventCollectionById } = require('../../data/FishData2/EventCollection.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    eventId: null,
    eventInfo: null,
    collectionInfo: null,
    eventImageUrl: '',
    isUsingDefaultImage: false,
    // 触摸相关
    touchStartX: 0,
    touchEndX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      wx.showToast({
        title: '事件ID无效',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    this.setData({
      eventId: options.id
    });

    this.loadEventDetail();
  },

  /**
   * 加载事件详情
   */
  loadEventDetail: function () {
    // 从FishEvents中获取事件信息
    const eventInfo = FishEvents.FishEvents.find(event => event.id === this.data.eventId);
    
    if (!eventInfo) {
      wx.showToast({
        title: '未找到事件信息',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 获取事件收集信息
    const collectionInfo = getEventCollectionById(this.data.eventId) || { count: 0 };

    // 设置事件图片URL
    const eventImageUrl = '../../images/fishicons/fishon.webp';

    this.setData({
      eventInfo,
      collectionInfo,
      eventImageUrl
    });
  },

  /**
   * 处理图片加载错误
   */
  handleImageError: function () {
    // 如果已经在使用默认图片，则不再处理
    if (this.data.isUsingDefaultImage) return;

    // 切换到默认图片
    this.setData({
      eventImageUrl: '../../images/fishicons/fish.png',
      isUsingDefaultImage: true
    });
  },

  /**
   * 返回上一页
   */
  goBack: function () {
    wx.navigateBack();
  },

  /**
   * 触摸开始事件
   */
  touchStart: function (e) {
    this.setData({
      touchStartX: e.changedTouches[0].clientX
    });
  },

  /**
   * 触摸结束事件
   */
  touchEnd: function (e) {
    this.setData({
      touchEndX: e.changedTouches[0].clientX
    });

    // 计算滑动距离
    const moveDistance = this.data.touchEndX - this.data.touchStartX;

    // 如果向右滑动超过50，则返回上一页
    if (moveDistance > 50) {
      this.goBack();
    }
  }
});
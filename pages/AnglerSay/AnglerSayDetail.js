// pages/AnglerSay/AnglerSayDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productDetail: {
      id: 1,
      name: 'DAIWA 达瓦 STEEZ A TW 2023款',
      price: 3699,
      images: [
        'https://img.alicdn.com/imgextra/i1/2200724907121/O1CN01LLkEDC22GdmFRLDOA_!!2200724907121.jpg',
        'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01qON5Uf22GdmEZZnpP_!!2200724907121.jpg',
        'https://img.alicdn.com/imgextra/i3/2200724907121/O1CN01Tz9Ywb22GdmFRLrLO_!!2200724907121.jpg'
      ],
      userAvatar: 'https://img.alicdn.com/imgextra/i4/O1CN01Tz9Ywb22GdmFRLrLO_!!2200724907121.jpg',
      userName: '钓鱼达人小王',
      userTag: 'LV.6 资深钓鱼玩家',
      usageYears: 1.5,
      castingRating: 9.2,
      brakingRating: 8.8,
      durabilityRating: 9.0,
      valueRating: 7.5,
      experience: '使用了一年多，整体表现非常出色。抛投性能优秀，制动系统精准，手感舒适。特别适合长时间使用，手腕不会有太大负担。唯一的缺点可能是价格偏高，但考虑到其性能和耐用性，还是值得投资的。',
      recommendations: [
        '抛投性能非常出色，即使初学者也能快速上手',
        '制动系统精准可靠，应对各种鱼种都游刃有余',
        '手感舒适，长时间使用不会有明显疲劳感',
        '做工精细，各部件衔接紧密，使用寿命长'
      ],
      usageScenes: [
        'https://img.alicdn.com/imgextra/i3/2200724907121/O1CN01Tz9Ywb22GdmFRLrLO_!!2200724907121.jpg',
        'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01qON5Uf22GdmEZZnpP_!!2200724907121.jpg'
      ],
      usageSceneDescription: '实际使用中，无论是在淡水湖泊还是近海区域都表现出了卓越的性能。尤其是在应对大型鱼类时，制动系统的精准度和可靠性给我留下了深刻印象。',
      likes: 128,
      commentCount: 18,
      comments: [
        {
          avatar: 'https://img.alicdn.com/imgextra/i1/2200724907121/O1CN01LLkEDC22GdmFRLDOA_!!2200724907121.jpg',
          userName: '渔夫老张',
          content: '确实非常好用，我也买了一个，用了7个月了，手感依旧很好！',
          time: '2小时前'
        },
        {
          avatar: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01qON5Uf22GdmEZZnpP_!!2200724907121.jpg',
          userName: '路亚专家',
          content: '价格确实有点贵，但是用过之后觉得物有所值，推荐入手！',
          time: '3小时前'
        }
      ]
    },
    isLiked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从列表页获取产品ID，然后加载详情
    if (options.id) {
      this.loadProductDetail(options.id);
    }
  },

  /**
   * 加载产品详情
   */
  loadProductDetail: function (id) {
    // 实际应用中，这里应该是从服务器获取数据
    // 这里使用假数据，实际开发时应替换为API调用
    console.log('加载产品ID:', id);
    // 假设已经在data中设置了默认数据
  },

  /**
   * 返回上一页
   */
  goBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 点赞操作
   */
  toggleLike: function () {
    const isLiked = !this.data.isLiked;
    let productDetail = this.data.productDetail;
    
    if (isLiked) {
      productDetail.likes += 1;
    } else {
      productDetail.likes -= 1;
    }

    this.setData({
      isLiked: isLiked,
      productDetail: productDetail
    });
  },

  /**
   * 分享操作
   */
  onShareAppMessage: function () {
    const productDetail = this.data.productDetail;
    return {
      title: productDetail.name,
      path: '/pages/AnglerSay/AnglerSayDetail?id=' + productDetail.id,
      imageUrl: productDetail.images[0]
    };
  },

  /**
   * 关注用户
   */
  followUser: function () {
    wx.showToast({
      title: '关注成功',
      icon: 'success',
      duration: 2000
    });
  },

  /**
   * 添加评论
   */
  addComment: function () {
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
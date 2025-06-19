// pages/donghuatest/donghuatest.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: '',
        progressValue: 0,
        showLoading1: false,
        showLoading2: false,
        cardData: [
            {
                title: '卡片1',
                content: '这是第一张发光卡片的内容描述',
                buttonText: '查看详情'
            },
            {
                title: '卡片2', 
                content: '这是第二张发光卡片的内容描述',
                buttonText: '了解更多'
            },
            {
                title: '卡片3',
                content: '这是第三张发光卡片的内容描述', 
                buttonText: '立即体验'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    // 按钮点击事件
    onButtonTap: function(e) {
        const { text } = e.detail;
        wx.showToast({
            title: `点击了: ${text}`,
            icon: 'none',
            duration: 2000
        });
    },

    // 卡片点击事件
    onCardTap: function(e) {
        const { title, content } = e.detail;
        wx.showModal({
            title: title,
            content: content,
            showCancel: false
        });
    },

    // 输入框变化事件
    onInputChange: function(e) {
        const { value } = e.detail;
        console.log('输入框值变化:', value);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log('donghuatest页面已准备就绪');
    },

    // 进度条控制函数
    setProgress25: function() {
        this.setData({ progressValue: 25 });
    },

    setProgress50: function() {
        this.setData({ progressValue: 50 });
    },

    setProgress75: function() {
        this.setData({ progressValue: 75 });
    },

    setProgress100: function() {
        this.setData({ progressValue: 100 });
    },

    // Loading 控制函数
    showLoading1: function() {
        this.setData({ showLoading1: true });
        // 3秒后自动隐藏
        setTimeout(() => {
            this.setData({ showLoading1: false });
        }, 3000);
    },

    showLoading2: function() {
        this.setData({ showLoading2: true });
        // 3秒后自动隐藏
        setTimeout(() => {
            this.setData({ showLoading2: false });
        }, 3000);
    },

    hideAllLoading: function() {
        this.setData({ 
            showLoading1: false,
            showLoading2: false 
        });
    },

    // Glow Cards 事件处理
  onGlowCardTap: function(e) {
    const card = e.detail.card;
    if (card) {
      wx.showToast({
        title: `点击了${card.title}`,
        icon: 'none'
      });
    }
  },

  onGlowButtonTap: function(e) {
    const card = e.detail.card;
    if (card) {
      wx.showModal({
        title: card.title,
        content: card.content,
        showCancel: false
      });
    }
  },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
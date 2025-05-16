// pages/result/result.js
const app = getApp();
Page({
  data: {
    fishCaught: 0,
    fishEscaped: 0,
    totalTime: 0,
    successRate: 0,
    weather: {},
    water: {}
  },
  onLoad() {
    // 获取全局数据中的钓鱼结果
    const fishCaught = app.globalData.fishCaught || 0;
    const fishEscaped = app.globalData.fishEscaped || 0;
    const totalFish = fishCaught + fishEscaped;
    const successRate = totalFish > 0 ? Math.round((fishCaught / totalFish) * 100) : 0;
    
    this.setData({
      fishCaught: fishCaught,
      fishEscaped: fishEscaped,
      totalTime: app.globalData.fishingTime || 0,
      successRate: successRate,
      weather: app.globalData.weather || {},
      water: app.globalData.water || {}
    });
    
    console.log('[钓鱼结果] 页面加载:', {
      fishCaught: this.data.fishCaught,
      fishEscaped: this.data.fishEscaped,
      successRate: this.data.successRate,
      weather: this.data.weather.name,
      water: this.data.water.name
    });
  },
  
  // 重新开始钓鱼
  restart() {
    console.log('[钓鱼结果] 用户点击重新开始');
    
    // 跳转到钓鱼准备页面
    wx.redirectTo({
      url: '../preparation/preparation'
    });
  }
});

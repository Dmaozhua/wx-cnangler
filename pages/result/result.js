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
    // 重新开始游戏
    restart() {
        // 重置全局数据
        app.globalData.fishCaught = 0;
        app.globalData.fishEscaped = 0;
        app.globalData.fishingTime = 0;
        app.globalData.nextFishRarity = null;
        app.globalData.triggeredEvents = [];
        app.globalData.eventModifiers = {};
        app.globalData.castCount = 0;
        
        console.log('[钓鱼模拟器] 重置游戏数据，准备开始新游戏');
        
        // 跳转到准备界面
        wx.navigateTo({
          url: '/pages/preparation/preparation',
          success: () => {
            console.log('[钓鱼模拟器] 跳转到准备界面成功');
          },
          fail: (err) => {
            console.error('[钓鱼模拟器] 跳转到准备界面失败:', err);
          }
        });
    },
    
    // 返回主页
    goBack() {
        wx.switchTab({
          url: '/pages/home/home',
          success: () => {
            console.log('[钓鱼模拟器] 返回Home页成功');
          },
          fail: (err) => {
            console.error('[钓鱼模拟器] 返回Home页失败:', err);
          }
        });
      }
});

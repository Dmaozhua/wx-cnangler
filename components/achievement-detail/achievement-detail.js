// components/achievement-detail/achievement-detail.js
Component({
  properties: {


    visible: {
      type: Boolean,
      value: false  // 默认值为 false，显示时应设置为 true
    },
    achievement: {
      type: Object,
      value: {

      }
    }
  },
  data: {
    animationData: {},
    formattedTime: ''
  },

  observers: {
    'achievement': function(achievement) {
      if (achievement && achievement.unlockTime) {
        this.formatUnlockTime(achievement.unlockTime);
      } else if (achievement) {
        // 如果没有解锁时间，显示为未解锁
        this.setData({ formattedTime: '未解锁' });
      }
    }
  },

lifetimes: {
  attached() {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    
    // 初始状态：隐藏
    this.animation.opacity(0).scale(0.8).step();
    this.setData({ animationData: this.animation.export() });
    
    // 立即触发显示动画（无需等待渲染）
    this.showAnimation();
  }
},
  
  // 监听页面生命周期
  pageLifetimes: {
    hide() {
      // 页面隐藏时关闭弹窗
      if (this.properties.visible) {
        this.triggerEvent('close');
      }
    }
  },

  methods: {
    // 阻止触摸事件穿透
    preventTouchMove() {
      return false;
    },
    
// 格式化解锁时间为易读格式
formatUnlockTime(isoTimeString) {
  if (!isoTimeString) {
    this.setData({ formattedTime: '未解锁' });
    return;
  }
  
  try {
    // 检查是否为有效的日期字符串
    const timestamp = Date.parse(isoTimeString);
    if (isNaN(timestamp)) {
      console.error('无效的时间格式:', isoTimeString);
      this.setData({ formattedTime: '未解锁' });
      return;
    }
    
    // 创建日期对象，注意app.js中已经加了8小时，这里不需要再加时区偏移
    const date = new Date(new Date(isoTimeString).getTime() - 8 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.setData({ formattedTime });
  } catch (error) {
    console.error('格式化时间失败:', error);
    this.setData({ formattedTime: '未知时间' });
  }
},

    showAnimation() {
      console.log('执行显示动画'); // 确认动画触发
      // 添加安全检查，确保animation对象存在
      if (!this.animation) {
        this.animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
      }
      this.animation.opacity(1).scale(1).step();
      this.setData({
        animationData: this.animation.export()
      });
    },

    hideAnimation() {
      // 添加安全检查，确保animation对象存在
      if (!this.animation) {
        this.animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
        // 初始状态设置为隐藏
        this.animation.opacity(0).scale(0.8).step();
      } else {
        this.animation.opacity(0).scale(0.8).step();
      }
      this.setData({
        animationData: this.animation.export()
      });
    },

    onClose() {
      this.triggerEvent('close');
    }
  }
});
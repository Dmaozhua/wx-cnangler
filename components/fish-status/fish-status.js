// components/fish-status/fish-status.js
Component({
  properties: {
    // 当前鱼的信息
    currentFish: {
      type: Object,
      value: null
    },
    // 钓线状态（玩家血量）
    playerHP: {
      type: Number,
      value: 100
    },
    // 组件显示状态
    visible: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        // 当visible变为true时，触发滑入动画
        if (newVal) {
          this.slideIn();
        } else {
          this.slideOut();
        }
      }
    },
    // 动画速度（毫秒）
    animationDuration: {
      type: Number,
      value: 600
    },
    // QTE状态
    qteState: {
      type: String,
      value: ''
    }
  },

  data: {
    animationData: {},
    isAnimating: false,
    isVisible: false,
    isLocked: false // 添加锁定状态，防止动画过程中的点击操作
  },

  lifetimes: {
    attached: function() {
      this.animation = wx.createAnimation({
        duration: this.properties.animationDuration,
        timingFunction: 'ease',
        delay: 0
      });
      
      // 初始化时设置组件位置在屏幕外
      this.animation.translateX('-100%').translateY('-50%').step();
      this.setData({
        animationData: this.animation.export()
      });
    }
  },

  methods: {
    // 滑入动画
    slideIn: function() {
      if (this.data.isAnimating) return;
      
      // 设置锁定状态，防止动画过程中的点击操作
      this.setData({
        isAnimating: true,
        isVisible: true,
        isLocked: true
      });
      
      // 触发锁定事件，通知父组件屏蔽点击
      this.triggerEvent('lockInteraction', { locked: true });
  
      // 从-100%位置滑入到0位置
      this.animation.translateX('0').translateY('-50%').step();
      
      this.setData({
        animationData: this.animation.export()
      });

      setTimeout(() => {
        this.setData({
          isAnimating: false,
          isLocked: false
        });
        // 解除锁定，通知父组件可以接受点击
        this.triggerEvent('lockInteraction', { locked: false });
      }, this.properties.animationDuration);
    },

    // 滑出动画
    slideOut: function() {
      if (this.data.isAnimating) return;
      
      // 设置锁定状态，防止动画过程中的点击操作
      this.setData({
        isAnimating: true,
        isLocked: true
      });
      
      // 触发锁定事件，通知父组件屏蔽点击
      this.triggerEvent('lockInteraction', { locked: true });

      // 确保从当前位置滑出到-100%位置
      this.animation.translateX('-100%').translateY('-50%').step();
      
      this.setData({
        animationData: this.animation.export()
      });

      setTimeout(() => {
        this.setData({
          isAnimating: false,
          isVisible: false,
          isLocked: false
        });
        // 通知父组件动画已完成并解除锁定
        this.triggerEvent('animationEnd');
        this.triggerEvent('lockInteraction', { locked: false });
      }, this.properties.animationDuration);
    },

    // 更新QTE结果
    updateQteResult: function(result) {
      // 可以在这里添加QTE结果的动画或显示效果
      console.log('QTE结果:', result);
    }
  }
})
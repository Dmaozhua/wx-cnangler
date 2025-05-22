// components/fish-status/fish-status.js
import { Equipment } from '../../data/FishData2/Equipment';
Component({
  properties: {
    // 当前鱼的信息
    currentFish: {
      type: Object,
      value: null,
      observer: function(newVal) {
        if (newVal) {
          // 根据鱼的稀有度设置样式类
          this.setRarityClass(newVal.rarity || 1);
        }
      }
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
    isLocked: false, // 添加锁定状态，防止动画过程中的点击操作
    rarityClass: 'rarity-1', // 默认稀有度样式类
    rarityBgClass: 'rarity-bg-1', // 默认背景样式类
    rarityBorderClass: 'rarity-border-1' // 默认边框样式类
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
    // 设置稀有度样式类
    setRarityClass: function(rarity) {
      // 将字符串常量稀有度映射到数字
      let rarityNum = 1; // 默认为1
      
      // 根据稀有度常量设置对应的数字
      if (rarity === 'COMMON') rarityNum = 1;
      else if (rarity === 'UNCOMMON') rarityNum = 2;
      else if (rarity === 'RARE') rarityNum = 3;
      else if (rarity === 'EPIC') rarityNum = 4;
      else if (rarity === 'MYTHIC') rarityNum = 5;
      else if (rarity === 'BOSS') rarityNum = 5; // BOSS鱼使用最高稀有度样式
      else if (rarity === 'WASTE') rarityNum = 1; // 杂物使用最低稀有度样式
      else if (typeof rarity === 'number') rarityNum = Math.max(1, Math.min(5, rarity)); // 兼容旧版数字稀有度
      
      this.setData({
        rarityClass: `rarity-${rarityNum}`,
        rarityBgClass: `rarity-bg-${rarityNum}`,
        rarityBorderClass: `rarity-border-${rarityNum}`
      });
    
    },
    
// 滑入动画
// 修改后的 slideIn 方法
slideIn: function() {
    if (this.data.isAnimating) return;
  
    // 先确保组件可见
    this.setData({
      isVisible: true,
      isLocked: true
    }, () => {
      // 在回调中执行动画，确保渲染完成
      this.animation = wx.createAnimation({
        duration: this.properties.animationDuration,
        timingFunction: 'ease'
      });
  
      // 重置动画参数
      this.animation
        .translateX('0')
        .translateY('-50%')
        .opacity(1)
        .step();
  
      this.setData({
        animationData: this.animation.export(),
        isAnimating: true
      });
  
      // 动画结束后解除锁定
      setTimeout(() => {
        this.setData({ 
          isAnimating: false, 
          isLocked: false 
        });
        this.triggerEvent('lockInteraction', { locked: false });
      }, this.properties.animationDuration);
    });
  
    // 立即触发锁定
    this.triggerEvent('lockInteraction', { locked: true });
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
      // 添加缩放和透明度变化
      this.animation.scale(1.1).opacity(0).step({ duration: this.properties.animationDuration });
      
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
      // 添加QTE状态变化动画
      const qteAnimation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });
      
      qteAnimation.scale(1.2).opacity(0).step();
      qteAnimation.scale(1).opacity(1).step();
      
      this.setData({
        qteState: result,
        qteAnimationData: qteAnimation.export()
      });
    }
  }
})
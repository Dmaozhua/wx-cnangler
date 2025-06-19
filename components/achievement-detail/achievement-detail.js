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
    formattedTime: '',
    showFullscreenIcon: false,
    currentAnimation: 'pulse',
    pulsatingCircles: [],
    rotatingOrbits: [],
    sequentialRings: [],
    concentricRings: []
  },

  observers: {
    'achievement': function(achievement) {
      console.log('achievement数据变化:', achievement);
      if (achievement && achievement.unlockTime) {
        this.formatUnlockTime(achievement.unlockTime);
      } else if (achievement) {
        // 如果没有解锁时间，显示为未解锁
        this.setData({ formattedTime: '未解锁' });
      }
    },
    'visible': function(visible) {
      console.log('visible状态变化:', visible);
      if (visible) {
        // 每次打开时随机选择一个动画效果
        this.selectRandomAnimation();
      }
    }
  },

lifetimes: {
  attached() {
    console.log('=== achievement-detail组件attached ===');
    console.log('初始properties:', this.properties);
    console.log('初始data:', this.data);
    
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    
    // 初始状态：隐藏
    this.animation.opacity(0).scale(0.8).step();
    this.setData({ animationData: this.animation.export() });
    
    // 立即触发显示动画（无需等待渲染）
    this.showAnimation();
    
    console.log('=== 组件初始化完成 ===');
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

    // 随机选择动画效果
    selectRandomAnimation() {
      const animations = ['pulse', 'orbit', 'ring', 'concentric'];
      const randomIndex = Math.floor(Math.random() * animations.length);
      const selectedAnimation = animations[randomIndex];
      
      console.log('选择的动画效果:', selectedAnimation);
      this.setData({ currentAnimation: selectedAnimation });
      
      // 根据选择的动画生成对应的数据
      switch (selectedAnimation) {
        case 'pulse':
          this.generatePulsatingCircles();
          break;
        case 'orbit':
          this.generateRotatingOrbits();
          break;
        case 'ring':
          this.generateSequentialRings();
          break;
        case 'concentric':
          this.generateConcentricRings();
          break;
      }
    },

    // 生成脉冲圆圈数据
    generatePulsatingCircles() {
      const circles = [];
      let id = 0;
      
      for (let r = 0; r < 6; r++) {
        const radius = 20 + r * 25;
        const count = 8 + r * 4;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sz = 4 + r * 0.5;
          
          circles.push({
            id: id++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); animation-delay: ${r * 0.2 + i * 0.1}s; background: rgba(255,215,0,${(90 - r * 8) / 100});`
          });
        }
      }
      
      this.setData({ pulsatingCircles: circles });
    },

    // 生成旋转轨道数据
    generateRotatingOrbits() {
      const orbits = [];
      let orbitId = 0;
      
      for (let r = 0; r < 5; r++) {
        const radius = 25 + r * 30;
        const count = 8 + r * 4;
        const dots = [];
        let dotId = 0;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sz = 5 - r * 0.3;
          
          dots.push({
            id: dotId++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); background: rgba(255,215,0,${(90 - r * 12) / 100});`
          });
        }
        
        orbits.push({
          id: orbitId++,
          containerStyle: `animation-duration: ${8 + r * 3}s; animation-direction: ${r % 2 ? 'reverse' : 'normal'};`,
          dots: dots
        });
      }
      
      this.setData({ rotatingOrbits: orbits });
    },

    // 生成序列环数据
    generateSequentialRings() {
      const rings = [];
      let id = 0;
      
      for (let i = 0; i < 7; i++) {
        const rad = 20 + i * 20;
        const count = 10 + i * 4;
        
        for (let j = 0; j < count; j++) {
          const angle = (j / count) * 2 * Math.PI;
          const x = Math.cos(angle) * rad;
          const y = Math.sin(angle) * rad;
          const sz = 4 + i * 0.3;
          
          rings.push({
            id: id++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); animation-delay: ${i * 0.3 + (j / count) * 0.1}s; background: rgba(255,215,0,${(90 - i * 10) / 100});`
          });
        }
      }
      
      this.setData({ sequentialRings: rings });
    },

    // 生成同心旋转数据
    generateConcentricRings() {
      const rings = [];
      let ringId = 0;
      
      for (let r = 0; r < 6; r++) {
        const radius = 25 + r * 25;
        const count = 8 + r * 3;
        const dots = [];
        let dotId = 0;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sz = 5 - r * 0.2;
          
          dots.push({
            id: dotId++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); background: rgba(255,215,0,${(90 - r * 10) / 100});`
          });
        }
        
        rings.push({
          id: ringId++,
          containerStyle: `animation-duration: ${6 + r * 2}s; animation-direction: ${r % 2 ? 'reverse' : 'normal'};`,
          dots: dots
        });
      }
      
      this.setData({ concentricRings: rings });
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
    },

    // 防止事件冒泡
    preventBubble(e) {
        console.log('preventBubble 被调用，事件类型:', e.type, '目标元素:', e.target);
        // 在微信小程序中，使用 catchtap 已经阻止了事件冒泡，不需要调用 stopPropagation
        return false;
    },

    // 点击遮罩关闭
    onMaskTap() {
      console.log('遮罩被点击，准备关闭');
      this.triggerEvent('close');
    },

    // 点击图标全屏显示
    onIconTap(e) {
        console.log('[DEBUG] 图标点击事件触发', e);
        
        this.setData({ showFullscreenIcon: true }, () => {
          console.log('[DEBUG] 全屏状态已更新:', this.data.showFullscreenIcon);
        });
        
        // 添加震动反馈
        wx.vibrateShort({ type: 'light' });
    },
    // 优化：关闭全屏方法
    onFullscreenClose() {
        this.setData({ showFullscreenIcon: false }, () => {
          console.log('[DEBUG] 全屏已关闭');
        });
    }
  }
});
// pages/achievement/achievement.js
const app = getApp()
const fs = wx.getFileSystemManager()
import lottie from 'lottie-miniprogram';
Page({
    onReady() {
        // 添加延迟确保canvas已完全渲染
        setTimeout(() => {
            wx.createSelectorQuery().select('#lottie-canvas').node(res => {
              if (!res || !res.node) {
                console.error('获取canvas节点失败，节点可能未渲染完成');
                return;
              }
              
              const canvas = res.node;
              const context = canvas.getContext('2d');
              const dpr = wx.getSystemInfoSync().pixelRatio;
        
              // 设置 Canvas 尺寸
              canvas.width = 300 * dpr;
              canvas.height = 300 * dpr;
              context.scale(dpr, dpr);
        
              // 初始化 Lottie
              try {
                lottie.setup(canvas);
                
                // 加载动画数据
                this.animation = lottie.loadAnimation({
                  loop: true,
                  autoplay: true,
                  animationData: require('../../Lottie/Animation.js'),
                  rendererSettings: { context }
                });
              } catch (error) {
                console.error('Lottie初始化失败:', error);
              }
            }).exec();
        }, 300); // 延迟300ms确保canvas已渲染
    },
    onUnload() {
        if (this.animation) this.animation.destroy();
      },
      
      // 每次显示页面时刷新成就数据
      onShow() {
    // 重新从全局数据获取最新的成就数据
    const userData = app.globalData.userAchievements
    const achievementScore = app.globalData.achievementScore || 0
    
    console.log('成就页面显示，重新加载最新数据')
    console.log('当前成就分数:', achievementScore)
    console.log('成就进度:', JSON.stringify(userData))
    
    // 确保每次进入都显示'all'分类
    this.setData({ activeCategory: 'all' })
    
    // 强制重新加载最新的成就数据
    this.loadAchievements()
    // 检查是否有新解锁的成就
    this.checkNewAchievements()
    
    // 更新过滤后的成就列表
    this.updateFilteredAchievements()
    
    // 检查是否有刚完成的成就需要展示
    this.checkAndShowCompletedAchievements()
  },
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'testman', name: '测试达人' },
      { id: 'persion', name: '个人成就' },
      { id: 'fishing', name: '作钓大师' }
    ],
    activeCategory: 'all',
    achievements: [],
    filteredAchievements: [],
    unlockedCount: 0,
    totalCount: 0,
    newAchievement: null,
    showAnimation: false,
    showPopup: false,
    showDetailPopup: false,
    selectedAchievement: null,
    animationData: null,
    achievementScore: 0,
    scrollIntoViewId: '',
    animatingAchievement: '', // 当前正在播放动画的成就ID
    pageStyle: "overflow: visible", // 允许页面滚动
    progressAnimating: {},
    sweepAnimating: {}
  },

  onLoad(options) {
    this.loadAchievements()
    this.checkNewAchievements()
    this.loadAnimationData()
    
    // 处理从其他页面传递过来的成就ID参数
    if (options && options.achievementId) {
      const achievementId = options.achievementId
      
      // 延迟执行，确保成就数据已加载完成
      setTimeout(() => {
        // 找到对应成就的索引
        const achievement = this.data.achievements.find(a => a.id === achievementId)
        
        if (achievement) {
          // 切换到对应成就的分类
          const category = achievement.category
          
          this.setData({ 
            activeCategory: category,
            scrollIntoViewId: `achievement-${achievementId}`
          })
          
          // 更新过滤后的成就列表
          this.updateFilteredAchievements()
        }
      }, 500)
    }
  },

  // 加载成就数据
  loadAchievements() {
    const { achievements: allAchievements } = require('../../data/achievements.js')
    const userData = app.globalData.userAchievements
    const achievementScore = app.globalData.achievementScore || 0
    
    const processed = allAchievements.map(a => {
      // 获取成就数据，适配新旧格式
      const achievementData = userData[a.id] || { progress: 0, unlockTime: null }
      
      // 获取当前进度，确保是数字类型
      let currentProgress;
      if (a.type === 2) {
        // type:2 - 成就分数统计，使用全局成就分数
        currentProgress = parseInt(achievementScore, 10) || 0;
      } else {
        // 其他类型使用存储的进度
        currentProgress = typeof achievementData === 'object' 
          ? parseInt(achievementData.progress || 0, 10)
          : parseInt(achievementData || 0, 10);
      }
      
      // 根据成就类型处理不同的解锁条件
      let isUnlocked = false
      
      // 定义目标值变量
      let targetValue = 0;
      
      // 根据成就类型处理不同的解锁条件
      if (a.type === 3) {
        // type:3 - 首次使用特定功能后解锁成就
        targetValue = 1; // 首次使用类型的目标值固定为1
        isUnlocked = currentProgress >= 1;
      } else if (a.type === 4) {
        // type:4 - 在特定时间段内完成测试解锁成就
        targetValue = 1; // 时间段类型的目标值固定为1
        isUnlocked = currentProgress >= 1;
      } else if (a.type === 8) {
        // type:8 - 累计钓到某一种鱼多少次
        if (Array.isArray(a.value) && a.value.length >= 2) {
          targetValue = parseInt(a.value[1], 10); // 目标次数
          isUnlocked = currentProgress >= targetValue;
        } else {
          targetValue = 1;
          isUnlocked = false;
        }
      } else if (a.type === 9) {
        // type:9 - 累计遇到某一种事件多少次
        if (Array.isArray(a.value) && a.value.length >= 2) {
          targetValue = parseInt(a.value[1], 10); // 目标次数
          isUnlocked = currentProgress >= targetValue;
        } else {
          targetValue = 1;
          isUnlocked = false;
        }
      } else if (a.type === 10) {
        // type:10 - 钓到strength强度比100%的任意一条鱼
        targetValue = parseInt(a.value, 10) || 1;
        isUnlocked = currentProgress >= targetValue;
      } else if (a.type === 11) {
        // type:11 - 听一首路亚歌曲
        targetValue = parseInt(a.value, 10) || 1;
        isUnlocked = currentProgress >= targetValue;
      } else {
        // 其他类型成就，获取目标值，确保是数字类型
        targetValue = parseInt(a.value, 10);
        // 确保targetValue是有效数字
        if (isNaN(targetValue)) targetValue = 1;
        // 判断是否解锁，确保数值比较正确
        isUnlocked = currentProgress >= targetValue;
      }
      
      // 获取解锁时间
      const unlockTime = typeof achievementData === 'object' ? achievementData.unlockTime : null;
      
      // 根据成就类型显示不同的目标值
      let targetDisplay = targetValue;
      console.log(`成就[${a.id}] ${a.title}: 进度 ${currentProgress}/${targetDisplay} ${isUnlocked ? '已解锁' : '未解锁'} 解锁时间: ${unlockTime || '未解锁'}`);

      
      return {
        ...a,
        currentProgress: currentProgress,
        targetProgress: targetValue,
        unlocked: isUnlocked,
        unlockTime: unlockTime,
        scrollId: `achievement-${a.id}`
      }
    })

    this.setData({
      achievements: processed,
      totalCount: allAchievements.length,
      unlockedCount: processed.filter(a => a.unlocked).length,
      achievementScore: achievementScore
    })
    
    // 更新过滤后的成就列表
    this.updateFilteredAchievements()
  },

  // 分类过滤
  switchCategory(e) {
    const category = e.currentTarget.dataset.id
    this.setData({ activeCategory: category })
    
    // 更新过滤后的成就列表
    this.updateFilteredAchievements()
  },
  
  // 获取过滤后的成就列表
  get filteredAchievements() {
    if (this.data.activeCategory === 'all') {
      return this.data.achievements
    } else {
      return this.data.achievements.filter(a => a.category === this.data.activeCategory)
    }
  },
  
  // 计算并更新过滤后的成就列表
  updateFilteredAchievements() {
    let filtered;
    if (this.data.activeCategory === 'all') {
      filtered = this.data.achievements;
    } else {
      filtered = this.data.achievements.filter(a => a.category === this.data.activeCategory);
    }
    
    // 1级排序：已解锁成就优先显示，2级排序：按照num升序排列
    filtered.sort((a, b) => {
      // 1级排序：已解锁成就优先显示
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      // 2级排序：按照num升序排列
      return a.num - b.num;
    });
    
    this.setData({
      filteredAchievements: filtered
    });
  },

  // 检查新成就
  checkNewAchievements() {
    const newAchieves = this.data.achievements
      .filter(a => a.unlocked && !a.viewed)
      .sort((a,b) => b.weight - a.weight)
    
    if (newAchieves.length > 0) {
      this.setData({ newAchievement: newAchieves[0] })
      // 标记为已查看
      app.markAchievementViewed(newAchieves[0].id)
    }
  },

  // 检查并展示刚完成的成就
  checkAndShowCompletedAchievements() {
    // 检查是否有刚完成的成就（从其他页面跳转过来时）
    const recentlyCompleted = this.getRecentlyCompletedAchievements()
    
    if (recentlyCompleted.length > 0) {
      console.log('发现刚完成的成就:', recentlyCompleted)
      
      // 如果有多个成就，定位到最后一个完成的成就
      const latestAchievement = recentlyCompleted[recentlyCompleted.length - 1]
      
      console.log(`在'all'分类下定位到成就: ${latestAchievement.id}`)
      
      // 保持在'all'分类，直接定位到成就
      // 延迟执行定位和动画，确保DOM已更新
      setTimeout(() => {
        console.log(`开始滚动到成就: ${latestAchievement.id}`)
        this.scrollToAchievementAndAnimate(latestAchievement.id)
      }, 500)
      
      // 标记这些成就为已展示，避免重复展示
      this.markAchievementsAsShown(recentlyCompleted)
    }
  },

  // 获取最近完成的成就
  getRecentlyCompletedAchievements() {
    const userData = app.globalData.userAchievements
    const now = Date.now()
    const recentTimeThreshold = 10 * 60 * 1000 // 10分钟内完成的成就
    
    return this.data.achievements.filter(achievement => {
      const achievementData = userData[achievement.id]
      
      if (!achievementData || !achievement.unlocked) {
        return false
      }
      
      // 检查是否有解锁时间且在最近时间内
      const unlockTime = typeof achievementData === 'object' ? achievementData.unlockTime : null
      
      if (unlockTime) {
        // 处理时间格式：如果是字符串（ISO格式），转换为时间戳
        const unlockTimestamp = typeof unlockTime === 'string' ? new Date(unlockTime).getTime() : unlockTime
        const timeDiff = now - unlockTimestamp
        console.log(`成就[${achievement.id}] 解锁时间: ${unlockTime}, 时间差: ${timeDiff}ms, 阈值: ${recentTimeThreshold}ms, shown: ${achievementData.shown}`)
        return timeDiff <= recentTimeThreshold && !achievementData.shown
      }
      
      return false
    }).sort((a, b) => {
      // 按解锁时间排序
      const aTime = userData[a.id].unlockTime || 0
      const bTime = userData[b.id].unlockTime || 0
      // 处理时间格式：如果是字符串（ISO格式），转换为时间戳
      const aTimestamp = typeof aTime === 'string' ? new Date(aTime).getTime() : aTime
      const bTimestamp = typeof bTime === 'string' ? new Date(bTime).getTime() : bTime
      return aTimestamp - bTimestamp
    })
  },

  // 滚动到指定成就并播放动画
  scrollToAchievementAndAnimate(achievementId) {
    console.log('定位到成就:', achievementId)
    
    // 检查目标成就是否在当前过滤列表中
    const targetAchievement = this.data.filteredAchievements.find(a => a.id === achievementId)
    if (!targetAchievement) {
      console.error(`成就 ${achievementId} 不在当前过滤列表中`)
      console.log('当前过滤列表:', this.data.filteredAchievements.map(a => a.id))
      return
    }
    
    console.log(`找到目标成就: ${targetAchievement.title}, scrollId: ${targetAchievement.scrollId}`)
    
    // 使用scroll-view的scrollIntoView功能滚动到指定成就
    this.setData({
      scrollIntoViewId: `achievement-${achievementId}`
    })
    
    // 延迟添加动画效果
    setTimeout(() => {
      this.addAchievementCompletionAnimation(achievementId)
    }, 500)
  },

  // 添加成就完成动画效果
  addAchievementCompletionAnimation(achievementId) {
    const query = wx.createSelectorQuery()
    query.select(`#achievement-${achievementId}`).boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        // 添加高亮动画类
        const achievementElement = res[0]
        
        // 分阶段触发动画效果
        this.triggerAnimationSequence(achievementId)
      }
    })
  },
  
  // 分阶段触发动画序列
  triggerAnimationSequence(achievementId) {
    // 第一阶段：开始动画
    this.setData({
      [`animatingAchievement`]: achievementId
    })
    
    // 第二阶段：显示完成特效（延迟300ms）
    setTimeout(() => {
      this.showCompletionEffect(achievementId)
    }, 300)
    
    // 第三阶段：进度条动画（延迟600ms）
    setTimeout(() => {
      this.triggerProgressAnimation(achievementId)
    }, 600)
    
    // 第四阶段：扫光特效（延迟1000ms）
    setTimeout(() => {
      this.triggerSweepEffect(achievementId)
    }, 1000)
    
    // 最终阶段：清理动画（延迟4000ms）
    setTimeout(() => {
      const progressAnimating = { ...this.data.progressAnimating }
      const sweepAnimating = { ...this.data.sweepAnimating }
      delete progressAnimating[achievementId]
      delete sweepAnimating[achievementId]
      
      this.setData({
        animatingAchievement: '',
        progressAnimating: progressAnimating,
        sweepAnimating: sweepAnimating
      })
    }, 4000)
  },
  
  // 触发进度条动画
  triggerProgressAnimation(achievementId) {
    const progressAnimating = { ...this.data.progressAnimating }
    progressAnimating[achievementId] = true
    this.setData({
      progressAnimating: progressAnimating
    })
  },
  
  // 触发扫光效果
  triggerSweepEffect(achievementId) {
    const sweepAnimating = { ...this.data.sweepAnimating }
    sweepAnimating[achievementId] = true
    this.setData({
      sweepAnimating: sweepAnimating
    })
  },

  // 显示完成特效
  showCompletionEffect(achievementId) {
    // 显示炫酷的成就达成提示
    wx.showToast({
      title: '🏆✨ 成就达成！✨🏆',
      icon: 'none',
      duration: 3000
    })
    
    // 触发震动反馈
    wx.vibrateShort({
      type: 'heavy'
    })
    
    // 延迟显示更多特效
    setTimeout(() => {
      this.showParticleEffect(achievementId)
    }, 500)
    
    // 播放音效（如果有的话）
    this.playAchievementSound()
    
    console.log('播放成就完成特效:', achievementId)
  },
  
  // 显示粒子特效
  showParticleEffect(achievementId) {
    // 创建粒子动画效果
    const particles = []
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: `particle-${i}`,
        delay: i * 100,
        duration: 1000 + Math.random() * 500
      })
    }
    
    this.setData({
      [`particles_${achievementId}`]: particles
    })
    
    // 清理粒子效果
    setTimeout(() => {
      this.setData({
        [`particles_${achievementId}`]: []
      })
    }, 2000)
  },
  
  // 播放成就音效
  playAchievementSound() {
    // 如果有音效文件，可以在这里播放
    // wx.createInnerAudioContext() 播放音效
    console.log('播放成就音效')
  },

  // 标记成就为已展示
  markAchievementsAsShown(achievements) {
    const userData = app.globalData.userAchievements
    
    achievements.forEach(achievement => {
      const achievementData = userData[achievement.id]
      if (typeof achievementData === 'object') {
        achievementData.shown = true
      } else {
        // 如果是旧格式，转换为新格式
        const beijingTime = new Date(Date.now() + 8 * 60 * 60 * 1000)
        userData[achievement.id] = {
          progress: achievementData,
          unlockTime: beijingTime.toISOString(),
          shown: true
        }
      }
    })
    
    // 保存到本地存储
    wx.setStorageSync('achievements', userData)
    console.log('已标记成就为已展示:', achievements.map(a => a.id))
  },

  // 成就解锁触发
  unlockAchievement(achievementId, progress) {
    const current = app.globalData.userAchievements[achievementId] || 0
    const achievement = this.data.achievements.find(a => a.id === achievementId)
    
    if (!achievement) return
    
    const newValue = Math.min(current + progress, achievement.value)
    
    if (newValue > current) {
      app.globalData.userAchievements[achievementId] = newValue
      wx.setStorageSync('achievements', app.globalData.userAchievements)
      
      // 检查是否解锁成就
      if (newValue >= achievement.value && current < achievement.value) {
        // 增加成就分数
        app.globalData.achievementScore = (app.globalData.achievementScore || 0) + achievement.score
        wx.setStorageSync('achievementScore', app.globalData.achievementScore)
        
        // 检查是否触发了成就值相关的成就
        this.checkScoreAchievements()
        
        // 触发界面更新
        this.showUnlockEffect(achievement)
      }
    }
  },

  // 加载动画数据
  loadAnimationData() {
    try {
      // 读取动画JSON文件
      const animationData = require('../../Lottie/Animation.js')
      this.setData({
        animationData: animationData
      })
    } catch (error) {
      console.error('加载动画数据失败:', error)
    }
  },

  // 显示动画效果
  showUnlockEffect(achievement) {
    // 记录解锁时间
    const userData = app.globalData.userAchievements
    const achievementData = userData[achievement.id]
    
    if (typeof achievementData === 'object') {
      // 使用北京时间的ISO字符串格式，与app.js保持一致
      const beijingTime = new Date(Date.now() + 8 * 60 * 60 * 1000)
      achievementData.unlockTime = beijingTime.toISOString()
      achievementData.shown = false // 标记为未展示
    } else {
      // 转换为新格式
      const beijingTime = new Date(Date.now() + 8 * 60 * 60 * 1000)
      userData[achievement.id] = {
        progress: achievementData,
        unlockTime: beijingTime.toISOString(),
        shown: false
      }
    }
    
    // 保存到本地存储
    wx.setStorageSync('achievements', userData)
    
    // 显示动画
    this.setData({
      showAnimation: true,
      newAchievement: achievement
    })
    
    // 3秒后隐藏动画并显示弹窗
    setTimeout(() => {
      this.setData({
        showAnimation: false,
        showPopup: true
      })
    }, 3000)
    
    // 将成就添加到待展示队列
    if (!app.globalData.pendingAchievements) {
      app.globalData.pendingAchievements = []
    }
    app.globalData.pendingAchievements.push(achievement)
    wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements)
  },
  
  // 关闭成就弹窗
  closePopup() {
    this.setData({
      showPopup: false
    })
  },
  
  // 检查成就值相关的成就
  checkScoreAchievements() {
    // 获取所有type为2的成就（成就值相关成就）
    const scoreAchievements = this.data.achievements.filter(a => a.type === 2)
    const currentScore = app.globalData.achievementScore || 0
    
    console.log('检查成就值相关成就，当前成就值:', currentScore)
    
    // 遍历所有成就值相关成就
    scoreAchievements.forEach(achievement => {
      // 检查当前成就值是否达到成就要求
      if (currentScore >= achievement.value) {
        const current = app.globalData.userAchievements[achievement.id] || 0
        console.log(`检查成就[${achievement.id}] ${achievement.title}，要求:${achievement.value}，当前进度:${current}`)
        
        // 如果成就尚未解锁
        if (current < achievement.value) {
          console.log(`解锁成就值成就: ${achievement.title}`)
          
          // 解锁成就
          app.globalData.userAchievements[achievement.id] = achievement.value
          wx.setStorageSync('achievements', app.globalData.userAchievements)
          
          // 增加成就分数（注意：这里可能会导致递归触发其他成就）
          const newScore = app.globalData.achievementScore + achievement.score
          app.globalData.achievementScore = newScore
          wx.setStorageSync('achievementScore', newScore)
          
          console.log(`成就值更新: ${app.globalData.achievementScore - achievement.score} -> ${app.globalData.achievementScore}`)
          
          // 触发界面更新
          this.showUnlockEffect(achievement)
          
          // 更新页面数据
          this.setData({
            achievementScore: app.globalData.achievementScore
          })
          
          // 重新加载成就列表以更新UI
          this.loadAchievements()
        }
      }
    })
  },
  
  // 显示成就详情
  showAchievementDetail(e) {
    const achievement = e.currentTarget.dataset.achievement;
  
    if (achievement && achievement.unlocked) {
      console.log('显示成就详情:', achievement); // 确保获取到正确的成就数据
  
      this.setData({
        selectedAchievement: achievement,  // 更新选中的成就
        showDetailPopup: true  // 显示弹窗
      }, () => {
        // setData 完成后的回调，确保获取最新的 selectedAchievement
        console.log('弹窗状态 showDetailPopup:', this.data.showDetailPopup);  // 确认弹窗状态
        console.log('selectedAchievement（更新后）:', this.data.selectedAchievement);  // 打印更新后的 selectedAchievement
      });
    } else {
      this.showLockedTip();  // 如果成就未解锁，显示提示
    }
  },
  
  // 显示未解锁成就提示
  showLockedTip() {
    wx.showToast({
      title: '解锁后查看详情',
      icon: 'none',
      duration: 1500
    })
  },
  

// 关闭成就详情弹窗
closeDetailPopup() {
  console.log('关闭弹窗');
  this.setData({
    showDetailPopup: false  // 设置为 false，隐藏弹窗
  });
},
  
  // 处理成就弹窗的查看详情按钮点击事件
  handleViewDetails(e) {
    console.log('handleViewDetails被调用，参数:', JSON.stringify(e));
    
    // 关闭弹窗
    this.setData({
      showPopup: false
    })
    
    // 获取成就信息，优先使用事件传递的数据
    const achievement = e && e.detail && e.detail.achievement ? e.detail.achievement : this.data.newAchievement
    console.log('获取到的成就信息:', JSON.stringify(achievement));
    
    // 如果当前已经在成就页面，则滚动到对应成就位置
    if (achievement) {
      const achievementId = achievement.id
      // 找到对应成就的索引
      const index = this.data.achievements.findIndex(a => a.id === achievementId)
      console.log('成就索引:', index);
      
      if (index !== -1) {
        // 切换到对应成就的分类
        const category = this.data.achievements[index].category
        
        // 为成就卡片添加唯一ID，用于scrollIntoView
        const achievementsWithId = this.data.achievements.map(a => ({
          ...a,
          scrollId: `achievement-${a.id}`
        }))
        
        this.setData({ 
          activeCategory: category,
          achievements: achievementsWithId
        })
        
        // 使用延时确保UI更新后再滚动
        setTimeout(() => {
          // 使用scroll-view的scrollIntoView功能滚动到指定成就
          this.setData({
            scrollIntoViewId: `achievement-${achievementId}`
          })
          
          // 显示成就详情弹窗
          console.log('准备显示成就详情弹窗');
          this.setData({
            selectedAchievement: achievement,
            showDetailPopup: true
          });
          console.log('成就详情弹窗已设置为显示');
        }, 300)
      } else {
        // 如果找不到对应成就，也显示详情弹窗
        console.log('未找到对应成就，直接显示详情弹窗');
        this.setData({
          selectedAchievement: achievement,
          showDetailPopup: true
        });
      }
    } else {
      console.error('没有获取到有效的成就信息');
    }
    
    console.log('显示成就详情:', achievement)
  },

  // 其他辅助方法...
})
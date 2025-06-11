// app.js
App({
  globalData: {
    userAchievements: null,
    viewedAchievements: {},
    achievementScore: 0,
    pendingAchievements: [],
    completedTests: [], // 添加已完成测试记录
    fishingSessionCount: 0 // 添加钓鱼会话次数计数器
  },
  
  onLaunch() {

    wx.setInnerAudioOption({
        obeyMuteSwitch: false, // 静音模式下仍播放声音
        mixWithOther: true     // 允许与其他音频混播
      });
    // 全局错误捕获
    wx.onError((error) => {
      console.error('Global Error:', error);
      wx.showToast({
        title: '程序出现异常',
        icon: 'none'
      });
    });
    // 初始化用户成就数据
    const savedAchievements = wx.getStorageSync('achievements') || {}
    
    // 转换旧格式的成就数据到新格式
    const convertedAchievements = {}
    Object.keys(savedAchievements).forEach(id => {
      // 检查是否已经是新格式
      if (typeof savedAchievements[id] === 'object' && savedAchievements[id] !== null) {
        convertedAchievements[id] = savedAchievements[id]
      } else {
        // 转换旧格式（数字）到新格式（对象）
        convertedAchievements[id] = {
          progress: savedAchievements[id],
          unlockTime: null // 旧数据没有解锁时间
        }
      }
    })
    
    this.globalData.userAchievements = convertedAchievements
    this.globalData.viewedAchievements = wx.getStorageSync('viewedAchievements') || {}
    this.globalData.achievementScore = wx.getStorageSync('achievementScore') || 0
    this.globalData.pendingAchievements = wx.getStorageSync('pendingAchievements') || []
    this.globalData.completedTests = wx.getStorageSync('completedTests') || []
    this.globalData.fishingSessionCount = wx.getStorageSync('fishingSessionCount') || 0
    
    // 输出成就初始化日志
    console.log('===== 成就系统初始化 =====')
    console.log('当前成就分数:', this.globalData.achievementScore)
    console.log('已完成测试:', this.globalData.completedTests)
    console.log('成就进度:', JSON.stringify(this.globalData.userAchievements))
    
    // 加载所有成就定义并输出初始状态
    try {
      const { achievements } = require('./data/achievements.js')
      console.log('===== 所有成就初始状态 =====')
      achievements.forEach(achievement => {
        const current = this.globalData.userAchievements[achievement.id] || 0
        const isUnlocked = current >= achievement.value
        console.log(`成就[${achievement.id}] ${achievement.title}: 进度 ${current}/${achievement.value} ${isUnlocked ? '已解锁' : '未解锁'}`)
      })
    } catch (error) {
      console.error('加载成就定义失败:', error)
    }
  },
  
  // 标记成就为已查看
  markAchievementViewed(achievementId) {
    this.globalData.viewedAchievements[achievementId] = true
    wx.setStorageSync('viewedAchievements', this.globalData.viewedAchievements)
  },
  
  // 更新成就进度
  updateAchievementProgress(achievementId, progress) {
    // 获取当前成就数据，如果不存在则创建一个新对象
    const achievementData = typeof this.globalData.userAchievements[achievementId] === 'object' 
      ? this.globalData.userAchievements[achievementId] 
      : { progress: 0, unlockTime: null }
    
    // 获取当前进度
    const current = achievementData.progress || 0
    const newProgress = current + progress
    
    // 更新成就数据
    this.globalData.userAchievements[achievementId] = {
      progress: newProgress,
      unlockTime: achievementData.unlockTime
    }
    
    wx.setStorageSync('achievements', this.globalData.userAchievements)
    
    // 获取成就定义信息用于日志
    try {
      const { achievements } = require('./data/achievements.js')
      const achievement = achievements.find(a => a.id === achievementId)
      if (achievement) {
        // 根据成就类型处理不同的解锁条件
        let isUnlocked = false
        let wasUnlocked = false
        
        if (achievement.type === 3) {
          // type:3 - 首次使用特定功能后解锁成就
          isUnlocked = newProgress >= 1
          wasUnlocked = current >= 1
        } else if (achievement.type === 4) {
          // type:4 - 在特定时间段内完成测试解锁成就
          // 这个类型的解锁逻辑在test.js中处理
          isUnlocked = newProgress >= 1
          wasUnlocked = current >= 1
        } else {
          // 常规类型成就（type:1和type:2）
          isUnlocked = newProgress >= achievement.value
          wasUnlocked = current >= achievement.value
        }
        
        // 如果是新解锁的成就，记录解锁时间
        if (isUnlocked && !wasUnlocked) {
          // 获取北京时间（UTC+8）
          const now = new Date()
          const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000)
          
          // 更新解锁时间
          this.globalData.userAchievements[achievementId].unlockTime = beijingTime.toISOString()
          wx.setStorageSync('achievements', this.globalData.userAchievements)
          
          console.log(`成就[${achievementId}]解锁时间: ${beijingTime.toISOString()}`)
        }
        
        console.log(`===== 成就进度更新 =====`)
        console.log(`成就[${achievementId}] ${achievement.title}: 进度 ${current} -> ${newProgress}/${achievement.value} ${isUnlocked ? '已解锁' : '未解锁'}`)
      } else {
        console.warn(`找不到成就定义: ${achievementId}`)
      }
    } catch (error) {
      console.error('获取成就定义失败:', error)
    }
    
    // 返回更新后的进度值
    return this.globalData.userAchievements[achievementId]
  },
  
  // 检查功能使用成就
  checkFeatureAchievement(featureId) {
    const { achievements, getAchievementIcon } = require('./data/achievements.js');
    
    console.log(`===== 功能使用成就检查 =====`);
    console.log(`当前使用功能: ${featureId}`);
    
    // 筛选出type:3类型的成就（首次使用特定功能）
    const featureAchievements = achievements.filter(a => a.type === 3 && a.value === featureId);
    console.log(`相关功能成就数量: ${featureAchievements.length}`);
    
    featureAchievements.forEach(achievement => {
      // 获取当前成就进度
      const achievementData = typeof this.globalData.userAchievements[achievement.id] === 'object'
        ? this.globalData.userAchievements[achievement.id]
        : { progress: 0, unlockTime: null };
      
      const current = achievementData.progress || 0;
      
      console.log(`检查成就[${achievement.id}] ${achievement.title}: 当前进度 ${current}`);
      
      // 如果成就尚未解锁，则解锁它
      if (current < 1) {
        console.log(`解锁功能使用成就: ${achievement.title}`);
        
        // 更新成就进度
        this.updateAchievementProgress(achievement.id, 1);
        
        // 获取成就数据
        const achievementData = achievements.find(a => a.id === achievement.id);
        
        if (achievementData) {
          // 确保成就对象包含正确的icon属性
          const achievementWithIcon = {
            ...achievementData,
            icon: achievementData.getIcon ? achievementData.getIcon(true) : getAchievementIcon(achievementData.id, true)
          };
          
          console.log('[checkFeatureAchievement] 成就图标地址:', achievementWithIcon.icon);
          
          // 增加成就分数
          const oldScore = this.globalData.achievementScore || 0;
          this.globalData.achievementScore = oldScore + achievementData.score;
          wx.setStorageSync('achievementScore', this.globalData.achievementScore);
          console.log(`成就分数更新: ${oldScore} -> ${this.globalData.achievementScore}`);
          
          // 检查成就分数相关的成就（type: 2）
          this.checkScoreAchievements();
          
          // 将成就添加到待展示队列
          if (!this.globalData.pendingAchievements) {
            this.globalData.pendingAchievements = [];
          }
          this.globalData.pendingAchievements.push(achievementWithIcon);
          wx.setStorageSync('pendingAchievements', this.globalData.pendingAchievements);
          
          console.log(`成就已添加到待展示队列，当前队列长度: ${this.globalData.pendingAchievements.length}`);
        }
      } else {
        console.log(`成就[${achievement.id}]已解锁，跳过`);
      }
    });
  },
  
  // 检查成就分数相关的成就（type: 2）
  checkScoreAchievements() {
    const { achievements, getAchievementIcon } = require('./data/achievements.js');
    const scoreAchievements = achievements.filter(a => a.type === 2);
    const currentScore = this.globalData.achievementScore || 0;
    
    console.log('检查成就分数相关成就，当前成就分数:', currentScore);
    
    scoreAchievements.forEach(achievement => {
      // 检查当前成就分数是否达到成就要求
      if (currentScore >= achievement.value) {
        // 获取当前成就进度
        const achievementData = typeof this.globalData.userAchievements[achievement.id] === 'object'
          ? this.globalData.userAchievements[achievement.id]
          : { progress: 0, unlockTime: null };
        
        const current = achievementData.progress || 0;
        console.log(`检查成就[${achievement.id}] ${achievement.title}，要求:${achievement.value}，当前进度:${current}`);
        
        // 如果成就尚未解锁
        if (current < achievement.value) {
          console.log(`解锁成就分数成就: ${achievement.title}`);
          
          // 更新成就进度并记录解锁时间
          this.updateAchievementProgress(achievement.id, achievement.value - current);
          
          // 增加成就分数（注意：这里可能会导致递归触发其他成就）
          const oldScore = this.globalData.achievementScore;
          this.globalData.achievementScore = oldScore + achievement.score;
          wx.setStorageSync('achievementScore', this.globalData.achievementScore);
          
          console.log(`成就分数更新: ${oldScore} -> ${this.globalData.achievementScore}`);
          
          // 确保成就对象包含正确的icon属性
          const achievementWithIcon = {
            ...achievement,
            icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
          };
          
          console.log('[app.js checkScoreAchievements] 成就图标地址:', achievementWithIcon.icon);
          
          // 将成就添加到待展示队列
          if (!this.globalData.pendingAchievements) {
            this.globalData.pendingAchievements = [];
          }
          this.globalData.pendingAchievements.push(achievementWithIcon);
          wx.setStorageSync('pendingAchievements', this.globalData.pendingAchievements);
          
          console.log(`成就分数成就已添加到待展示队列，当前队列长度: ${this.globalData.pendingAchievements.length}`);
        }
      }
    });
  }
})

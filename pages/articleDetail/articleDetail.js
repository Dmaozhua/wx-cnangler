// pages/articleDetail/articleDetail.js
Page({
  data: {
    article: null,
    loading: true,
    articleId: null,
    startX: 0,          // 触摸起始X坐标
    startY: 0,          // 触摸起始Y坐标
    swipeTransform: '',  // 滑动变换样式
    isSwiping: false,    // 是否正在滑动
    maxSwipeDistance: 150, // 最大滑动距离
    pageStyle: "overflow: visible" ,// 允许页面滚动
    swipeProgress: 0,       // 新增滑动进度(0-1)
    isAnimating: false ,     // 新增动画状态锁
    swipeTransform: 'transform: translateX(0)',
    isTouchMoving: false
  },

  onLoad: function(options) {
    // 获取文章ID
    if (options.articleId) {
      const articleId = parseInt(options.articleId);
      this.setData({
        articleId: articleId
      });
      this.loadArticleDetail(articleId);
      
      // 更新文章阅读次数和连续阅读天数，用于成就系统
      this.updateArticleReadCount();
      this.updateConsecutiveReadDays();
    } else {
      wx.showToast({
        title: '无效的文章ID',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
// 新增触摸事件处理函数
touchStart(e) {
  if (this.data.isAnimating) return;
  
  const touch = e.touches[0]
  this.setData({
    startX: touch.clientX,
    startY: touch.clientY,
    isTouchMoving: false
  })
},


touchMove(e) {
  if (this.data.isAnimating) return;

  const touch = e.touches[0]
  const deltaX = touch.clientX - this.data.startX
  const deltaY = touch.clientY - this.data.startY
  
  // 方向锁定逻辑
  if (!this.data.isTouchMoving) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.setData({ isTouchMoving: true })
    } else {
      return // 纵向滑动不处理
    }
  }
  const progress = Math.min(Math.max(deltaX / this.data.maxSwipeDistance, 0), 1)
  this.setData({
    swipeTransform: `transform: translateX(${deltaX}px)`,
    swipeProgress: progress,
    isSwiping: progress > 0.2
  })
},

touchEnd() {
  if (this.data.isAnimating) return;
  
  this.setData({ 
    isAnimating: true,
    isTouchMoving: false 
  })

  const finalTransform = this.data.swipeProgress > 0.5 ? 
    `transform: translateX(100vw) translateZ(0); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);` :
    `transform: translateX(0) translateZ(0); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);`

  this.setData({
    swipeTransform: finalTransform
  }, () => {
    setTimeout(() => {
      if (this.data.swipeProgress > 0.5) {
        wx.navigateBack()
      }
      this.setData({ 
        isAnimating: false,
        swipeProgress: 0,
        isSwiping: false
      })
    }, 350)
  })

},

  // 加载文章详情
  loadArticleDetail: function(articleId) {
    try {
      // 动态加载文章数据
      const articleData = [];
      let article = null;
      
      // 由于小程序的安全限制，我们无法直接列出目录内容
      // 所以我们使用一个足够大的范围来尝试加载文章，类似于articlePage.js的实现
      const maxArticleNumber = 50; // 设置一个足够大的数字来尝试加载文章
      
      for (let i = 1; i <= maxArticleNumber; i++) {
        const fileName = `article${i}.js`;
        try {
          // 动态构建require路径
          const articleModule = require(`../../data/textData/${fileName}`);
          // 检查导出方式，支持多种导出格式
          let currentArticle;
          if (articleModule.fishingData) {
            currentArticle = articleModule.fishingData;
          } else if (articleModule.default) {
            currentArticle = articleModule.default;
          } else {
            currentArticle = articleModule;
          }
          
          // 将文章添加到列表中
          const currentId = i;
          articleData.push({id: currentId, data: currentArticle});
          
          // 如果ID匹配，设置为当前文章
          if (currentId === articleId) {
            article = currentArticle;
          }
          console.log(`成功加载文章: article${i}.js`);
        } catch (e) {
          // 如果连续5个文件都加载失败，则认为已经没有更多文章了
          if (i > 5 && articleData.length === 0) {
            console.log('没有找到任何文章文件，停止尝试加载');
            break;
          }
          // 如果已经加载了一些文章，并且连续5个文件都加载失败，则认为已经加载完所有文章
          if (articleData.length > 0 && i - articleData.length >= 5) {
            console.log('已加载所有可用文章文件，停止尝试加载');
            break;
          }
          console.log(`尝试加载article${i}.js：文件不存在或格式不正确`);
        }
      }
      
      // 如果没有直接匹配到文章ID，则从加载的文章列表中查找
      if (!article && articleData.length > 0) {
        const foundArticle = articleData.find(item => item.id === articleId);
        if (foundArticle) {
          article = foundArticle.data;
        }
      }
      
      if (article) {
        // 处理文章数据，转换为适合在详情页显示的格式
        const processedArticle = this.processArticleData(article);
        
        this.setData({
          article: processedArticle,
          loading: false
        });
      } else {
        wx.showToast({
          title: '文章不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('加载文章详情失败:', error);
      wx.showToast({
        title: '加载文章失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 导航到主页
  navigateToHome: function() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 返回上一页
  navigateBack: function() {
    wx.navigateBack();
  },
  
  // 更新文章阅读次数，用于成就系统
  updateArticleReadCount: function() {
    try {
      // 获取app实例
      const app = getApp();
      if (!app) return;
      
      // 获取已读文章记录
      let readArticles = wx.getStorageSync('readArticles') || [];
      const articleId = this.data.articleId;
      
      // 检查当前文章是否已经被记录过
      if (!readArticles.includes(articleId)) {
        // 将当前文章ID添加到已读文章列表中
        readArticles.push(articleId);
        wx.setStorageSync('readArticles', readArticles);
        
        console.log(`文章${articleId}已添加到已读列表，当前已读文章数量: ${readArticles.length}`);
        
        // 更新阅读文章相关成就
        // 查找type为5的成就（阅读不同文章的次数）
        try {
          const { achievements } = require('../../data/achievements.js');
          const readAchievements = achievements.filter(a => a.type === 5);
          
          readAchievements.forEach(achievement => {
            // 检查是否达到成就条件
            if (readArticles.length >= achievement.value) {
              // 获取当前成就进度
              const achievementData = app.globalData.userAchievements[achievement.id] || { progress: 0 };
              const current = achievementData.progress || 0;
              
              // 如果成就尚未解锁，则更新进度
              if (current < achievement.value) {
                console.log(`解锁文章阅读成就: ${achievement.title}`);
                app.updateAchievementProgress(achievement.id, achievement.value - current);
                
                // 增加成就分数
                const oldScore = app.globalData.achievementScore || 0;
                app.globalData.achievementScore = oldScore + achievement.score;
                wx.setStorageSync('achievementScore', app.globalData.achievementScore);
                
                // 确保成就对象包含正确的icon属性
                const { getAchievementIcon } = require('../../data/achievements.js');
                const achievementWithIcon = {
                  ...achievement,
                  icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
                };
                
                console.log('[articleDetail.js] 成就图标地址:', achievementWithIcon.icon);
                
                // 将成就添加到待展示队列
                if (!app.globalData.pendingAchievements) {
                  app.globalData.pendingAchievements = [];
                }
                app.globalData.pendingAchievements.push(achievementWithIcon);
                wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
              }
            }
          });
        } catch (error) {
          console.error('更新阅读成就失败:', error);
        }
      }
    } catch (error) {
      console.error('更新文章阅读次数失败:', error);
    }
  },
  
  // 更新连续阅读天数，用于成就系统
  updateConsecutiveReadDays: function() {
    try {
      // 获取app实例
      const app = getApp();
      if (!app) return;
      
      // 获取上次阅读日期和连续阅读天数
      const lastReadDate = wx.getStorageSync('lastReadDate') || '';
      let consecutiveReadDays = wx.getStorageSync('consecutiveReadDays') || 0;
      
      // 获取当前日期（格式：YYYY-MM-DD）
      const today = new Date();
      const currentDate = today.getFullYear() + '-' + 
                         (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                         today.getDate().toString().padStart(2, '0');
      
      console.log(`上次阅读日期: ${lastReadDate}, 当前日期: ${currentDate}, 连续阅读天数: ${consecutiveReadDays}`);
      
      // 如果今天已经阅读过，则不重复计算
      if (lastReadDate === currentDate) {
        console.log('今天已经阅读过文章，不重复计算连续阅读天数');
        return;
      }
      
      // 检查是否是连续阅读
      if (lastReadDate) {
        const lastDate = new Date(lastReadDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // 格式化昨天的日期为YYYY-MM-DD
        const yesterdayFormatted = yesterday.getFullYear() + '-' + 
                                  (yesterday.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                                  yesterday.getDate().toString().padStart(2, '0');
        
        console.log(`昨天日期: ${yesterdayFormatted}`);
        
        // 如果上次阅读是昨天，则连续阅读天数+1
        if (lastReadDate === yesterdayFormatted) {
          consecutiveReadDays++;
          console.log(`连续阅读天数+1，当前为${consecutiveReadDays}天`);
        } 
        // 如果上次阅读不是昨天，但也不是今天，则重置连续阅读天数为1
        else if (lastReadDate !== currentDate) {
          consecutiveReadDays = 1;
          console.log('连续阅读中断，重置为1天');
        }
      } else {
        // 如果是首次阅读，设置连续阅读天数为1
        consecutiveReadDays = 1;
        console.log('首次阅读，设置连续阅读天数为1');
      }
      
      // 更新上次阅读日期和连续阅读天数
      wx.setStorageSync('lastReadDate', currentDate);
      wx.setStorageSync('consecutiveReadDays', consecutiveReadDays);
      
      // 更新连续阅读相关成就
      try {
        const { achievements } = require('../../data/achievements.js');
        const consecutiveReadAchievements = achievements.filter(a => a.type === 6);
        
        consecutiveReadAchievements.forEach(achievement => {
          // 检查是否达到成就条件
          if (consecutiveReadDays >= achievement.value) {
            // 获取当前成就进度
            const achievementData = app.globalData.userAchievements[achievement.id] || { progress: 0 };
            const current = achievementData.progress || 0;
            
            // 如果成就尚未解锁，则更新进度
            if (current < achievement.value) {
              console.log(`解锁连续阅读成就: ${achievement.title}`);
              app.updateAchievementProgress(achievement.id, achievement.value - current);
              
              // 增加成就分数
              const oldScore = app.globalData.achievementScore || 0;
              app.globalData.achievementScore = oldScore + achievement.score;
              wx.setStorageSync('achievementScore', app.globalData.achievementScore);
              
              // 确保成就对象包含正确的icon属性
              const { getAchievementIcon } = require('../../data/achievements.js');
              const achievementWithIcon = {
                ...achievement,
                icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
              };
              
              console.log('[articleDetail.js] 成就图标地址:', achievementWithIcon.icon);
              
              // 将成就添加到待展示队列
              if (!app.globalData.pendingAchievements) {
                app.globalData.pendingAchievements = [];
              }
              app.globalData.pendingAchievements.push(achievementWithIcon);
              wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
            }
          }
        });
      } catch (error) {
        console.error('更新连续阅读成就失败:', error);
      }
    } catch (error) {
      console.error('更新连续阅读天数失败:', error);
    }
  },
  
  // 处理文章数据，转换为适合在详情页显示的格式
  processArticleData: function(rawArticle) {
    // 创建一个新的文章对象，包含meta信息
    const processedArticle = {
      meta: {
        title: rawArticle.title || "无标题",
        author: rawArticle.author || "未知作者",
        publishDate: rawArticle.publishDate || "未知日期"
      },
      introduction: {
        title: "引言",
        text: ""
      },
      // 保留原始的content字段
      content: rawArticle.content || rawArticle.text || "",
      // 保留原始的children结构
      children: rawArticle.children || [],
      chapters: []
    };
    
    // 处理文章内容
    if (rawArticle.children && rawArticle.children.length > 0) {
      // 第一个子节点通常是引言
      const intro = rawArticle.children[0];
      if (intro) {
        processedArticle.introduction = {
          title: intro.title || "引言",
          text: intro.content || ""
        };
      }
      
      // 处理其余章节
      for (let i = 1; i < rawArticle.children.length; i++) {
        const chapter = rawArticle.children[i];
        if (!chapter) continue;
        
        const processedChapter = {
          title: chapter.title || `章节 ${i}`,
          sections: []
        };
        
        // 如果章节有直接内容
        if (chapter.content && chapter.content.trim() !== "") {
          processedChapter.sections.push({
            subtitle: "",
            content: [{ type: "text", value: chapter.content }]
          });
        }
        
        // 处理章节的子节点
        if (chapter.children && chapter.children.length > 0) {
          chapter.children.forEach(section => {
            if (section) {
              processedChapter.sections.push({
                subtitle: section.title || "",
                content: [{ type: "text", value: section.content || "" }]
              });
            }
          });
        }
        
        // 只有当章节有内容或子节点时才添加到章节列表
        if (processedChapter.sections.length > 0) {
          processedArticle.chapters.push(processedChapter);
        }
      }
    } else {
      // 处理没有children结构的文章
      // 如果文章有content字段，将其作为引言
      if (rawArticle.content && rawArticle.content.trim() !== "") {
        processedArticle.introduction = {
          title: "引言",
          text: rawArticle.content
        };
      } 
      // 如果文章有text字段（旧格式），将其作为引言
      else if (rawArticle.text && rawArticle.text.trim() !== "") {
        processedArticle.introduction = {
          title: "引言",
          text: rawArticle.text
        };
      }
      
      // 创建一个默认章节，确保页面有内容显示
      if (!processedArticle.introduction.text && !processedArticle.content) {
        processedArticle.chapters.push({
          title: "内容",
          sections: [{
            subtitle: "",
            content: [{ type: "text", value: "暂无内容" }]
          }]
        });
      }
    }
    
    return processedArticle;
  },
    // 导航到主页
    navigateToHome: function() {
        wx.switchTab({
          url: '/pages/articlePage/articlePage'
        });
      }

});
// components/achievement-popup/achievement-popup.js
Component({
    properties: {
    visible: {
      type: Boolean,
      value: false
    },
    achievement: {
      type: Object,
      value: null
    },
    achievements: {
      type: Array,
      value: []
    },
    currentIndex: {
      type: Number,
      value: 0
    }
  },
  
    data: {
    animationData: {},
    canSwitchPrev: false,
    canSwitchNext: false,
    achievementCount: 0
  },
  
    lifetimes: {
      attached() {
        // 创建动画实例
        this.animation = wx.createAnimation({
          duration: 300, // 可根据 achievements 界面调整
          timingFunction: 'ease' // 可根据 achievements 界面调整
        })
      },
      ready() {
        // 确保动画实例已创建
        if (!this.animation) {
          this.animation = wx.createAnimation({
            duration: 300, // 可根据 achievements 界面调整
            timingFunction: 'ease' // 可根据 achievements 界面调整
          })
        }
      }
    },
  
    // 监听页面生命周期
    pageLifetimes: {
      hide() {
        const pages = getCurrentPages();
        if (pages.length > 0 && pages[pages.length - 1].route.includes('pages/achievements/achievements')) {
          return;
        }
        if (this.properties.visible) {
          this.triggerEvent('close');
        }
      }
    },
  
    observers: {
    'visible': function(visible) {
      // 确保animation对象已创建后再执行动画
      if (!this.animation) {
        this.animation = wx.createAnimation({
          duration: 300, // 可根据 achievements 界面调整
          timingFunction: 'ease' // 可根据 achievements 界面调整
        })
      }

      if (visible) {
        this.updateSwitchButtons();
        this.showAnimation()
      } else {
        this.hideAnimation()
      }
    },
    'achievements, currentIndex': function(achievements, currentIndex) {
      this.updateSwitchButtons();
    }
  },
  
    methods: {
      preventTouchMove() {
        // 阻止触摸事件穿透
        return false
      },

      updateSwitchButtons() {
        const achievements = this.properties.achievements || [];
        const currentIndex = this.properties.currentIndex || 0;
        
        this.setData({
          canSwitchPrev: achievements.length > 1 && currentIndex > 0,
          canSwitchNext: achievements.length > 1 && currentIndex < achievements.length - 1,
          achievementCount: achievements.length
        });
      },

      onSwitchPrev() {
        const currentIndex = this.properties.currentIndex;
        if (currentIndex > 0) {
          this.triggerEvent('switchAchievement', { 
            direction: 'prev',
            newIndex: currentIndex - 1 
          });
        }
      },

      onSwitchNext() {
        const achievements = this.properties.achievements || [];
        const currentIndex = this.properties.currentIndex;
        if (currentIndex < achievements.length - 1) {
          this.triggerEvent('switchAchievement', { 
            direction: 'next',
            newIndex: currentIndex + 1 
          });
        }
      },
  
      showAnimation() {
        // 添加安全检查，确保animation对象存在
        if (!this.animation) {
          this.animation = wx.createAnimation({
            duration: 300, // 可根据 achievements 界面调整
            timingFunction: 'ease' // 可根据 achievements 界面调整
          })
        }
        this.animation.opacity(1).scale(1).step()
        this.setData({
          animationData: this.animation.export()
        })
      },
  
      hideAnimation() {
        // 添加安全检查，确保animation对象存在
        if (!this.animation) {
          this.animation = wx.createAnimation({
            duration: 300, // 可根据 achievements 界面调整
            timingFunction: 'ease' // 可根据 achievements 界面调整
          })
          // 初始状态设置为隐藏
          this.animation.opacity(0).scale(0.8).step()
        } else {
          this.animation.opacity(0).scale(0.8).step()
        }
        this.setData({
          animationData: this.animation.export()
        })
      },
  
      onClose() {
        this.triggerEvent('close')
      },
  
      onViewDetails() {
        console.log('成就弹窗: 点击查看详情按钮');
        console.log('当前成就信息:', JSON.stringify(this.properties.achievement));
  
        // 触发viewDetails事件，并传递当前成就信息
        this.triggerEvent('viewDetails', { achievement: this.properties.achievement });
  
        // 直接跳转到成就页面，并传递成就ID
        if (this.properties.achievement && this.properties.achievement.id) {
          const achievementId = this.properties.achievement.id;
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
  
          console.log('当前页面路径:', currentPage ? currentPage.route : '未知');
  
          if (currentPage && currentPage.route === 'pages/achievements/achievements') {
            console.log('当前已在成就页面，直接调用handleViewDetails方法');
            if (typeof currentPage.handleViewDetails === 'function') {
              currentPage.handleViewDetails({
                detail: { achievement: this.properties.achievement }
              });
              this.onClose();
            } else {
              console.error('handleViewDetails方法不存在或不是函数');
              // 尝试直接调用showAchievementDetail方法
              if (typeof currentPage.showAchievementDetail === 'function') {
                console.log('尝试直接调用showAchievementDetail方法');
                currentPage.showAchievementDetail({
                  currentTarget: {
                    dataset: { achievement: this.properties.achievement }
                  }
                });
                this.onClose();
              } else {
                console.error('showAchievementDetail方法也不存在');
              }
            }
          } else {
            console.log('不在成就页面，跳转到成就页面');
            wx.switchTab({
              url: `/pages/achievements/achievements`,
              success: () => {
                console.log('成功跳转到成就页面');
                // 成功跳转后再关闭弹窗，避免页面隐藏时触发 close
                setTimeout(() => this.onClose(), 300);
              }
            });
          }
        }
      }
    }
  })
// pages/fishingHome/fishingHome.js
import { gameGuide } from '../../data/FishData2/fishingHelp';

Page({
    data: {
        showTips: false,
        fishingHelp: {
            title: "钓鱼指南",
            sections: []
        },
        tipsContent: "",
        logoAnimated: false
    },
    /**
     * 判断是否为字符串类型
     */
    isString(value) {
        return typeof value === 'string';
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('[钓鱼模拟器] 首页加载');
        // 初始化提示内容，使用gameGuide中的数据
        this.setData({
            'fishingHelp.title': '钓鱼指南',
            'fishingHelp.sections': gameGuide.sections
        });
    },
 /**
     * 生命周期函数--监听页面初次渲染完成
     */
 onReady() {
    // 创建入场动画
    const animation = wx.createAnimation({
        duration: 1500,
        timingFunction: 'ease-out'
    });
    
    // 初始状态：不可见，位置偏上
    animation.opacity(0).translateY(-100).step();
    
    // 结束状态：完全可见，回到原位
    animation.opacity(1).translateY(0).step({
        duration: 1500,
        timingFunction: 'ease-out'
    });
    
    this.setData({
        logoAnimation: animation.export()
    }, () => {
        // 入场动画完成后启动待机动画
        setTimeout(() => {
            this.setData({
                logoAnimated: true
            });
        }, 1500);

                // 添加调试信息
                wx.createSelectorQuery().select('.logo-container').boundingClientRect(rect => {
                    console.log('Logo容器位置:', rect);
                }).exec();
                
                wx.createSelectorQuery().select('.game-logo').boundingClientRect(rect => {
                    console.log('Logo图片尺寸:', rect);
                }).exec();
    });
},

/**
 * 启动待机动画（持续浮动效果）
 */
startIdleAnimation() {
    const animation = wx.createAnimation({
        duration: 3000,
        timingFunction: 'ease-in-out'
    });
    
    // 向上浮动
    animation.translateY(-15).step({
        duration: 1500,
        timingFunction: 'ease-in-out'
    });
    
    // 向下浮动
    animation.translateY(0).step({
        duration: 1500,
        timingFunction: 'ease-in-out'
    });
    
    this.setData({
        idleAnimation: animation.export()
    });
    
    // 循环动画
    this.idleTimer = setInterval(() => {
        this.startIdleAnimation();
    }, 3000);
},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload() {
    // 清除待机动画计时器
    if (this.idleTimer) {
        clearInterval(this.idleTimer);
        this.idleTimer = null;
    }
},

    /**
     * 返回上一页
     */
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
      },

    /**
     * 显示/隐藏帮助提示
     */
    toggleTips() {
        this.setData({
            showTips: !this.data.showTips
        });
        console.log('[钓鱼模拟器] 切换提示显示状态:', this.data.showTips);
    },

    /**
     * 开始钓鱼，跳转到钓鱼准备页面
     */
    startFishing() {
        console.log('[钓鱼模拟器] 用户点击了开始钓鱼按钮');
        wx.navigateTo({
            url: '/pages/preparation/preparation',
            success: (res) => {
                console.log('[钓鱼模拟器] 成功跳转到钓鱼准备页面', res);
            },
            fail: (err) => {
                console.error('[钓鱼模拟器] 跳转到钓鱼欢迎页面失败:', err);
            }
        });
    },

    /**
     * 打开鱼类图鉴
     */
    openFishCollection() {
        console.log('[钓鱼模拟器] 用户点击了图鉴按钮');
        wx.navigateTo({
            url: '/pages/fishCollection/fishCollection',
            success: (res) => {
                console.log('[钓鱼模拟器] 成功跳转到鱼类图鉴页面', res);
            },
            fail: (err) => {
                console.error('[钓鱼模拟器] 跳转到鱼类图鉴页面失败:', err);
            }
        });
    }
})
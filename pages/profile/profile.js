// pages/profile/profile.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isUpdateLogOpen: false, // 控制更新日志的展开/折叠状态
        achievementScore: 0,    // 成就分数
        unlockedAchievements: 0 ,// 已解锁成就数量
        pageStyle: "overflow: visible" // 允许页面滚动
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 获取全局数据
        const app = getApp()
        const achievementScore = app.globalData.achievementScore || 0
        const fishingSessionCount = app.globalData.fishingSessionCount || 0
        
        // 计算已解锁的成就数量（与achievements页面保持一致）
        let unlockedCount = 0
        try {
            const { achievements } = require('../../data/achievements.js')
            const userData = app.globalData.userAchievements || {}
            
            // 计算已解锁的成就数量（与achievements页面保持完全一致）
            unlockedCount = achievements.filter(a => {
                const achievementData = userData[a.id] || { progress: 0 }
                const currentProgress = typeof achievementData === 'object' 
                    ? parseInt(achievementData.progress || 0, 10)
                    : parseInt(achievementData || 0, 10)
                
                let isUnlocked = false;
                let targetValue = 0;
                
                // 根据成就类型处理不同的解锁条件（与achievements.js保持一致）
                if (a.type === 3) {
                    // type:3 - 首次使用特定功能后解锁成就
                    targetValue = 1;
                    isUnlocked = currentProgress >= 1;
                } else if (a.type === 4) {
                    // type:4 - 在特定时间段内完成测试解锁成就
                    targetValue = 1;
                    isUnlocked = currentProgress >= 1;
                } else if (a.type === 8) {
                    // type:8 - 累计钓到某一种鱼多少次
                    if (Array.isArray(a.value) && a.value.length >= 2) {
                        targetValue = parseInt(a.value[1], 10);
                        isUnlocked = currentProgress >= targetValue;
                    } else {
                        targetValue = 1;
                        isUnlocked = false;
                    }
                } else if (a.type === 9) {
                    // type:9 - 累计遇到某一种事件多少次
                    if (Array.isArray(a.value) && a.value.length >= 2) {
                        targetValue = parseInt(a.value[1], 10);
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
                    // 其他类型成就
                    targetValue = parseInt(a.value, 10);
                    if (isNaN(targetValue)) targetValue = 1;
                    isUnlocked = currentProgress >= targetValue;
                }
                
                return isUnlocked;
            }).length
        } catch (error) {
            console.error('计算已解锁成就数量失败:', error)
        }
        
        // 更新页面数据
        this.setData({
            achievementScore: achievementScore,
            unlockedAchievements: unlockedCount,
            fishingSessionCount: fishingSessionCount
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    
    /**
     * 切换更新日志的展开/折叠状态
     */
    toggleUpdateLog() {
        this.setData({
            isUpdateLogOpen: !this.data.isUpdateLogOpen
        });
    },
    
    /**
     * 导航到设置页面
     */
    navigateToSettings() {
        wx.navigateTo({
            url: '/pages/settings/settings'
        });
    },
    
    /**
     * 导航到收藏页面
     */
    navigateToFavorites() {
        wx.navigateTo({
            url: '/pages/favorites/favorites'
        });
    },
    
    /**
     * 导航到反馈页面
     */
    navigateToFeedback() {
        wx.navigateTo({
            url: '/pages/feedback/feedback'
        });
    }
})
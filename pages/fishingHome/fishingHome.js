// pages/fishingHome/fishingHome.js
import { gameGuide } from '../../data/FishData2/fishingHelp';

Page({
    data: {
        showTips: false,
        fishingHelp: {
            title: "钓鱼指南",
            sections: []
        },
        tipsContent: ""
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
     * 返回上一页
     */
    goBack() {
        wx.navigateBack({
            delta: 1,
            success: () => {
                console.log('[钓鱼模拟器] 返回上一页成功');
            },
            fail: (err) => {
                console.error('[钓鱼模拟器] 返回上一页失败:', err);
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
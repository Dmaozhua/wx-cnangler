// pages/AnglerSay/AnglerSay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentFilter: 'all',  // 当前选中的筛选选项
        subFilter: 'comprehensive', // 当前选中的二级筛选选项
        anglerList: [  // 钓友说列表数据
            {
                id: 1,
                userName: '老钓手王',
                userTag: '资深钓手',
                userYear: '已使用2年',
                avatar: '/images/tab/路亚轮 (1).png',
                productName: '达瓦 大物轮 2024',
                price: '2999',
                description: '这款路亚轮使用了2年，整体表现非常出色，抛投距离远，操控性好，特别适合海钓使用。',
                images: [
                    '/images/tab/路亚轮 (1).png',
                    '/images/tab/路亚轮 (1).png',
                    '/images/tab/路亚轮 (1).png'
                ],
                rating: 4.8,
                serviceRating: 4.5,
                valueRating: 4.2,
                likes: 128,
                comments: 18
            },
            {
                id: 2,
                userName: '钓鱼达人',
                userTag: '专业钓手',
                userYear: '已使用2年',
                avatar: '/images/tab/路亚轮 (1).png',
                productName: '禧玛诺 XCV+',
                price: '1899',
                description: '使用这款路亚轮已经3年了，整体性能非常稳定，轻便耐用，抛投性好，特别适合淡水钓鱼。',
                images: [
                    '/images/tab/路亚轮 (1).png',
                    '/images/tab/路亚轮 (1).png'
                ],
                rating: 4.6,
                serviceRating: 4.7,
                valueRating: 4.5,
                likes: 128,
                comments: 18
            },
            {
                id: 3,
                userName: '钓鱼达人小王',
                userTag: 'LV8 资深钓手',
                userYear: '已使用2年',
                avatar: '/images/tab/路亚轮 (1).png',
                productName: 'DAIWA 达瓦 STEEZ A TW 2023款',
                price: '3699',
                description: '极佳的性能表现，手感顺滑，非常适合长时间使用，特别推荐给进阶钓手。',
                images: [
                    '/images/tab/路亚轮 (1).png',
                    '/images/tab/路亚轮 (1).png'
                ],
                rating: 4.8,
                serviceRating: 4.9,
                valueRating: 4.7,
                likes: 128,
                comments: 18
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 可以在这里加载初始数据
    },

    /**
     * 切换筛选选项
     */
    changeFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        this.setData({
            currentFilter: filter
        });
        // 根据筛选条件重新加载数据
        this.loadFilteredData(filter, this.data.subFilter);
    },

    /**
     * 切换二级筛选选项
     */
    changeSubFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        this.setData({
            subFilter: filter
        });
        // 根据筛选条件重新加载数据
        this.loadFilteredData(this.data.currentFilter, filter);
    },

    /**
     * 根据筛选条件加载数据
     */
    loadFilteredData(filter, subFilter) {
        // 这里可以根据筛选条件请求后端数据
        // 示例中使用的是假数据，实际应用中可以调用API获取数据
        console.log('加载数据，筛选条件:', filter, '二级筛选条件:', subFilter);
    },

    /**
     * 查看钓友说详情
     */
    viewAnglerDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/AnglerSay/AnglerSayDetail?id=${id}`
        });
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

    }
})
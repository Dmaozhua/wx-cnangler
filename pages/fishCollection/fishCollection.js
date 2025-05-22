// pages/fishCollection/fishCollection.js
import { FishData, COMMON, UNCOMMON, RARE, EPIC, MYTHIC, BOSS, WASTE } from '../../data/FishData2/FishDataAll';
import { getFishCollection } from '../../data/FishData2/FishCollection';

Page({
  data: {
    fishList: [],
    filteredFishList: [],
    collectionData: {},
    collectionCount: 0,
    totalCount: 0,
    touchStartX: 0, // 记录触摸开始的X坐标
    touchEndX: 0,   // 记录触摸结束的X坐标
    currentFilter: 'all', // 当前选中的过滤标签
    rarityNames: {
      [COMMON]: '普通',
      [UNCOMMON]: '少见',
      [RARE]: '稀有',
      [EPIC]: '史诗级',
      [MYTHIC]: '传说级',
      [BOSS]: 'Boss级',
      [WASTE]: '杂物'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('[鱼类图鉴] 页面加载');
    this.loadFishData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时重新加载数据，确保数据最新
    this.loadFishData();
  },

  /**
   * 加载鱼类数据和收集状态
   */
  loadFishData() {
    // 获取鱼类收集状态
    const collectionData = getFishCollection();
    
    // 处理鱼类数据，添加解锁状态
    const fishList = FishData.map(fish => {
      const collected = collectionData[fish.id] || { unlocked: false };
      return {
        ...fish,
        unlocked: collected.unlocked,
        displayName: collected.unlocked ? fish.name : '???'
      };
    });

    // 计算收集数量
    const collectionCount = fishList.filter(fish => fish.unlocked).length;
    const totalCount = fishList.length;

    this.setData({
      fishList,
      filteredFishList: fishList, // 初始显示全部鱼类
      collectionData,
      collectionCount,
      totalCount
    });

    console.log('[鱼类图鉴] 数据加载完成', fishList.length, '已收集', collectionCount);
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1,
      success: () => {
        console.log('[鱼类图鉴] 返回上一页成功');
      },
      fail: (err) => {
        console.error('[鱼类图鉴] 返回上一页失败:', err);
      }
    });
  },

  /**
   * 查看鱼类详情
   */
  viewFishDetail(e) {
    const { id, unlocked } = e.currentTarget.dataset;
    
    // 只有解锁的鱼才能查看详情
    if (!unlocked) {
      wx.showToast({
        title: '尚未解锁该鱼类',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/fishDetail/fishDetail?id=${id}`,
      success: () => {
        console.log('[鱼类图鉴] 跳转到详情页', id);
      },
      fail: (err) => {
        console.error('[鱼类图鉴] 跳转详情页失败:', err);
      }
    });
  },
  
  /**
   * 触摸开始事件
   */
  touchStart(e) {
    this.setData({
      touchStartX: e.changedTouches[0].clientX
    });
  },
  
  /**
   * 触摸结束事件
   */
  touchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const moveDistance = touchEndX - this.data.touchStartX;
    
    // 如果向右滑动超过100px，则返回上一页
    if (moveDistance > 100) {
      this.goBack();
    }
    
    this.setData({
      touchEndX: touchEndX
    });
  },

  /**
   * 切换过滤标签
   */
  changeFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    let filteredFishList = [];
    
    // 根据选择的标签过滤鱼类列表
    switch(filter) {
      case 'all':
        filteredFishList = this.data.fishList;
        break;
      case 'unlocked':
        filteredFishList = this.data.fishList.filter(fish => fish.unlocked);
        break;
      case 'locked':
        filteredFishList = this.data.fishList.filter(fish => !fish.unlocked);
        break;
      case COMMON:
      case UNCOMMON:
      case RARE:
      case EPIC:
      case MYTHIC:
      case BOSS:
      case WASTE:
        // 按稀有度过滤，只显示已解锁的鱼
        filteredFishList = this.data.fishList.filter(fish => 
          fish.unlocked && fish.rarity === filter
        );
        break;
      default:
        filteredFishList = this.data.fishList;
    }
    
    this.setData({
      currentFilter: filter,
      filteredFishList
    });
  }
});
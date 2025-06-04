// pages/fishCollection/fishCollection.js
import { FishData, COMMON, UNCOMMON, RARE, EPIC, MYTHIC, BOSS, WASTE } from '../../data/FishData2/FishDataAll';
import { getFishCollection } from '../../data/FishData2/FishCollection';
import { FishEvents } from '../../data/FishData2/FishEvents';
import { getEventCollection } from '../../data/FishData2/EventCollection';

Page({
  data: {
    // 鱼类图鉴数据
    fishList: [],
    filteredFishList: [],
    collectionData: {},
    collectionCount: 0,
    totalCount: 0,
    
    // 事件图鉴数据
    eventList: [],
    filteredEventList: [],
    eventCollectionData: {},
    eventCollectionCount: 0,
    eventTotalCount: 0,
    
    // 图鉴类型切换
    showFishCollection: true,
    showEventCollection: false,
    
    // 触摸相关
    touchStartX: 0, // 记录触摸开始的X坐标
    touchEndX: 0,   // 记录触摸结束的X坐标
    
    // 过滤相关
    currentFilter: 'all', // 当前选中的过滤标签
    
    // 稀有度名称映射
    rarityNames: {
      [COMMON]: '普通',
      [UNCOMMON]: '少见',
      [RARE]: '稀有',
      [EPIC]: '史诗级',
      [MYTHIC]: '传说级',
      [BOSS]: 'Boss级',
      [WASTE]: '杂物'
    },
    
    // 事件类型名称映射
    eventTypeNames: {
      'BEF_FISHON': '钓鱼前',
      'AFT_FISHON': '钓鱼后',
      'EXTRA': '特殊天气'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('[图鉴] 页面加载');
    this.loadFishData();
    this.loadEventData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时重新加载数据，确保数据最新
    this.loadFishData();
    this.loadEventData();
    
    // 重新应用当前的过滤状态，保持排序效果
    if (this.data.currentFilter) {
      this.changeFilter({ currentTarget: { dataset: { filter: this.data.currentFilter } } });
    }
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
        displayName: collected.unlocked ? fish.name : '???',
        // 根据解锁状态设置图片URL
        imageUrl: collected.unlocked ? fish.Image : fish.backgroundImage
      };
    });

    // 排序：已解锁的排在前面，然后按原有顺序
    const sortedFishList = fishList.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return 0; // 保持原有顺序
    });

    // 计算收集数量
    const collectionCount = fishList.filter(fish => fish.unlocked).length;
    const totalCount = fishList.length;

    this.setData({
      fishList: sortedFishList,
      filteredFishList: sortedFishList, // 初始显示全部鱼类
      collectionData,
      collectionCount,
      totalCount
    });

    console.log('[鱼类图鉴] 数据加载完成', fishList.length, '已收集', collectionCount);
  },
  
  /**
   * 加载事件数据和收集状态
   */
  loadEventData() {
    // 获取事件收集状态
    const eventCollectionData = getEventCollection();
    
    // 处理事件数据，添加解锁状态
    const eventList = FishEvents.map(event => {
      const collected = eventCollectionData[event.id] || { unlocked: false };
      return {
        ...event,
        unlocked: collected.unlocked,
        displayName: collected.unlocked ? event.name : '???',
        // 设置事件图片URL（这里使用通用图片）
        imageUrl: '../../images/fishicons/fishon.webp'
      };
    });

    // 排序：已解锁的排在前面，然后按原有顺序
    const sortedEventList = eventList.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return 0; // 保持原有顺序
    });

    // 计算收集数量
    const eventCollectionCount = eventList.filter(event => event.unlocked).length;
    const eventTotalCount = eventList.length;

    this.setData({
      eventList: sortedEventList,
      filteredEventList: sortedEventList, // 初始显示全部事件
      eventCollectionData,
      eventCollectionCount,
      eventTotalCount
    });

    console.log('[事件图鉴] 数据加载完成', eventList.length, '已收集', eventCollectionCount);
  },

  /**
   * 处理鱼类图片加载错误
   */
  handleImageError(e) {
    const index = e.currentTarget.dataset.index;
    const fish = this.data.filteredFishList[index];
    
    if (!fish) return;
    
    // 构建新的鱼类列表，替换出错的图片URL为默认图片
    const newFilteredFishList = [...this.data.filteredFishList];
    newFilteredFishList[index] = {
      ...fish,
      imageUrl: fish.defImage || '../../images/fishicons/fish.png'
    };
    
    // 同时更新完整的鱼类列表
    const fishIndex = this.data.fishList.findIndex(item => item.id === fish.id);
    if (fishIndex !== -1) {
      const newFishList = [...this.data.fishList];
      newFishList[fishIndex] = {
        ...this.data.fishList[fishIndex],
        imageUrl: fish.defImage || '../../images/fishicons/fish.png'
      };
      
      this.setData({
        fishList: newFishList,
        filteredFishList: newFilteredFishList
      });
    } else {
      this.setData({
        filteredFishList: newFilteredFishList
      });
    }
    
    console.log('[鱼类图鉴] 图片加载失败，使用默认图片', fish.id);
  },
  
  /**
   * 处理事件图片加载错误
   */
  handleEventImageError(e) {
    const index = e.currentTarget.dataset.index;
    const event = this.data.filteredEventList[index];
    
    if (!event) return;
    
    // 构建新的事件列表，替换出错的图片URL为默认图片
    const newFilteredEventList = [...this.data.filteredEventList];
    newFilteredEventList[index] = {
      ...event,
      imageUrl: '../../images/fishicons/fish.png'
    };
    
    // 同时更新完整的事件列表
    const eventIndex = this.data.eventList.findIndex(item => item.id === event.id);
    if (eventIndex !== -1) {
      const newEventList = [...this.data.eventList];
      newEventList[eventIndex] = {
        ...this.data.eventList[eventIndex],
        imageUrl: '../../images/fishicons/fish.png'
      };
      
      this.setData({
        eventList: newEventList,
        filteredEventList: newFilteredEventList
      });
    } else {
      this.setData({
        filteredEventList: newFilteredEventList
      });
    }
    
    console.log('[事件图鉴] 图片加载失败，使用默认图片', event.id);
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
   * 查看事件详情
   */
  viewEventDetail(e) {
    const { id, unlocked } = e.currentTarget.dataset;
    
    // 只有解锁的事件才能查看详情
    if (!unlocked) {
      wx.showToast({
        title: '尚未解锁该事件',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到事件详情页
    wx.navigateTo({
      url: `/pages/eventDetail/eventDetail?id=${id}`,
      success: () => {
        console.log('[事件图鉴] 跳转到详情页', id);
      },
      fail: (err) => {
        console.error('[事件图鉴] 跳转详情页失败:', err);
      }
    });
  },
  
  /**
   * 切换图鉴类型（鱼类/事件）
   */
  switchGalleryType(e) {
    const type = e.currentTarget.dataset.type;
    
    if (type === 'fish') {
      this.setData({
        showFishCollection: true,
        showEventCollection: false,
        currentFilter: 'all'
      });
      this.changeFilter({ currentTarget: { dataset: { filter: 'all' } } });
    } else if (type === 'event') {
      this.setData({
        showFishCollection: false,
        showEventCollection: true,
        currentFilter: 'all'
      });
      this.changeFilter({ currentTarget: { dataset: { filter: 'all' } } });
    }
    
    console.log('[图鉴] 切换图鉴类型:', type);
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
    
    if (this.data.showFishCollection) {
      // 过滤鱼类列表
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
      
      // 对过滤后的列表进行排序：已解锁的排在前面
      filteredFishList = filteredFishList.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        return 0; // 保持原有顺序
      });
      
      this.setData({
        currentFilter: filter,
        filteredFishList
      });
    } else if (this.data.showEventCollection) {
      // 过滤事件列表
      let filteredEventList = [];
      
      // 根据选择的标签过滤事件列表
      switch(filter) {
        case 'all':
          filteredEventList = this.data.eventList;
          break;
        case 'unlocked':
          filteredEventList = this.data.eventList.filter(event => event.unlocked);
          break;
        case 'locked':
          filteredEventList = this.data.eventList.filter(event => !event.unlocked);
          break;
        case 'BEF_FISHON':
        case 'AFT_FISHON':
        case 'EXTRA':
          // 按事件类型过滤，只显示已解锁的事件
          filteredEventList = this.data.eventList.filter(event => 
            event.unlocked && event.type === filter
          );
          break;
        default:
          filteredEventList = this.data.eventList;
      }
      
      // 对过滤后的列表进行排序：已解锁的排在前面
      filteredEventList = filteredEventList.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        return 0; // 保持原有顺序
      });
      
      this.setData({
        currentFilter: filter,
        filteredEventList
      });
    }
  }
});
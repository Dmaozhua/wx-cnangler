// 事件图鉴收集数据

// 初始化事件收集状态
export const initEventCollection = () => {
  // 检查是否已有存储数据
  const storageData = wx.getStorageSync('eventCollection');
  if (storageData) {
    return storageData;
  }
  
  // 没有数据则初始化
  const initialCollection = {};
  
  // 从本地存储中获取或初始化数据
  wx.setStorageSync('eventCollection', initialCollection);
  return initialCollection;
};

// 更新事件收集状态
export const updateEventCollection = (eventId) => {
  const collection = wx.getStorageSync('eventCollection') || {};
  
  // 如果事件未被收集过，初始化数据
  if (!collection[eventId]) {
    collection[eventId] = {
      count: 1,
      unlocked: true
    };
  } else {
    // 更新已有数据
    collection[eventId].count += 1;
    collection[eventId].unlocked = true;
  }
  
  // 保存更新后的数据
  wx.setStorageSync('eventCollection', collection);
  return collection;
};

// 获取事件收集状态
export const getEventCollection = () => {
  return wx.getStorageSync('eventCollection') || {};
};

// 获取特定事件的收集状态
export const getEventCollectionById = (eventId) => {
  const collection = wx.getStorageSync('eventCollection') || {};
  return collection[eventId] || { count: 0, unlocked: false };
};
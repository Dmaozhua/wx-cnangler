// 鱼类图鉴收集数据

// 初始化鱼类收集状态
export const initFishCollection = () => {
  // 检查是否已有存储数据
  const storageData = wx.getStorageSync('fishCollection');
  if (storageData) {
    return storageData;
  }
  
  // 没有数据则初始化
  const initialCollection = {};
  
  // 从本地存储中获取或初始化数据
  wx.setStorageSync('fishCollection', initialCollection);
  return initialCollection;
};

// 更新鱼类收集状态
export const updateFishCollection = (fishId, fishStrength) => {
  const collection = wx.getStorageSync('fishCollection') || {};
  
  // 如果鱼未被收集过，初始化数据
  if (!collection[fishId]) {
    collection[fishId] = {
      count: 0,
      minStrength: fishStrength,
      maxStrength: fishStrength,
      unlocked: true
    };
  } else {
    // 更新已有数据
    collection[fishId].count += 1;
    collection[fishId].unlocked = true;
    
    // 更新最小/最大体型
    if (fishStrength < collection[fishId].minStrength) {
      collection[fishId].minStrength = fishStrength;
    }
    if (fishStrength > collection[fishId].maxStrength) {
      collection[fishId].maxStrength = fishStrength;
    }
  }
  
  // 保存更新后的数据
  wx.setStorageSync('fishCollection', collection);
  return collection;
};

// 获取鱼类收集状态
export const getFishCollection = () => {
  return wx.getStorageSync('fishCollection') || {};
};

// 获取特定鱼的收集状态
export const getFishCollectionById = (fishId) => {
  const collection = wx.getStorageSync('fishCollection') || {};
  return collection[fishId] || { count: 0, unlocked: false };
};
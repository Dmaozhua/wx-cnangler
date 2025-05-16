// pages/fishing/fishing.js
const app = getApp();
import { FishData,RARITY_MULTIPLIER } from '../../data/FishData2/FishDataAll';
import { FishEvents } from '../../data/FishData2/FishEvents';
import { QTEData } from '../../data/FishData2/QTEData';
import { fishtimeData } from '../../data/FishData2/fishtimeData';
import { WeatherEvents } from '../../data/FishData2/WeatherEvents';
import { Equipment } from '../../data/FishData2/Equipment';


// 计算中鱼概率的函数
function calculateFishProbability(waterArea, habitat, weather, bait, eventModifiers) {
  // 初始化权重对象
  const weights = {};
  let totalWeight = 0;
  
  // 获取NONE的基础概率并添加到总权重
  const noneProb = waterArea.fishProbabilities[habitat].NONE || 0.3;
  weights['NONE'] = noneProb;
  totalWeight += noneProb;
  
  // 遍历所有鱼类
  FishData.forEach(fish => {
    // 检查鱼是否在当前栖息地出现
    if (!fish.habitats.includes(habitat)) return;
    
    // 获取基础概率
    const baseProb = waterArea.fishProbabilities[habitat][fish.id] || 0;
    if (baseProb <= 0) return;
    
    // 计算天气影响
    const weatherBaseMultiplier = weather.effects.baseMultiplier || 1;
    const weatherAffinity = fish.weatherAffinity[weather.id] || 1;
    const weatherEffect = weatherBaseMultiplier * weatherAffinity;
    
    // 计算鱼饵匹配度
    let baitEffect = 0;
    if (fish.baitPref.includes(bait.id)) {
      baitEffect = bait.effect || 1;
      // 应用天气对鱼饵的影响
      if (weather.effects.baitEffect) {
        baitEffect *= weather.effects.baitEffect;
      }
    } else {
      return; // 如果鱼饵不匹配，跳过此鱼，不计算权重
    }
    
    // 计算稀有度权重
    let rarityMultiplier = RARITY_MULTIPLIER[fish.rarity] || 1;
    
    // 应用稀有度事件修正
    if (eventModifiers.rareFishBoost && eventModifiers.rareFishBoost.targetRarity && 
        eventModifiers.rareFishBoost.targetRarity.includes(fish.rarity)) {
      rarityMultiplier *= eventModifiers.rareFishBoost.value;
    }
    
    // 应用基础概率修正
    const baseMultiplier = eventModifiers.baseMultiplier || 1;
    
    // 计算最终权重
    const weight = baseProb * weatherEffect * baitEffect * rarityMultiplier * baseMultiplier;
    weights[fish.id] = weight;
    totalWeight += weight;
  });
  
  // 归一化概率
  const probabilities = {};
  Object.keys(weights).forEach(key => {
    probabilities[key] = weights[key] / totalWeight;
  });
  
  return probabilities;
}

Page({
  // 在data对象中添加事件加成列表数据结构
  data: {
    fishingTime: app.globalData.fishingTime,
    fishingTimePercent: 100, // 钓鱼时间百分比
    playerHP: app.globalData.playerHP,
    currentFish: null, // 进入 fishon 状态时设置
    state: 'waiting',  // 状态：waiting, fishon, qte
    qteData: {},
    qteOptions: [],
    qteTimeLeft: 0,
    fishCaught: 0,
    fishEscaped: 0,
    // 新增事件加成列表
    eventBuffs: [],
    hasEventBuffs: false,
    // 鱼状态组件控制
    showFishStatus: false,
    qteStatusText: '',
    canCastRod: true // 控制抛竿按钮是否可点击
  },
  // 返回准备页面的方法
  goBack() {
    console.log('返回准备页面');
    // 清除所有计时器
    if (this.fishingTimer) {
      clearInterval(this.fishingTimer);
      this.fishingTimer = null;
    }
    if (this.qteTimer) {
      clearInterval(this.qteTimer);
      this.qteTimer = null;
    }
    if (this.castTimer) {
      clearTimeout(this.castTimer);
      this.castTimer = null;
    }
    if (this.fishOnTimer) {
      clearTimeout(this.fishOnTimer);
      this.fishOnTimer = null;
    }
    
    // 重置状态
    this.setData({
      state: 'waiting',
      currentFish: null,
      showFishStatus: false
    });
    
    // 返回到准备页面
    wx.navigateBack({
      delta: 1,
      fail: () => {
        // 如果navigateBack失败，则使用redirectTo
        wx.redirectTo({
          url: '/pages/preparation/preparation'
        });
      }
    });
  },
  
  onLoad() {
    // 添加调试日志，确认全局变量
    console.log('[DEBUG] 全局变量:', {
      weather: app.globalData.weather,
      water: app.globalData.water,
      habitat: app.globalData.habitat
    });
    
    // 检查全局变量是否存在，如果不存在则初始化
    if (!app.globalData.fishingTime) {
      console.warn('[钓鱼游戏] 全局变量fishingTime未初始化，使用默认值');
      app.globalData.fishingTime = 300; // 默认5分钟
    }
    
    // 保存初始时间值，用于计算百分比
    app.globalData.initialFishingTime = app.globalData.fishingTime;
    
    if (!app.globalData.playerHP) {
      console.warn('[钓鱼游戏] 全局变量playerHP未初始化，使用默认值');
      app.globalData.playerHP = 100; // 默认满血
    }
    
    if (!app.globalData.weather || !app.globalData.water || !app.globalData.habitat) {
      console.warn('[钓鱼游戏] 全局环境变量未初始化，可能导致游戏异常');
      // 尝试从preparation页面重新初始化
      wx.redirectTo({
        url: '../preparation/preparation'
      });
      return;
    }
    
    // 初始化事件加成列表
    app.globalData.eventModifiers = { 
      rareFishBoost: 1, 
      baseMultiplier: 1, 
      timeModifier: 0, 
      baitEffect: 1 
    };
    
    // 初始化事件加成显示列表
    this.setData({
      eventBuffs: [],
      hasEventBuffs: false
    });
    
    // 计算时间百分比
    let timePercent = Math.ceil((app.globalData.fishingTime / app.globalData.initialFishingTime) * 100);
    // 确保时间百分比不小于0
    if (timePercent <= 0) {
      timePercent = 0;
    }
    
    // 获取水域背景图片路径并转换为小程序可用的绝对路径格式
    let backgroundImage = app.globalData.water.backgroundImage || '../../images/icons/stream.png';
    // 将相对路径转换为小程序可用的绝对路径格式
    backgroundImage = backgroundImage.replace('../../', '/');
    
    // 更新显示数据
    this.setData({
      fishingTime: app.globalData.fishingTime,
      fishingTimePercent: timePercent,
      playerHP: app.globalData.playerHP,
      state: 'waiting',
      fishCaught: app.globalData.fishCaught || 0,
      backgroundImage: backgroundImage,
      fishEscaped: app.globalData.fishEscaped || 0
    });
    
    console.log('[钓鱼游戏] 页面加载完成', {
      state: this.data.state,
      weather: app.globalData.weather.name,
      water: app.globalData.water.name,
      habitat: app.globalData.habitat,
      fishingTime: app.globalData.fishingTime,
      fishingTimePercent: timePercent
    });
  },
  // 点击“抛竿”按钮时触发
  // 鱼状态组件动画结束回调
  onFishStatusAnimationEnd() {
    // 动画结束后，如果组件已隐藏，则允许抛竿
    if (!this.data.showFishStatus) {
      this.setData({
        canCastRod: true
      });
    }
  },
  
  // 鱼状态组件锁定交互回调
  onFishStatusLockInteraction(e) {
    // 根据组件传来的locked状态设置页面交互状态
    const isLocked = e.detail.locked;
    this.setData({
      canCastRod: !isLocked // 当locked为true时，禁用抛竿按钮
    });
    
    // 如果需要，可以在这里添加更多的交互锁定逻辑
    // 例如禁用其他按钮或滑动操作
  },

  onCastRod() {
    // 检查是否可以抛竿（防止动画期间点击）
    if (!this.data.canCastRod) {
      console.log('[钓鱼游戏] 动画进行中，抛竿操作被屏蔽');
      return;
    }
    
    // 检查是否需要触发AFT_FISHON事件（在鱼被钓起或脱钩后的第一次抛竿前）
    if (app.globalData.shouldTriggerAftFishOn) {
      // 触发AFT_FISHON事件
      this.triggerAfterFishOnEvent(() => {
        // 重置标记
        app.globalData.shouldTriggerAftFishOn = false;
        // 然后触发BEF_FISHON事件
        this.triggerBeforeFishOnEvent(() => {
          this.decideBite();
        });
      });
    } else {
      // 在等待状态下触发可能BEF_FISHON事件
      this.triggerBeforeFishOnEvent(() => {
        this.decideBite();
      });
    }
  },
  // 模拟抛竿后判断是否有鱼上钩
  decideBite() {
    const water = app.globalData.water;
    const habitat = app.globalData.habitat;
    const weather = app.globalData.weather;
    const bait = app.globalData.currentBait || { id: 'BREADone', effect: 1.0 };
    const eventModifiers = app.globalData.eventModifiers || { rareFishBoost: 1, baseMultiplier: 1, timeModifier: 0, baitEffect: 1 };
    
    // 计算各种鱼的概率
    const probabilities = calculateFishProbability(water, habitat, weather, bait, eventModifiers);
    
    // 随机判断是否有鱼咬钩
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedFishId = 'NONE';
    
    // 根据概率选择鱼或者没有鱼咬钩
    for (const [fishId, probability] of Object.entries(probabilities)) {
      cumulativeProbability += probability;
      if (rand < cumulativeProbability) {
        selectedFishId = fishId;
        break;
      }
    }
    
    console.log('[钓鱼游戏] 抛竿结果:', selectedFishId);
    
    if (selectedFishId === 'NONE') {
      // 没有鱼咬钩
      wx.showToast({
        title: '没有鱼上钩',
        icon: 'none'
      });
      // 扣除时间
      this.updateFishingTime(fishtimeData.everyNONE);
      // 检查时间是否结束
      this.checkFishingTime();
    } else {
      // 有鱼咬钩，找到对应的鱼数据
      const fish = FishData.find(f => f.id === selectedFishId);
      if (fish) {
        this.startFishOn(fish);
      } else {
        console.error('[钓鱼游戏] 未找到鱼数据:', selectedFishId);
        this.updateFishingTime(fishtimeData.everyNONE);
        this.checkFishingTime();
      }
    }
  },
  // 进入鱼咬状态
  startFishOn(fish) {
    // 随机计算鱼的 strength 数值（保留两位小数）
    let min = fish.strength[0], max = fish.strength[1];
    let strength = Number((Math.random() * (max - min) + min).toFixed(2));
    // 计算鱼的总血量 = BaseHP * strength（保留两位小数）
    fish.hp = Number((fish.BaseHP * strength).toFixed(2));
    fish.strengthVal = strength;
    app.globalData.currentFish = fish;
    
    console.log('[钓鱼游戏] 鱼上钩:', {
      name: fish.name,
      strength: strength,
      hp: fish.hp
    });
    
    this.setData({
      currentFish: fish,
      state: 'fishon',
      showFishStatus: true, // 显示鱼状态组件
      qteStatusText: '鱼儿上钩了！'
    });
    
    // 初始化玩家血量
    app.globalData.playerHP = app.globalData.equipment.USER_LINEHP;
    this.setData({
      playerHP: app.globalData.playerHP
    });
    
    // 显示鱼上钩提示
    wx.showToast({
      title: `${fish.name}上钩了！`,
      icon: 'success'
    });
    
    // 开启被动伤害定时器以及 QTE 计时器
    this.startFishOnTimers();
  },
  
  startFishOnTimers() {
    // 定时器：每 0.5 秒给鱼扣除被动伤害（10 点）
    this.passiveTimer = setInterval(() => {
      if (this.data.state !== 'fishon') return; // QTE状态暂停被动伤害
      
      let fish = app.globalData.currentFish;
      if (!fish) return;
      
      const passiveDamage = 10; // 被动伤害值
      fish.hp = Number((fish.hp - passiveDamage).toFixed(2));
      
      app.globalData.currentFish = fish;
      this.setData({ currentFish: fish });
      
      // 检查鱼是否被钓起
      if (fish.hp <= 0) {
        this.onFishCaught();
      }
    }, 500);
    
    // 定时器：每 2.5 秒触发一次 QTE（实际触发时间在 2.5 秒内随机）
    this.qteTimer = setInterval(() => {
      if (this.data.state !== 'fishon') return;
      
      // 随机延迟触发QTE，增加游戏的不确定性
      const randomDelay = Math.random() * 2500; // 0-2.5秒内随机
      setTimeout(() => {
        if (this.data.state !== 'fishon') return; // 再次检查状态，防止在延迟期间状态已改变
        // 暂停被动伤害，进入 QTE 状态
        this.triggerQTE();
      }, randomDelay);
    }, 2500);
  },
  
  // 触发QTE事件
  triggerQTE() {
    // 进入QTE时清除被动伤害定时器
    if (this.passiveTimer) {
      clearInterval(this.passiveTimer);
      this.passiveTimer = null;
    }
    
    // 重置QTE处理锁
    this.isProcessingQte = false;
    
    const fish = app.globalData.currentFish;
    if (!fish) return;
    
    // 从鱼的QTEList中随机选择一个QTE类型
    const qteType = fish.QTEList[Math.floor(Math.random() * fish.QTEList.length)];
    // 获取对应的QTE数据
    const qteData = QTEData.find(qte => qte.id === qteType);
    
    if (!qteData) {
      console.error('[钓鱼游戏] 未找到对应的QTE数据:', qteType);
      return;
    }
    
    console.log('[钓鱼游戏] 触发QTE:', qteData.description);
    
    // 准备QTE选项
    const qteOptions = [];
    for (const [key, option] of Object.entries(qteData.options)) {
      qteOptions.push({
        key: key,
        description: option.description,
        attack: option.attack,
        linedam: option.linedam
      });
    }
    
    // 如果选项数量大于1，使用Fisher-Yates洗牌算法随机排序选项
    if (qteOptions.length > 1) {
      for (let i = qteOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // 交换位置
        [qteOptions[i], qteOptions[j]] = [qteOptions[j], qteOptions[i]];
      }
      console.log('[钓鱼游戏] QTE选项已随机排序');
    }
    
    // 更新状态为QTE
    this.setData({
      state: 'qte',
      qteData: qteData,
      qteOptions: qteOptions,
      qteTimeLeft: qteData.duration,
      qteStatusText: qteData.description // 更新鱼状态组件的QTE文本
    });
    
    // 启动QTE倒计时
    this.startQTETimer(qteData.duration);
  },
  
  // 启动QTE倒计时
  startQTETimer(duration) {
    // 清除之前的计时器
    if (this.qteCountdown) {
      clearInterval(this.qteCountdown);
    }
    
    let timeLeft = duration;
    
    // 每秒更新倒计时
    this.qteCountdown = setInterval(() => {
      timeLeft -= 1;
      
      this.setData({
        qteTimeLeft: timeLeft
      });
      
      if (timeLeft <= 0) {
        clearInterval(this.qteCountdown);
        this.onQTETimeout();
      }
    }, 1000);
  },
  
  // QTE超时处理
  onQTETimeout() {
    console.log('[钓鱼游戏] QTE超时');
    
    // 清除QTE计时器
    if (this.qteCountdown) {
      clearInterval(this.qteCountdown);
      this.qteCountdown = null;
    }
    
    // 重置QTE处理锁
    this.isProcessingQte = false;
    
    const fish = app.globalData.currentFish;
    if (!fish) return;
    
    // 判断鱼是否脱钩（根据QTEFail概率）
    if (Math.random() < fish.QTEFail) {
      // 鱼脱钩
      this.onFishEscaped();
    } else {
      // 恢复到fishon状态
      this.setData({ 
        state: 'fishon',
        qteData: {},
        qteOptions: []
      });
      
      // QTE结束后重新启动被动伤害和QTE触发定时器
      this.startFishOnTimers();
    }
  },
  
  // 玩家选择QTE选项
  onQteSelect(e) {
    // 如果当前不是QTE状态或者正在处理QTE选项，则忽略点击
    if (this.data.state !== 'qte' || this.isProcessingQte || !this.data.canCastRod) {
      console.log('[钓鱼游戏] QTE操作被屏蔽：状态不匹配或动画进行中');
      return;
    }
    
    // 设置处理锁，防止重复处理
    this.isProcessingQte = true;
    
    // 清除QTE计时器
    if (this.qteCountdown) {
      clearInterval(this.qteCountdown);
      this.qteCountdown = null;
    }
    
    const optionKey = e.currentTarget.dataset.option;
    const fish = app.globalData.currentFish;
    const qteData = this.data.qteData;
    
    // 增强防御性检查
    if (!fish || !qteData || !qteData.options || !optionKey || !qteData.options[optionKey]) {
      console.error('[钓鱼游戏] QTE选择处理错误');
      this.setData({ state: 'fishon', qteData: {}, qteOptions: [] });
      this.isProcessingQte = false; // 释放处理锁
      this.startFishOnTimers();
      return;
    }
    
    const option = qteData.options[optionKey];
    console.log('[钓鱼游戏] 玩家选择QTE选项:', option.description);
    
    // 计算对鱼的伤害
    const attackMultiplier = option.attack || 1;
    const damage = app.globalData.equipment.USER_ATT * attackMultiplier;
    fish.hp = Number((fish.hp - damage).toFixed(2));
    
    // 计算对钓线的伤害
    const lineDamage = option.linedam || 0;
    app.globalData.playerHP = Math.max(0, app.globalData.playerHP - lineDamage);
    
    // 更新数据
    app.globalData.currentFish = fish;
    this.setData({
      currentFish: fish,
      playerHP: app.globalData.playerHP
    });
    
    // 检查鱼是否被钓起或钓线是否断裂
    if (fish.hp <= 0) {
      this.onFishCaught();
    } else if (app.globalData.playerHP <= 0) {
      this.onFishEscaped();
    } else {
      // 恢复到fishon状态
      this.setData({ 
        state: 'fishon',
        qteData: {},
        qteOptions: []
      });
      
      // QTE结束后重新启动被动伤害和QTE触发定时器
      this.startFishOnTimers();
    }
    
    // 释放处理锁
    this.isProcessingQte = false;
  },
  
  // 鱼被钓起
  onFishCaught() {
    // 清除所有计时器
    this.clearAllTimers();
    
    const fish = app.globalData.currentFish;
    if (!fish) return;
    
    console.log('[钓鱼游戏] 鱼被钓起:', fish.name);
    
    // 增加已钓起的鱼数量
    app.globalData.fishCaught += 1;
    this.setData({
      fishCaught: app.globalData.fishCaught,
      state: 'waiting',
      qteStatusText: '成功钓起！',
      canCastRod: false // 禁用抛竿按钮，等待动画完成
    });
    
    // 延迟隐藏鱼状态组件，等待被动掉血和QTE判定动画结束
    setTimeout(() => {
      this.setData({
        showFishStatus: false
      });
    }, 1000);
    
    // 显示钓鱼成功提示
    wx.showToast({
      title: `成功钓起${fish.name}！`,
      icon: 'success',
      duration: 2000
    });
    
    // 扣除钓鱼时间
    this.updateFishingTime(fishtimeData.everyfishon);
    
    // 设置标记，表示需要在下次抛竿前触发AFT_FISHON事件
    app.globalData.shouldTriggerAftFishOn = true;
    
    // 检查钓鱼时间是否结束
    this.checkFishingTime();
  },
  
  // 鱼脱钩
  onFishEscaped() {
    // 清除所有计时器
    this.clearAllTimers();
    
    const fish = app.globalData.currentFish;
    if (!fish) return;
    
    console.log('[钓鱼游戏] 鱼脱钩:', fish.name);
    
    // 增加脱钩的鱼数量
    app.globalData.fishEscaped += 1;
    this.setData({
      fishEscaped: app.globalData.fishEscaped,
      state: 'waiting',
      qteStatusText: '鱼儿逃脱了！',
      canCastRod: false // 禁用抛竿按钮，等待动画完成
    });
    
    // 延迟隐藏鱼状态组件，等待被动掉血和QTE判定动画结束
    setTimeout(() => {
      this.setData({
        showFishStatus: false
      });
    }, 1000);
    
    // 确定逃脱原因并显示相应提示
    let escapeReason = '';
    if (app.globalData.playerHP <= 0) {
      // 鱼线血量为0导致的逃脱
      escapeReason = '鱼线崩断，鱼儿逃脱了，请选择更优的处理应对';
    } else {
      // QTE未完成导致的逃脱
      escapeReason = '没有及时采取应对措施，鱼儿有机会跑掉哦';
    }
    
    // 显示鱼脱钩提示
    wx.showToast({
      title: `${fish.name}脱钩了！`,
      icon: 'none',
      duration: 2000
    });
    
    // 显示逃脱原因
    setTimeout(() => {
      wx.showToast({
        title: escapeReason,
        icon: 'none',
        duration: 3000
      });
    }, 2100);
    
    // 扣除钓鱼时间
    this.updateFishingTime(fishtimeData.everyfishon);
    
    // 设置标记，表示需要在下次抛竿前触发AFT_FISHON事件
    app.globalData.shouldTriggerAftFishOn = true;
    
    // 检查钓鱼时间是否结束
    this.checkFishingTime();
  },
  
  // 页面卸载时清除所有计时器
  onUnload() {
    this.clearAllTimers();
  },
  
  // 返回准备页面并结束本次钓鱼
  onBackToPreparation() {
    console.log('[钓鱼游戏] 返回准备页面，结束本次钓鱼');
    
    // 清除所有计时器
    this.clearAllTimers();
    
    // 清空事件加成显示
    this.clearEventBuffsDisplay();
    
    // 重置钓鱼相关状态
    app.globalData.fishingTime = fishtimeData.Basetime;
    app.globalData.initialFishingTime = fishtimeData.Basetime;
    app.globalData.fishCaught = 0;
    app.globalData.fishEscaped = 0;
    app.globalData.playerHP = app.globalData.equipment.USER_LINEHP;
    app.globalData.eventModifiers = { rareFishBoost: 1, baseMultiplier: 1, timeModifier: 0, baitEffect: 1 };
    app.globalData.extraWeatherTriggered = false;
    app.globalData.currentFish = null;
    
    // 返回准备页面
    wx.redirectTo({
      url: '../preparation/preparation'
    });
  },
  
  // 清除所有计时器
  clearAllTimers() {
    if (this.passiveTimer) {
      clearInterval(this.passiveTimer);
      this.passiveTimer = null;
    }
    
    if (this.qteTimer) {
      clearInterval(this.qteTimer);
      this.qteTimer = null;
    }
    
    if (this.qteCountdown) {
      clearInterval(this.qteCountdown);
      this.qteCountdown = null;
    }
  },
  
  // 更新钓鱼时间
  updateFishingTime(change) {
    app.globalData.fishingTime += change;
    
    // 计算时间百分比（向上取整）
    let timePercent = Math.ceil((app.globalData.fishingTime / app.globalData.initialFishingTime) * 100);
    // 确保时间百分比不小于0
    if (timePercent <= 0) {
      timePercent = 0;
    }
    
    this.setData({
      fishingTime: app.globalData.fishingTime,
      fishingTimePercent: timePercent
    });
  },
  
  // 检查钓鱼时间是否结束
  checkFishingTime() {
    if (app.globalData.fishingTime <= 0) {
      console.log('[钓鱼游戏] 钓鱼时间结束，游戏结束');
      
      // 清除所有计时器
      this.clearAllTimers();
      
      // 清空事件加成显示
      this.clearEventBuffsDisplay();
      
      // 跳转到结果页面
      wx.redirectTo({
        url: '../result/result'
      });
    }
  },
  // 退出鱼咬状态，触发 AFT_FISHON 或 EXTRA 事件，并回到等待状态
  exitFishOn() {
    // 先触发 AFT_FISHON 事件（20% 概率）
    this.triggerAfterFishOnEvent(() => {
      // 如果未触发 AFT_FISHON，判断是否触发 EXTRA 天气事件（15%，且本局只触发一次）
      if (!app.globalData.extraWeatherTriggered) {
        this.triggerExtraWeatherEvent(() => {
          this.backToWaiting();
        });
      } else {
        this.backToWaiting();
      }
    });
  },
  
  backToWaiting() {
    // 清除当前鱼数据
    app.globalData.currentFish = null;
    this.setData({ currentFish: null, state: 'waiting', qteData: {}, qteOptions: [] });
    // 检查总时间是否结束
    this.checkFishingTime();
  },
  // 模拟 BEF_FISHON 事件（20% 概率）
  triggerBeforeFishOnEvent(callback) {
    let events = FishEvents.filter(e => e.type === 'BEF_FISHON');
    if (Math.random() < 0.2 && events.length > 0) {
      let evt = events[Math.floor(Math.random() * events.length)];
      wx.showModal({
        title: evt.name,
        content: evt.description,
        showCancel: false,
        success: () => {
          // 初始化事件修正器（如果不存在）
          if (!app.globalData.eventModifiers) {
            app.globalData.eventModifiers = { 
              rareFishBoost: 1, 
              baseMultiplier: 1, 
              timeModifier: 0, 
              baitEffect: 1 
            };
          }
          
          // 应用时间修正
          if (evt.effects.timeModifier) {
            app.globalData.eventModifiers.timeModifier += evt.effects.timeModifier;
            // 直接应用到钓鱼时间
            const timeChange = app.globalData.fishingTime * evt.effects.timeModifier;
            this.updateFishingTime(timeChange);
          }
          
          // 应用稀有度修正
          if (evt.effects.rareFishBoost) {
            app.globalData.eventModifiers.rareFishBoost = evt.effects.rareFishBoost;
          } else {
            app.globalData.eventModifiers.rareFishBoost = 1; // 复位稀有度修正
          }
          
          // 应用基础概率修正
          if (evt.effects.baseMultiplier) {
            app.globalData.eventModifiers.baseMultiplier *= evt.effects.baseMultiplier;
          }
          
          // 更新事件加成显示
          this.updateEventBuffsDisplay(evt);
          
          console.log('[钓鱼游戏] 触发BEF_FISHON事件:', evt.name, app.globalData.eventModifiers);
          callback();
        }
      });
    } else {
      callback();
    }
  },
  
  // 模拟 AFT_FISHON 事件（20% 概率）
  triggerAfterFishOnEvent(callback) {
    let events = FishEvents.filter(e => e.type === 'AFT_FISHON');
    if (Math.random() < 0.2 && events.length > 0) {
      let evt = events[Math.floor(Math.random() * events.length)];
      wx.showModal({
        title: evt.name,
        content: evt.description,
        showCancel: false,
        success: () => {
          // 初始化事件修正器（如果不存在）
          if (!app.globalData.eventModifiers) {
            app.globalData.eventModifiers = { 
              rareFishBoost: 1, 
              baseMultiplier: 1, 
              timeModifier: 0, 
              baitEffect: 1 
            };
          }
          
          // 应用时间修正
          if (evt.effects.timeModifier) {
            app.globalData.eventModifiers.timeModifier += evt.effects.timeModifier;
          }
          
          // 应用稀有度修正
          if (evt.effects.rareFishBoost) {
            app.globalData.eventModifiers.rareFishBoost = evt.effects.rareFishBoost;
          } else {
            app.globalData.eventModifiers.rareFishBoost = 1; // 复位稀有度修正
          }
          
          // 应用基础概率修正
          if (evt.effects.baseMultiplier) {
            app.globalData.eventModifiers.baseMultiplier *= evt.effects.baseMultiplier;
          }
          
          // 更新事件加成显示
          this.updateEventBuffsDisplay(evt);
          
          console.log('[钓鱼游戏] 触发AFT_FISHON事件:', evt.name, app.globalData.eventModifiers);
          callback();
        }
      });
    } else {
      callback();
    }
  },
  
  // 模拟附加天气事件（EXTRA，50% 概率，且本局只触发一次）
  triggerExtraWeatherEvent(callback) {
    // 检查是否已经触发过附加天气事件
    if (app.globalData.extraWeatherTriggered) {
      callback();
      return;
    }
    
    const extraWeathers = WeatherEvents.filter(e => e.type === 'EXTRA');
    // 增加触发概率从15%到50%，使玩家更容易遇到附加天气事件
    if (Math.random() < 1 && extraWeathers.length > 0) {
      let evt = extraWeathers[Math.floor(Math.random() * extraWeathers.length)];
      wx.showModal({
        title: evt.name,
        content: evt.description,
        showCancel: false,
        success: () => {
          // 初始化事件修正器（如果不存在）
          if (!app.globalData.eventModifiers) {
            app.globalData.eventModifiers = { 
              rareFishBoost: 1, 
              baseMultiplier: 1, 
              timeModifier: 0, 
              baitEffect: 1 
            };
          }
          
          // 调整 rareFishBoost
          if (evt.effects.rareFishBoost) {
            app.globalData.eventModifiers.rareFishBoost = evt.effects.rareFishBoost;
          }
          
          app.globalData.extraWeatherTriggered = true;
          
          // 更新事件加成显示
          this.updateEventBuffsDisplay(evt);
          
          console.log('[钓鱼游戏] 触发EXTRA天气事件:', evt.name, app.globalData.eventModifiers);
          callback();
        }
      });
    } else {
      callback();
    }
  },
  
  // 更新事件加成显示
  updateEventBuffsDisplay(event) {
    // 获取当前事件加成列表
    let eventBuffs = this.data.eventBuffs;
    let hasUpdate = false;
    
    // 处理稀有度加成
    if (event.effects.rareFishBoost) {
      const rarityBuff = eventBuffs.find(buff => buff.type === 'rareFishBoost');
      if (rarityBuff) {
        // 如果已存在相同类型的加成，累乘其值（而不是直接覆盖）
        rarityBuff.value *= event.effects.rareFishBoost.value;
        // 计算百分比变化，如果大于1则是增加，小于1则是减少
        const percentChange = (rarityBuff.value - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        rarityBuff.description = `稀有鱼出现概率 ${sign}${percentChange.toFixed(0)}%`;
        hasUpdate = true;
      } else {
        // 添加新的加成
        // 计算百分比变化
        const percentChange = (event.effects.rareFishBoost.value - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        eventBuffs.push({
          type: 'rareFishBoost',
          value: event.effects.rareFishBoost.value,
          description: `稀有鱼出现概率 ${sign}${percentChange.toFixed(0)}%`
        });
        hasUpdate = true;
      }
    }
    
    // 处理基础概率修正
    if (event.effects.baseMultiplier) {
      const baseBuff = eventBuffs.find(buff => buff.type === 'baseMultiplier');
      if (baseBuff) {
        // 如果已存在相同类型的加成，累乘其值
        baseBuff.value *= event.effects.baseMultiplier;
        // 计算百分比变化
        const percentChange = (baseBuff.value - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        baseBuff.description = `鱼儿基础概率 ${sign}${percentChange.toFixed(0)}%`;
        hasUpdate = true;
      } else {
        // 添加新的加成
        // 计算百分比变化
        const percentChange = (event.effects.baseMultiplier - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        eventBuffs.push({
          type: 'baseMultiplier',
          value: event.effects.baseMultiplier,
          description: `鱼儿基础概率 ${sign}${percentChange.toFixed(0)}%`
        });
        hasUpdate = true;
      }
    }
    
    // 处理时间修正
    if (event.effects.timeModifier) {
      const timeBuff = eventBuffs.find(buff => buff.type === 'timeModifier');
      if (timeBuff) {
        // 如果已存在相同类型的加成，更新其值
        timeBuff.value += event.effects.timeModifier;
        const sign = timeBuff.value > 0 ? '+' : '';
        timeBuff.description = `钓鱼时间 ${sign}${(timeBuff.value * 100).toFixed(0)}%`;
        hasUpdate = true;
      } else {
        // 添加新的加成
        const sign = event.effects.timeModifier > 0 ? '+' : '';
        eventBuffs.push({
          type: 'timeModifier',
          value: event.effects.timeModifier,
          description: `钓鱼时间 ${sign}${(event.effects.timeModifier * 100).toFixed(0)}%`
        });
        hasUpdate = true;
      }
    }
    
    // 处理鱼饵效果
    if (event.effects.baitEffect) {
      const baitBuff = eventBuffs.find(buff => buff.type === 'baitEffect');
      if (baitBuff) {
        // 如果已存在相同类型的加成，累乘其值
        baitBuff.value *= event.effects.baitEffect;
        // 计算百分比变化
        const percentChange = (baitBuff.value - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        baitBuff.description = `鱼饵效率 ${sign}${percentChange.toFixed(0)}%`;
        hasUpdate = true;
      } else {
        // 添加新的加成
        // 计算百分比变化
        const percentChange = (event.effects.baitEffect - 1) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        eventBuffs.push({
          type: 'baitEffect',
          value: event.effects.baitEffect,
          description: `鱼饵效率 ${sign}${percentChange.toFixed(0)}%`
        });
        hasUpdate = true;
      }
    }
    
    // 更新数据
    if (hasUpdate) {
      this.setData({
        eventBuffs: eventBuffs,
        hasEventBuffs: eventBuffs.length > 0
      });
    }
  },
  
  // 清空事件加成显示
  clearEventBuffsDisplay() {
    this.setData({
      eventBuffs: [],
      hasEventBuffs: false
    });
  },
  
  // 在页面卸载时清空事件加成
  onUnload() {
    this.clearAllTimers();
    this.clearEventBuffsDisplay();
  },
  
  // 清除所有计时器
  clearAllTimers() {
    if (this.passiveTimer) {
      clearInterval(this.passiveTimer);
      this.passiveTimer = null;
    }
    
    if (this.qteTimer) {
      clearInterval(this.qteTimer);
      this.qteTimer = null;
    }
    
    if (this.qteCountdown) {
      clearInterval(this.qteCountdown);
      this.qteCountdown = null;
    }
  },
  
  // 更新钓鱼时间
  updateFishingTime(change) {
    app.globalData.fishingTime += change;
    
    // 计算时间百分比（向上取整）
    let timePercent = Math.ceil((app.globalData.fishingTime / app.globalData.initialFishingTime) * 100);
    // 确保时间百分比不小于0
    if (timePercent <= 0) {
      timePercent = 0;
    }
    
    this.setData({
      fishingTime: app.globalData.fishingTime,
      fishingTimePercent: timePercent
    });
  },
  
  // 检查钓鱼时间是否结束
  checkFishingTime() {
    if (app.globalData.fishingTime <= 0) {
      console.log('[钓鱼游戏] 钓鱼时间结束，游戏结束');
      
      // 清除所有计时器
      this.clearAllTimers();
      
      // 清空事件加成显示
      this.clearEventBuffsDisplay();
      
      // 跳转到结果页面
      wx.redirectTo({
        url: '../result/result'
      });
    }
  },
  // 退出鱼咬状态，触发 AFT_FISHON 或 EXTRA 事件，并回到等待状态
  exitFishOn() {
    // 先触发 AFT_FISHON 事件（20% 概率）
    this.triggerAfterFishOnEvent(() => {
      // 如果未触发 AFT_FISHON，判断是否触发 EXTRA 天气事件（15%，且本局只触发一次）
      if (!app.globalData.extraWeatherTriggered) {
        this.triggerExtraWeatherEvent(() => {
          this.backToWaiting();
        });
      } else {
        this.backToWaiting();
      }
    });
  },
  
  backToWaiting() {
    // 清除当前鱼数据
    app.globalData.currentFish = null;
    this.setData({ currentFish: null, state: 'waiting', qteData: {}, qteOptions: [] });
    // 检查总时间是否结束
    this.checkFishingTime();
  }
});
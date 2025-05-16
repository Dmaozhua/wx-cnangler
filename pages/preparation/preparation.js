// pages/preparation/preparation.js
const app = getApp();
import { WeatherEvents } from '../../data/FishData2/WeatherEvents';
import { WaterData } from '../../data/FishData2/WaterData';
import { FishData } from '../../data/FishData2/FishDataAll';
import { Equipment } from '../../data/FishData2/Equipment';
import { fishtimeData } from '../../data/FishData2/fishtimeData';

Page({
  data: {
    weather: {},
    water: {},
    habitatsList: [],
    selectedHabitat: ''
  },
  onLoad() {
    // 初始化全局装备数据
    if (!app.globalData.equipment) {
      app.globalData.equipment = Equipment;
    }

    // 随机选择基础天气（type 为 BASE）
    const baseWeathers = WeatherEvents.filter(item => item.type === 'BASE');
    const weather = baseWeathers[Math.floor(Math.random() * baseWeathers.length)];

    // 随机选择水域
    const water = WaterData[Math.floor(Math.random() * WaterData.length)];

    // 从当前水域的 fishProbabilities 中获取有效的栖息地列表
    let habitats = Object.keys(water.fishProbabilities);
    let shuffled = habitats.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, Math.min(3, habitats.length));
    // 默认选中第一个
    let selectedHabitat = selected[0];
    
    // 创建栖息地列表，包含键名和中文名称
    const habitatsListWithNames = selected.map(key => ({
      key: key,
      name: water.habitats[key] || key // 使用中文名称，如果没有则使用键名
    }));
    
    console.log('[钓鱼准备] 有效栖息地列表:', habitats);

    // 保存在全局数据中
    app.globalData.weather = weather;
    app.globalData.water = water;
    app.globalData.habitat = selectedHabitat;
    
    // 重置相关数据
    app.globalData.fishingTime = fishtimeData.Basetime;
    app.globalData.initialFishingTime = fishtimeData.Basetime; // 保存初始时间值，用于计算百分比
    app.globalData.fishCaught = 0;
    app.globalData.fishEscaped = 0;
    app.globalData.playerHP = app.globalData.equipment.USER_LINEHP;
    app.globalData.eventModifiers = { rareFishBoost: 1, baseMultiplier: 1, timeModifier: 0, baitEffect: 1 };
    app.globalData.extraWeatherTriggered = false;
    app.globalData.currentBait = { id: 'BREADone', name: '面包饵', effect: 1.0 }; // 默认鱼饵

    console.log('[钓鱼准备] 初始化数据:', {
      weather: weather.name,
      water: water.name,
      habitat: selectedHabitat,
      fishingTime: app.globalData.fishingTime
    });

    this.setData({
      weather,
      water,
      habitatsList: habitatsListWithNames,
      selectedHabitat
    });
  },
  onHabitatChange(e) {
    this.setData({
      selectedHabitat: e.detail.value
    });
    app.globalData.habitat = e.detail.value;
    console.log('[钓鱼准备] 选择钓点:', e.detail.value);
  },
  onRandomAgain() {
    console.log('[钓鱼准备] 再次随机');
    
    // 随机选择基础天气（type 为 BASE）
    const baseWeathers = WeatherEvents.filter(item => item.type === 'BASE');
    const weather = baseWeathers[Math.floor(Math.random() * baseWeathers.length)];

    // 随机选择水域
    const water = WaterData[Math.floor(Math.random() * WaterData.length)];

    // 从当前水域的 fishProbabilities 中获取有效的栖息地列表
    let habitats = Object.keys(water.fishProbabilities);
    let shuffled = habitats.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, Math.min(3, habitats.length));
    // 默认选中第一个
    let selectedHabitat = selected[0];
    
    // 创建栖息地列表，包含键名和中文名称
    const habitatsListWithNames = selected.map(key => ({
      key: key,
      name: water.habitats[key] || key // 使用中文名称，如果没有则使用键名
    }));
    
    console.log('[钓鱼准备] 重新随机:', {
      weather: weather.name,
      water: water.name,
      habitat: selectedHabitat
    });

    // 保存在全局数据中
    app.globalData.weather = weather;
    app.globalData.water = water;
    app.globalData.habitat = selectedHabitat;
    
    // 更新页面数据
    this.setData({
      weather,
      water,
      habitatsList: habitatsListWithNames,
      selectedHabitat
    });
    
    // 显示提示
    wx.showToast({
      title: '已重新随机',
      icon: 'success',
      duration: 1500
    });
  },
  onStart() {
    console.log('[钓鱼准备] 开始钓鱼');
    wx.redirectTo({
      url: '../fishing/fishing'
    });
  },
  
  // 返回主页
  onBackToHome() {
    console.log('[钓鱼准备] 返回主页');
    wx.switchTab({
      url: '../home/home'
    });
  }
});

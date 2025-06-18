// pages/fishing/fishing.js
const app = getApp();
import { FishData, RARITY_MULTIPLIER } from '../../data/FishData2/FishDataAll';
import { FishEvents, FishEventsProbability, ExtraEventConfig } from '../../data/FishData2/FishEvents';
import { QTEData } from '../../data/FishData2/QTEData';
import { fishtimeData } from '../../data/FishData2/fishtimeData';
import { WeatherEvents } from '../../data/FishData2/WeatherEvents';
import { Equipment } from '../../data/FishData2/Equipment';
import { updateFishCollection } from '../../data/FishData2/FishCollection';
import { updateEventCollection } from '../../data/FishData2/EventCollection';


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
        sessionFishEscaped: 0, // 本局脱钩数量
        // 新增事件加成列表
        eventBuffs: [],
        hasEventBuffs: false,
        // 鱼状态组件控制
        showFishStatus: false,
        qteStatusText: '',
        canCastRod: true, // 控制抛竿按钮是否可点击
        fishStatusAnimating: false, // 记录fish-status组件动画状态
        // 钓鱼成功弹窗相关
        showFishCaughtPopup: false,
        caughtFish: {
            name: '',
            strengthValue: 0,
            battleTime: '', // 搏鱼时间
            strengthRatio: 0 // 强度比
        },
        fishBiteTime: 0, // 记录鱼咬钩的时间戳
        // 自定义弹窗相关
        showCustomModal: false,
        customModalData: {
            title: '',
            content: ''
        },
        // 自定义tooltip相关
        showCustomTooltip: false,
        customTooltipData: {
            content: ''
        }
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
        // 初始化事件屏蔽标记
        app.globalData.blockAFTEvent = false;
        app.globalData.blockBEFEvent = false;
        
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
        
        // 初始化新增的效果变量
        app.globalData.nextFishRarity = null;       // 下一条鱼的稀有度
        app.globalData.nextFishStrength = null;     // 下一条鱼的体型变化系数
        app.globalData.passiveDamageBoost = null;   // 被动伤害提升系数
        app.globalData.qteDurationChange = null;    // QTE判定时间变化系数
        app.globalData.qteDamageChange = null;      // QTE伤害变化系数

        // 重置已触发事件记录，用于新的钓鱼会话
        app.globalData.triggeredEvents = [];

        // AFT_FISHON事件现在直接在钓鱼结束后触发，不需要标记

        // 初始化抛竿计数器为0，用于跟踪游戏中抛竿次数
        app.globalData.castCount = 0;

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

        // 更新显示数据，初始设置背景透明度为0，实现淡入效果
        this.setData({
            fishingTime: app.globalData.fishingTime,
            fishingTimePercent: timePercent,
            playerHP: app.globalData.playerHP,
            state: 'waiting',
            fishCaught: app.globalData.fishCaught || 0,
            backgroundImage: backgroundImage,
            fishEscaped: app.globalData.fishEscaped || 0,
            sessionFishEscaped: 0, // 每局开始重置为0
            sceneBgFadeIn: true // 开始淡入动画
        });
        
        // 不再重置sceneBgFadeIn，保持背景图片可见
        // setTimeout(() => {
        //     this.setData({
        //         sceneBgFadeIn: false // 重置淡入状态
        //     });
        // }, 500); // 淡入动画时长

        console.log('[钓鱼游戏] 页面加载完成', {
            state: this.data.state,
            weather: app.globalData.weather.name,
            water: app.globalData.water.name,
            habitat: app.globalData.habitat,
            fishingTime: app.globalData.fishingTime,
            fishingTimePercent: timePercent
        });
        
        // 触发钓鱼功能使用成就检查
        if (app.checkFeatureAchievement) {
            app.checkFeatureAchievement('fishing');
        }
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
            canCastRod: !isLocked, // 当locked为true时，禁用抛竿按钮
            fishStatusAnimating: isLocked // 记录fish-status动画状态
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

        // 如果钓鱼成功弹窗正在显示，先关闭它
        if (this.data.showFishCaughtPopup) {
            this.setData({
                showFishCaughtPopup: false
            });
            // 短暂延迟后再继续抛竿操作
            setTimeout(() => {
                this.processCastRod();
            }, 300);
            return;
        }

        // 直接处理抛竿
        this.processCastRod();
    },

    // 处理抛竿逻辑
    processCastRod() {
        // 增加抛竿计数
        app.globalData.castCount = (app.globalData.castCount || 0) + 1;
        console.log('[钓鱼游戏] 当前抛竿次数:', app.globalData.castCount);

        // 第一次抛竿不触发任何事件，直接判断鱼是否上钩
        if (app.globalData.castCount === 1) {
            console.log('[钓鱼游戏] 第一次抛竿，跳过事件触发');
            this.decideBite();
            return;
        }
        
        // 检查是否需要屏蔽BEF_FISHON事件
        if (app.globalData.blockBEFEvent) {
            console.log('[钓鱼游戏] 屏蔽BEF_FISHON事件，直接判断鱼是否上钩');
            app.globalData.blockBEFEvent = false; // 重置屏蔽标记
            this.decideBite();
            return;
        }

        // 在等待状态下触发可能BEF_FISHON事件
        this.triggerBeforeFishOnEvent(() => {
            this.decideBite();
        });
    },
    // 模拟抛竿后判断是否有鱼上钩
    decideBite() {
        const water = app.globalData.water;
        const habitat = app.globalData.habitat;
        const weather = app.globalData.weather;
        const bait = app.globalData.currentBait || { id: 'BREADone', effect: 1.0 };
        const eventModifiers = app.globalData.eventModifiers || { rareFishBoost: 1, baseMultiplier: 1, timeModifier: 0, baitEffect: 1 };

        // 检查是否有指定稀有度的鱼效果
        if (app.globalData.nextFishRarity) {
            console.log('[钓鱼游戏] 触发指定稀有度鱼效果:', app.globalData.nextFishRarity);
            
            // 获取当前水域当前栖息地中存在的鱼类ID列表
            const currentWaterFishIds = Object.keys(app.globalData.water.fishProbabilities[app.globalData.habitat] || {})
                .filter(fishId => fishId !== 'NONE' && (app.globalData.water.fishProbabilities[app.globalData.habitat][fishId] || 0) > 0);
            
            // 从当前水域的鱼类中筛选指定稀有度的鱼
            const targetRarityFishes = FishData.filter(fish => 
                fish.rarity === app.globalData.nextFishRarity && 
                currentWaterFishIds.includes(fish.id) &&
                fish.habitats.includes(app.globalData.habitat) &&
                fish.baitPref.includes((app.globalData.currentBait || { id: 'BREADone' }).id)
            );
            
            if (targetRarityFishes.length > 0) {
                // 随机选择一条指定稀有度的鱼
                const randomIndex = Math.floor(Math.random() * targetRarityFishes.length);
                const selectedFish = targetRarityFishes[randomIndex];
                
                // 清除效果，只对一次抛竿生效
                app.globalData.nextFishRarity = null;
                
                // 优化1：从事件加成显示中移除该一次性效果
                this.removeEventBuffDisplay('nextFishRarity');
                
                console.log('[钓鱼游戏] 选中指定稀有度鱼:', selectedFish.name);
                this.startFishOn(selectedFish);
                return;
            } else {
                console.log('[钓鱼游戏] 没有找到符合条件的指定稀有度鱼，使用正常概率');
                // 清除效果
                app.globalData.nextFishRarity = null;
                
                // 优化1：从事件加成显示中移除该一次性效果
                this.removeEventBuffDisplay('nextFishRarity');
            }
        }

        // 正常流程：计算各种鱼的概率
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
            this.showCustomTooltip('没有鱼上钩');
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
        // 记录鱼咬钩的时间戳
        const biteTime = Date.now();
        this.setData({
            fishBiteTime: biteTime
        });
        
        // 随机计算鱼的 strength 数值（保留两位小数）
        let min = fish.strength[0], max = fish.strength[1];
        let strength;
        
        // 检查是否有下一条鱼的strength变化效果
        if (app.globalData.nextFishStrength) {
            // 先正常随机一个strength值
            let baseStrength = Number((Math.random() * (max - min) + min).toFixed(2));
            // 应用变化系数，但确保不超出原有设定的strength区间
            strength = Number((baseStrength * app.globalData.nextFishStrength).toFixed(2));
            // 确保不超出范围
            strength = Math.max(min, Math.min(max, strength));
            // 清除效果，只对一条鱼生效
            app.globalData.nextFishStrength = null;
            // 优化1：从事件加成显示中移除该一次性效果
            this.removeEventBuffDisplay('nextFishStrength');
            console.log('[钓鱼游戏] 应用鱼体型变化效果:', {
                原始体型: baseStrength,
                变化后体型: strength
            });
        } else {
            // 正常随机
            strength = Number((Math.random() * (max - min) + min).toFixed(2));
        }
        
        // 计算鱼的总血量 = BaseHP * strength（保留两位小数）
        fish.hp = Number((fish.BaseHP * strength).toFixed(2));
        fish.strengthVal = strength;
        // 计算强度比（当前强度值在范围内的百分比）
        fish.strengthRatio = Number((((strength - min) / (max - min)) * 100).toFixed(0));
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
        // wx.showToast({
        //     title: `${fish.name}上钩了！`,
        //     icon: 'success'
        // });

        // 开启被动伤害定时器以及 QTE 计时器
        this.startFishOnTimers();
    },

    startFishOnTimers() {
        // 记录上次QTE触发时间
        this.lastQTETime = Date.now();
        
        // 定时器：每 0.5 秒给鱼扣除被动伤害（10 点）
        this.passiveTimer = setInterval(() => {
            if (this.data.state !== 'fishon') return; // QTE状态暂停被动伤害

            let fish = app.globalData.currentFish;
            if (!fish) return;
            
            // 应用被动伤害提升效果
            let passiveDamage = Equipment.USER_PassiveDamage; // 基础被动伤害值
            if (app.globalData.passiveDamageBoost) {
                passiveDamage = Number((passiveDamage * app.globalData.passiveDamageBoost).toFixed(2));
                console.log('[钓鱼游戏] 应用被动伤害提升效果:', {
                    基础被动伤害: Equipment.USER_PassiveDamage,
                    提升系数: app.globalData.passiveDamageBoost,
                    实际被动伤害: passiveDamage
                });
            }
            
            fish.hp = Number((fish.hp - passiveDamage).toFixed(2));

            app.globalData.currentFish = fish;
            this.setData({ currentFish: fish });

            // 检查鱼是否被钓起
            if (fish.hp <= 0) {
                this.onFishCaught();
            }
        }, 500);

        // 获取鱼的血量，根据血量调整QTE触发频率
        const fish = app.globalData.currentFish;
        if (!fish) return;
        
        // 计算基础QTE间隔时间：血量越高，间隔越短（更频繁触发）
        // 基础间隔为3000ms，最小为2000ms
        const baseInterval = Math.max(2000, 3000 - (fish.hp / 1000));
        console.log('[钓鱼游戏] QTE触发频率设置:', {
            鱼名称: fish.name,
            鱼血量: fish.hp.toFixed(2),
            基础间隔: baseInterval.toFixed(2) + 'ms'
        });
        
        // 定时器：根据鱼的血量动态调整QTE触发频率
        this.qteTimer = setInterval(() => {
            if (this.data.state !== 'fishon') return;

            // 随机延迟触发QTE，增加游戏的不确定性（最大随机延迟为基础间隔的一半）
            const maxRandomDelay = baseInterval / 2;
            const randomDelay = Math.random() * maxRandomDelay;
            
            setTimeout(() => {
                if (this.data.state !== 'fishon') return; // 再次检查状态，防止在延迟期间状态已改变
                
                // 计算并记录QTE触发间隔
                const now = Date.now();
                const interval = now - this.lastQTETime;
                this.lastQTETime = now;
                
                console.log('[钓鱼游戏] QTE触发间隔:', {
                    鱼名称: fish.name,
                    当前血量: fish.hp.toFixed(2),
                    间隔时间: interval + 'ms'
                });
                
                // 暂停被动伤害，进入 QTE 状态
                this.triggerQTE();
            }, randomDelay);
        }, baseInterval);
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

        // 应用QTE判定时间变化效果
        let qteDuration = qteData.duration;
        if (app.globalData.qteDurationChange) {
            qteDuration = Number((qteDuration * app.globalData.qteDurationChange).toFixed(2));
            console.log('[钓鱼游戏] 应用QTE判定时间变化效果:', {
                原始判定时间: qteData.duration,
                变化系数: app.globalData.qteDurationChange,
                实际判定时间: qteDuration
            });
        }

        // 准备QTE选项，并应用QTE伤害变化效果
        const qteOptions = [];
        for (const [key, option] of Object.entries(qteData.options)) {
            // 深拷贝选项，避免修改原始数据
            let newOption = {
                key: key,
                description: option.description,
                attack: option.attack,
                linedam: option.linedam
            };
            
            // 应用QTE伤害变化效果
            if (app.globalData.qteDamageChange) {
                newOption.attack = Number((option.attack * app.globalData.qteDamageChange).toFixed(2));
                console.log('[钓鱼游戏] 应用QTE伤害变化效果:', {
                    选项: option.description,
                    原始伤害倍率: option.attack,
                    变化系数: app.globalData.qteDamageChange,
                    实际伤害倍率: newOption.attack
                });
            }
            
            qteOptions.push(newOption);
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
            qteData: {...qteData, duration: qteDuration}, // 使用修改后的持续时间
            qteOptions: qteOptions,
            qteTimeLeft: qteDuration,
            qteStatusText: qteData.description // 更新鱼状态组件的QTE文本
        });

        // 启动QTE倒计时
        this.startQTETimer(qteDuration);
    },

    // 启动QTE倒计时（精确到毫秒）
    startQTETimer(duration) {
        // 清除之前的计时器
        if (this.qteCountdown) {
            clearInterval(this.qteCountdown);
        }

        // 将秒转换为毫秒
        let timeLeftMs = duration * 1000;
        const startTime = Date.now();
        const endTime = startTime + timeLeftMs;

        // 每100毫秒更新倒计时，提高精度
        this.qteCountdown = setInterval(() => {
            const now = Date.now();
            timeLeftMs = Math.max(0, endTime - now);
            
            // 计算秒和毫秒部分
            const seconds = Math.floor(timeLeftMs / 1000);
            const milliseconds = Math.floor((timeLeftMs % 1000) / 10);
            
            // 格式化显示，例如：5.45秒
            const formattedTime = seconds + '.' + (milliseconds < 10 ? '0' + milliseconds : milliseconds);
            
            this.setData({
                qteTimeLeft: formattedTime
            });

            if (timeLeftMs <= 0) {
                clearInterval(this.qteCountdown);
                this.onQTETimeout();
            }
        }, 50); // 更新频率提高到50毫秒一次
    },

    // QTE超时处理
    onQTETimeout() {
        console.log('[钓鱼游戏] QTE超时');

        // 先保存当前状态，确保在处理前状态是QTE
        const currentState = this.data.state;
        if (currentState !== 'qte') {
            console.log('[钓鱼游戏] QTE超时处理被跳过：当前不是QTE状态');
            return;
        }

        // 立即更新状态，防止后续事件处理错误
        this.setData({ state: 'fishon' });

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
            // 更新剩余QTE数据
            this.setData({
                qteData: {},
                qteOptions: []
            });

            // QTE结束后重新启动被动伤害和QTE触发定时器
            this.startFishOnTimers();
        }
    },

    // 玩家选择QTE选项
    onQteSelect(e) {
        // 再次检查当前是否为QTE状态，防止在QTE界面消失后仍处理点击事件
        // 如果当前不是QTE状态或者正在处理QTE选项，则忽略点击
        if (this.data.state !== 'qte' || this.isProcessingQte || !this.data.canCastRod) {
            console.log('[钓鱼游戏] QTE操作被屏蔽：状态不匹配或动画进行中');
            return;
        }

        // 获取选项信息，提前进行防御性检查
        const optionKey = e.currentTarget.dataset.option;
        const fish = app.globalData.currentFish;
        const qteData = this.data.qteData;

        // 增强防御性检查 - 在设置处理锁之前进行
        if (!fish || !qteData || !qteData.options || !optionKey || !qteData.options[optionKey]) {
            console.error('[钓鱼游戏] QTE选择处理错误(无效数据)');
            return;
        }

        // 设置处理锁，防止重复处理
        this.isProcessingQte = true;

        // 清除QTE计时器
        if (this.qteCountdown) {
            clearInterval(this.qteCountdown);
            this.qteCountdown = null;
        }

        // 再次检查当前状态，防止在处理过程中状态已经改变
        if (this.data.state !== 'qte') {
            console.log('[钓鱼游戏] QTE选择处理被中断：状态已改变');
            this.isProcessingQte = false;
            return;
        }

        const option = qteData.options[optionKey];
        console.log('[钓鱼游戏] 玩家选择QTE选项:', option.description);

        // 立即更新状态为fishon，防止后续事件处理错误
        this.setData({ state: 'fishon' });

        // 计算对鱼的伤害
        const attackMultiplier = option.attack || 1;
        const damage = app.globalData.equipment.USER_ATT * attackMultiplier;
        const oldFishHp = fish.hp;
        fish.hp = Number((fish.hp - damage).toFixed(2));

        // 计算对钓线的伤害 - 基于百分比和鱼的强度
        const lineDamage = option.linedam || 0; // 现在linedam是百分比值
        const fishStrength = fish.strengthVal || 1; // 获取鱼的强度系数
        // 计算实际伤害：钓线基础血量 * linedam百分比 * 鱼的强度           
        //const actualDamage = app.globalData.equipment.USER_LINEHP * lineDamage * fishStrength;
        // 优化后 计算实际伤害：钓线基础血量 * linedam百分比 * 鱼的强度
        const actualDamage = 20 * lineDamage * fishStrength;

        const oldPlayerHP = app.globalData.playerHP;
        app.globalData.playerHP = Math.max(0, app.globalData.playerHP - actualDamage);
        
        // 添加日志输出，记录伤害和剩余血量
        console.log('[钓鱼游戏] QTE效果 - 鱼:', {
          操作: option.description,
          伤害倍率: attackMultiplier,
          造成伤害: damage.toFixed(2),
          原始血量: oldFishHp.toFixed(2),
          剩余血量: fish.hp.toFixed(2)
        });
        console.log('[钓鱼游戏] QTE效果 - 钓线:', {
          损伤系数: lineDamage,
          鱼力度: fishStrength.toFixed(2),
          造成损伤: actualDamage.toFixed(2),
          原始耐久: oldPlayerHP.toFixed(2),
          剩余耐久: app.globalData.playerHP.toFixed(2)
        });

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
            // 清空QTE相关数据
            this.setData({
                qteData: {},
                qteOptions: []
            });

            // QTE结束后重新启动被动伤害和QTE触发定时器
            this.startFishOnTimers();
        }

        // 释放处理锁
        this.isProcessingQte = false;
    },

    // 处理QTE触摸结束事件
    onQteTouchEnd(e) {
        // 如果当前不是QTE状态，则忽略触摸结束事件
        // 这是为了防止在QTE界面消失后，用户松开手指时触发错误
        if (this.data.state !== 'qte') {
            console.log('[钓鱼游戏] QTE触摸结束被屏蔽：当前不是QTE状态');
            return;
        }

        // 如果已经在处理QTE选项，则忽略触摸结束事件
        if (this.isProcessingQte) {
            console.log('[钓鱼游戏] QTE触摸结束被屏蔽：正在处理QTE选项');
            return;
        }

        // 如果触摸结束事件没有关联的选项数据，则忽略
        const optionKey = e.currentTarget.dataset.option;
        if (!optionKey) {
            console.log('[钓鱼游戏] QTE触摸结束被屏蔽：无效的选项数据');
            return;
        }

        // 调用QTE选择处理函数
        this.onQteSelect(e);
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
        
        // 检查是否钓起指定条数的鱼，如果是则触发EXTRA天气事件
        if (app.globalData.fishCaught === ExtraEventConfig.triggerFishCount) {
            console.log(`[钓鱼游戏] 已钓起第${ExtraEventConfig.triggerFishCount}条鱼，将触发EXTRA天气事件`);
            // 设置标记，屏蔽AFT_FISHON事件触发
            app.globalData.blockAFTEvent = true;
            // 设置标记，屏蔽下一次抛竿的BEF_FISHON事件触发
            app.globalData.blockBEFEvent = true;
        }

        // 优化3：延长等待时间，确保血条动画完成后再隐藏鱼状态组件
        setTimeout(() => {
            this.setData({
                showFishStatus: false
            });
        }, 1500); // 从1000ms增加到1500ms

        // 获取鱼的强度值（如果是范围则取随机值或平均值）
        let strengthValue = fish.strength;
        let isExtremeStrength = false; // 标记是否为极值强度
        
        if (Array.isArray(fish.strength)) {
            // 如果是范围，取实际钓到的值或计算平均值
            strengthValue = fish.strengthVal || ((fish.strength[0] + fish.strength[1]) / 2).toFixed(1);
            
            // 判断是否为极值（最大值或最小值）
            if (fish.strengthVal === fish.strength[0] || fish.strengthVal === fish.strength[1]) {
                isExtremeStrength = true;
                console.log('[钓鱼游戏] 极值强度鱼！', fish.strengthVal);
            }
        }

        // 计算搏鱼时间（从鱼咬钩到钓起的时间）
        const caughtTime = Date.now();
        const battleDuration = caughtTime - this.data.fishBiteTime; // 毫秒
        let battleTimeDisplay = '';
        
        if (battleDuration < 60000) { // 小于1分钟，用秒显示
            battleTimeDisplay = Math.floor(battleDuration / 1000) + '秒';
        } else { // 大于1分钟，显示几分几秒
            const minutes = Math.floor(battleDuration / 60000);
            const seconds = Math.floor((battleDuration % 60000) / 1000);
            battleTimeDisplay = minutes + '分' + seconds + '秒';
        }

        // 显示自定义钓鱼成功弹窗
        this.setData({
            caughtFish: {
                name: fish.name,
                strengthValue: strengthValue,
                battleTime: battleTimeDisplay,
                strengthRatio: fish.strengthRatio || 0,
                isExtremeStrength: isExtremeStrength // 添加极值标志
            },
            showFishCaughtPopup: true
        });

        // 扣除钓鱼时间
        this.updateFishingTime(fishtimeData.everyfishon);

        // 更新鱼类图鉴收集数据
        updateFishCollection(fish.id, fish.strengthVal);
        console.log('[钓鱼游戏] 更新图鉴:', fish.id, fish.strengthVal);
        
        // 检查图鉴解锁成就（type 14）
        this.checkCollectionAchievements();

        // 检查成就
        this.checkFishingAchievements(fish);
        
        // 检查type 13成就：累计钓到特定稀有度的鱼
        this.checkRarityAchievements(fish);

        // AFT_FISHON事件将在弹窗关闭后触发
        // 检查钓鱼时间是否结束
        this.checkFishingTime();
    },

    // 检查钓鱼相关成就
    checkFishingAchievements(fish) {
        if (!fish) return;
        
        const { achievements } = require('../../data/achievements.js');
        
        // 检查type 8成就：累计钓到某一种鱼多少次
        const fishTypeAchievements = achievements.filter(a => a.type === 8);
        fishTypeAchievements.forEach(achievement => {
            if (Array.isArray(achievement.value) && achievement.value.length >= 2) {
                const targetFishId = achievement.value[0];
                const targetCount = achievement.value[1];
                
                if (fish.id === targetFishId) {
                    // 检查成就是否已解锁
                    const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                        ? app.globalData.userAchievements[achievement.id] 
                        : { progress: 0, unlockTime: null };
                    
                    // 只有在成就未解锁时才更新计数和进度
                    if (!achievementData.unlockTime) {
                        // 更新该鱼类的钓获次数
                        const storageKey = `fishCaught_${targetFishId}`;
                        let currentCount = wx.getStorageSync(storageKey) || 0;
                        currentCount += 1;
                        wx.setStorageSync(storageKey, currentCount);
                        
                        // 更新成就进度
                        this.updateFishingAchievement(achievement.id, currentCount);
                        
                        console.log(`[成就检查] 钓到${targetFishId}，当前次数：${currentCount}/${targetCount}`);
                    } else {
                        console.log(`[成就检查] ${achievement.title} 已解锁，跳过重复处理`);
                    }
                }
            }
        });
        
        // 检查type 10成就：钓到特定体型比的鱼
        const strengthAchievements = achievements.filter(a => a.type === 10);
        strengthAchievements.forEach(achievement => {
            if (fish.strengthRatio !== undefined && fish.strengthRatio !== null) {
                // 新格式：value为[y,x]，y是体型比例阈值(0-1)，x是需要钓到的数量
                if (Array.isArray(achievement.value) && achievement.value.length === 2) {
                    const [thresholdRatio, targetCount] = achievement.value;
                    const thresholdPercent = thresholdRatio * 100; // 转换为百分比
                    
                    // 检查当前鱼的体型比是否满足条件
                    let meetsCondition = false;
                    if (thresholdRatio === 1 && fish.strengthRatio >= 100) {
                        // 体型比100%的鱼
                        meetsCondition = true;
                    } else if (thresholdRatio === 0 && fish.strengthRatio <= 0) {
                        // 体型比0%的鱼
                        meetsCondition = true;
                    } else if (thresholdRatio > 0 && thresholdRatio < 1) {
                        // 其他体型比例
                        meetsCondition = fish.strengthRatio >= thresholdPercent;
                    }
                    
                    if (meetsCondition) {
                        // 使用独立的存储键来跟踪每个体型比例成就的进度
                        const storageKey = `sizeRatio_${thresholdRatio}`;
                        let currentCount = wx.getStorageSync(storageKey) || 0;
                        currentCount++;
                        wx.setStorageSync(storageKey, currentCount);
                        
                        console.log(`[成就检查] 钓到体型比${fish.strengthRatio}%的鱼，当前${thresholdPercent}%体型比鱼类计数：${currentCount}/${targetCount}`);
                        
                        // 检查成就是否已解锁
                        const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                            ? app.globalData.userAchievements[achievement.id] 
                            : { progress: 0, unlockTime: null };
                        
                        // 只有在成就未解锁时才更新进度
                        if (!achievementData.unlockTime && currentCount >= targetCount) {
                            this.updateFishingAchievement(achievement.id, currentCount);
                            console.log(`[成就解锁] ${achievement.title} - 累计钓到${currentCount}条体型比${thresholdPercent}%的鱼`);
                        } else if (achievementData.unlockTime) {
                            console.log(`[成就检查] ${achievement.title} 已解锁，跳过重复处理`);
                        }
                    }
                } else {
                    // 兼容旧格式的代码（如果还有的话）
                    console.warn(`[成就检查] ${achievement.id} 使用了旧的value格式：${achievement.value}`);
                }
            }
        });
    },

    // 更新钓鱼成就进度
    updateFishingAchievement(achievementId, progress) {
        if (!app.globalData.userAchievements) {
            app.globalData.userAchievements = {};
        }
        
        // 获取当前成就数据，适配新旧格式
        const achievementData = typeof app.globalData.userAchievements[achievementId] === 'object' 
            ? app.globalData.userAchievements[achievementId] 
            : { progress: 0, unlockTime: null };
        
        const currentProgress = achievementData.progress || 0;
        
        // 对于type 8和9，使用传入的progress值；对于type 10和11，只要触发就设为1
        const newProgress = progress;
        
        if (newProgress > currentProgress) {
            // 更新进度
            app.globalData.userAchievements[achievementId] = {
                progress: newProgress,
                unlockTime: achievementData.unlockTime
            };
            
            // 检查是否解锁成就
            const { achievements } = require('../../data/achievements.js');
            const achievement = achievements.find(a => a.id === achievementId);
            
            if (achievement) {
                let targetValue = 1;
                if (achievement.type === 8 || achievement.type === 9) {
                    targetValue = Array.isArray(achievement.value) ? achievement.value[1] : 1;
                } else {
                    targetValue = parseInt(achievement.value, 10) || 1;
                }
                
                if (newProgress >= targetValue && currentProgress < targetValue) {
                    // 成就解锁
                    app.globalData.userAchievements[achievementId].unlockTime = new Date().toISOString();
                    
                    // 增加成就分数
                    app.globalData.achievementScore = (app.globalData.achievementScore || 0) + achievement.score;
                    wx.setStorageSync('achievementScore', app.globalData.achievementScore);
                    
                    // 检查成就分数相关的成就（type: 2）
                    app.checkScoreAchievements();
                    
                    // 确保成就对象包含正确的icon属性
                    const { getAchievementIcon } = require('../../data/achievements.js');
                    const achievementWithIcon = {
                        ...achievement,
                        icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
                    };
                    
                    console.log('[fishing.js] 成就图标地址:', achievementWithIcon.icon);
                    
                    // 将成就添加到待展示队列，等到返回Home页面时统一显示
                    if (!app.globalData.pendingAchievements) {
                        app.globalData.pendingAchievements = [];
                    }
                    app.globalData.pendingAchievements.push(achievementWithIcon);
                    wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
                    
                    console.log(`[成就系统] 解锁成就: ${achievement.title}，已添加到待展示队列`);
                    console.log(`[成就系统] 当前待展示队列长度: ${app.globalData.pendingAchievements.length}`);
                    
                    console.log(`[成就解锁] ${achievement.title}`);
                }
            }
            
            // 保存到本地存储
            wx.setStorageSync('achievements', app.globalData.userAchievements);
        }
    },

    // 关闭钓鱼成功弹窗
    onCloseFishCaughtPopup() {
        this.setData({
            showFishCaughtPopup: false
        });

        // 恢复抛竿按钮
        setTimeout(() => {
            this.setData({
                canCastRod: true
            });

            // 检查是否需要屏蔽AFT_FISHON事件并触发EXTRA天气事件
            if (app.globalData.blockAFTEvent) {
                console.log('[钓鱼游戏] 屏蔽AFT_FISHON事件，直接触发EXTRA天气事件');
                // 重置屏蔽标记
                app.globalData.blockAFTEvent = false;
                // 直接触发EXTRA天气事件
                this.triggerExtraWeatherEvent(() => {
                    // 检查钓鱼时间是否结束
                    this.checkFishingTime();
                });
            } else {
                // 正常流程：在弹窗关闭后触发AFT_FISHON事件
                this.triggerAfterFishOnEvent(() => {
                    // 检查钓鱼时间是否结束
                    this.checkFishingTime();
                });
            }
        }, 300);
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
        wx.setStorageSync('fishEscaped', app.globalData.fishEscaped); // 保存到本地存储
        this.setData({
            fishEscaped: app.globalData.fishEscaped,
            sessionFishEscaped: this.data.sessionFishEscaped + 1, // 增加本局脱钩数量
            state: 'waiting',
            qteStatusText: '鱼儿逃脱了！',
            canCastRod: false // 禁用抛竿按钮，等待动画完成
        });
        
        // 检查type 12成就：累计跑掉x条鱼
        this.checkFishEscapedAchievements();

        // 优化3：延长等待时间，确保血条动画完成后再隐藏鱼状态组件
        setTimeout(() => {
            this.setData({
                showFishStatus: false
            });
        }, 1500); // 从1000ms增加到1500ms

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
        this.showCustomTooltip('??? 脱钩了！', 2000);

        // 显示逃脱原因
        setTimeout(() => {
            this.showCustomTooltip(escapeReason, 3000);

            // 检查是否需要屏蔽AFT_FISHON事件并触发EXTRA天气事件
            if (app.globalData.blockAFTEvent) {
                console.log('[钓鱼游戏] 鱼脱钩后屏蔽AFT_FISHON事件，直接触发EXTRA天气事件');
                // 重置屏蔽标记
                app.globalData.blockAFTEvent = false;
                // 直接触发EXTRA天气事件
                this.triggerExtraWeatherEvent(() => {
                    // 检查钓鱼时间是否结束
                    this.checkFishingTime();
                });
            } else {
                // 直接触发AFT_FISHON事件，而不是等到下次抛竿
                this.triggerAfterFishOnEvent(() => {
                    // 检查钓鱼时间是否结束
                    this.checkFishingTime();
                });
            }
        }, 2100);

        // 扣除钓鱼时间
        this.updateFishingTime(fishtimeData.everyfishon);
    },
    
    // 检查鱼脱钩相关成就（type 12）
    checkFishEscapedAchievements() {
        const { achievements } = require('../../data/achievements.js');
        
        // 检查type 12成就：累计跑掉x条鱼
        const escapedAchievements = achievements.filter(a => a.type === 12);
        escapedAchievements.forEach(achievement => {
            const targetCount = parseInt(achievement.value, 10) || 1;
            const currentCount = app.globalData.fishEscaped;
            
            // 检查成就是否已解锁
            const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                ? app.globalData.userAchievements[achievement.id] 
                : { progress: 0, unlockTime: null };
            
            // 只有在成就未解锁时才更新进度
            if (!achievementData.unlockTime) {
                // 更新成就进度
                this.updateFishingAchievement(achievement.id, currentCount);
                
                console.log(`[成就检查] 鱼脱钩次数：${currentCount}/${targetCount}`);
            } else {
                console.log(`[成就检查] ${achievement.title} 已解锁，跳过重复处理`);
            }
        });
    },
    
    // 检查稀有度相关成就（type 13）
    checkRarityAchievements(fish) {
        if (!fish || !fish.rarity) return;
        
        const { achievements } = require('../../data/achievements.js');
        
        // 检查type 13成就：累计钓到特定稀有度的鱼
        const rarityAchievements = achievements.filter(a => a.type === 13);
        rarityAchievements.forEach(achievement => {
            if (Array.isArray(achievement.value) && achievement.value.length >= 2) {
                const targetRarity = achievement.value[0];
                const targetCount = achievement.value[1];
                
                if (fish.rarity === targetRarity) {
                    // 检查成就是否已解锁
                    const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                        ? app.globalData.userAchievements[achievement.id] 
                        : { progress: 0, unlockTime: null };
                    
                    // 只有在成就未解锁时才更新计数和进度
                    if (!achievementData.unlockTime) {
                        // 更新该稀有度的钓获次数
                        const storageKey = `rarityFishCaught_${targetRarity}`;
                        let currentCount = wx.getStorageSync(storageKey) || 0;
                        currentCount += 1;
                        wx.setStorageSync(storageKey, currentCount);
                        
                        // 更新成就进度
                        this.updateFishingAchievement(achievement.id, currentCount);
                        
                        console.log(`[成就检查] 钓到${targetRarity}稀有度鱼，当前次数：${currentCount}/${targetCount}`);
                    } else {
                        console.log(`[成就检查] ${achievement.title} 已解锁，跳过重复处理`);
                    }
                }
            }
        });
     },
     
     // 检查图鉴解锁成就（type 14）
     checkCollectionAchievements() {
         const { achievements } = require('../../data/achievements.js');
         const { getFishCollection } = require('../../data/FishData2/FishCollection');
         const { FishData, BOSS } = require('../../data/FishData2/FishDataAll');
         
         // 检查type 14成就：解锁全部鱼种图鉴
         const collectionAchievements = achievements.filter(a => a.type === 14);
         collectionAchievements.forEach(achievement => {
             if (achievement.value === 1) { // 全部解锁
                 const fishCollection = getFishCollection();
                 
                 // 获取所有非BOSS鱼的数量
                 const nonBossFish = FishData.filter(fish => fish.rarity !== BOSS);
                 const totalFishCount = nonBossFish.length;
                 
                 // 计算已解锁的非BOSS鱼数量
                 let unlockedCount = 0;
                 nonBossFish.forEach(fish => {
                     if (fishCollection[fish.id] && fishCollection[fish.id].unlocked) {
                         unlockedCount++;
                     }
                 });
                 
                 // 如果全部解锁，更新成就进度
                 if (unlockedCount >= totalFishCount) {
                     this.updateFishingAchievement(achievement.id, 1);
                     console.log(`[成就检查] 鱼类图鉴全部解锁：${unlockedCount}/${totalFishCount}`);
                 } else {
                     console.log(`[成就检查] 鱼类图鉴进度：${unlockedCount}/${totalFishCount}`);
                 }
             }
         });
     },
     
     // 检查钓鱼事件图鉴解锁成就（type 15）
     checkEventCollectionAchievements() {
         const { achievements } = require('../../data/achievements.js');
         const { getEventCollection } = require('../../data/FishData2/EventCollection');
         const { FishEvents } = require('../../data/FishData2/FishEvents');
         
         // 检查type 15成就：解锁全部钓鱼事件
         const eventCollectionAchievements = achievements.filter(a => a.type === 15);
         eventCollectionAchievements.forEach(achievement => {
             if (achievement.value === 1) { // 全部解锁
                 const eventCollection = getEventCollection();
                 
                 // 获取所有钓鱼事件的数量
                 const totalEventCount = FishEvents.length;
                 
                 // 计算已解锁的钓鱼事件数量
                 let unlockedCount = 0;
                 FishEvents.forEach(event => {
                     if (eventCollection[event.id] && eventCollection[event.id].unlocked) {
                         unlockedCount++;
                     }
                 });
                 
                 // 如果全部解锁，更新成就进度
                 if (unlockedCount >= totalEventCount) {
                     this.updateFishingAchievement(achievement.id, 1);
                     console.log(`[成就检查] 钓鱼事件图鉴全部解锁：${unlockedCount}/${totalEventCount}`);
                 } else {
                     console.log(`[成就检查] 钓鱼事件图鉴进度：${unlockedCount}/${totalEventCount}`);
                 }
             }
         });
     },
     
     // 检查天气事件图鉴解锁成就（type 16）
     checkWeatherEventCollectionAchievements() {
         const { achievements } = require('../../data/achievements.js');
         const { getEventCollection } = require('../../data/FishData2/EventCollection');
         const { WeatherEvents } = require('../../data/FishData2/WeatherEvents');
         
         // 检查type 16成就：解锁全部天气事件
         const weatherEventCollectionAchievements = achievements.filter(a => a.type === 16);
         weatherEventCollectionAchievements.forEach(achievement => {
             if (achievement.value === 1) { // 全部解锁
                 const eventCollection = getEventCollection();
                 
                 // 获取所有天气事件的数量
                 const totalWeatherEventCount = WeatherEvents.length;
                 
                 // 计算已解锁的天气事件数量
                 let unlockedCount = 0;
                 WeatherEvents.forEach(event => {
                     if (eventCollection[event.id] && eventCollection[event.id].unlocked) {
                         unlockedCount++;
                     }
                 });
                 
                 // 如果全部解锁，更新成就进度
                 if (unlockedCount >= totalWeatherEventCount) {
                     this.updateFishingAchievement(achievement.id, 1);
                     console.log(`[成就检查] 天气事件图鉴全部解锁：${unlockedCount}/${totalWeatherEventCount}`);
                 } else {
                     console.log(`[成就检查] 天气事件图鉴进度：${unlockedCount}/${totalWeatherEventCount}`);
                 }
             }
         });
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
        
        // 增加钓鱼会话计数
        app.globalData.fishingSessionCount += 1;
        // 保存到本地存储
        wx.setStorageSync('fishingSessionCount', app.globalData.fishingSessionCount);
        console.log('[钓鱼游戏] 钓鱼会话计数:', app.globalData.fishingSessionCount);
        
        // 更新钓鱼相关成就进度
        this.updateFishingAchievementProgress();

        // 重置钓鱼相关状态（注意：fishEscaped是累计值，不应重置）
        app.globalData.fishingTime = fishtimeData.Basetime;
        app.globalData.initialFishingTime = fishtimeData.Basetime;
        app.globalData.fishCaught = 0;
        // app.globalData.fishEscaped = 0; // 移除重置，保持累计值
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
            
            // 增加钓鱼会话计数
            app.globalData.fishingSessionCount += 1;
            // 保存到本地存储
            wx.setStorageSync('fishingSessionCount', app.globalData.fishingSessionCount);
            console.log('[钓鱼游戏] 钓鱼会话计数:', app.globalData.fishingSessionCount);
            
            // 更新钓鱼相关成就进度
            this.updateFishingAchievementProgress();

            // 将本局脱钩数量保存到全局数据
            app.globalData.sessionFishEscaped = this.data.sessionFishEscaped;

            // 跳转到结果页面
            wx.redirectTo({
                url: '../result/result'
            });
        }
    },
    // 退出鱼咬状态，触发 AFT_FISHON 或 EXTRA 事件，并回到等待状态
    exitFishOn() {
        // 检查是否需要屏蔽AFT_FISHON事件
        if (app.globalData.blockAFTEvent) {
            console.log('[钓鱼游戏] 屏蔽AFT_FISHON事件，直接触发EXTRA天气事件');
            // 注意：不在这里重置blockAFTEvent标记，而是在onCloseFishCaughtPopup中重置
            // 直接触发EXTRA天气事件
            this.triggerExtraWeatherEvent(() => {
                this.backToWaiting();
            });
        } else {
            // 正常流程：先触发 AFT_FISHON 事件
            this.triggerAfterFishOnEvent(() => {
                // 如果未触发 AFT_FISHON，判断是否触发 EXTRA 天气事件
                if (!app.globalData.extraWeatherTriggered) {
                    this.triggerExtraWeatherEvent(() => {
                        this.backToWaiting();
                    });
                } else {
                    this.backToWaiting();
                }
            });
        }
    },

    backToWaiting() {
        // 清除当前鱼数据
        app.globalData.currentFish = null;
        this.setData({ currentFish: null, state: 'waiting', qteData: {}, qteOptions: [] });
        // 检查总时间是否结束
        this.checkFishingTime();
    },
    // 模拟 BEF_FISHON 事件
    triggerBeforeFishOnEvent(callback) {
        // 获取所有BEF_FISHON类型的事件
        let events = FishEvents.filter(e => e.type === 'BEF_FISHON');

        // 过滤掉已触发且不可重复触发的事件
        if (!app.globalData.triggeredEvents) {
            app.globalData.triggeredEvents = [];
        }

        // 优化1：检查是否在连续抛竿中触发事件
        if (!app.globalData.lastEventTriggerInfo) {
            app.globalData.lastEventTriggerInfo = {
                castCount: 0,
                lastBEFEventCastCount: 0,
                lastAFTEventCastCount: 0
            };
        }

        // 如果上一次BEF_FISHON事件是在上一次抛竿中触发的，则跳过本次触发
        if (app.globalData.lastEventTriggerInfo.lastBEFEventCastCount === app.globalData.castCount - 1) {
            console.log('[钓鱼游戏] 跳过BEF_FISHON事件触发：连续抛竿检测');
            callback();
            return;
        }

        let availableEvents = events.filter(e => {
            // 如果事件不可重复触发且已经触发过，则排除
            return e.retriggering || !app.globalData.triggeredEvents.includes(e.id);
        });

        // 如果有可用事件，根据概率触发
        if (availableEvents.length > 0) {
            // 计算总权重
            const totalWeight = availableEvents.reduce((sum, event) => sum + (event.weight || 1), 0);
            
            // 根据权重随机选择一个事件
            const randomValue = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            let evt = null;
            
            for (const event of availableEvents) {
                cumulativeWeight += (event.weight || 1);
                if (randomValue <= cumulativeWeight) {
                    evt = event;
                    break;
                }
            }
            
            // 如果没有选中事件（理论上不应该发生），选择第一个
            if (!evt && availableEvents.length > 0) {
                evt = availableEvents[0];
            }

            // 优化2：使用FishEventsProbability中的配置概率
            const triggerProbability = FishEventsProbability.BEF_Probability || 0.15;
            
            // 根据事件的触发概率决定是否触发
            if (Math.random() < triggerProbability) {
                this.showCustomModal(evt.name, evt.description, () => {
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

                        // 记录本次事件触发的抛竿次数
                        app.globalData.lastEventTriggerInfo.lastBEFEventCastCount = app.globalData.castCount;

                        console.log('[钓鱼游戏] 触发BEF_FISHON事件:', evt.name, app.globalData.eventModifiers);

                        // 更新事件图鉴收集状态
                        updateEventCollection(evt.id);
                        
                        // 检查事件图鉴解锁成就（type 15）
                        this.checkEventCollectionAchievements();

                        // 检查事件相关成就
                        this.checkEventAchievements(evt.id);

                        // 如果事件不可重复触发，记录已触发
                        if (!evt.retriggering) {
                            app.globalData.triggeredEvents.push(evt.id);
                        }

                        // 当触发了BEF_FISHON事件后，直接跳过本次抛竿
                        // 不调用callback，而是直接返回，等待玩家下次点击抛竿
                        this.showCustomTooltip('请继续钓鱼吧~', 2000);

                        // 检查钓鱼时间是否结束
                        this.checkFishingTime();
                });
            } else {
                callback();
            }
        } else {
            callback();
        }
    },

    // 模拟 AFT_FISHON 事件
    triggerAfterFishOnEvent(callback) {
        // 检查是否需要屏蔽AFT_FISHON事件
        if (app.globalData.blockAFTEvent) {
            console.log('[钓鱼游戏] 屏蔽AFT_FISHON事件');
            app.globalData.blockAFTEvent = false; // 重置屏蔽标记
            callback();
            return;
        }
        
        // 第一次抛竿不触发任何事件
        if (app.globalData.castCount === 1) {
            console.log('[钓鱼游戏] 第一次抛竿，跳过AFT_FISHON事件触发');
            callback();
            return;
        }
        
        // 获取所有AFT_FISHON类型的事件
        let events = FishEvents.filter(e => e.type === 'AFT_FISHON');

        // 过滤掉已触发且不可重复触发的事件
        if (!app.globalData.triggeredEvents) {
            app.globalData.triggeredEvents = [];
        }

        // 优化1：检查是否在连续抛竿中触发事件
        if (!app.globalData.lastEventTriggerInfo) {
            app.globalData.lastEventTriggerInfo = {
                castCount: 0,
                lastBEFEventCastCount: 0,
                lastAFTEventCastCount: 0
            };
        }

        // 如果上一次AFT_FISHON事件是在上一次抛竿中触发的，则跳过本次触发
        if (app.globalData.lastEventTriggerInfo.lastAFTEventCastCount === app.globalData.castCount - 1) {
            console.log('[钓鱼游戏] 跳过AFT_FISHON事件触发：连续抛竿检测');
            callback();
            return;
        }

        let availableEvents = events.filter(e => {
            // 如果事件不可重复触发且已经触发过，则排除
            return e.retriggering || !app.globalData.triggeredEvents.includes(e.id);
        });

        // 如果有可用事件，根据概率触发
        if (availableEvents.length > 0) {
            // 计算总权重
            const totalWeight = availableEvents.reduce((sum, event) => sum + (event.weight || 1), 0);
            
            // 根据权重随机选择一个事件
            const randomValue = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            let evt = null;
            
            for (const event of availableEvents) {
                cumulativeWeight += (event.weight || 1);
                if (randomValue <= cumulativeWeight) {
                    evt = event;
                    break;
                }
            }
            
            // 如果没有选中事件（理论上不应该发生），选择第一个
            if (!evt && availableEvents.length > 0) {
                evt = availableEvents[0];
            }

            // 优化2：使用FishEventsProbability中的配置概率
            const triggerProbability = FishEventsProbability.AFT_Probability || 0.15;
            
            // 根据事件的触发概率决定是否触发
            if (Math.random() < triggerProbability) {
                this.showCustomModal(evt.name, evt.description, () => {
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

                        // 记录本次事件触发的抛竿次数
                        app.globalData.lastEventTriggerInfo.lastAFTEventCastCount = app.globalData.castCount;

                        console.log('[钓鱼游戏] 触发AFT_FISHON事件:', evt.name, app.globalData.eventModifiers);

                        // 更新事件图鉴收集状态
                        updateEventCollection(evt.id);
                        
                        // 检查事件图鉴解锁成就（type 15）
                        this.checkEventCollectionAchievements();

                        // 检查事件相关成就
                        this.checkEventAchievements(evt.id);

                        // 如果事件不可重复触发，记录已触发
                        if (!evt.retriggering) {
                            app.globalData.triggeredEvents.push(evt.id);
                        }

                        callback();
                });
            } else {
                callback();
            }
        } else {
            callback();
        }
    },

    // 模拟附加天气事件（根据权重选择，且本局只触发一次）
    triggerExtraWeatherEvent(callback) {
        // 检查是否已经触发过附加天气事件或钓鱼时间已结束
        if (app.globalData.extraWeatherTriggered || app.globalData.fishingTime <= 0) {
            console.log('[钓鱼游戏] 不触发EXTRA天气事件：', {
                已触发过: app.globalData.extraWeatherTriggered,
                钓鱼时间已结束: app.globalData.fishingTime <= 0
            });
            callback();
            return;
        }

        const extraWeathers = WeatherEvents.filter(e => e.type === 'EXTRA');
        
        // 检查是否是指定条数鱼触发的EXTRA事件
        const isTargetFishTrigger = app.globalData.fishCaught === ExtraEventConfig.triggerFishCount;
        
        // 检查是否有可用的EXTRA事件
        if (extraWeathers.length === 0) {
            console.log('[钓鱼游戏] 没有可用的EXTRA天气事件');
            callback();
            return;
        }
        
        // EXTRA事件只在指定条数的鱼时必然触发
        if (isTargetFishTrigger) {
            console.log(`[钓鱼游戏] 第${ExtraEventConfig.triggerFishCount}条鱼触发EXTRA天气事件`);
        } else {
            console.log(`[钓鱼游戏] 非第${ExtraEventConfig.triggerFishCount}条鱼，不触发EXTRA天气事件`);
            callback();
            return;
        }
        
        console.log('[钓鱼游戏] 触发EXTRA天气事件:', {
             是目标条数鱼触发: isTargetFishTrigger,
             触发条数: ExtraEventConfig.triggerFishCount,
             可用事件数量: extraWeathers.length
         });
         
         // 根据权重选择事件
         // 计算总权重
         const totalWeight = extraWeathers.reduce((sum, event) => sum + (event.weight || 1), 0);
         
         // 根据权重随机选择一个事件
         const randomValue = Math.random() * totalWeight;
         let cumulativeWeight = 0;
         let evt = null;
         
         for (const event of extraWeathers) {
             cumulativeWeight += (event.weight || 1);
             if (randomValue <= cumulativeWeight) {
                 evt = event;
                 break;
             }
         }
         
         // 如果没有选中事件（理论上不应该发生），选择第一个
         if (!evt && extraWeathers.length > 0) {
             evt = extraWeathers[0];
         }
         this.showCustomModal(evt.name, evt.description, () => {
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

                 // 调整 rareFishBoost
                 if (evt.effects.rareFishBoost) {
                     app.globalData.eventModifiers.rareFishBoost = evt.effects.rareFishBoost;
                 }

                 app.globalData.extraWeatherTriggered = true;

                 // 更新事件加成显示
                 this.updateEventBuffsDisplay(evt);

                 // 更新事件图鉴收集状态
                 updateEventCollection(evt.id);
                 
                 // 检查天气事件图鉴解锁成就（type 16）
                 this.checkWeatherEventCollectionAchievements();

                 console.log('[钓鱼游戏] 触发EXTRA天气事件:', evt.name, app.globalData.eventModifiers);
                 callback();
         });

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
                
                // 优化显示，显示具体哪些稀有度概率进行了变化
                let rarityNames = '';
                if (event.effects.rareFishBoost.targetRarity) {
                    const rarityMap = {
                        'COMMON': '普通',
                        'UNCOMMON': '不常见',
                        'RARE': '稀有',
                        'EPIC': '史诗',
                        'MYTHIC': '神话',
                        'BOSS': 'BOSS',
                        'WASTE': '废弃物'
                    };
                    
                    const rarityTexts = event.effects.rareFishBoost.targetRarity.map(r => rarityMap[r] || r);
                    rarityNames = rarityTexts.join('、');
                }
                
                rarityBuff.description = rarityNames ? 
                    `${rarityNames}鱼出现概率 ${sign}${percentChange.toFixed(0)}%` : 
                    `稀有鱼出现概率 ${sign}${percentChange.toFixed(0)}%`;
                    
                hasUpdate = true;
            } else {
                // 添加新的加成
                // 计算百分比变化
                const percentChange = (event.effects.rareFishBoost.value - 1) * 100;
                const sign = percentChange >= 0 ? '+' : '';
                
                // 优化显示，显示具体哪些稀有度概率进行了变化
                let rarityNames = '';
                if (event.effects.rareFishBoost.targetRarity) {
                    const rarityMap = {
                        'COMMON': '普通',
                        'UNCOMMON': '不常见',
                        'RARE': '稀有',
                        'EPIC': '史诗',
                        'MYTHIC': '神话',
                        'BOSS': 'BOSS',
                        'WASTE': '废弃物'
                    };
                    
                    const rarityTexts = event.effects.rareFishBoost.targetRarity.map(r => rarityMap[r] || r);
                    rarityNames = rarityTexts.join('、');
                }
                
                eventBuffs.push({
                    type: 'rareFishBoost',
                    value: event.effects.rareFishBoost.value,
                    description: rarityNames ? 
                        `${rarityNames}鱼出现概率 ${sign}${percentChange.toFixed(0)}%` : 
                        `稀有鱼出现概率 ${sign}${percentChange.toFixed(0)}%`
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
                baseBuff.description = `鱼饵基础概率 ${sign}${percentChange.toFixed(0)}%`;
                hasUpdate = true;
            } else {
                // 添加新的加成
                // 计算百分比变化
                const percentChange = (event.effects.baseMultiplier - 1) * 100;
                const sign = percentChange >= 0 ? '+' : '';
                eventBuffs.push({
                    type: 'baseMultiplier',
                    value: event.effects.baseMultiplier,
                    description: `鱼饵基础概率 ${sign}${percentChange.toFixed(0)}%`
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

        // 处理下一条鱼是指定稀有度
        if (event.effects.nextFishRarity) {
            const rarityMap = {
                'COMMON': '普通',
                'UNCOMMON': '不常见',
                'RARE': '稀有',
                'EPIC': '史诗',
                'MYTHIC': '神话',
                'BOSS': 'BOSS',
                'WASTE': '废弃物'
            };
            
            const rarityName = rarityMap[event.effects.nextFishRarity.rarity] || event.effects.nextFishRarity.rarity;
            
            eventBuffs.push({
                type: 'nextFishRarity',
                value: event.effects.nextFishRarity,
                description: `下一条鱼必定是${rarityName}鱼`
            });
            hasUpdate = true;
            
            // 设置全局变量，用于下次抛竿时使用
            app.globalData.nextFishRarity = event.effects.nextFishRarity.rarity;
            app.globalData.blockBEFEvent = event.effects.nextFishRarity.blockEvents || false;
            app.globalData.blockAFTEvent = event.effects.nextFishRarity.blockEvents || false;
        }
        
        // 处理下一条鱼的strength变化
        if (event.effects.nextFishStrength) {
            const percentChange = (event.effects.nextFishStrength - 1) * 100;
            const sign = percentChange >= 0 ? '+' : '';
            
            eventBuffs.push({
                type: 'nextFishStrength',
                value: event.effects.nextFishStrength,
                description: `下一条鱼体型 ${sign}${percentChange.toFixed(0)}%`
            });
            hasUpdate = true;
            
            // 设置全局变量，用于下次抛竿时使用
            app.globalData.nextFishStrength = event.effects.nextFishStrength;
        }
        
        // 处理被动伤害提升
        if (event.effects.passiveDamageBoost) {
            const percentChange = (event.effects.passiveDamageBoost - 1) * 100;
            const sign = percentChange >= 0 ? '+' : '';
            
            eventBuffs.push({
                type: 'passiveDamageBoost',
                value: event.effects.passiveDamageBoost,
                description: `被动伤害 ${sign}${percentChange.toFixed(0)}%`
            });
            hasUpdate = true;
            
            // 临时修改被动伤害值
            app.globalData.passiveDamageBoost = event.effects.passiveDamageBoost;
        }
        
        // 处理QTE判定时间变化
        if (event.effects.qteDurationChange) {
            const percentChange = (event.effects.qteDurationChange - 1) * 100;
            const sign = percentChange >= 0 ? '+' : '';
            
            eventBuffs.push({
                type: 'qteDurationChange',
                value: event.effects.qteDurationChange,
                description: `QTE判定时间 ${sign}${percentChange.toFixed(0)}%`
            });
            hasUpdate = true;
            
            // 临时修改QTE判定时间
            app.globalData.qteDurationChange = event.effects.qteDurationChange;
        }
        
        // 处理QTE造成伤害整体变化
        if (event.effects.qteDamageChange) {
            const percentChange = (event.effects.qteDamageChange - 1) * 100;
            const sign = percentChange >= 0 ? '+' : '';
            
            eventBuffs.push({
                type: 'qteDamageChange',
                value: event.effects.qteDamageChange,
                description: `QTE伤害 ${sign}${percentChange.toFixed(0)}%`
            });
            hasUpdate = true;
            
            // 临时修改QTE伤害
            app.globalData.qteDamageChange = event.effects.qteDamageChange;
        }
        
        // 更新数据
        if (hasUpdate) {
            this.setData({
                eventBuffs: eventBuffs,
                hasEventBuffs: eventBuffs.length > 0
            });
        }
    },

    // 检查事件相关成就
    checkEventAchievements(eventId) {
        const { getEventCollectionById } = require('../../data/FishData2/EventCollection.js');
        const eventData = getEventCollectionById(eventId);
        
        if (eventData && eventData.count > 0) {
            this.updateEventAchievement(eventId, eventData.count);
        }
    },

    // 更新事件成就
    updateEventAchievement(eventId, count) {
        const app = getApp();
        const achievementsData = require('../../data/achievements.js');
        
        console.log(`[成就系统] 检查事件成就，事件ID: ${eventId}, 触发次数: ${count}`);
        
        // 检查type 9成就（累计遇到某种事件多少次）
        const eventAchievements = achievementsData.achievements.filter(achievement => {
            if (achievement.type === 9 && Array.isArray(achievement.value)) {
                const targetEventId = achievement.value[0];
                console.log(`[成就系统] 检查成就 ${achievement.id}: 目标事件ID ${targetEventId} vs 当前事件ID ${eventId}`);
                return targetEventId === eventId;
            }
            return false;
        });
        
        console.log(`[成就系统] 找到 ${eventAchievements.length} 个相关事件成就`);
        
        eventAchievements.forEach(achievement => {
            const targetEventId = achievement.value[0];
            const targetCount = achievement.value[1];
            
            console.log(`[成就系统] 处理成就: ${achievement.title}, 目标: ${targetCount}次`);
            
            // 获取当前成就数据
            const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                ? app.globalData.userAchievements[achievement.id] 
                : { progress: 0, unlockTime: null };
            
            // 如果成就已解锁，跳过处理
            if (achievementData.unlockTime) {
                console.log(`[成就系统] ${achievement.title} 已解锁，跳过重复处理`);
                return;
            }
            
            const currentProgress = achievementData.progress || 0;
            console.log(`[成就系统] 当前进度: ${currentProgress}, 新进度: ${count}`);
            
            // 更新成就进度
            if (count > currentProgress) {
                app.globalData.userAchievements[achievement.id] = {
                    progress: count,
                    unlockTime: achievementData.unlockTime
                };
                
                // 保存到本地存储
                wx.setStorageSync('achievements', app.globalData.userAchievements);
                
                console.log(`[成就系统] 更新进度到: ${count}`);
                
                // 检查是否达到解锁条件
                if (count >= targetCount && !achievementData.unlockTime) {
                    console.log(`[成就系统] 达到解锁条件，解锁成就: ${achievement.title}`);
                    
                    // 解锁成就
                    app.globalData.userAchievements[achievement.id].unlockTime = new Date().toISOString();
                    
                    // 增加成就分数
                    app.globalData.achievementScore += achievement.score;
                    wx.setStorageSync('achievementScore', app.globalData.achievementScore);
                    
                    // 检查成就分数相关的成就（type: 2）
                    app.checkScoreAchievements();
                    
                    // 保存更新后的成就数据
                    wx.setStorageSync('achievements', app.globalData.userAchievements);
                    
                    // 确保成就对象包含正确的icon属性
                    const { getAchievementIcon } = require('../../data/achievements.js');
                    const achievementWithIcon = {
                        ...achievement,
                        icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
                    };
                    
                    console.log('[fishing.js] 成就图标地址:', achievementWithIcon.icon);
                    
                    // 将成就添加到待展示队列，等到返回Home页面时统一显示
                if (!app.globalData.pendingAchievements) {
                    app.globalData.pendingAchievements = [];
                }
                app.globalData.pendingAchievements.push(achievementWithIcon);
                wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
                
                console.log(`[成就系统] 解锁成就: ${achievement.title}，已添加到待展示队列`);
                console.log(`[成就系统] 当前待展示队列长度: ${app.globalData.pendingAchievements.length}`);
                    
                    console.log(`[成就系统] 解锁事件成就: ${achievement.title}`);
                } else {
                    console.log(`[成就系统] 未达到解锁条件: ${count}/${targetCount}`);
                }
            }
        });
    },

    // 清除事件加成显示
    clearEventBuffsDisplay() {
        this.setData({
            eventBuffs: [],
            hasEventBuffs: false
        });
        
        // 重置事件修正
        app.globalData.eventModifiers = {
            rareFishBoost: 1,
            baseMultiplier: 1,
            timeModifier: 0,
            baitEffect: 1
        };
        
        // 重置新增的效果变量
        app.globalData.nextFishRarity = null;       // 下一条鱼的稀有度
        app.globalData.nextFishStrength = null;     // 下一条鱼的体型变化系数
        app.globalData.passiveDamageBoost = null;   // 被动伤害提升系数
        app.globalData.qteDurationChange = null;    // QTE判定时间变化系数
        app.globalData.qteDamageChange = null;      // QTE伤害变化系数
    },
    
    // 优化1：从事件加成显示中移除指定类型的效果
    removeEventBuffDisplay(buffType) {
        if (!buffType) return;
        
        // 获取当前事件加成列表
        let eventBuffs = this.data.eventBuffs;
        
        // 过滤掉指定类型的效果
        eventBuffs = eventBuffs.filter(buff => buff.type !== buffType);
        
        // 更新数据
        this.setData({
            eventBuffs: eventBuffs,
            hasEventBuffs: eventBuffs.length > 0
        });
        
        console.log(`[钓鱼游戏] 移除事件加成显示: ${buffType}`);
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
            
            // 增加钓鱼会话计数
            app.globalData.fishingSessionCount += 1;
            // 保存到本地存储
            wx.setStorageSync('fishingSessionCount', app.globalData.fishingSessionCount);
            console.log('[钓鱼游戏] 钓鱼会话计数:', app.globalData.fishingSessionCount);
            
            // 更新钓鱼相关成就进度
            this.updateFishingAchievementProgress();

            // 将本局脱钩数量保存到全局数据
            app.globalData.sessionFishEscaped = this.data.sessionFishEscaped;

            // 跳转到结果页面
            wx.redirectTo({
                url: '../result/result'
            });
        }
    },
    // 退出鱼咬状态，触发 AFT_FISHON 或 EXTRA 事件，并回到等待状态
    exitFishOn() {
        // 检查是否需要屏蔽AFT_FISHON事件
        if (app.globalData.blockAFTEvent) {
            console.log('[钓鱼游戏] 屏蔽AFT_FISHON事件，直接触发EXTRA天气事件');
            // 注意：不在这里重置blockAFTEvent标记，而是在onCloseFishCaughtPopup中重置
            // 直接触发EXTRA天气事件
            this.triggerExtraWeatherEvent(() => {
                this.backToWaiting();
            });
        } else {
            // 正常流程：先触发 AFT_FISHON 事件
            this.triggerAfterFishOnEvent(() => {
                // 如果未触发 AFT_FISHON，判断是否触发 EXTRA 天气事件
                if (!app.globalData.extraWeatherTriggered) {
                    this.triggerExtraWeatherEvent(() => {
                        this.backToWaiting();
                    });
                } else {
                    this.backToWaiting();
                }
            });
        }
    },

    backToWaiting() {
        // 清除当前鱼数据
        app.globalData.currentFish = null;
        this.setData({ currentFish: null, state: 'waiting', qteData: {}, qteOptions: [] });
        // 检查总时间是否结束
        this.checkFishingTime();
    },

    // 更新钓鱼相关成就进度
    updateFishingAchievementProgress() {
        const { achievements } = require('../../data/achievements.js');
        const currentCount = app.globalData.fishingSessionCount;
        
        // 查找钓鱼相关成就
        const fishingAchievements = ['fishing1', 'fishing2', 'fishing3', 'fishing4'];
        
        fishingAchievements.forEach(achievementId => {
            const achievement = achievements.find(a => a.id === achievementId);
            if (achievement && achievement.type === 1) {
                // 获取当前成就数据
                const currentData = app.globalData.userAchievements[achievementId] || { progress: 0, unlockTime: null };
                
                // 如果成就未解锁，更新进度并检查解锁条件
                if (!currentData.unlockTime) {
                    // 调用updateFishingAchievement方法来处理进度更新和解锁检查
                    this.updateFishingAchievement(achievementId, currentCount);
                    
                    console.log(`[钓鱼成就] 更新 ${achievementId} 进度: ${currentCount}/${achievement.value}`);
                }
            }
        });
    },

    // 显示自定义弹窗
    showCustomModal(title, content, callback) {
        // 保存回调函数
        this.customModalCallback = callback;
        
        // 检查是否有fish-status正在动画中
        if (this.data.fishStatusAnimating) {
            // 等待fish-status动画结束后再显示弹窗（默认600ms）
            setTimeout(() => {
                this.setData({
                    showCustomModal: true,
                    customModalData: {
                        title: title,
                        content: content
                    }
                });
            }, 600);
        } else {
            // 立即显示弹窗
            this.setData({
                showCustomModal: true,
                customModalData: {
                    title: title,
                    content: content
                }
            });
        }
    },

    // 隐藏自定义弹窗
    hideCustomModal() {
        this.setData({
            showCustomModal: false,
            customModalData: {
                title: '',
                content: ''
            }
        });
        // 执行回调函数
        if (this.customModalCallback) {
            this.customModalCallback();
            this.customModalCallback = null;
        }
    },

    // 阻止事件冒泡
    stopPropagation() {
        // 空函数，用于阻止事件冒泡
    },

    // 显示自定义tooltip
    showCustomTooltip(content, duration = 2000) {
        this.setData({
            showCustomTooltip: true,
            customTooltipData: {
                content: content
            }
        });
        
        // 自动隐藏tooltip
        setTimeout(() => {
            this.hideCustomTooltip();
        }, duration);
    },

    // 隐藏自定义tooltip
    hideCustomTooltip() {
        this.setData({
            showCustomTooltip: false,
            customTooltipData: {
                content: ''
            }
        });
    }
});
// 定义稀有度常量
export const COMMON = 'COMMON';
export const UNCOMMON = 'UNCOMMON';
export const RARE = 'RARE';
export const EPIC = 'EPIC';
export const MYTHIC = 'MYTHIC';
export const BOSS = 'BOSS';
export const WASTE = 'WASTE';

export const RARITY_MULTIPLIER = {
  [COMMON]: 2.5,  // 普通
  [UNCOMMON]: 1.6, // 少见
  [RARE]: 0.8,     // 稀有
  [EPIC]: 0.1,     // 史诗级
  [MYTHIC]: 0.05,   // 传说级  
  [BOSS]: 0.001,       // Boss级
  [WASTE]: 0.6,    // 杂物
};

//白COMMON:   罗非
//绿UNCOMMON:     太阳
//蓝RARE:        
//紫EPIC:      龙纹斑
//彩MYTHIC:   哲罗鲑  金目鲈 孔雀鲈 蓝吉罗 
    //     backwater: '回水湾',
    //     slowmoving: '缓流',
    //     rapids: '急流',
    //     shallow: '浅滩',
    //     obstacle: '障碍'
    //     Deep: '深滩'

    //   JUMP:洗腮
    //   InObstacles:钻结构
    //   SpeedUp:加速
    //   nopower:无力
    //   nomove:打桩
    //   come:失去张力

//白COMMON:白条 柳根 青稍 红尾 罗非
//绿UNCOMMON: 马口 溪哥 大口鲶 红眼 
//蓝RARE: 大口黑鲈 鳜鱼 叉尾鮰 黑鱼 狗鱼 沙塘鳢 花骨鱼 重唇鱼 五道黑 淡化海鲈 雷龙
//紫EPIC: 斑鳜 翘嘴  虹鳟 金樽 军鱼 梭鲈 雅罗鱼 金目鲈
//彩MYTHIC: 鳡鱼  哲罗鲑   孔雀鲈 山女鳟
//彩色BOSS: 
//白WASTE：塑料袋 枯树枝 水草 橡胶制品 贴身衣物 鲫鱼 鲤鱼 草鱼
//白条 溪哥 马口 鳜鱼 斑鳜 鳡鱼 大口鲶 叉尾鮰 翘嘴 红尾 红眼 青稍 黑鱼 雷龙  虹鳟 金樽 哲罗鲑 山女鳟 柳根 军鱼 狗鱼 金目鲈 淡化海鲈 沙塘鳢 梭鲈 花骨鱼 重唇鱼 雅罗鱼 五道黑




export const FishData = [    
  {
    id: 'FISH_01',
    name: '大口黑鲈',
    rarity: RARE,//稀有度
    description: '路亚圈的真正核心，路亚的重中之重。',
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [1.5, 3.51],//鱼的强度范围，随机
    BaseHP: 200,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },
  {
    id: 'FISH_02',
    name: '马口',
    rarity: UNCOMMON,
    description: '城市河道的明星，溪流精灵。',
    habitats: ['backwater','slowmoving','rapids','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.2,
    strength: [0.5, 1.5],
    BaseHP: 120,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_03',
    name: '白条',
    rarity: COMMON,
    description: '这是尊严，要轻拿轻放。',
    habitats: ['backwater','slowmoving','rapids','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.2,
    strength: [0.5, 1.4],
    BaseHP: 100,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_04',
    name: '鳜鱼',
    rarity: EPIC,
    description: '隐秘伏击的水底暴君,Duang的一口谁都喜爱,背鳍毒棘需小心。',
    habitats: ['Deep','obstacle','rapids','slowmoving'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'nomove', 'come'],
    QTEFail: 0.5,
    strength: [1.5, 3.51],
    BaseHP: 230,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_05',
    name: '鳡鱼',
    rarity: MYTHIC,
    description: '顶级掠食者，淡水速度与激情的代言鱼。',
    habitats: ['backwater','slowmoving','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.7,
    strength: [2, 8],
    BaseHP: 300,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  }
  ,
  {
    id: 'FISH_06',
    name: '柳根鱼',
    rarity: UNCOMMON,
    description: '冷水限定，偏好急流浅滩、乱石堆，喜欢集群。',
    habitats: ['backwater','slowmoving','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.1,
    strength: [0.4, 1.3],
    BaseHP: 100,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  }
  ,
  {
    id: 'FISH_07',
    name: '青稍',
    rarity: COMMON,
    description: '小翘嘴平替，偏好静水或缓流的湖泊、水库浅湾及河湾。',
    habitats: ['backwater','slowmoving','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.2,
    strength: [0.5, 1.4],
    BaseHP: 120,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_08',
    name: '红尾',
    rarity: COMMON,
    description: '性情凶猛，爆发力强，喜欢组团围猎饵鱼。',
    habitats: ['backwater','slowmoving','shallow','obstacle'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'JUMP', 'come'],
    QTEFail: 0.4,
    strength: [0.5, 1.45],
    BaseHP: 140,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_09',
    name: '红眼',
    rarity: COMMON,
    description: '性情暴躁，游动迅猛，是淡水路亚中兼具视觉吸引力与钓获挑战的目标鱼。',
    habitats: ['backwater','slowmoving','rapids','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'JUMP', 'come'],
    QTEFail: 0.4,
    strength: [0.6, 1.7],
    BaseHP: 180,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_10',
    name: '溪哥',
    rarity: UNCOMMON,
    description: '溪流生态的视觉盛宴，偏好山涧溪流、清澈小河及江河支流，砂砾底浅滩。',
    habitats: ['backwater','slowmoving','rapids','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.2,
    strength: [0.5, 1.5],
    BaseHP: 120,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_11',
    name: '大口鲶',
    rarity: UNCOMMON,
    description: '昼伏夜出，喜栖息于江河、湖泊、水库的深水底层。',
    habitats: ['backwater','Deep'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'nomove', 'come'],
    QTEFail: 0.4,
    strength: [1.9, 4.91],
    BaseHP: 260,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_12',
    name: '叉尾鮰',
    rarity: RARE,
    description: '入侵物种，但是肉质鲜美，偏好江河、湖泊、水库的中下层水域。',
    habitats: ['backwater','Deep','obstacle'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'nomove', 'come'],
    QTEFail: 0.4,
    strength: [1.9, 4.51],
    BaseHP: 220,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_13',
    name: '黑鱼',
    rarity: RARE,
    description: '凶猛的捕食能力、强大的环境适应力及独特的护幼行。',
    habitats: ['obstacle','slowmoving'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'nomove'],
    QTEFail: 0.7,
    strength: [2, 6],
    BaseHP: 300,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_14',
    name: '雷龙鱼',
    rarity: RARE,
    description: '水族爱好者狂喜，外形独特、习性凶猛，极具魅力的淡水观赏鱼。',
    habitats: ['obstacle','slowmoving'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'nomove'],
    QTEFail: 0.7,
    strength: [1.5, 3.3],
    BaseHP: 200,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },
  {
    id: 'FISH_15',
    name: '狗鱼',
    rarity: RARE,
    description: '寒流原住民，吻部尖长，似鸭嘴，牙齿格外锋利。',
    habitats: ['Deep','slowmoving','obstacle'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.9,
    strength: [3, 7],
    BaseHP: 300,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },{
    id: 'FISH_16',
    name: '沙塘鳢',
    rarity: RARE,//稀有度
    description: '淡水小型底栖鱼类，大头宽嘴身披迷彩，石头缝里的特色鱼种。',
    habitats: ['slowmoving','obstacle'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['InObstacles','nopower'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [0.5, 1.51],//鱼的强度范围，随机
    BaseHP: 120,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_17',
    name: '花骨鱼',
    rarity: RARE,//稀有度
    description: '独特斑点，偏好微流水、水质清澈的中下层，底质以沙砾或泥沙为主。',
    habitats: ['slowmoving','obstacle','shallow'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['InObstacles','nopower','SpeedUp'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [0.5, 1.51],//鱼的强度范围，随机
    BaseHP: 160,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_18',
    name: '重唇鱼',
    rarity: RARE,//稀有度
    description: '被蜜蜂蛰过的嘟嘟嘴，偏好水流湍急、底质为沙砾或砂石的江河中下层水域。',
    habitats: ['slowmoving','shallow','rapids','backwater'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['InObstacles','nopower','SpeedUp'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [0.5, 1.51],//鱼的强度范围，随机
    BaseHP: 140,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_19',
    name: '五道黑',
    rarity: RARE,//稀有度
    description: '带条形码的新疆特产，有橙红色鱼鳍却是热情的冷水鱼。',
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [1.5, 2.91],//鱼的强度范围，随机
    BaseHP: 200,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_20',
    name: '淡化海鲈',
    rarity: RARE,//稀有度
    description: '穿银甲泳姿矫健，带来强劲的搏鱼手感。',
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_21',
    name: '斑鳜',
    rarity: EPIC,//稀有度
    description: '野生豹纹尖牙利嘴，肉质细嫩且为路亚的重要目标鱼种。',
    habitats: ['backwater','slowmoving','rapids','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.5, 2.91],//鱼的强度范围，随机
    BaseHP: 200,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_22',
    name: '翘嘴',
    rarity: EPIC,//稀有度
    description: '身影捉摸不定，米翘却是路亚佬的必修课。',
    habitats: ['backwater','shallow'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [2, 5],//鱼的强度范围，随机
    BaseHP: 280,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_23',
    name: '虹鳟',
    rarity: EPIC,//稀有度
    description: '侧线一条彩虹状纵纹，体侧散布黑色斑点，活泼善跳跃，水温到达22℃不宜生存。',
    habitats: ['backwater','slowmoving','shallow','rapids'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.9, 2.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_24',
    name: '金鳟',
    rarity: EPIC,//稀有度
    description: '虹鳟的土豪亲戚，金黄色突变品系。',
   habitats: ['backwater','slowmoving','shallow','rapids'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_25',
    name: '山女鳟',
    rarity: MYTHIC,//稀有度
    description: '冷水里的樱花武士，鳃盖后延伸鲜红色彩带，体侧分布8-10个椭圆斑点。',
  habitats: ['backwater','slowmoving','shallow','rapids'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.8,//qte失败后，逃跑概率
    strength: [0.5, 1.91],//鱼的强度范围，随机
    BaseHP: 200,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_26',
    name: '梭鲈',
    rarity: EPIC,//稀有度
    description: '两个五道黑，淡黄色的体色，拥有锋利獠牙和高高耸立的背鳍。',
    habitats: ['Deep','slowmoving','obstacle'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.5,
    strength: [3, 6],
    BaseHP: 300,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_27',
    name: '雅罗鱼',
    rarity: EPIC,//稀有度
    description: '此华子非彼华子，北方水系为主，背部灰色，腹部银白。',
    habitats: ['backwater','slowmoving','shallow','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.5,//qte失败后，逃跑概率
    strength: [0.5, 1.51],//鱼的强度范围，随机
    BaseHP: 160,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},{
    id: 'FISH_28',
    name: '军鱼',
    rarity: EPIC,//稀有度
    description: '身着宽大鳞甲，性格暴躁，时常在溪流中展示暴力美学。',
    habitats: ['backwater','slowmoving','shallow','rapids'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},
  {
    id: 'FISH_29',
    name: '罗非鱼',
    rarity: COMMON,
    description: '生存卷王，超生游击队。',
    habitats: ['backwater','slowmoving','Deep','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.2,
    strength: [0.6, 1.5],
    BaseHP: 160,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 1.8,
      "rainy": 0.3
    }
  },{
    id: 'FISH_30',
    name: '哲罗鲑',
    rarity: MYTHIC,//稀有度
    description: '是北半球冷水水域的顶级掠食性鱼类，肉质鲜美且极具生态与科研价值，成年个体通常体长1-2米，体重20-50千克。',
    habitats: ['backwater','rapids','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.9,//qte失败后，逃跑概率
    strength: [3, 9],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }},
    {
    id: 'FISH_31',
    name: '金目鲈',
    rarity: EPIC,//稀有度
    description: '因其眼睛具有金色光泽而得名，在不同地区也被称为尖吻鲈、盲鰽。',
    habitats: ['backwater','slowmoving','shallow','obstacle'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.7,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }
  },{
    id: 'FISH_32',
    name: '孔雀鲈',
    rarity: MYTHIC,//稀有度
    description: '又称皇冠三间、孔雀鲷，体侧三道墨色横纹如天瀑垂墨，披着热带丛林迷彩的水下突击兵。',
    habitats: ['obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.9,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 300,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }}
    ,{
    id: 'FISH_33',
    name: '蓝吉罗',
    rarity: MYTHIC,//稀有度
    description: '钴蓝鳞片在激流中折射出冰晶般的冷冽光泽，在砾石密布的急流区游动时，活脱脱是一群披着 “液态龙鳞甲” 的水下贵族。',
    habitats: ['rapids','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come', 'nomove'],// 可触发QTE的事件
    QTEFail: 0.9,//qte失败后，逃跑概率
    strength: [1.9, 4.91],//鱼的强度范围，随机
    BaseHP: 270,
    Image: 'https://anglertest.xyz/game/fish/fishon.webp',
    backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
    defImage: '../../images/icons/whatfish.png',
    weatherAffinity: {
      "sunny": 0.6,
      "rainy": 1.7
    }}
];
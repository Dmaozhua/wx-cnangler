// 定义稀有度常量
export const COMMON = 'COMMON';
export const UNCOMMON = 'UNCOMMON';
export const RARE = 'RARE';
export const EPIC = 'EPIC';
export const MYTHIC = 'MYTHIC';
export const BOSS = 'BOSS';
export const WASTE = 'WASTE';

export const RARITY_MULTIPLIER = {
  [COMMON]: 2,  // 普通
  [UNCOMMON]: 1.6, // 少见
  [RARE]: 1,     // 稀有
  [EPIC]: 0.5,     // 史诗级
  [MYTHIC]: 0.1,   // 传说级  
  [BOSS]: 0.05,       // Boss级
  [WASTE]: 0.6,    // 杂物
};

    //     backwater: '回水湾',
    //     slowmoving: '缓流',
    //     rapids: '急流',
    //     shallow: '浅滩',
    //     obstacle: '障碍'
    //     Deep: '深潭'
    //     surface: '水面',
    //     cliff:'崖壁'


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
//彩色BOSS: “百战”白条，“独眼”大口鲈，“生化”鳄雀鳝，“暴虐”鳡，“深渊”鲶，“幽冥”鳟
//白WASTE：塑料袋 枯树枝 水草 橡胶制品 贴身衣物 鲫鱼 鲤鱼 草鱼
//白条 溪哥 马口 鳜鱼 斑鳜 鳡鱼 大口鲶 叉尾鮰 翘嘴 红尾 红眼 青稍 黑鱼 雷龙  虹鳟 金樽 哲罗鲑 山女鳟 柳根 军鱼 狗鱼 金目鲈 淡化海鲈 沙塘鳢 梭鲈 花骨鱼 重唇鱼 雅罗鱼 五道黑



export const FishData = [    
  {
    id: 'FISH_01',
    name: '大口黑鲈',
    rarity: RARE,//稀有度
    description: '路亚圈的真正核心，路亚的重中之重。',
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep','cliff','surface'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','rapids','shallow','obstacle','Deep','surface'],
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
    habitats: ['backwater','slowmoving','rapids','shallow','obstacle','Deep','cliff','surface'],
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
    name: '白鳜鱼',
    rarity: EPIC,
    description: '隐秘伏击的水底暴君,Duang的一口谁都喜爱,背鳍毒棘需小心。',
    habitats: ['Deep','obstacle','rapids','slowmoving','cliff'],
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
    habitats: ['backwater','slowmoving','shallow','surface','obstacle'],
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
    habitats: ['backwater','slowmoving','shallow','rapids',],
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
    habitats: ['backwater','slowmoving','shallow','Deep','cliff'],
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
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep','cliff','surface','rapids'],
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
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep','cliff','surface','rapids'],
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
    habitats: ['backwater','slowmoving','rapids','shallow','obstacle'],
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
    habitats: ['backwater','Deep','slowmoving','cliff'],
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
    habitats: ['Deep','slowmoving','obstacle','backwater'],
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
    habitats: ['slowmoving','obstacle','shallow','Deep','backwater'],// 出现水域类型
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
    habitats: ['slowmoving','obstacle','shallow','Deep','backwater'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep','cliff'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','rapids','obstacle','Deep','cliff'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','surface'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','rapids','Deep'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','rapids','Deep'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','rapids','Deep'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','shallow','rapids','obstacle'],// 出现水域类型
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
    habitats: ['backwater','slowmoving','Deep','shallow','surface'],
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
    habitats: ['rapids','obstacle','Deep','backwater','slowmoving'],// 出现水域类型
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
    }},{
      id: 'FISH_34',
      name: '一块破布',
      rarity: WASTE,//稀有度
      description: '你别说，拉力还可以。',
      habitats: ['backwater','slowmoving','shallow','obstacle','Deep','rapids','surface','obstacle'],// 出现水域类型
      baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
      QTEList: ['nopower'],// 可触发QTE的事件
      QTEFail: 0.1,
      strength: [1.5, 3.51],
      BaseHP: 150,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_35',
      name: '橡胶制品',
      rarity: WASTE,//稀有度
      description: '对，就是你想的那个东西。',
      habitats: ['backwater','slowmoving','shallow','obstacle','Deep','rapids','surface','obstacle'],// 出现水域类型
      baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
      QTEList: ['nopower'],// 可触发QTE的事件
      QTEFail: 0.1,
      strength: [1.5, 3.51],
      BaseHP: 150,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_36',
      name: '水草',
      rarity: WASTE,//稀有度
      description: '中鱼就在下一竿。',
      habitats: ['backwater','slowmoving','shallow','obstacle','Deep','rapids','surface','obstacle'],// 出现水域类型
      baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
       QTEList: ['nopower'],// 可触发QTE的事件
      QTEFail: 0.1,
      strength: [1, 3],
      BaseHP: 100,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_37',
      name: '枯树枝',
      rarity: WASTE,//稀有度
      description: '有挂才有鱼。',
      habitats: ['backwater','slowmoving','shallow','obstacle','Deep','rapids','surface','obstacle'],// 出现水域类型
      baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
      QTEList: ['nopower'],// 可触发QTE的事件
      QTEFail: 0.1,
      strength: [1, 3],
      BaseHP: 120,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }}

      ,
	  
	  {
      id: 'FISH_38',
      name: '“百战”白条',
      rarity: BOSS,//稀有度
      description: '在浑浊的青焰江流域，白条鱼向来是食物链底端的 “弱者”。它们身形纤细，成群游动时宛如闪烁的碎银，却总是在黑鱼、鲶鱼等掠食者的阴影下东躲西藏。直到一次工业废水的意外泄露，大量放射性物质涌入江水，改变了整个生态链。​\n大部分白条鱼在污染中痛苦死去，唯有一条身形矫健、生性好斗的白条鱼 “百战” 在变异中觉醒。它的鱼鳃长出细密的血色脉络，能将摄入的污染物转化为战斗能量。它不再蜷缩于族群之中，反而将废弃的桥墩当作据点，用收集来的金属废料和破碎的渔具，搭建起一座充满金属质感的 “战争堡垒”。​\n“百战” 以近乎疯狂的姿态统治着领地，它会释放出特殊的化学信号，吸引其他鱼类前来争夺 “资源”。当挑战者靠近，它便如离弦之箭般发动攻击，凭借超强的爆发力和不知疲倦的战斗本能，将对手打得遍体鳞伤。久而久之，江面上漂浮着各种鱼类的残骸，而 “百战” 的威名也在整个流域不胫而走，成为所有生物闻风丧胆的存在。',
    habitats: ['backwater','slowmoving','rapids','shallow','obstacle','Deep'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
    QTEFail: 0.999,
    strength: [1, 4],
    BaseHP: 200,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_39',
      name: '“独眼”大口鲈',
      rarity: BOSS,//稀有度
      description: '在暗流涌动的黑渊湖深处，曾有一只大口鲈族群的王者，它凭借着敏锐的双眼与迅猛的捕食技巧，称霸一方。然而，一场突如其来的人类水下爆破工程，彻底改变了它的命运。爆炸产生的强大冲击波，不仅摧毁了它的栖息地，还让它失去了右眼。​\n剧痛与愤怒彻底激发了这只大口鲈的野性，它拖着受伤的身体，躲进湖底那座布满尖刺的沉船残骸中养伤。在此期间，它吞噬着误入沉船的各类生物，在血腥厮杀中不断进化。当它再次现身时，曾经的王者变得更加暴戾，被称作 “独眼”。​\n“独眼” 占据了沉船周边最危险的水域，它会用仅剩的左眼锁定猎物，再凭借超乎寻常的爆发力发起突袭。它还会利用独眼释放出特殊声波，干扰周围鱼类的方向感，让它们如同陷入迷雾般，只能乖乖成为自己的盘中餐。久而久之，黑渊湖的鱼类们谈 “独眼” 色变，它也成为了湖底最令人恐惧的存在。',
    habitats: ['backwater','slowmoving','shallow','obstacle','Deep'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.999,
    strength: [3, 4.51],//鱼的强度范围，随机
    BaseHP: 300,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_40',
      name: '“生化”鳄雀鳝',
      rarity: BOSS,//稀有度
      description: '在一座被人类遗弃的化工城市边缘，有片被污染的死水湖。这里曾是鳄雀鳝的栖息地，原本凶猛的它们在污水与泄漏化学物质的侵蚀下，发生了可怕的变异。其中一条体型最大的鳄雀鳝，在吞噬了大量变异鱼类和化工废料后，蜕变成了令人闻风丧胆的 “生化” 鳄雀鳝。​\n它的身体不断分泌出诡异的绿色黏液，所到之处，水体都会泛起阵阵毒雾。它不再满足于捕食普通鱼类，甚至会主动攻击误入水域的人类和其他大型生物。每当夜幕降临，湖面就会传来低沉的嘶吼声，那是 “生化” 鳄雀鳝在召唤被它释放出的生化孢子所感染的 “鱼群军团”，这些受控制的鱼类会组成恐怖的包围圈，将猎物逼入它的血盆大口。',
    habitats: ['Deep','slowmoving','obstacle'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.999,
    strength: [5, 10],
    BaseHP: 600,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_41',
      name: '“暴虐”鳡',
      rarity: BOSS,//稀有度
      description: '在一条暗流汹涌的古河道深处，沉睡着一处被遗忘的上古战场遗址。常年受战场残留煞气与神秘磁场影响，河道中的鳡鱼群体发生了诡异转变，其中一条身形巨大的鳡鱼更是成为 “暴虐” 的代名词。​\n它天生嗜杀，领地意识极强，在吞噬了沾染战场戾气的古兵器碎片与骸骨后，体内的暴戾因子被彻底激发。“暴虐” 鳡不再满足于常规的捕食，它会主动挑衅一切闯入领地的生物，无论是体型庞大的鲶鱼群，还是误入河道的水鸟，都难逃它的追杀。它游动时会发出震耳欲聋的嘶吼，所经之处掀起滔天巨浪，仿佛是来自远古战场的杀戮机器在宣泄无尽的怒火。更可怕的是，它能释放出特殊的声波干扰，让周围生物陷入恐惧与混乱，成为它肆意虐杀的目标。',
    habitats: ['backwater','slowmoving','shallow'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'come'],
    QTEFail: 0.999,
    strength: [5, 10],
    BaseHP: 600,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_42',
      name: '“深渊”鲶',
      rarity: BOSS,//稀有度
      description: '在一片人迹罕至的湖泊底部，隐藏着深不见底的水下洞穴群，这里弥漫着永恒的黑暗与神秘。一条普通的鲶鱼偶然游入洞穴最深处，接触到了蕴含远古深渊力量的黑色晶体。黑暗能量不断侵蚀着它的身体，让它发生了恐怖的变异，成为令人闻风丧胆的 “深渊” 鲶。​\n“深渊” 鲶掌控着洞穴内的黑暗力量，它会在洞穴入口释放出黑色迷雾，将误入其中的生物困在迷雾迷宫里。它还能召唤由腐烂水草和淤泥组成的 “触手”，从各个角落发动袭击。每当有猎物靠近，洞穴深处就会传来低沉而诡异的 “咕噜” 声，那是 “深渊” 鲶在宣告领地主权，也是死亡降临的预兆。它如同深渊的使者，吞噬着所有敢于踏入这片黑暗领域的生命，将湖泊变成了充满恐惧的死亡禁地。',
     habitats: ['backwater','Deep'],
    baitPref: ['BREADone','BREADtwo'],
    QTEList: ['nopower', 'InObstacles', 'SpeedUp', 'nomove', 'come'],
    QTEFail: 0.999,
    strength: [2.5, 4.91],
    BaseHP: 350,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }},{
      id: 'FISH_43',
      name: '“幽冥”鳟',
      rarity: BOSS,//稀有度
      description: '在终年笼罩着浓雾的寒潭深处，沉睡着一座被遗忘的古代祭坛。一条生性机敏的鳟鱼，在一次觅食时误触祭坛封印，释放出了沉睡千年的幽冥之气。这股阴气如附骨之疽般缠绕着鳟鱼，使其身体与灵魂都发生了扭曲，“幽冥” 鳟就此诞生。​\n“幽冥” 鳟掌控着寒潭的生死轮回，它游动时，身后会拖曳出一条由幽蓝色磷火组成的光带，如同引路的冥河。它能操纵潭底的枯木、骸骨组成 “幽冥军团”，对闯入领地的生物发动围攻。每当月圆之夜，寒潭水面便会浮现出模糊的人脸虚影，伴随着空灵而凄厉的哀鸣，那是 “幽冥” 鳟在召唤被它吞噬的亡魂，将整片水域化作阴森恐怖的幽冥世界。',
   habitats: ['backwater','slowmoving','shallow','rapids'],// 出现水域类型
    baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
    QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower', 'come'],// 可触发QTE的事件
    QTEFail: 0.999,
    strength: [2.5, 4.91],//鱼的强度范围，随机
    BaseHP: 350,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }}
];

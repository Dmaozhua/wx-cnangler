// 定义稀有度常量
export const COMMON = 'COMMON';
export const UNCOMMON = 'UNCOMMON';
export const RARE = 'RARE';
export const EPIC = 'EPIC';
export const MYTHIC = 'MYTHIC';
export const BOSS = 'BOSS';
export const WASTE = 'WASTE';

export const RARITY_MULTIPLIER = {
  [COMMON]: 2.0,  // 普通
  [UNCOMMON]: 1.5, // 少见
  [RARE]: 1.0,     // 稀有
  [EPIC]: 0.7,     // 史诗级
  [MYTHIC]: 0.3,   // 传说级  
  [BOSS]: 0,       // Boss级
  [WASTE]: 0.6,    // 杂物
};
  
  export const FishData = [    
    {
      id: 'FISH_01',
      name: '大口黑鲈',
      rarity: RARE,//稀有度
      description: '路亚圈的真正核心，路亚的重中之重。',
      habitats: ['slowmoving','Deep','obstacle'],// 出现水域类型
      baitPref: ['BREADone','BREADtwo'],// 鱼饵类型，当前默认
      QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower'],// 可触发QTE的事件
      QTEFail: 0.3,//qte失败后，逃跑概率
      strength: [2, 2.01],//鱼的强度范围，随机
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
      description: '城市河道的明星，溪流精灵',
      habitats: ['backwater','slowmoving','rapids'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.15,
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
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.1,
      strength: [0.5, 1.3],
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
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.1,
      strength: [2.5, 8],
      BaseHP: 400,
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
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.1,
      strength: [3, 12],
      BaseHP: 1200,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 1.8,
        "rainy": 0.3
      }
    },
    {
      id: 'FISH_06',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_07',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_08',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_09',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_10',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_11',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_12',
      name: '白条',
      rarity: COMMON,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_13',
      name: '白条爷爷',
      rarity: BOSS,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
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
    },
    {
      id: 'FISH_14',
      name: '溪哥',
      rarity: UNCOMMON,
      description: '城市河道的明星，溪流精灵',
      habitats: ['backwater','slowmoving','rapids'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.15,
      strength: [0.5, 1.5],
      BaseHP: 120,
      Image: 'https://anglertest.xyz/game/fish/fishon.webp',
      backgroundImage: 'https://anglertest.xyz/game/fish/5.webp',
      defImage: '../../images/icons/whatfish.png',
      weatherAffinity: {
        "sunny": 1.8,
        "rainy": 0.3
      }
    }
  ];
export const RARITY_MULTIPLIER = {
    1: 2.0,  // 普通
    2: 1.5,
    3: 1.0,  // 当前示例的3星
    4: 0.7,
    5: 0.3   // 传说级
  };
  
  export const FishData = [    
    {
      id: 'FISH_01',
      name: '大口黑鲈',
      rarity: 3,
      description: '路亚圈的真正核心，路亚的重中之重。',
      habitats: ['shallow','Deep','obstacle'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['JUMP', 'InObstacles', 'SpeedUp', 'nopower'],
      QTEFail: 0.1,
      strength: [2, 4],
      BaseHP: 200,
      image1: '../../images/icons/fishon.png',
      image2: '../../images/icons/fishon.png',
      weatherAffinity: {
        "sunny": 0.6,
        "rainy": 1.7
      }
    },
    {
      id: 'FISH_02',
      name: '马口',
      rarity: 2,
      description: '城市河道的明星，溪流精灵',
      habitats: ['backwater','slowmoving','rapids'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.15,
      strength: [0.5, 1.5],
      BaseHP: 120,
      image1: '../../images/icons/fishon.png',
      image2: '../../images/icons/fishon.png',
      weatherAffinity: {
        "sunny": 1.8,
        "rainy": 0.3
      }
    },
    {
      id: 'FISH_03',
      name: '白条',
      rarity: 1,
      description: '这是尊严，要轻拿轻放。',
      habitats: ['backwater','slowmoving','rapids','shallow','obstacle','surface'],
      baitPref: ['BREADone','BREADtwo'],
      QTEList: ['nopower', 'InObstacles', 'SpeedUp'],
      QTEFail: 0.1,
      strength: [0.4, 1.3],
      BaseHP: 100,
      image1: '../../images/icons/fishon.png',
      image2: '../../images/icons/fishon.png',
      weatherAffinity: {
        "sunny": 1.8,
        "rainy": 0.3
      }
    }
  ];
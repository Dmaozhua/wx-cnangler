export const WaterData = [
    {
      id: 'WATER_01',
      name: '溪流',
      description: '清澈的山间溪流，水流急缓相间，适合钓一些喜欢流水的鱼类。',
      habitats:{
        backwater: '回水湾',
        slowmoving: '缓流',
        rapids: '急流'
        // ,
        // shallow: '浅滩',
        // obstacle: '障碍'
      },
      image: 'https://anglertest.xyz/game/BG/stream.png',
      backgroundImage: 'https://anglertest.xyz/game/BG/stream.png',
      fishProbabilities: {
        backwater: { FISH_01: 0.5,FISH_14: 0.4, FISH_02: 0.4,  FISH_03: 0.2,  FISH_04: 0.05,  FISH_05: 0.05,NONE: 0 ,FISH_13: 0.001},
        slowmoving: { FISH_01: 0.9,NONE: 0.1  },
        rapids:    { FISH_02: 0.35, FISH_03: 0.25, NONE: 0.3 }
        // ,
        // shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        // obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
      }
    }
    // ,
    // {
    //   id: 'WATER_02',
    //   name: '湖泊',
    //   description: '平静又开阔的的湖泊，适合长时间等待运气。',
    //   habitats:{
    //     backwater: '回水湾',
    //     slowmoving: '缓流',
    //     rapids: '急流',
    //     shallow: '浅滩',
    //     obstacle: '障碍'
    //   },
    //   image: 'https://anglertest.xyz/game/BG/rivers.png',
    //   backgroundImage: 'https://anglertest.xyz/game/BG/rivers.png',
    //   fishProbabilities: {
    //     backwater: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     slowmoving: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     rapids:    { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
    //   }
    // }

    // ,
    // {
    //   id: 'WATER_03',
    //   name: '城市河道',
    //   description: '热门标点乃兵家必争之地，城市精灵的栖息地。',
    //   habitats:{
    //     backwater: '回水湾',
    //     slowmoving: '缓流',
    //     rapids: '急流',
    //     shallow: '浅滩',
    //     obstacle: '障碍'
    //   },
    //   image: 'https://anglertest.xyz/game/BG/city.png',
    //   backgroundImage: 'https://anglertest.xyz/game/BG/city.png',
    //   fishProbabilities: {
    //     backwater: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     slowmoving: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     rapids:    { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
    //     obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
    //   }
    // }

  ];
  
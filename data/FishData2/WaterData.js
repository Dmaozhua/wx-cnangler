export const WaterData = [
    {
      id: 'WATER_01',
      name: '溪流',
      description: '山涧清泉潺潺而下，急缓交织的水纹里，是溪流精灵的隐秘居所。',
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
        slowmoving: { FISH_38: 0.5,FISH_39: 0.5,NONE: 0.1  },
        rapids:    { FISH_02: 0.35, FISH_03: 0.25, NONE: 0.3 }
        // ,
        // shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        // obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
      }
    }
    // ,
    // {
    //   id: 'WATER_02',
    //   name: '湖库',
    //   description: '如镜般的湖面下暗藏玄机，深浅交错的沟壑与枯木丛构成天然迷宫，适合长时间进行探索。',
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
    //   description: '在钢筋水泥丛林中的蓝色动脉，热门标点乃兵家必争之地，看似平凡的角落，也隐藏着一些惊喜。',
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
    // ,
    // {
    //   id: 'WATER_04',
    //   name: '水坝下游',
    //   description: '混凝土构筑的堤坝与湍急的漩涡，形成强大的能量场，成为掠食者们绝佳的狩猎天堂。',
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
    // },
    // {
    //   id: 'WATER_05',
    //   name: '江河支流',
    //   description: ' 宛如大地脉络般的江河支流，蜿蜒的河水裹挟着上游的馈赠，深潭之中，巨物蛰伏，等待着最佳的捕食时机。',
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
  
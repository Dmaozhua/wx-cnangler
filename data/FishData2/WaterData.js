export const WaterData = [
  {
    id: 'WATER_01',
    name: '溪流',
    description: '山涧清泉潺潺而下,急缓交织的水纹里,是溪流精灵的隐秘居所。',
    habitats:{
      backwater: '回水湾',
      slowmoving: '缓流',
      rapids: '急流',
      shallow: '浅滩',
      obstacle: '障碍',
      Deep:'深潭'
    },
    image: 'https://anglertest.xyz/game/BG/stream.webp',
    backgroundImage: 'https://anglertest.xyz/game/BG/stream.webp',
    fishProbabilities: {
      backwater: {  FISH_36:0.1,FISH_43:0.0001,FISH_33:0.01,FISH_28:0.05,FISH_27:0.01,FISH_25:0.01,FISH_24:0.05,FISH_23:0.05,FISH_18:0.1,FISH_17:0.1,FISH_14:0.1,FISH_13:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_03:0.4,FISH_02:0.2 ,NONE: 0.3 },//     backwater: '回水湾',
      slowmoving: {  FISH_36:0.1,FISH_43:0.0001,FISH_33:0.01,FISH_28:0.05,FISH_27:0.01,FISH_25:0.01,FISH_24:0.05,FISH_23:0.05,FISH_21:0.05,FISH_18:0.1,FISH_17:0.1,FISH_11:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_03:0.4,FISH_02:0.2,NONE: 0.3  }, //     slowmoving: '缓流',
      rapids:    {   FISH_37:0.1,FISH_43:0.0001,FISH_33:0.01,FISH_30:0.01,FISH_28:0.05,FISH_25:0.01,FISH_24:0.05,FISH_23:0.05,FISH_21:0.05,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_03:0.4,FISH_02:0.2, NONE: 0.3 },    //     rapids: '急流',
      shallow:   {   FISH_36:0.1,FISH_43:0.0001,FISH_28:0.05,FISH_27:0.01,FISH_25:0.01,FISH_24:0.05,FISH_23:0.05,FISH_18:0.1,FISH_17:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_03:0.4,FISH_02:0.2, NONE: 0.3 },   //     shallow: '浅滩',
      obstacle:  {  FISH_36:0.1,FISH_43:0.0001,FISH_28:0.05,FISH_21:0.05,FISH_16:0.2,FISH_14:0.1,FISH_13:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_03:0.2,FISH_04:0.05,FISH_02:0.2, NONE: 0.3 },    //     obstacle: '障碍'
      Deep:  { FISH_37:0.1,FISH_34:0.1,FISH_43:0.0001,FISH_30:0.01,FISH_27:0.01,FISH_24:0.05,FISH_23:0.05,FISH_18:0.1,FISH_17:0.1,FISH_11:0.1,FISH_09:0.2,FISH_08:0.2,FISH_04:0.1,FISH_03:0.4,FISH_02:0.2, NONE: 0.3 }    //     Deep: '深滩'
    }
  }
  ,
  {
    id: 'WATER_02',
    name: '湖库',
    description: '如镜般的湖面下暗藏玄机,深浅交错的沟壑与枯木丛构成天然迷宫,适合长时间进行探索。',
    habitats:{
      backwater: '回水湾',
      slowmoving: '缓流',
      obstacle: '障碍',
      cliff:'崖壁',
      surface:'水面',
      Deep:'深水'
    },
    image: 'https://anglertest.xyz/game/BG/rivers.webp',
    backgroundImage: 'https://anglertest.xyz/game/BG/rivers.webp',
    fishProbabilities: {
      backwater: { FISH_37:0.1,FISH_34:0.1,FISH_39:0.0001,FISH_29:0.3,FISH_22:0.1,FISH_19:0.15,FISH_15:0.1,FISH_11:0.2,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_05:0.05,FISH_03:0.3,FISH_01:0.1,NONE: 0.3 },//     backwater: '回水湾',
      slowmoving: {  FISH_36:0.1,FISH_34:0.1,FISH_39:0.0001,FISH_29:0.3,FISH_26:0.15,FISH_22:0.1,FISH_19:0.15,FISH_15:0.1,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_05:0.05,FISH_04:0.1,FISH_03:0.3,FFISH_02:0.2,FISH_01:0.1,NONE: 0.3  }, //     slowmoving: '缓流',
      surface:    { FISH_39:0.0001,FISH_29:0.3,FISH_22:0.1,FISH_09:0.2,FISH_08:0.2,FISH_05:0.05,FISH_03:0.3,FFISH_01:0.1, NONE: 0.3 },    //     surface: '水面',
      cliff:   {  FISH_39:0.0001,FISH_21:0.1,FISH_19:0.15,FISH_11:0.2,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_04:0.1,FISH_03:0.3,FISH_01:0.1, NONE: 0.3 },   //     cliff:'崖壁',
      obstacle:  {  FISH_36:0.1,FISH_39:0.0001,FISH_32:0.01,FISH_29:0.3,FISH_26:0.15,FISH_21:0.1,FISH_19:0.15,FISH_15:0.1,FISH_13:0.1,FISH_09:0.2,FISH_08:0.2,FISH_04:0.1,FISH_01:0.1, NONE: 0.3 },    //     obstacle: '障碍'
      Deep:  { FISH_37:0.1,FISH_39:0.0001,FISH_29:0.3,FISH_26:0.15,FISH_21:0.1,FISH_19:0.15,FISH_15:0.1,FISH_12:0.1,FISH_11:0.2,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_03:0.3,FISH_01:0.1, NONE: 0.3 }    //     Deep: '深滩'
    }
  }

  ,
  {
    id: 'WATER_03',
    name: '城市河道',
    description: '在钢筋水泥丛林中的蓝色动脉,热门标点乃兵家必争之地,看似平凡的角落,也隐藏着一些惊喜。',
    habitats:{
      backwater: '回水湾',
      slowmoving: '缓流',
      rapids: '急流',
      shallow: '浅滩',
      obstacle: '障碍',
		  surface:'水面'
    },
    image: 'https://anglertest.xyz/game/BG/city.webp',
    backgroundImage: 'https://anglertest.xyz/game/BG/city.webp',
    fishProbabilities: {
      backwater: {  FISH_40:0.0001,FISH_12:0.1,FISH_35:0.06,FISH_36:0.1,FISH_38:0.0001,FISH_29:0.3,FISH_28:0.05,FISH_27:0.01,FISH_18:0.1,FISH_17:0.1,FISH_13:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_06:0.2,FISH_05:0.05,FISH_03:0.4,FISH_02:0.2 ,NONE: 0.3 },//     backwater: '回水湾',
      slowmoving: {  FISH_40:0.0001,FISH_34:0.1,FISH_36:0.1,FISH_38:0.0001,FISH_29:0.3,FISH_22:0.1,FISH_28:0.05,FISH_27:0.01,FISH_18:0.1,FISH_17:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_07:0.25,FISH_06:0.2,FISH_03:0.4,FISH_05:0.05,FISH_02:0.2,FISH_01:0.1,NONE: 0.3  }, //     slowmoving: '缓流',
      rapids:    {   FISH_40:0.0001,FISH_37:0.1,FISH_38:0.0001,FISH_28:0.05,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_03:0.4,FISH_02:0.2, NONE: 0.3 },    //     rapids: '急流',
      shallow:   {   FISH_40:0.0001,FISH_36:0.1,FISH_38:0.0001,FISH_28:0.05,FISH_27:0.01,FISH_29:0.3,FISH_18:0.1,FISH_17:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_06:0.2,FISH_07:0.25,FISH_03:0.4,FISH_02:0.2, NONE: 0.3 },   //     shallow: '浅滩',
      obstacle:  {  FISH_40:0.0001,FISH_37:0.1,FISH_36:0.1,FISH_38:0.0001,FISH_28:0.05,FISH_29:0.3,FISH_16:0.2,FISH_14:0.1,FISH_13:0.1,FISH_11:0.1,FISH_10:0.2,FISH_09:0.2,FISH_08:0.2,FISH_03:0.2,FISH_04:0.05,FISH_01:0.1, NONE: 0.3 },    //     obstacle: '障碍'
      surface:    { FISH_40:0.0001,FISH_39:0.0001,FISH_38:0.0001,FISH_29:0.3,FISH_22:0.1,FISH_09:0.2,FISH_08:0.2,FISH_05:0.05,FISH_03:0.3,FISH_11:0.1,FISH_01:0.1,FISH_02:0.2, NONE: 0.3 },    //     surface: '水面',
    }
  }
  ,
  {
    id: 'WATER_04',
    name: '水坝下游',
    description: '混凝土构筑的堤坝与湍急的漩涡,形成强大的能量场,成为掠食者们绝佳的狩猎天堂。',
    habitats:{
      backwater: '回水湾',
      slowmoving: '缓流',
      rapids: '急流',
      shallow: '浅滩',
      obstacle: '障碍',
		  Deep:'深水'
    },
    image: 'https://anglertest.xyz/game/BG/dam.webp',
    backgroundImage: 'https://anglertest.xyz/game/BG/dam.webp',
    fishProbabilities: {
      backwater: {FISH_41:0.0001,FISH_35:0.1,FISH_34:0.1,FISH_29:0.15,FISH_22:0.1,FISH_21:0.08,FISH_12:0.08,FISH_11:0.15,FISH_10:0.1,FISH_08:0.25,FISH_09:0.25,FISH_05:0.01,FISH_04:0.15,FISH_03:0.25,FISH_02:0.1 ,NONE: 0.3},//     backwater: '回水湾',
      slowmoving: {FISH_41:0.0001,FISH_36:0.1,FISH_34:0.1,FISH_29:0.15,FISH_22:0.1,FISH_21:0.08,FISH_12:0.08,FISH_11:0.15,FISH_10:0.1,FISH_08:0.25,FISH_07:0.15,FISH_09:0.25,FISH_05:0.01,FISH_04:0.15,FISH_03:0.25,FISH_02:0.1  ,NONE: 0.3  }, //     slowmoving: '缓流',
      rapids:    { FISH_41:0.0001,FISH_21:0.08,FISH_10:0.1,FISH_11:0.15,FISH_08:0.25,FISH_09:0.25,FISH_05:0.01,FISH_04:0.15, NONE: 0.3 },    //     rapids: '急流',
      shallow:   {FISH_41:0.0001,FISH_37:0.1,FISH_29:0.15,FISH_22:0.1,FISH_12:0.08,FISH_11:0.15,FISH_10:0.1,FISH_08:0.25,FISH_09:0.25,FISH_05:0.01,FISH_03:0.25,FISH_02:0.1  , NONE: 0.3 },   //     shallow: '浅滩',
      obstacle:  {FISH_41:0.0001,FISH_37:0.1,FISH_29:0.15,FISH_21:0.08,FISH_16:0.08,FISH_12:0.08,FISH_11:0.15,FISH_10:0.1,FISH_08:0.25,FISH_09:0.25,FISH_05:0.01,FISH_04:0.15, NONE: 0.3 },    //     obstacle: '障碍'
      Deep:  { FISH_41:0.0001,FISH_34:0.1,FISH_21:0.08,FISH_12:0.08,FISH_11:0.15,FISH_10:0.1,FISH_08:0.25,FISH_09:0.25,FISH_04:0.15, NONE: 0.3 }    //     Deep: '深滩'
    }
  },
{
    id: 'WATER_05',
    name: '江河支流',
    description: ' 宛如大地脉络般的江河支流,蜿蜒的河水裹挟着上游的馈赠,深潭之中,巨物蛰伏,等待着最佳的捕食时机。',
    habitats:{
      backwater: '回水湾',
      slowmoving: '缓流',
      rapids: '急流',
      shallow: '浅滩',
      obstacle: '障碍',
	  	Deep:'深水'
    },
    image: 'https://anglertest.xyz/game/BG/tributaries.webp',
    backgroundImage: 'https://anglertest.xyz/game/BG/tributaries.webp',
    fishProbabilities: {
      backwater: { FISH_38:0.01,FISH_36:0.1,FISH_42:0.0001,FISH_31:0.08,FISH_22:0.1,FISH_20:0.08,FISH_29:0.1,FISH_12:0.08,FISH_11:0.1,FISH_08:0.25,FISH_09:0.25,FISH_05:0.05,FISH_03:0.25,FISH_01:0.1,NONE: 0.3 },//     backwater: '回水湾',
      slowmoving: {  FISH_38:0.01,FISH_37:0.1,FISH_42:0.0001,FISH_17:0.15,FISH_22:0.1,FISH_21:0.1,FISH_20:0.08,FISH_11:0.1,FISH_08:0.25,FISH_04:0.1,FISH_07:0.25,FISH_09:0.25,FISH_05:0.05,FISH_03:0.25,NONE: 0.3  }, //     slowmoving: '缓流',
      rapids:    { FISH_38:0.01,FISH_34:0.1,FISH_42:0.0001,FISH_18:0.15,FISH_31:0.08,FISH_21:0.1,FISH_05:0.05,FISH_11:0.08,FISH_12:0.08,FISH_04:0.1,FISH_10:0.15,FISH_02:0.15 ,NONE: 0.3 },    //     rapids: '急流',
      shallow:   { FISH_38:0.01,FISH_36:0.1,FISH_42:0.0001,FISH_31:0.08,FISH_22:0.1,FISH_20:0.08,FISH_11:0.1,FISH_08:0.25,FISH_09:0.25,FISH_29:0.1,FISH_05:0.05,FISH_03:0.25,FISH_01:0.1, NONE: 0.3 },   //     shallow: '浅滩',
      obstacle:  { FISH_38:0.01,FISH_37:0.1,FISH_42:0.0001,FISH_31:0.08,FISH_21:0.1,FISH_20:0.08,FISH_13:0.1,FISH_12:0.08,FISH_11:0.1,FISH_05:0.05,FISH_04:0.1,FISH_01:0.1, NONE: 0.3 },    //     obstacle: '障碍'
      Deep:  { FISH_38:0.01,FISH_42:0.0001,FISH_21:0.1,FISH_12:0.08,FISH_11:0.1,FISH_08:0.25,FISH_09:0.25,FISH_07:0.25,FISH_04:0.1, NONE: 0.3 }    //     Deep: '深滩'
    }
  }
];

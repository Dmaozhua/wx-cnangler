import { COMMON,UNCOMMON,RARE, EPIC, MYTHIC, BOSS ,WASTE} from './FishDataAll';

export const WeatherEvents = [
  {
    id: 'sunny',
    type: 'BASE',
    name: '风和日丽',
    description: '钓鱼和好天气更加匹配，所有鱼的活动度+10%',
    effects: { baseMultiplier: 1.1 },
    weight:0.1
  },
  {
    id: 'rainy',
    type: 'BASE',
    name: '细雨绵绵',
    description: '静谧的氛围让钓手更加专注，鱼饵效率+10%',
    effects: { baitEffect: 1.1 },
    weight:0.1
  },
  {
    id: 'windy',
    type: 'BASE',
    name: '微风轻拂',
    description: '鱼儿舒适人也爽，鱼饵效率+10%',
    effects: { baitEffect: 1.1 },
    weight:0.1
  },
  {
    id: 'EX001',
    type: 'EXTRA',
    name: '出现彩虹',
    description: '不虚此行，拍照留念。好运不知不觉增加，高稀有度鱼出现概率x2',
    effects: {
      rareFishBoost: {
        value: 2,
        targetRarity: [RARE, EPIC, MYTHIC]
      }
    },
    weight:0.1
  },
  {
    id: 'EX002',
    type: 'EXTRA',
    name: '浓雾弥漫',
    description: '水面浮着层薄纱似的雾，像在为神秘的事物拉开序幕。极高稀有度鱼出现概率x2',
    effects: {
      rareFishBoost: {
        value: 2,
        targetRarity: [RARE, EPIC, MYTHIC]
      }
    },
    weight:0.1
  }
  // {
  //   id: 'EX003',
  //   type: 'EXTRA',
  //   name: '鱼群迁徙',
  //   description: '不虚此行，拍照留念。好运不知不觉增加，高稀有度鱼出现概率x2',
  //   effects: {
  //     rareFishBoost: {
  //       value: 2,
  //       targetRarity: [RARE, EPIC, MYTHIC]
  //     }
  //   },
  //   weight:0.1
  // },
  // {
  //   id: 'EX004',
  //   type: 'EXTRA',
  //   name: '烈日当空',
  //   description: '不虚此行，拍照留念。好运不知不觉增加，高稀有度鱼出现概率x2',
  //   effects: {
  //     rareFishBoost: {
  //       value: 2,
  //       targetRarity: [RARE, EPIC, MYTHIC]
  //     }
  //   },
  //   weight:0.1
  // }
,
  {
    id: 'EX005',
    type: 'EXTRA',
    name: '雷暴天气',
    description: '作为理智和有责任心的钓鱼人，此刻你决定暂时撤离等待雷暴结束。\n钓鱼时间减少99%，但下一竿总存在着惊喜。',
    effects: { timeModifier: -0.99 ,nextFishRarity: { rarity: MYTHIC, blockEvents: true }},
    weight:0.9
  }
];

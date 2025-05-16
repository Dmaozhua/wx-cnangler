export const WeatherEvents = [
  {
    id: 'sunny',
    type: 'BASE',
    name: '风和日丽',
    description: '钓鱼和好天气更加匹配，所有鱼的活动度+10%',
    effects: { baseMultiplier: 1.1 }
  },
  {
    id: 'rainy',
    type: 'BASE',
    name: '细雨绵绵',
    description: '静谧的氛围让钓手更加专注，鱼饵效率+10%',
    effects: { baitEffect: 1.1 }
  },
  {
    id: 'windy',
    type: 'BASE',
    name: '微风轻拂',
    description: '鱼儿舒适人也爽，鱼饵效率+10%',
    effects: { baitEffect: 1.1 }
  },
  {
    id: 'rainbow',
    type: 'EXTRA',
    name: '出现彩虹',
    description: '不虚此行，拍照留念。好运不知不觉增加，高稀有度鱼出现概率x2',
    effects: {
      rareFishBoost: {
        value: 2,
        targetRarity: [3, 4, 5]
      }
    }
  }
];

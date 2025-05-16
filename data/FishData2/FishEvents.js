
export const FishEvents = [
    {
      id: 'EVENT1',
      type: 'AFT_FISHON',
      name: '发现奇怪的东西',
      description: '你突然发现了一个奇怪的东西，决定去看看，之后运气爆棚。\n稀有鱼出现概率增加20%',
      effects: { rareFishBoost: { value: 1.2, targetRarity: [3, 4, 5] } }
    },
    {
      id: 'EVENT2',
      type: 'AFT_FISHON',
      name: '邂逅女钓友',
      description: '突然发现女钓友，你决定去搭讪。\n装笔心切，鱼儿基础概率下降10%',
      effects: { baseMultiplier: 0.9 }
    },
    {
      id: 'EVENT3',
      type: 'BEF_FISHON',
      name: '无法幸免',
      description: '随意的一竿，却挂到了身后的草丛。\n突然的不幸让你心情变差，\n稀有鱼出现概率降低20%',
      effects: { rareFishBoost: { value: 0.8, targetRarity: [3, 4, 5] } }
    },
    {
      id: 'EVENT4',
      type: 'BEF_FISHON',
      name: '迟早会来',
      description: '任性的一抛，炒了一盘的粉。\n埋头解线，钓鱼时间减少10%',
      effects: { timeModifier: -0.1 }
    }
  ];
  
export const WaterData = [
    {
      id: 'WATER_01',
      name: '溪流',
      description: '清澈的山间溪流，水流急缓相间，适合钓一些喜欢流水的鱼类。',
      habitats:{
        backwater: '回水湾',
        slowmoving: '缓流',
        rapids: '急流',
        shallow: '浅滩',
        obstacle: '障碍'
      },
      image: '../../images/icons/stream.png',
      backgroundImage: '/images/icons/stream.png',
      fishProbabilities: {
        backwater: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        slowmoving: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        rapids:    { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
      }
    },
    {
      id: 'WATER_02',
      name: '湖泊',
      description: '平静又开阔的的湖泊，适合长时间等待运气。',
      habitats:{
        backwater: '回水湾',
        slowmoving: '缓流',
        rapids: '急流',
        shallow: '浅滩',
        obstacle: '障碍'
      },
      image: '../../images/icons/rivers.png',
      backgroundImage: '/images/icons/rivers.png',
      fishProbabilities: {
        backwater: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        slowmoving: { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        rapids:    { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        shallow:   { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 },
        obstacle:  { FISH_01: 0.35, FISH_02: 0.25, NONE: 0.3 }
      }
    }
  ];
  
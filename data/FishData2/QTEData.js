export const QTEData = [
    {
      id: 'JUMP',
      description: "鱼跃出了水面！",
      duration: 1.8, // 秒
      options: {
        xiaya: {
          description: '侧身下压',
          attack: 2,  
          linedam: 0.01
        },
        shouxian: {
          description: '保持不动',
          attack: 0.1,
          linedam: 0.25  
        }
      }
    },
    {
      id: 'InObstacles',
      description: "鱼要钻入障碍区！",
      duration: 2.5,
      options: {
        qiangla: {
          description: '反向弓鱼',
          attack: 3.5,
          linedam: 0.01
        },
        songxian: {
          description: '持续收线',
          attack: 0.5,
          linedam: 0.25
        },
        xieli: {
          description: '强锁泄力',
          attack: 6,
          linedam: 0.3
        }
      }
    },
    {
      id: 'SpeedUp',
      description: "突然加速猛冲！",
      duration: 2.5,
      options: {
        gensu: {
          description: '收线对抗',
          attack: 0.8,
          linedam: 0.25
        },
        fangxian: {
          description: '竖竿缓冲',
          attack: 3.6,
          linedam: 0.05
        }
      }
    },
    {
      id: 'nopower',
      description: "鱼儿没有发力。",
      duration: 1.8,
      options: {
        default: {
          description: '加速回鱼',
          attack: 2.5,
          linedam: 0.05
        }
      }
    },
    {
      id: 'nomove',
      description: "鱼突然静止。",
      duration: 2.8,
      options: {
        default: {
          description: '硬碰硬',
          attack: 0.9,
          linedam: 0.3
        },
        fangxian: {
          description: '轻抖鱼竿',
          attack: 2,
          linedam: 0.05
        }
      }
    },
    {
      id: 'come',
      description: "线突然了失去张力。",
      duration: 2,
      options: {
        default: {
          description: '疯狂收线',
          attack: 2,
          linedam: 0.1
        },
        fangxian: {
          description: '横向引竿',
          attack: 2,
          linedam: 0.1
        },
        nofish: {
          description: '鱼呢？',
          attack: 0.001,
          linedam: 0.001
        }
      }
    }
  ];
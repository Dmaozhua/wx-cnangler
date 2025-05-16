export const QTEData = [
    {
      id: 'JUMP',
      description: "鱼跃出水面！",
      duration: 2, // 秒
      options: {
        xiaya: {
          description: '下压竿稍',
          attack: 1.8,  // 高风险高回报
          linedam: 0
        },
        shouxian: {
          description: '保持不动',
          attack: 1.0,
          linedam: 20  // 保线优先
        }
      }
    },
    {
      id: 'InObstacles',
      description: "鱼要钻入障碍区！",
      duration: 3,
      options: {
        qiangla: {
          description: '反向弓鱼',
          attack: 2.2,
          linedam: 20
        },
        songxian: {
          description: '持续收线',
          attack: 0.5,
          linedam: 15
        }
      }
    },
    {
      id: 'SpeedUp',
      description: "鱼突然的加速！",
      duration: 3,
      options: {
        gensu: {
          description: '收线对抗',
          attack: 1.5,
          linedam: 15
        },
        fangxian: {
          description: '握紧鱼竿',
          attack: 0.8,
          linedam: 8
        }
      }
    },
    {
      id: 'nopower',
      description: "鱼儿没有发力",
      duration: 2,
      options: {
        default: {
          description: '加速回鱼',
          attack: 1.2,
          linedam: 10
        }
      }
    }
  ];
const ganzi = {
  id: 34,
  title: "路亚钓竿 推荐测试（淡水版v0.2）",
  questions: [
    {
      id: 1,
      text: "主要作钓水域类型是？",
      options: [
        {
          text: "湖库（大面积开放水域）",
          resultKey: [['Length',4], ['Power',4], ['Action',2]], // 原4+1+2=7→5+2+3=10
          icon: "🌊"
        },
        {
          text: "江河支流（缓/急流区）",
          resultKey: [['Length',3], ['Sensitivity',4], ['Action',3]], // 原3+2+3=8→4+3+3=10
          icon: "🚣"
        },
        {
          text: "城市河道（狭窄浅水）",
          resultKey: [['Recovery',4.5], ['Sensitivity',4.5],['Length',1]], // 原5+4+1=10→保持
          icon: "🏙️"
        },
        {
          text: "管理场（浅/结构复杂）",
          resultKey: [['Length',2], ['Sensitivity',4], ['Action',4]], // 原4+5+4=13→3+4+3=10
          icon: "🎯"
        }
      ]
    },
    {
      id: 2,
      text: "目标鱼主要栖息在？",
      options: [
        {
          text: "底栖（鲶鱼/鳜鱼）",
          resultKey: [['Power',2], ['Action',4], ['Sensitivity',4]], // 原5+4+3=12→4+3+3=10
          icon: "🐟"
        },
        {
          text: "巡游（翘嘴/鱤鱼）",
          resultKey: [['Length',5], ['Power',5]], // 原5+4+3=12→4+3+3=10
          icon: "🎏"
        },
        {
          text: "急流（马口/军鱼）",
          resultKey: [['Recovery',4.5], ['Sensitivity',4.5],['Length',1]], // 原3+5+4=12→3+4+3=10
          icon: "🌊"
        },
        {
          text: "草区（黑鱼/鲈鱼）",
          resultKey: [['Power',5], ['Action',5]], // 原4+5+3=12→3+4+3=10
          icon: "🌿"
        },
        {
          text: "都玩玩",
          resultKey: [['Recovery',3], ['Length',1.5],['Power',1.5],['Sensitivity',3]], // 原4+5+3=12→3+4+3=10
          icon: "🌿"
        }
      ]
    },
    {
      id: 3,
      text: "拟饵常用克重范围？",
      options: [
        {
          text: "5g以下（微物）",
          resultKey: [['Lureweight',1], ['Recovery',4.5], ['Sensitivity',4.5]],
          icon: "⚖️"
        },
        {
          text: "5-10g（泛用）",
          resultKey: [['Lureweight',3], ['Power',3],['Sensitivity',4]],
          icon: "🎚️"
        },
        {
          text: "15g起（远投/障碍）",
          resultKey: [['Lureweight',6], ['Power',4]],
          icon: "🏋️"
        }
      ]
    },
    {
      id: 4,
      text: "目标鱼平均体型？",
      options: [
        {
          text: "15cm以下（小型鱼）",
          resultKey: [['Recovery',9], ['Sensitivity',1]],
          icon: "🐠"
        },
        {
          text: "30cm左右（中型鱼）",
          resultKey: [['Power',3], ['Action',4], [' Lureweight',3]],
          icon: "🐟"
        },
        {
          text: "50cm以上（大型鱼）",
          resultKey: [['Power',4], ['Length',3], ['Lureweight',3]],
          icon: "🦈"
        }
      ]
    },{
      id: 5,
      text: "您最常需要的抛投距离是？",
      options: [
        {
          text: "短距精准抛投（20米内）",
          resultKey: [['Recovery',3], ['Sensitivity',3], ['Lureweight',1], ['Action',3]],
          icon: "🎯",
          tool : "适合障碍区精准打点"
        },
        {
          text: "中距离覆盖（30-50米）",
          resultKey: [['Length',2.5], ['Recovery',5], ['Action',2.5]],
          icon: "📏",
          tool : "泛用型抛投需求"
        },
        {
          text: "超远投搜索（50米+）",
          resultKey: [['Power',5], ['Length',5]],
          icon: "🚀",
          tool : "大水面搜索必备"
        }
      ]
    } ,
    {
      id: 6,
      text: "您更倾向于哪种操作风格？",
      options: [
        {
          text: "暴力驾驶（Power Fishing）",
          resultKey: [['Power',5], ['Action',5]],
          icon: "💥",
          tool : "强调快速起鱼与强力操控"
        },
        {
          text: "精细操控（Finesse）",
          resultKey: [['Sensitivity',6], ['Length',1.5], ['Power',2.5]],
          icon: "🎻",
          tool : "微操作感知水下动态"
        },
        {
          text: "中规中矩（Steady Retrieve）",
          resultKey: [['Recovery',3], ['Length',1.5],['Power',1.5],['Sensitivity',3]],
          icon: "🔄",
          tool : "保持稳定泳姿"
        }
      ]
    }
  ],
  dimensionWeights: {
    Power:       1.00,   // 硬度：均衡
    Action:      1.20,   // 调性速度：略微提升
    Length:      1.15,   // 竿长：略微提升
    Lureweight:  1.10,   // 饵重：适度加权
    Sensitivity: 1.15,   // 感知度：略微提升
    Recovery:    1.00,   // 回弹：均衡
  },
  results: [
    {
      title: "UL超轻快调溪流竿",
      formula:"Power >= 1 && Power <= 10 && Lureweight <= 2 && Sensitivity >= 13 && Action <= 10 && Recovery >= 16",
      description: "适合微物抛投的精细钓法，5g以下小饵操控精准，高感度设计能捕捉细微咬口",
      equip: "长度1.5-1.8m｜UL调性｜快调｜PE0.4-0.8号",
      suggestion: "溪流马口/青梢｜城市河道小鲈鱼｜管理场蓝鳃太阳鱼"
    },
    {
      title: "ML中快调泛用竿",
      formula: "Power >= 6 && Power <= 10 && Lureweight <= 10 && Length >= 2 && Sensitivity >= 13 && Sensitivity <= 20",
      description: "全能战士型钓竿，兼顾5-15g饵重范围，适合多种作钓场景",
      equip: "长度2.1-2.4m｜ML调性｜中快调｜PE1.0-1.5号",
      suggestion: "湖库翘嘴｜江河鳜鱼｜管理场鲈鱼"
    },
    {
      title: "MH强力雷强竿",
      formula:  "Power >= 22 && Action >= 18",
      description: "重障碍区专用武器，10-20g重饵暴力抛投，强悍腰力快速起鱼",
      equip: "长度2.1-2.3m｜MH/H调性｜快调｜PE2-4号",
      suggestion: "重草区黑鱼｜倒树区鲈鱼｜江河鳡鱼"
    },
    {
      title: "L长竿远投系",
      formula:   "Length >= 15 && Power <= 20",
      description: "超长竿身实现远距离精准抛投，适合大水面搜索型作钓",
      equip: "长度2.7-3.0m｜L/M调性｜中调｜PE1.2-2.0号",
      suggestion: "湖库鱤鱼｜深水区鳡鱼｜开阔水域红尾"
    },
    {
      title: "XF超快调精细竿",
      formula:  "Sensitivity >= 20 && Action >= 15 && Lureweight >= 5",
      description: "高敏度传导设计，适合软饵精细操作，感知水下细微结构",
      equip: "长度1.9-2.1m｜L/ML调性｜超快调｜PE0.6-1.2号",
      suggestion: "岩石区鳜鱼｜深场鲈鱼｜精细作钓模式"
    },
    {
      title: "此竿只应天上有，人间难有几回闻",
      formula:  "true",
      description: "建议重新测试并且注意合理搭配参数，正确的搭配不仅有助于钓获目标鱼，也能提升在整个钓鱼过程中的体验。",
      equip: "❌",
      suggestion: "❌"
    }
  ]
};
const lunzi = {
  id: 2,
  title: "路亚佬应急能力测考验",
  questions: [
      {
          id: 1,
          text: '拟饵挂底了，你会？',
          options: [
              {
                  text: '尝试大力拉扯，说不定能扯出来',
                  resultKey: [
                      ['Bold', 7],
                      ['Aggressive', 3]
                  ],
                  icon: '💪'
              },
              {
                  text: '小心地收线，慢慢调整角度尝试取出',
                  resultKey: [
                      ['Patient', 7],
                      ['Prudent', 3]
                  ],
                  icon: '🧐'
              },
              {
                  text: '直接剪断鱼线，换个拟饵继续',
                  resultKey: [
                      ['Practical', 8],
                      ['Efficient', 2]
                  ],
                  icon: '✂️'
              }
          ]
      },
      {
          id: 2,
          text: '遇到鱼咬口很凶，但就是钓不上来，你咋办？',
          options: [
              {
                  text: '换个更锋利的鱼钩，加大力度刺鱼',
                  resultKey: [
                      ['Aggressive', 7],
                      ['Patient', 3]
                  ],
                  icon: '🔪'
              },
              {
                  text: '调整拟饵的动作和速度，尝试不同的手法',
                  resultKey: [
                      ['Adaptable', 6],
                      ['Practical', 4]
                  ],
                  icon: '🔄'
              },
              {
                  text: '先休息一会儿，观察下鱼情再做决定',
                  resultKey: [
                      ['Prudent', 8],
                      ['Adaptable', 2]
                  ],
                  icon: '😴'
              }
          ]
      },
      {
          id: 3,
          text: '在陌生水域，鱼情一直不好，你怎么搞？',
          options: [
              {
                  text: '坚持在这个钓点，相信总会有鱼上钩',
                  resultKey: [
                      ['Patient', 7],
                      ['Adaptable', 3]
                  ],
                  icon: '💎'
              },
              {
                  text: '四处走走，换几个不同的钓点试试',
                  resultKey: [
                      ['Practical', 6],
                      ['Bold', 4]
                  ],
                  icon: '🚶'
              },
              {
                  text: '向当地钓友请教经验',
                  resultKey: [
                      ['Efficient', 8],
                      ['Prudent', 2]
                  ],
                  icon: '👥'
              }
          ]
      },
      {
          id: 4,
          text: '突然狂风大作，浪很大，你怎么应对？',
          options: [
              {
                  text: '不管风浪，继续抛竿作钓',
                  resultKey: [
                      ['Aggressive', 7],
                      ['Bold', 3]
                  ],
                  icon: '🌪️'
              },
              {
                  text: '找个避风的地方继续作钓',
                  resultKey: [
                      ['Patient', 6],
                      ['Practical', 4]
                  ],
                  icon: '⛺'
              },
              {
                  text: '收拾装备回家，等风停了再来',
                  resultKey: [
                      ['Prudent', 8],
                      ['Adaptable', 2]
                  ],
                  icon: '🏠'
              }
          ]
      },
      {
          id: 5,
          text: '鱼轮突然卡死了，你咋整？',
          options: [
              {
                  text: '自己动手拆开鱼轮修理',
                  resultKey: [
                      ['Patient', 7],
                      ['Bold', 3]
                  ],
                  icon: '🛠️'
              },
              {
                  text: '赶紧拿出备用鱼轮换上',
                  resultKey: [
                      ['Practical', 8],
                      ['Efficient', 2]
                  ],
                  icon: '🎏'
              },
              {
                  text: '打电话给大师朋友求救',
                  resultKey: [
                      ['Prudent', 7],
                      ['Efficient', 3]
                  ],
                  icon: '📞'
              }
          ]
      }
  ],
  dimensionWeights: {
      Bold: 1.4,
      Aggressive:1.8,
      Patient: 1.8,
      Prudent: 1.8,
      Practical: 1.4,
      Efficient: 1.4,
      Adaptable: 1.8,
  },
  results: [
      {
          title: "路亚勇者(Bold+Aggressive)",
          description: "嘿哟，你就是那路亚江湖里的勇者！不管遇到啥情况，直接开干，拟饵挂底了大力扯，鱼咬不上就加大力度刺。你这股子猛劲，说不定哪天能把水底的龙王都给钓上来！",
          formula: "(Bold>=16 && Aggressive>=13)",
          suggestion: "有时候稍微冷静下，别太冲动，不然拟饵和鱼线可遭不住你的折腾。多学习点技巧，让你的猛劲更有方向。",
          equip: "带上一些结实耐用的拟饵和鱼线，能扛得住你的大力拉扯。"
      },
      {
          title: "耐心大师(Patient+Adaptable)",
          description: "你就像一位耐心的隐士，拟饵挂底了慢慢弄，鱼咬不上就调整手法。在这快节奏的路亚世界里，你用耐心编织着自己的钓鱼梦，说不定能钓到那些最狡猾的鱼。",
          formula: "(Patient>=11 && Adaptable>=13)",
          suggestion: "继续保持这份耐心，但也别太钻牛角尖，如果实在不行，也可以换个思路。",
          equip: "一套轻便且灵活的钓具，让你在调整手法时更加得心应手。"
      },
      {
          title: "实用达人(Practical+Efficient)",
          description: "你是路亚界的实用主义者，拟饵挂底直接剪，鱼轮卡死换备用。不搞那些花里胡哨的，怎么方便怎么来，高效又实在。",
          formula: "(Practical>=13 && Efficient>=13)",
          suggestion: "可以多备一些常用的配件和拟饵，这样在遇到问题时能更快速地解决。",
          equip: "一个装满各种备用配件的渔具盒，让你随时应对突发情况。"
      },
      {
          title: "执着钓者(Patient+Aggressive)",
          description: "不管鱼情好不好，你都死死守在一个钓点，就像坚守着自己的阵地。这份执着，说不定能让你等到那条超级大鱼，成为路亚界的传奇。",
          formula: "(Patient>= 15 && Aggressive>=15)",
          suggestion: "在执着的同时，也可以适当灵活点，换个钓点说不定有意外收获。",
          equip: "一把舒适的钓椅，让你在长时间坚守时不会太累。"
      },
      {
          title: "机智探险家(Aggressive+Prudent)",
          description: "在陌生水域，你就像一个勇敢的探险家，四处走走，换钓点、请教钓友。你这灵活的头脑和探索精神，能让你发现更多的钓鱼宝藏地。",
          formula: "(Aggressive>=13 && Prudent>=11)",
          suggestion: "多和钓友交流经验，分享你的发现，说不定能建立一个属于自己的路亚小圈子。",
          equip: "一个防水的地图和指南针，让你在陌生水域也不会迷路。"
      },
      {
          title: "安全卫士(Prudent+Adaptable)",
          description: "你是路亚世界的安全守护者，狂风大作就找避风处或者回家，鱼轮卡死也不慌。你把安全和理智放在首位，让钓鱼之旅稳稳当当。",
          formula: "(Prudent>=10 && Adaptable>=12)",
          suggestion: "继续保持对安全的重视，在钓鱼前多关注下天气和水域情况。",
          equip: "一件救生衣和一个急救包，为你的安全保驾护航。"
      },
      {
          title: "自力更生者(Bold+Patient)",
          description: "你就像一个全能的工匠，鱼轮卡死自己修。你相信自己的双手，用自己的技能解决问题，在路亚的世界里走出一条属于自己的路。",
          formula: "(Bold>=13 &&Patient>=10)",
          suggestion: "多学习一些渔具维修的知识，让自己的技能更加全面。",
          equip: "一套专业的渔具维修工具，让你在修理渔具时更加得心应手。"
      },
      {
          title: "冷静观察者(Practical+Prudent)",
          description: "当鱼情不好或者遇到突发情况时，你能冷静观察，先思考再行动。你这敏锐的洞察力和冷静的头脑，能让你在复杂的路亚环境中找到最佳的解决方案。",
          formula: "(Practical>=13 && Prudent>=13)",
          suggestion: "继续保持观察和思考的习惯，这会让你在钓鱼中越来越厉害。",
          equip: "一副高倍望远镜，让你能更清楚地观察鱼情和环境。"
      },
      {
          title: "全能路亚侠",
          description: "哇塞，你就是路亚界的超级英雄！在各个方面都表现得非常出色，勇敢、耐心、实用、执着……你就像一个装满了各种技能的百宝箱。不管遇到什么困难和挑战，你都能轻松应对，让路亚之旅变得完美无缺。",
          formula: "true",
          suggestion: "继续保持自己的优势，不断挑战更高难度的路亚环境和目标鱼种。参加一些路亚比赛和交流活动，与其他高手切磋技艺，提升自己的水平。",
          equip: "配备一套顶级的路亚装备，包括高端的钓竿、渔轮、拟饵等，让你在任何情况下都能发挥出最佳水平。再带上一个专业的户外摄影设备，记录下自己精彩的路亚瞬间。"
      }
  ]
};   
const multiDimTest = {
  id: 3,
  title: "多维度测试样例",
  questions: [
    {
      id: 1,
      text: "测试问题1：多维度选择",
      options: [
        {
          text: "选项A",
          resultKey: [
            ['Dim1', 5],
            ['Dim2', 3],
            ['Dim3', 2]
          ],
          icon: "🔄"
        },
        {
          text: "选项B",
          resultKey: [
            ['Dim1', 2],
            ['Dim2', 5],
            ['Dim3', 3],
            ['Dim4', 1]
          ],
          icon: "🔄"
        }
      ]
    },
    {
      id: 2,
      text: "测试问题2：多维度选择",
      options: [
        {
          text: "选项C",
          resultKey: [
            ['Dim1', 3],
            ['Dim2', 4],
            ['Dim3', 5],
            ['Dim5', 2]
          ],
          icon: "🔄"
        },
        {
          text: "选项D",
          resultKey: [
            ['Dim1', 4],
            ['Dim2', 2],
            ['Dim4', 4],
            ['Dim5', 3]
          ],
          icon: "🔄"
        }
      ]
    }
  ],
  dimensionWeights: {
    Dim1: 1.2,
    Dim2: 1.3,
    Dim3: 1.1,
    Dim4: 1.4,
    Dim5: 1.5
  },
  results: [
    {
      title: "结果1",
      formula: "Dim1>=8 && Dim2>=7",
      description: "这是结果1的描述",
      equip: "结果1的装备",
      suggestion: "结果1的建议"
    },
    {
      title: "结果2",
      formula: "Dim3>=6 && Dim5>=3",
      description: "这是结果2的描述",
      equip: "结果2的装备",
      suggestion: "结果2的建议"
    },
    {
      title: "结果3",
      formula: "Dim4>=5",
      description: "这是结果3的描述",
      equip: "结果3的装备",
      suggestion: "结果3的建议"
    },
    {
      title: "默认结果",
      formula: "true",
      description: "这是默认结果的描述",
      equip: "默认结果的装备",
      suggestion: "默认结果的建议"
    }
  ]
};


module.exports = {
  ganzi,
  lunzi,
  multiDimTest
};


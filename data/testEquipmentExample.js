// 这是一个示例文件，展示如何在testEquipment.js中添加一个新的测试，该测试包含resultKey中有三个以上数据的情况

const multiDimExample = {
  id: 4,
  title: "钓鱼技巧综合评估",
  questions: [
    {
      id: 1,
      text: "你最擅长的钓鱼技巧是？",
      options: [
        {
          text: "精准抛投",
          resultKey: [
            ['Precision', 5],
            ['Patience', 2],
            ['Knowledge', 3],
            ['Adaptability', 1]
          ],
          icon: "🎯"
        },
        {
          text: "鱼情分析",
          resultKey: [
            ['Knowledge', 5],
            ['Observation', 4],
            ['Patience', 2],
            ['Adaptability', 3]
          ],
          icon: "🔍"
        },
        {
          text: "装备调校",
          resultKey: [
            ['Technical', 5],
            ['Precision', 3],
            ['Knowledge', 4],
            ['Creativity', 2]
          ],
          icon: "🔧"
        }
      ]
    },
    {
      id: 2,
      text: "遇到难钓的鱼，你会？",
      options: [
        {
          text: "尝试不同的饵料和手法",
          resultKey: [
            ['Adaptability', 5],
            ['Creativity', 4],
            ['Patience', 3],
            ['Technical', 2],
            ['Persistence', 3]
          ],
          icon: "🔄"
        },
        {
          text: "研究该鱼种的习性后再战",
          resultKey: [
            ['Knowledge', 5],
            ['Patience', 4],
            ['Observation', 3],
            ['Precision', 2],
            ['Persistence', 3]
          ],
          icon: "📚"
        }
      ]
    }
  ],
  dimensionWeights: {
    Precision: 1.2,    // 精准度
    Patience: 1.3,     // 耐心
    Knowledge: 1.4,    // 知识
    Adaptability: 1.5, // 适应性
    Observation: 1.2,  // 观察力
    Technical: 1.3,    // 技术性
    Creativity: 1.1,   // 创造力
    Persistence: 1.4   // 坚持性
  },
  results: [
    {
      title: "技术型钓手",
      formula: "Technical>=8 && Precision>=6",
      description: "你是一位注重技术细节的钓手，对装备和技巧有着极高的要求和理解。",
      equip: "高精度钓具，精密调校的装备",
      suggestion: "可以尝试参加一些技术性比赛，展示你的专业技能。"
    },
    {
      title: "分析型钓手",
      formula: "Knowledge>=10 && Observation>=6",
      description: "你善于分析鱼情和环境，总能找到最佳的钓点和时机。",
      equip: "多功能探鱼器，全天候观测设备",
      suggestion: "记录和分享你的分析方法，可以帮助其他钓友提高技术。"
    },
    {
      title: "创新型钓手",
      formula: "Creativity>=6 && Adaptability>=8",
      description: "你总能在困难情况下想出创新的解决方案，适应各种钓鱼环境。",
      equip: "多样化的钓具组合，自制改装的特殊装备",
      suggestion: "尝试开发一些新的钓法或改进现有技术，你的创新思维是宝贵财富。"
    },
    {
      title: "耐心型钓手",
      formula: "Patience>=10 && Persistence>=8",
      description: "你有着超乎寻常的耐心和毅力，即使在最困难的条件下也能坚持不懈。",
      equip: "舒适的钓椅，长效保温杯",
      suggestion: "挑战一些需要长时间等待的大型鱼种，你的耐心将获得回报。"
    },
    {
      title: "全能型钓手",
      formula: "true",
      description: "你在各个方面都有所涉猎，是一位全面发展的钓手。",
      equip: "通用型钓具，适合各种场景",
      suggestion: "继续保持学习和尝试的态度，不断提升各方面的能力。"
    }
  ]
};

// 如果要将此示例添加到testEquipment.js中，可以这样导出：
// module.exports = {
//   ganzi,
//   lunzi,
//   multiDimTest,
//   multiDimExample
// };
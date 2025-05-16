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
  multiDimTest
};
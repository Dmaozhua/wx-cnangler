const testData = require('./data/testDataNew.js');

console.log('测试数据加载成功');
console.log('personalityTest是否有resultProbabilities:', !!testData.personalityTest.resultProbabilities);
console.log('emergencyTest是否有resultProbabilities:', !!testData.emergencyTest.resultProbabilities);
console.log('natureAbilityTest是否有resultProbabilities:', !!testData.natureAbilityTest.resultProbabilities);

// 显示一个测试的概率数据示例
if (testData.emergencyTest.resultProbabilities) {
  console.log('\nemergencyTest的概率分布:');
  Object.entries(testData.emergencyTest.resultProbabilities).forEach(([title, prob]) => {
    console.log(`  ${title}: ${prob}%`);
  });
}

console.log('\n概率数据验证完成！');
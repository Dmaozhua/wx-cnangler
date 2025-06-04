const testDataNew = require('./data/testDataNew.js');

// 直接实现calculateRealResultProbability函数
function calculateRealResultProbability(testType) {
  const testData = testDataNew[testType];
  if (!testData) {
    console.error('测试类型不存在:', testType);
    return [];
  }

  const questions = testData.questions;
  const results = testData.results;
  const dimensionWeights = testData.dimensionWeights;
  
  // 计算所有可能的答题组合数量
  const totalCombinations = questions.reduce((total, question) => total * question.options.length, 1);
  
  // 初始化结果计数器
  const resultCounts = {};
  results.forEach(result => {
    resultCounts[result.title] = 0;
  });
  
  // 生成所有可能的答题组合
  function generateCombinations(questionIndex, currentAnswers) {
    if (questionIndex >= questions.length) {
      // 计算当前组合的结果
      const result = calculateResultForCombination(currentAnswers);
      if (result) {
        resultCounts[result.title]++;
      }
      return;
    }
    
    const question = questions[questionIndex];
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
      generateCombinations(questionIndex + 1, [...currentAnswers, optionIndex]);
    }
  }
  
  // 计算单个组合的结果
  function calculateResultForCombination(answers) {
    // 计算维度得分
    const dimensionScores = {};
    
    answers.forEach((answerIndex, questionIndex) => {
      const option = questions[questionIndex].options[answerIndex];
      option.resultKey.forEach(([dimension, score]) => {
        if (!dimensionScores[dimension]) {
          dimensionScores[dimension] = 0;
        }
        dimensionScores[dimension] += score;
      });
    });
    
    // 应用权重
    Object.keys(dimensionScores).forEach(dimension => {
      if (dimensionWeights[dimension]) {
        dimensionScores[dimension] *= dimensionWeights[dimension];
      }
    });
    
    // 计算总维度分数
    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
    
    // 匹配结果 - 使用与test.js相同的逻辑
    let matchedResults = [];
    
    // 第一阶段：匹配特定公式
    for (const result of results) {
      if (result.formula !== 'true') {
        try {
          // 创建评估上下文
          const context = { ...dimensionScores };
          const isMatch = eval(result.formula.replace(/([A-Za-z]+)/g, (match) => {
            return context[match] !== undefined ? context[match] : 0;
          }));
          
          if (isMatch) {
            matchedResults.push({ result, totalScore });
          }
        } catch (e) {
          console.warn('公式评估错误:', result.formula, e.message);
        }
      }
    }
    
    // 如果有匹配的特定公式，选择总分最高的
    if (matchedResults.length > 0) {
      matchedResults.sort((a, b) => b.totalScore - a.totalScore);
      return matchedResults[0].result;
    }
    
    // 第二阶段：使用保底结果
    const fallbackResult = results.find(result => result.formula === 'true');
    if (fallbackResult) {
      return fallbackResult;
    }
    
    // 最后保底：返回第一个结果
    return results[0];
  }
  
  // 生成所有组合并计算结果
  generateCombinations(0, []);
  
  // 计算概率
  const probabilities = results.map(result => ({
    title: result.title,
    probability: resultCounts[result.title] / totalCombinations
  }));
  
  return probabilities;
}

// 计算personalityTest的概率分布
const probabilities = calculateRealResultProbability('personalityTest');

// PersonalityTest结果概率分布检查
// 概率分布详情

let totalProbability = 0;
let fallbackProbability = 0;
let otherProbabilities = 0;

probabilities.forEach((result, index) => {
  const percentage = (result.probability * 100).toFixed(2);
  // 结果概率: ${result.title} - ${percentage}%
  totalProbability += result.probability;
  
  // 保底结果是"六边形战士"(formula为"true")
  if (result.title === '六边形战士（Four-Dimension）') {
    fallbackProbability = result.probability;
  } else {
    otherProbabilities += result.probability;
  }
});

// 概率分布统计完成
// 概率统计计算完成

// 概率验证完成
  if (Math.abs(totalProbability - 1) >= 0.0001) {
    console.error('概率分布有误，总和不等于100%');
  }
  
  if (Math.abs((fallbackProbability + otherProbabilities) - 1) >= 0.0001) {
    console.error('保底结果 + 其他结果 ≠ 100%');
  }
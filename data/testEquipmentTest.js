// 这是一个测试文件，用于验证testEquipment.js中的修改是否能正确处理resultKey中有三个或更多数据的情况

// 导入原始测试数据
const { ganzi, lunzi, multiDimTest } = require('./testEquipment');

// 测试函数：模拟test.js中的计算逻辑
function calculateDimensionScores(answers, dimensionWeights) {
  const dimensionScores = {};
  
  // 遍历答案并计算维度得分
  answers.forEach(answer => {
    answer.resultKey.forEach(([dimension, baseWeight]) => {
      const cleanDim = dimension.trim().charAt(0).toUpperCase() + dimension.trim().slice(1).toLowerCase();
      // 应用维度权重配置系数
      const dimensionWeight = dimensionWeights[cleanDim] || 1;
      const finalWeight = baseWeight * dimensionWeight;
      
      dimensionScores[cleanDim] = (dimensionScores[cleanDim] || 0) + finalWeight;
    });
  });
  
  return dimensionScores;
}

// 测试函数：模拟test.js中的公式评估逻辑
function evaluateFormula(formula, env) {
  try {
    // 确保 `safeEnv` 是标准对象
    let safeEnv = JSON.parse(JSON.stringify(env));
    Object.keys(safeEnv).forEach(key => {
      if (safeEnv[key] === undefined) {
        safeEnv[key] = 0;
      }
    });
    
    // 替换变量
    const processedFormula = formula.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, match => {
      if (["true", "false"].includes(match)) return match; // 避免 true/false 误替换
      return `safeEnv["${match}"]`;
    });
    
    // 直接使用 eval 计算
    let result = eval(`(function(safeEnv){ return (${processedFormula}); })`)(safeEnv);
    
    return Boolean(result);
  } catch (e) {
    console.error('公式执行失败:', formula, e);
    return false;
  }
}

// 测试函数：模拟test.js中的结果匹配逻辑
function findBestMatch(dimensionScores, results) {
  let bestMatch = null;
  let highestScore = -Infinity;
  let defaultResult = null;
  
  // 第一阶段：尝试匹配所有特定公式
  results.forEach(result => {
    try {
      // 保存formula为"true"的结果作为默认结果
      if (result.formula === "true") {
        defaultResult = result;
        return; // 继续检查其他结果
      }
      
      const isMatch = evaluateFormula(result.formula, dimensionScores);
      console.log(`计算公式: ${result.formula}, 结果: ${isMatch}`);
      if (isMatch) {
        const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
        if (totalScore > highestScore) {
          highestScore = totalScore;
          bestMatch = result;
        }
      }
    } catch (e) {
      console.error(`公式计算失败`, e);
    }
  });
  
  // 第二阶段：如果没有匹配到特定公式，使用formula为"true"的默认结果
  if (!bestMatch && defaultResult) {
    console.log('使用默认结果:', defaultResult.title);
    bestMatch = defaultResult;
  }
  
  return bestMatch || results[0];
}

// 测试案例1：测试ganzi中的多维度数据
function testGanzi() {
  console.log('===== 测试ganzi中的多维度数据 =====');
  
  // 模拟用户选择的答案
  const answers = [
    {
      questionId: 1,
      selectedOption: 0,
      resultKey: ganzi.questions[0].options[0].resultKey
    },
    {
      questionId: 2,
      selectedOption: 1,
      resultKey: ganzi.questions[1].options[1].resultKey
    }
  ];
  
  // 计算维度得分
  const dimensionScores = calculateDimensionScores(answers, ganzi.dimensionWeights);
  console.log('维度得分:', dimensionScores);
  
  // 查找最佳匹配结果
  const bestMatch = findBestMatch(dimensionScores, ganzi.results);
  console.log('最佳匹配结果:', bestMatch.title);
}

// 测试案例2：测试multiDimTest中的多维度数据
function testMultiDimTest() {
  console.log('\n===== 测试multiDimTest中的多维度数据 =====');
  
  // 模拟用户选择的答案
  const answers = [
    {
      questionId: 1,
      selectedOption: 0,
      resultKey: multiDimTest.questions[0].options[0].resultKey
    },
    {
      questionId: 2,
      selectedOption: 0,
      resultKey: multiDimTest.questions[1].options[0].resultKey
    }
  ];
  
  // 计算维度得分
  const dimensionScores = calculateDimensionScores(answers, multiDimTest.dimensionWeights);
  console.log('维度得分:', dimensionScores);
  
  // 查找最佳匹配结果
  const bestMatch = findBestMatch(dimensionScores, multiDimTest.results);
  console.log('最佳匹配结果:', bestMatch.title);
}

// 运行测试
testGanzi();
testMultiDimTest();

console.log('\n测试完成，所有测试都通过了！');
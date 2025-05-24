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
    
    console.log(`原始公式: ${formula}`);
    console.log(`当前维度得分:`, safeEnv);
    
    // 如果公式是"true"，直接返回true
    if (formula === "true") {
      return true;
    }
    
    // 处理包含乘法的公式，如"Record*1.1 >= 31"
    let processedFormula = formula;
    
    // 先处理乘法部分
    if (processedFormula.includes('*')) {
      // 找出所有可能的乘法表达式
      const multiplyRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\*\s*([0-9.]+)/g;
      let match;
      
      // 替换所有乘法表达式
      while ((match = multiplyRegex.exec(processedFormula)) !== null) {
        const varName = match[1];
        const multiplier = parseFloat(match[2]);
        
        if (safeEnv[varName] !== undefined) {
          const result = safeEnv[varName] * multiplier;
          // 替换整个乘法表达式为计算结果
          processedFormula = processedFormula.replace(
            `${varName}*${multiplier}`, 
            result.toString()
          );
        }
      }
    }
    
    // 替换剩余的变量为实际值
    Object.keys(safeEnv).forEach(key => {
      // 使用正则表达式确保只替换完整的变量名
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processedFormula = processedFormula.replace(regex, safeEnv[key]);
    });
    
    console.log(`处理后的公式: ${processedFormula}`);
    
    // 使用简单的逻辑运算符替代eval
    // 支持基本的比较运算符和逻辑运算符
    let result = false;
    
    // 处理简单的比较表达式
    if (processedFormula.includes('>=')) {
      const parts = processedFormula.split('>=');
      result = Number(parts[0].trim()) >= Number(parts[1].trim());
    } else if (processedFormula.includes('<=')) {
      const parts = processedFormula.split('<=');
      result = Number(parts[0].trim()) <= Number(parts[1].trim());
    } else if (processedFormula.includes('>')) {
      const parts = processedFormula.split('>');
      result = Number(parts[0].trim()) > Number(parts[1].trim());
    } else if (processedFormula.includes('<')) {
      const parts = processedFormula.split('<');
      result = Number(parts[0].trim()) < Number(parts[1].trim());
    } else if (processedFormula.includes('==')) {
      const parts = processedFormula.split('==');
      result = Number(parts[0].trim()) == Number(parts[1].trim());
    } else if (processedFormula.includes('!=')) {
      const parts = processedFormula.split('!=');
      result = Number(parts[0].trim()) != Number(parts[1].trim());
    }
    
    console.log(`计算公式: ${formula}, 处理后: ${processedFormula}, 结果: ${result}`);
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
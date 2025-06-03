const fs = require('fs');
const path = require('path');

// 导入测试数据
const testDataModule = require('./data/testDataNew.js');

// 公式评估函数（与test.js保持一致）
function evaluateFormula(formula, env) {
  try {
    // 确保 `safeEnv` 是标准对象
    let safeEnv = JSON.parse(JSON.stringify(env));
    Object.keys(safeEnv).forEach(key => {
      if (safeEnv[key] === undefined) {
        safeEnv[key] = 0;
      }
    });

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
    
    // 使用安全的公式评估，支持逻辑运算符
    let result = false;
    
    try {
      // 使用eval来处理复杂的逻辑表达式，但确保安全性
      const allowedPattern = /^[\d\s\(\)\&\|\!\=\<\>\+\-\*\/\.]+$/;
      if (allowedPattern.test(processedFormula)) {
        result = eval(processedFormula);
      } else {
        // 回退到简单比较
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
      }
    } catch (evalError) {
      console.warn('公式评估失败，使用简单比较:', processedFormula, evalError);
      // 回退到简单比较逻辑
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
    }
    
    return Boolean(result);
  } catch (e) {
    console.error('公式执行失败:', formula, e);
    return false;
  }
}

// 计算单个测试的概率分布
function calculateTestProbabilities(testData) {
  console.log(`\n开始计算测试: ${testData.title}`);
  
  const questions = testData.questions;
  const results = testData.results;
  const dimensionWeights = testData.dimensionWeights || {};
  
  // 计算所有可能的答题组合数量
  const totalCombinations = questions.reduce((total, question) => total * question.options.length, 1);
  console.log(`总组合数: ${totalCombinations}`);
  
  // 初始化结果计数器
  const resultCounts = {};
  results.forEach(result => {
    resultCounts[result.title] = 0;
  });
  
  // 遍历所有可能的答题组合
  for (let combination = 0; combination < totalCombinations; combination++) {
    // 显示进度
    if (combination % Math.max(1, Math.floor(totalCombinations / 10)) === 0) {
      const progress = ((combination / totalCombinations) * 100).toFixed(1);
      console.log(`计算进度: ${progress}%`);
    }
    
    // 将数字转换为n进制，表示每题的选择
    const choices = [];
    let temp = combination;
    for (let i = questions.length - 1; i >= 0; i--) {
      const optionCount = questions[i].options.length;
      choices[i] = temp % optionCount;
      temp = Math.floor(temp / optionCount);
    }
    
    // 计算当前组合的结果
    const result = calculateResultForChoices(choices, testData);
    if (result) {
      resultCounts[result.title]++;
    }
  }
  
  // 转换为概率百分比
  const probabilities = {};
  results.forEach(result => {
    const count = resultCounts[result.title];
    const percentage = (count / totalCombinations * 100).toFixed(2);
    probabilities[result.title] = percentage;
  });
  
  console.log('概率分布:');
  Object.keys(probabilities).forEach(title => {
    console.log(`  ${title}: ${probabilities[title]}%`);
  });
  
  return probabilities;
}

// 计算特定选择组合的结果
function calculateResultForChoices(choices, testData) {
  const dimensionScores = {};
  
  // 计算维度得分
  choices.forEach((choiceIndex, questionIndex) => {
    const question = testData.questions[questionIndex];
    const selectedOption = question.options[choiceIndex];
    
    selectedOption.resultKey.forEach(([dimension, baseWeight]) => {
      const cleanDim = dimension.trim().charAt(0).toUpperCase() + dimension.trim().slice(1).toLowerCase();
      const dimensionWeight = testData.dimensionWeights[cleanDim] || 1;
      const finalWeight = baseWeight * dimensionWeight;
      
      dimensionScores[cleanDim] = (dimensionScores[cleanDim] || 0) + finalWeight;
    });
  });
  
  // 匹配结果逻辑
  let bestMatch = null;
  let highestScore = -Infinity;
  let defaultResult = null;
  
  // 查找默认结果
  testData.results.forEach(result => {
    if (result.formula === "true") {
      defaultResult = result;
    }
  });
  
  // 尝试匹配特定公式
  testData.results.forEach(result => {
    try {
      if (result.formula === "true") {
        return;
      }
      
      const isMatch = evaluateFormula(result.formula, dimensionScores);
      if (isMatch) {
        const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
        if (totalScore > highestScore) {
          highestScore = totalScore;
          bestMatch = result;
        }
      }
    } catch (e) {
      // 公式计算失败，继续下一个
    }
  });
  
  // 如果没有匹配到特定公式，使用默认结果
  if (!bestMatch && defaultResult) {
    bestMatch = defaultResult;
  }
  
  // 如果仍然没有匹配，使用第一个结果
  if (!bestMatch) {
    bestMatch = testData.results[0];
  }
  
  return bestMatch;
}

// 更新testDataNew.js文件
function updateTestDataFile(testName, probabilities) {
  const filePath = path.join(__dirname, 'data', 'testDataNew.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 查找测试定义的结束位置
  const testPattern = new RegExp(`const ${testName} = \\{[\\s\\S]*?\\};`, 'g');
  const match = testPattern.exec(content);
  
  if (match) {
    const testContent = match[0];
    
    // 检查是否已经有resultProbabilities
    if (testContent.includes('resultProbabilities:')) {
      // 替换现有的resultProbabilities
      const updatedTestContent = testContent.replace(
        /resultProbabilities:\s*\{[\s\S]*?\}/,
        `resultProbabilities: ${JSON.stringify(probabilities, null, 2).replace(/\n/g, '\n  ')}`
      );
      content = content.replace(testContent, updatedTestContent);
    } else {
      // 添加新的resultProbabilities
      const insertPosition = testContent.lastIndexOf('}');
      const beforeClosing = testContent.substring(0, insertPosition);
      const afterClosing = testContent.substring(insertPosition);
      
      const probabilitiesStr = `,\n// 复合结果概率统计\nresultProbabilities: ${JSON.stringify(probabilities, null, 2).replace(/\n/g, '\n  ')}`;
      const updatedTestContent = beforeClosing + probabilitiesStr + '\n' + afterClosing;
      content = content.replace(testContent, updatedTestContent);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新 ${testName} 的概率数据`);
  } else {
    console.error(`未找到测试 ${testName} 的定义`);
  }
}

// 主函数
function main() {
  console.log('开始生成概率数据...');
  
  // 动态获取testDataNew.js中所有导出的测试数据
  const testsToProcess = Object.keys(testDataModule).filter(testName => {
    const testData = testDataModule[testName];
    // 过滤出具有questions和results属性的测试对象
    return testData && 
           typeof testData === 'object' && 
           testData.questions && 
           testData.results && 
           Array.isArray(testData.questions) && 
           Array.isArray(testData.results);
  });
  
  console.log(`发现 ${testsToProcess.length} 个有效测试:`, testsToProcess);
  
  testsToProcess.forEach(testName => {
    try {
      const testData = testDataModule[testName];
      if (testData && testData.questions && testData.results) {
        const probabilities = calculateTestProbabilities(testData);
        updateTestDataFile(testName, probabilities);
      } else {
        console.error(`测试 ${testName} 数据不完整或不存在`);
      }
    } catch (error) {
      console.error(`处理测试 ${testName} 时出错:`, error);
    }
  });
  
  console.log('\n概率数据生成完成！');
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  calculateTestProbabilities,
  evaluateFormula,
  calculateResultForChoices
};
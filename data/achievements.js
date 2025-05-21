// 成就类型说明：
// type: 1 - 完成成就的次数统计
// type: 2 - 成就分数统计
// type: 3 - 首次使用特定功能后解锁成就，value为功能标识符
// type: 4 - 在特定时间段内完成测试解锁成就，value为时间范围，格式为"开始时间,结束时间"
// type: 5 - 阅读不同的文章解锁成就，value为阅读文章的次数
// type: 6 - 连续阅读文章解锁成就，value为连续阅读的天数
// type: 7 - 分享相关，value为分享系类别1测试2文章

//提示，邂逅10次女钓友，抛竿100次..
//提示 钓到强度比 100%的任意一条鱼

const achievements = [
  {
      num: 1,
      type: 1,//完成成就的次数
      id: "test1",
      category: "testman",
      title: "初次见面",
      description: "首次完成任意性格测试",
      value: 1,
      icon: "images/achievements/钓鱼 (1).png",
      score: 10,
      weight: 3,
      detailed:'此刻是我们的首次碰面。你好，钓鱼人。'
  },
  {
      num: 2,
      type: 1,
      id: "test2",
      category: "testman",
      title: "鱼塘常客",
      description: "累计完成测试5次",
      value: 5,
      icon: "images/achievements/Sport-Fishing (1).png",
      score: 15,
      weight: 2,
      detailed:'五份报告在手，看来你已深谙此塘鱼性，是时候挑战更复杂的钓场了！'
  },
  {
      num: 3,
      type: 2,//成就分数统计
      id: "test3",
      category: "persion",
      title: "初出茅庐",
      description: "累计获得15成就分数",
      value: 15,
      icon: "images/achievements/路亚轮 (1).png",
      score: 20,
      weight: 4,
      detailed:'恭喜获得累计15点成就分，你已经可以在小程序中自由探索了。'
  },
  {
      num: 4,
      type: 1,
      id: "test4",
      category: "testman",
      title: "测试观察者",
      description: "累计完成测试10次",
      value: 10,
      icon: "images/achievements/钓鱼 (1).png",
      score: 25,
      weight: 3,
      detailed:'十次数据沉淀。你的性格轮廓已在数据中清晰浮现。'
  },
  {
      num: 5,
      type: 1,
      id: "test5",
      category: "testman",
      title: "测试研究者",
      description: "完成20个任意测试",
      value: 20,
      icon: "images/achievements/Sport-Fishing (1).png",
      score: 35,
      weight: 4,
      detailed:'二十次严谨测试构成完整样本，你已掌握性格变化的潮汐规律。'
  },
  {
      num: 6,
      type: 2,
      id: "score1",
      category: "persion",
      title: "小有成就",
      description: "累计获得50成就分数",
      value: 50,
      icon: "images/achievements/路亚轮 (1).png",
      score: 30,
      weight: 3,
      detailed:'感谢你的陪伴，在路亚这条路上你是一个了不起的角色。'
  },
  {
      num: 7,
      type: 2,
      id: "score2",
      category: "persion",
      title: "成就斐然",
      description: "累计获得100成就分数",
      value: 100,
      icon: "images/achievements/钓鱼 (1).png",
      score: 40,
      weight: 4,
      detailed:'快去联系作者。'
  },
  {
      num: 8,
      type: 1,
      id: "fishing1",
      category: "fishing",
      title: "初次体验",
      description: "首次使用钓鱼功能",
      value: 1,
      icon: "images/achievements/钓鱼 (1).png",
      score: 15,
      weight: 2,
      detailed:'Fishing On！'
  },
  {
      num: 9,
      type: 1,
      id: "fishing2",
      category: "fishing",
      title: "钓鱼爱好者",
      description: "完成5次钓鱼活动",
      value: 5,
      icon: "images/achievements/Sport-Fishing (1).png",
      score: 25,
      weight: 3,
      detailed:'纪念用户累计使用钓鱼功能5次，特授予这份成就。'
  },
  {
      num: 10,
      type: 1,
      id: "fishing3",
      category: "fishing",
      title: "钓鱼大师",
      description: "完成15次钓鱼活动",
      value: 15,
      icon: "images/achievements/路亚轮 (1).png",
      score: 35,
      weight: 4,
      detailed:'纪念用户累计使用钓鱼功能15次，特授予这份成就。'
  },
  {
      num: 11,
      type: 3,
      id: "firsttime",
      category: "persion",
      title: "气象爱好者",
      description: "首次使用查看天气功能",
      value: 'checkWeather',
      icon: "images/achievements/路亚轮 (1).png",
      score: 35,
      weight: 4,
      detailed:'在路亚征途里，重视起天气是必修课，特此授予 “气象爱好者” 成就，愿你借天时，斩获满舱。'
  },
  {
      num: 12,
      type: 5,
      id: "nightowl",
      category: "fishing",
      title: "早口专家",
      description: "在凌晨3-6点完成任意测试题",
      value:[[3],[6]],
      icon: "images/achievements/路亚轮 (1).png",
      score: 35,
      weight: 4,
      detailed:'当世界还在沉睡，你已清醒逐光。这份成就献给打早口的钓鱼人！'
  },  {
    num: 13,
    type: 5,
    id: "readone",
    category: "persion",
    title: "抛竿启航",
    description: "首次阅读任意1篇路亚文章",
    value:1,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'恭喜！你成功打响路亚知识储备的 “第一枪”。路亚之旅，从第一竿开始！纪念用户首次阅读路亚文章，特授予这份成就。'
},{
    num: 14,
    type: 5,
    id: "readone2",
    category: "persion",
    title: "知识渔夫",
    description: "累计阅读任意10篇路亚文章",
    value:10,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'在路亚知识的探索中，每一次阅读都是沉淀。您累计阅读 10 篇路亚文章，既温故知新，又不断突破。特授予这一成就，致敬您的坚持。'
},{
    num: 15,
    type: 5,
    id: "readone3",
    category: "persion",
    title: "路亚百科全书",
    description: "累计阅读任意30篇钓鱼文章",
    value:30,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'在路亚领域，知识是丈量水域的标尺，阅读是积累经验的良方。鱼饵在左，钓竿在右，智慧在心中！纪念用户累计阅读30篇路亚文章，在路亚领域，知识是丈量水域的标尺，阅读是积累经验的良方。'
},{
    num: 16,
    type: 6,
    id: "readone4",
    category: "persion",
    title: "路亚通勤者",
    description: "连续3天阅读文章",
    value:3,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'每天都是新的潮水，新的收获！恭喜你成功拿下 “三日连学” 小目标！特此纪念用户连续3天获取路亚知识，颁发此成就！'
},{
    num: 17,
    type: 7,
    id: "share",
    category: "persion",
    title: "渔获传播者",
    description: "首次分享测试结果到社交平台",
    value:3,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'独乐乐不如众乐乐，你抛出这一竿正吸引更多同好！纪念用户首次分享测试结果，颁发此成就！'
},{
    num: 18,
    type: 7,
    id: "share1",
    category: "persion",
    title: "知识传播者",
    description: "首次分享钓鱼文章到社交平台",
    value:3,
    icon: "images/achievements/路亚轮 (1).png",
    score: 35,
    weight: 4,
    detailed:'让我们一起把路亚做大做强，感谢你的分享！纪念用户首次分享钓鱼文章，颁发此成就！'
},
];

module.exports = {
  achievements
};

import { COMMON,UNCOMMON,RARE, EPIC, MYTHIC, BOSS ,WASTE} from './FishDataAll';

export const FishEventsProbability = {
  AFT_Probability: 0.9,  
  BEF_Probability: 0.1,
  // EXTRA_Probability: 0   EXTRA天气事件触发概率 第五次必然触发 先配置为0
  // EXTRA事件只在指定条数的鱼时必然触发，无需概率配置
};

// EXTRA事件触发配置
export const ExtraEventConfig = {
  triggerFishCount: 5  // 第几条鱼触发EXTRA事件
};

// 新增效果类型
export const EffectTypes = {
  // 现有效果
  RARE_FISH_BOOST: 'rareFishBoost',     // 稀有鱼出现概率修正
  BASE_MULTIPLIER: 'baseMultiplier',    // 基础概率修正
  TIME_MODIFIER: 'timeModifier',        // 时间修正
  BAIT_EFFECT: 'baitEffect',            // 鱼饵效果修正
  // 新增效果
  NEXT_FISH_RARITY: 'nextFishRarity',   // 下一条鱼是指定稀有度
  NEXT_FISH_STRENGTH: 'nextFishStrength', // 下一条鱼的strength变化
  PASSIVE_DAMAGE_BOOST: 'passiveDamageBoost', // 被动伤害提升
  QTE_DURATION_CHANGE: 'qteDurationChange',   // QTE判定时间变化
  QTE_DAMAGE_CHANGE: 'qteDamageChange'        // QTE造成伤害整体变化
};

export const FishEvents = [
    {
      id: 'EVENT1',
      type: 'AFT_FISHON',
      name: '发现奇怪的东西',
      description: '你突然发现了一个奇怪的东西，决定去看看，之后运气爆棚。\n稀有鱼出现概率增加20%',
      // triggerprobability:1,
      retriggering:false,//是否可以重复触发
      effects: { rareFishBoost: { value: 1.2, targetRarity: [RARE, EPIC, MYTHIC] } },
      weight:0.1
    },
    // {
    //   id: 'EVENT11',
    //   type: 'AFT_FISHON',
    //   name: '命运降临',
    //   description: '这条鱼似乎带来了什么东西，是一枚陈旧的鱼饵，发散着古老的讯息，你觉得更换尝试一下。\n握紧鱼竿，boss即将出现！',
    //   // triggerprobability:0.1,
    //   retriggering:false,
    //   effects: { nextFishRarity: { rarity: BOSS, blockEvents: true } },
    //   weight:0.1
    // }
    // ,
    
    // {
    //   id: 'EVENT12',
    //   type: 'AFT_FISHON',
    //   name: '危险讯息',
    //   description: '鱼搅浑了岸边的水面，渐渐清澈下来后发现了一个漂流瓶，打开后里面是作者的手机号，你慌张的将瓶子扔的远远的。\n之后什么都没有发生，你暗自骂了一句。',
    //   // triggerprobability:0.1,
    //   retriggering:false,
    //   effects: { },
    //   weight:0.1
    // }
    // ,
    // {
    //   id: 'EVENT13',
    //   type: 'AFT_FISHON',
    //   name: '引发警觉',
    //   description: '刚刚搏鱼闹出了太大动静，附近的鱼群明显变得骚动。\n鱼活跃度概率下降20%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { baseMultiplier: 0.1 },
    //   weight:0.1
    // }
    // ,
    {
      id: 'EVENT14',
      type: 'AFT_FISHON',
      name: '水位上升',
      description: '水流突然变得湍急，水位也在上涨。理智的你决定先换个安全钓点。\n钓鱼时间减少30%\n鱼饵基础概率上升200%',
      // triggerprobability:0.1,
      retriggering:true,
      effects: { timeModifier: -0.3, baitEffect: 2 },
      weight:0.9
    },
    // {
    //   id: 'EVENT17',
    //   type: 'AFT_FISHON',
    //   name: '形影不离',
    //   description: '钓起一条鱼后，发现还有几条同类尾随。\n下一条鱼的体型增大15%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { nextFishStrength: 1.15 },
    //   weight:0.1
    // },
  // {
  //     id: 'EVENT18',
  //     type: 'AFT_FISHON',
  //     name: '手感火热',
  //     description: '鱼竿的回弹伴着破风声，拿捏着水中沟壑控饵如有神助，正在与装备融为一体。\nQTE判定时间延长100%',
  //     // triggerprobability:0.1,
  //     retriggering:false,
  //     effects: { qteDurationChange: 2.0 }, // 判定时间延长100%
  //     weight:0.9
  //   }
    // ,
    // {
    //   id: 'EVENT19',
    //   type: 'AFT_FISHON',
    //   name: '技巧领悟',
    //   description: '灵光一现，突然感受了钓组的魅力，脑海回响着灵动的泳姿，信心倍增。\n被动伤害提升100%',
    //   // triggerprobability:0.1,
    //   retriggering:false,
    //   effects: { passiveDamageBoost: 2.0 }, // 被动伤害提升100%
    //   weight:0.1
    // }
    // ,
    // {
    //   id: 'EVENT2',
    //   type: 'AFT_FISHON',
    //   name: '邂逅女钓友',
    //   description: '突然发现女钓友，你决定去搭讪。\n侃侃而谈，鱼饵基础概率下降10%',
    //   // triggerprobability:0.2,
    //   retriggering:false,
    //   effects: { baitEffect: 0.9 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT3',
    //   type: 'BEF_FISHON',
    //   name: '无法幸免',
    //   description: '看似随意的一竿，却挂到了身后的草丛。\n突然的不幸让你心情变差，\n稀有鱼出现概率降低20%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { rareFishBoost: { value: 0.8, targetRarity: [RARE, EPIC, MYTHIC] } },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT4',
    //   type: 'BEF_FISHON',
    //   name: '迟早会来',
    //   description: '洒脱任性的一抛，无奈炒了一盘粉。\n埋头解线，钓鱼时间减少10%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { timeModifier: -0.1 },
    //   weight:0.1
    // }
    // {
    //   id: 'EVENT5',
    //   type: 'BEF_FISHON',
    //   name: '水鸟惊飞',
    //   description: '正要抛竿前，一群水鸟突然从水面惊飞而起，发出嘈杂的叫声。\n鱼的活跃度下降10%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { baseMultiplier: 0.9 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT6',
    //   type: 'BEF_FISHON',
    //   name: '水草缠绕',
    //   description: '准备抛竿时，发现钓线不知何时缠绕上了水草。\n钓鱼时间减少5%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { timeModifier: -0.05 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT7',
    //   type: 'BEF_FISHON',
    //   name: '泛起异常涟漪',
    //   description: '抛竿前，水面出现不同于平常的涟漪，像是有大型生物在水下活动。\n下一条鱼的体型增大30%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { nextFishStrength: 1.3 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT8',
    //   type: 'BEF_FISHON',
    //   name: '吱吱作响',
    //   description: '握住鱼竿时听到轻微的异响，似乎装备某个部分松动了，立刻进行检查。\n钓鱼时间减少5%，但是被动伤害增加50%，鱼饵基础概率提升5%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { timeModifier: -0.05,   passiveDamageBoost: 1.5 ,baitEffect:1.05},
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT9',
    //   type: 'BEF_FISHON',
    //   name: '振奋的声音',
    //   description: '正要抛竿，听到隔壁钓友传来稀有鱼出没的讯息，你全神贯注迎接挑战。\n超稀有概率提升100%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { rareFishBoost: { value: 2, targetRarity: [EPIC, MYTHIC] } },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT15',
    //   type: 'BEF_FISHON',
    //   name: '生活物资？',
    //   description: '清风和绿水带来的本应该只有鱼获，还有白色污染。\n杂物的出现概率增加50%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { rareFishBoost: { value: 1.5, targetRarity: [WASTE] } },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT20',
    //   type: 'BEF_FISHON',
    //   name: '有备无患',
    //   description: '抛竿前对装备进行仔细检查，导环Cheak！鱼饵Cheak！泄力Cheak！\n钓鱼时间减少10%，但是被动伤害增加150%，QTE伤害提升50%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { timeModifier: -0.1, passiveDamageBoost: 2.5, qteDamageChange: 1.5 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT21',
    //   type: 'BEF_FISHON',
    //   name: '神秘预感',
    //   description: '水面泛起奇特的涟漪，你感觉到下一竿会有稀有的收获。\n下一条鱼必定是稀有鱼',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { nextFishRarity: { rarity: RARE, blockEvents: true } },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT22',
    //   type: 'BEF_FISHON',
    //   name: '巨物预兆',
    //   description: '水下似乎有什么大东西在游动，你的心跳加速了。\n下一条鱼的体型增大30%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { nextFishStrength: 1.3 },
    //   weight:0.1
    // },
    // {
    //   id: 'EVENT23',
    //   type: 'AFT_FISHON',
    //   name: 'QTE精通',
    //   description: '经过多次搏鱼，你的反应速度和判断力都有了显著提升。\nQTE造成伤害整体提升80%',
    //   // triggerprobability:0.1,
    //   retriggering:true,
    //   effects: { qteDamageChange: 1.8 },
    //   weight:0.1
    // }
  ];
  
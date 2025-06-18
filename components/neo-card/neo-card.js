// neo-card.js - Neo Brutalist卡片组件
Component({
  properties: {
    // 卡片标题
    title: {
      type: String,
      value: 'Neo Card'
    },
    // 卡片内容
    content: {
      type: String,
      value: ''
    },
    // 背景颜色
    bgColor: {
      type: String,
      value: '#06FFA5'
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      value: true
    },
    // 卡片高度
    height: {
      type: String,
      value: 'auto'
    }
  },

  methods: {
    // 卡片点击事件
    onCardTap(e) {
      this.triggerEvent('cardtap', {
        title: this.data.title,
        content: this.data.content
      });
    }
  }
});
// components/glowcards/glowcards.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 卡片数据
    cards: {
      type: Array,
      value: [
        {
          id: 1,
          title: 'Style 1',
          content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
          buttonText: 'Read More'
        },
        {
          id: 2,
          title: 'Style 2',
          content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
          buttonText: 'Read More'
        }
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 卡片点击事件
    onCardTap(e) {
      const { card } = e.currentTarget.dataset;
      this.triggerEvent('cardtap', { card });
    },

    // 按钮点击事件
    onButtonTap(e) {
      const { card } = e.currentTarget.dataset;
      this.triggerEvent('buttontap', { card });
    }
  }
})
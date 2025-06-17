// neo-tabs.js - Neo Brutalist标签页组件
Component({
  properties: {
    // 标签页数据
    tabs: {
      type: Array,
      value: ['Tab 1', 'Tab 2', 'Tab 3']
    },
    // 标签页内容
    contents: {
      type: Array,
      value: ['Content 1', 'Content 2', 'Content 3']
    },
    // 当前激活的标签页索引
    activeIndex: {
      type: Number,
      value: 0
    },
    // 背景颜色
    bgColor: {
      type: String,
      value: '#ffffff'
    },
    // 激活标签页颜色
    activeColor: {
      type: String,
      value: '#FFD166'
    }
  },

  data: {
    currentIndex: 0
  },

  lifetimes: {
    attached() {
      this.setData({
        currentIndex: this.data.activeIndex
      });
    }
  },

  observers: {
    'activeIndex': function(newIndex) {
      this.setData({
        currentIndex: newIndex
      });
    }
  },

  methods: {
    // 标签页切换事件
    onTabChange(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex: index
      });
      
      // 触发自定义事件
      this.triggerEvent('tabchange', {
        index: index,
        tab: this.data.tabs[index],
        content: this.data.contents[index]
      });
    }
  }
});
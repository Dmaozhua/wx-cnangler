// neo-button.js - Neo Brutalist按钮组件
Component({
  properties: {
    // 按钮文本
    text: {
      type: String,
      value: 'Neo Button'
    },
    // 背景颜色
    color: {
      type: String,
      value: 'yellow'
    },
    // 文字颜色
    textColor: {
      type: String,
      value: 'black'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 按钮大小
    size: {
      type: String,
      value: 'normal' // normal, large, small
    }
  },

  methods: {
    // 按钮点击事件
    onButtonTap(e) {
      if (this.data.disabled) {
        return;
      }
      
      // 触发自定义事件
      this.triggerEvent('tap', {
        text: this.data.text
      });
    }
  }
});
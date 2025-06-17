// neo-input.js - Neo Brutalist输入框组件
Component({
  properties: {
    // 输入框占位符
    placeholder: {
      type: String,
      value: 'Enter text...'
    },
    // 输入框值
    value: {
      type: String,
      value: ''
    },
    // 输入框类型
    type: {
      type: String,
      value: 'text' // text, number, password
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 最大长度
    maxlength: {
      type: Number,
      value: 140
    },
    // 背景颜色
    bgColor: {
      type: String,
      value: '#FFFFFF'
    },
    // 标签文本
    label: {
      type: String,
      value: ''
    }
  },

  data: {
    focused: false
  },

  methods: {
    // 输入事件
    onInput(e) {
      const value = e.detail.value;
      this.setData({
        value: value
      });
      
      this.triggerEvent('input', {
        value: value
      });
    },

    // 获得焦点
    onFocus(e) {
      this.setData({
        focused: true
      });
      
      this.triggerEvent('focus', {
        value: e.detail.value
      });
    },

    // 失去焦点
    onBlur(e) {
      this.setData({
        focused: false
      });
      
      this.triggerEvent('blur', {
        value: e.detail.value
      });
    },

    // 确认输入
    onConfirm(e) {
      this.triggerEvent('confirm', {
        value: e.detail.value
      });
    }
  }
});
// components/jinduBar/jinduBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 进度值 (0-100)
    progress: {
      type: Number,
      value: 50
    },
    // 是否显示动画
    animated: {
      type: Boolean,
      value: true
    },
    // 进度条颜色
    color: {
      type: String,
      value: '#92C81A'
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
    // 设置进度
    setProgress(progress) {
      this.setData({
        progress: Math.max(0, Math.min(100, progress))
      });
    }
  }
})
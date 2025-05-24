Component({
    options: {
      multipleSlots: true
    },
    properties: {
      extClass: {
        type: String,
        value: ''
      },
      title: {
        type: String,
        value: ''
      },
      background: {
        type: String,
        value: ''
      },
      color: {
        type: String,
        value: ''
      },
      back: {
        type: Boolean,
        value: true
      },
      loading: {
        type: Boolean,
        value: false
      },
      homeButton: {
        type: Boolean,
        value: false
      },
      animated: {
        type: Boolean,
        value: true
      },
      show: {
        type: Boolean,
        value: true,
        observer: '_showChange'
      },
      delta: {
        type: Number,
        value: 1
      },
      titleFontStyle: {
        type: String,
        value: ''
      }
    },
    data: {
      displayStyle: '',
      backgroundStyle: '',
      ios: false,
      innerPaddingRight: '',
      leftWidth: '',
      safeAreaTop: ''
    },
    lifetimes: {
      attached() {
        try {
          const rect = wx.getMenuButtonBoundingClientRect()
          const res = wx.getSystemInfoSync()
          const isAndroid = res.platform === 'android'
          const isDevtools = res.platform === 'devtools'
  
          const innerPaddingRight = `padding-right: ${res.windowWidth - rect.left}px;`
          const leftWidth = `width: ${res.windowWidth - rect.left}px;`
          const safeAreaTop = (isDevtools || isAndroid)
            ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px;`
            : ''
  
          const backgroundStyle = [
            // 'transition: background 0.3s ease;',
            innerPaddingRight,
            safeAreaTop
          ].join(' ')
  
          wx.nextTick(() => {
            this.setData({
              ios: !isAndroid,
              innerPaddingRight,
              leftWidth,
              safeAreaTop,
              backgroundStyle
            })
          })
        } catch (error) {
          console.error('导航栏初始化失败:', error)
        }
      }
    },
    methods: {
      _showChange(show) {
        const animated = this.data.animated
        let displayStyle = ''
        if (animated) {
          displayStyle = `opacity: ${show ? '1' : '0'}; transition: opacity 0.5s;`
        } else {
          displayStyle = `display: ${show ? '' : 'none'};`
        }
  
        wx.nextTick(() => {
          this.setData({ displayStyle })
        })
      },
      back() {
        const delta = this.data.delta
        if (delta) {
          wx.navigateBack({ delta })
        }
        this.triggerEvent('back', { delta }, {})
      },
      home() {
        wx.reLaunch({ url: '/pages/index/index' }) // 可根据实际路径修改
        this.triggerEvent('home', {}, {})
      }
    }
  })
  
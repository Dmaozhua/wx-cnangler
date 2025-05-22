// pages/music/player.js
Page({
    data: {
      currentTime: 0,
      duration: 0,
      playing: false
    },
  
    onLoad(options) {
      this.audioContext = wx.createInnerAudioContext()
      this.initAudioEvents()
    },
  
    initAudioEvents() {
      // 播放时间更新
      this.audioContext.onTimeUpdate(() => {
        this.setData({
          currentTime: this.audioContext.currentTime,
          duration: this.audioContext.duration || 0
        })
      })
  
      // 播放状态监听
      this.audioContext.onPlay(() => {
        this.setData({ playing: true })
      })
      
      this.audioContext.onPause(() => {
        this.setData({ playing: false })
      })
    },
  
    // 格式化时间显示
    formatTime(time) {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
  
    // 拖动进度条处理
    onSliderChange(e) {
      const value = e.detail.value
      this.audioContext.seek(value)
      if (!this.data.playing) {
        this.audioContext.play()
      }
    },
  
    // 实时拖动中处理
    onSliderChanging(e) {
      this.setData({ currentTime: e.detail.value })
    },
  
    // 播放/暂停切换
    togglePlay() {
      if (this.data.playing) {
        this.audioContext.pause()
      } else {
        this.audioContext.play()
      }
    }
  })
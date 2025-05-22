// pages/music/list.js
let audioContext = null
Page({
    //获取音乐列表
    data: { musicList: [] },
    onLoad() {
      wx.request({
        url: 'https://your-api-domain.com/api/music/list',
        success: (res) => {
          if (res.data.code === 0) {
            this.setData({ musicList: res.data.data })
          }
        }
      })
    },
    //实现本地播放功能
    playMusic(e) {
        const index = e.currentTarget.dataset.index
        const music = this.data.musicList[index]
        
        if (!audioContext) {
          audioContext = wx.createInnerAudioContext()
          audioContext.onPlay(() => {
            wx.showToast({ title: '开始播放' })
          })
        }
        
        audioContext.stop()
        audioContext.src = music.url
        audioContext.play()
      },
      //实现跳转第三方应用
      jumpToPlatform(e) {
        const scheme = e.currentTarget.dataset.url
        wx.openScheme({
          scheme: scheme,
          fail: () => {
            wx.showToast({ 
              title: '跳转失败，请安装对应APP',
              icon: 'none'
            })
          }
        })
      }
  })
// pages/music/list.js
// 创建全局音频上下文，以便在页面间共享
let audioContext = null;

Page({
    //获取音乐列表
    data: { 
      musicList: [],
      playing: false,
      currentSongIndex: -1
    },
    onLoad() {
      // 显示加载中提示
      wx.showLoading({
        title: '加载音乐列表中',
      });
      
      // 获取服务器上的音乐文件列表
      wx.request({
        url: 'https://anglertest.xyz/music/',
        success: (res) => {
          // 解析HTML内容，提取音乐文件
          this.parseAndSetMusicList(res.data);
        },
        fail: (err) => {
          console.error('获取音乐列表失败:', err);
          wx.showToast({
            title: '获取音乐列表失败',
            icon: 'none'
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    
    // 解析HTML内容，提取音乐文件
    parseAndSetMusicList(htmlContent) {
      // 由于服务器返回的是默认页面，我们需要手动构建音乐列表
      // 这里我们创建一些示例音乐数据
      const musicList = [
        {
          id: 1,
          title: '打龟又怎样',
          artist: 'Angler钓鱼佬',
          cover: 'https://anglertest.xyz/music/musicBG.png',
          url: 'https://anglertest.xyz/music/打龟又怎样.mp3',
          platforms: {
            netease: 'orpheus://song/2706943514'
          }
        },
        {
          id: 2,
          title: '钓鱼许可证',
          artist: 'Angler钓鱼佬',
          cover: 'https://anglertest.xyz/music/musicBG.png',
          url: 'https://anglertest.xyz/music/钓鱼许可证.mp3',
          platforms: {
            netease: 'orpheus://song/2706945391'
          }
        },
        {
          id: 3,
          title: '087',
          artist: 'Angler钓鱼佬',
          cover: 'https://anglertest.xyz/music/musicBG.png',
          url: 'https://anglertest.xyz/music/087.mp3',
          platforms: {
            netease: 'orpheus://song/2706946198'
          }
        }
      ];
      
      this.setData({ musicList });
    },
    //实现本地播放功能
    playMusic(e) {
        const index = e.currentTarget.dataset.index;
        const music = this.data.musicList[index];
        
        console.log('播放音乐:', { index, title: music.title });
        
        if (!audioContext) {
          // 创建音频上下文
          audioContext = wx.createInnerAudioContext();
          
          // 设置音频事件监听
          audioContext.onPlay(() => {
            wx.showToast({ title: '开始播放' });
            console.log('音频开始播放');
          });
          
          audioContext.onError((err) => {
            console.error('音频播放错误:', err);
            wx.showToast({
              title: '音频播放失败',
              icon: 'none'
            });
          });
          
          audioContext.onEnded(() => {
            // 播放结束后，自动播放下一首
            console.log('音频播放结束，播放下一首');
            this.playNextSong();
          });
        }
        
        // 停止当前播放
        audioContext.stop();
        
        // 设置新的音频源并播放
        audioContext.src = music.url;
        audioContext.play();
        
        // 将音频上下文保存到页面实例，以便在player页面可以访问
        this.audioContext = audioContext;
        
        // 更新播放状态
        this.setData({
          playing: true,
          currentSongIndex: index
        });
        
        // 将音乐列表保存到缓存，以便在player页面可以访问
        wx.setStorageSync('musicList', this.data.musicList);
        // 保存当前播放索引到缓存
        wx.setStorageSync('currentSongIndex', index);
      },
      
      // 播放下一首歌曲
      playNextSong() {
        const { currentSongIndex, musicList } = this.data;
        // 计算下一首歌曲的索引，如果是最后一首则循环到第一首
        const nextIndex = (currentSongIndex + 1) % musicList.length;
        
        console.log('播放下一首:', { currentIndex: currentSongIndex, nextIndex });
        
        // 播放下一首
        this.playMusic({
          currentTarget: {
            dataset: {
              index: nextIndex
            }
          }
        });
        
        // 更新缓存中的当前歌曲索引
        wx.setStorageSync('currentSongIndex', nextIndex);
      },
      
      // 停止播放
      stopMusic() {
        if (audioContext) {
          audioContext.stop();
          this.setData({
            playing: false
          });
        }
      },
      
      // 暂停播放
      pauseMusic() {
        if (audioContext && this.data.playing) {
          audioContext.pause();
          this.setData({
            playing: false
          });
        }
      },
      
      // 继续播放
      resumeMusic() {
        if (audioContext && !this.data.playing && this.data.currentSongIndex >= 0) {
          audioContext.play();
          this.setData({
            playing: true
          });
        }
      },
      
      //实现跳转第三方应用
      jumpToPlatform(e) {
        const url = e.currentTarget.dataset.url;
        wx.openScheme({
          scheme: url,
          success: () => {
            console.log('跳转成功');
          },
          fail: (err) => {
            console.error('跳转失败:', err);
            wx.showToast({ 
              title: '跳转失败，请安装网易云音乐APP',
              icon: 'none'
            });
          }
        });
      },
      
      // 跳转到播放器页面
      goToPlayer(e) {
        // 如果传入了事件对象，则使用事件中的索引
        let index = this.data.currentSongIndex;
        if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.index !== undefined) {
          const newIndex = e.currentTarget.dataset.index;
          
          // 如果点击的不是当前播放的歌曲，则播放该歌曲
          if (newIndex !== this.data.currentSongIndex) {
            this.playMusic(e);
          }
          
          // 更新当前播放的歌曲索引
          index = newIndex;
        }
        
        if (index >= 0) {
          wx.navigateTo({
            url: `/pages/music/player?index=${index}`
          });
        }
      },
      
      // 返回首页
      goToHome() {
        wx.switchTab({
          url: '/pages/home/home'
        });
      },
      
      // 页面卸载时处理
      onUnload() {
        // 注意：不要在这里销毁audioContext，因为我们需要在播放器页面继续使用它
        // 只有在应用退出时才需要销毁
      },
      
      // 页面显示时处理
      onShow() {
        console.log('list页面显示');
        
        // 从缓存获取当前播放索引
        const cachedSongIndex = wx.getStorageSync('currentSongIndex');
        if (cachedSongIndex !== undefined && cachedSongIndex !== null) {
          this.setData({ currentSongIndex: cachedSongIndex });
          console.log('从缓存恢复当前歌曲索引:', cachedSongIndex);
        }
        
        // 如果有缓存的音乐列表，恢复它
        const cachedMusicList = wx.getStorageSync('musicList');
        if (cachedMusicList && cachedMusicList.length > 0) {
          this.setData({ musicList: cachedMusicList });
        }
        
        // 检查全局audioContext状态，更新播放状态
        if (audioContext) {
          // 获取当前播放的URL
          const currentUrl = audioContext.src;
          
          // 根据当前播放的URL找到对应的歌曲索引
          if (currentUrl) {
            const index = this.data.musicList.findIndex(item => item.url === currentUrl);
            if (index !== -1 && index !== this.data.currentSongIndex) {
              // 更新当前歌曲索引
              this.setData({ currentSongIndex: index });
              // 更新缓存
              wx.setStorageSync('currentSongIndex', index);
              console.log('根据URL更新当前歌曲索引:', index);
            }
          }
          
          // 更新播放状态
          this.setData({
            playing: !audioContext.paused
          });
          
          console.log('onShow更新状态:', {
            playing: !audioContext.paused,
            currentSongIndex: this.data.currentSongIndex,
            currentUrl: audioContext.src
          });
        }
      },
   // 导航到主页
   navigateToHome: function() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }     
  })
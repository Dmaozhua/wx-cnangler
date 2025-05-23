// pages/music/player.js

// 获取全局音频上下文
let audioContext = null;

Page({
    data: {
        musicInfo: null,        // 当前播放的音乐信息
        musicList: [],         // 音乐列表
        currentTime: 0,        // 当前播放时间（秒）
        duration: 0,           // 总时长（秒）
        playing: false,        // 是否正在播放
        currentLyricIndex: -1, // 当前歌词索引
        lyrics: [],            // 歌词数据
        playMode: 'list',      // 播放模式：list（列表循环）、single（单曲循环）、random（随机播放）
        sliderValue: 0,        // 进度条值（百分比）
        sliderChanging: false, // 是否正在拖动进度条
        coverRotate: 0,        // 封面旋转角度
        showLyrics: false,     // 是否显示歌词
    },

    onLoad(options) {
        // 获取页面参数
        const index = parseInt(options.index || 0);

        // 从列表页获取音乐列表和当前播放状态
        const pages = getCurrentPages();
        const musicListPage = pages.find(page => page.route === 'pages/music/list');

        if (musicListPage) {
            const { musicList, currentSongIndex, playing } = musicListPage.data;
            this.setData({
                musicList,
                musicInfo: musicList[currentSongIndex >= 0 ? currentSongIndex : index],
                playing
            });
        } else {
            // 如果无法获取列表页数据，尝试从缓存获取
            const musicList = wx.getStorageSync('musicList') || [];
            this.setData({
                musicList,
                musicInfo: musicList[index] || null
            });
        }

        // 初始化音频上下文
        this.initAudioContext();

        // 加载歌词
        this.loadLyrics();

        // 启动封面旋转动画
        this.startCoverRotation();
    },

    onShow() {
        // 页面显示时，如果有音乐在播放，更新状态
        if (audioContext) {
            this.setData({
                playing: !audioContext.paused,
                currentTime: audioContext.currentTime || 0,
                duration: audioContext.duration || 0,
                sliderValue: audioContext.duration > 0 ? (audioContext.currentTime / audioContext.duration) * 100 : 0
            });

            // 如果正在播放，启动进度更新
            if (!audioContext.paused) {
                this.startUpdateProgress();
                this.startCoverRotation();
            }
        }
    },

    // 初始化音频上下文
    initAudioContext() {
        // 获取全局音频上下文（如果存在）
        const pages = getCurrentPages();
        const musicListPage = pages.find(page => page.route === 'pages/music/list');

        if (musicListPage && musicListPage.audioContext) {
            audioContext = musicListPage.audioContext;
        } else if (!audioContext) {
            // 如果不存在，创建新的音频上下文
            audioContext = wx.createInnerAudioContext();

            // 如果有音乐信息，设置音频源
            if (this.data.musicInfo) {
                audioContext.src = this.data.musicInfo.url;
            }

            // 将音频上下文保存到全局，以便在页面间共享
            if (musicListPage) {
                musicListPage.audioContext = audioContext;
            }
        }

        // 设置音频事件监听
        this.setupAudioListeners();

        // 更新初始状态
        this.updateMusicState();
    },

    // 设置音频事件监听
    setupAudioListeners() {
        if (!audioContext) return;

        // 清除可能存在的旧监听器
        audioContext.offPlay();
        audioContext.offPause();
        audioContext.offStop();
        audioContext.offEnded();
        audioContext.offTimeUpdate();
        audioContext.offError();

        // 播放事件
        audioContext.onPlay(() => {
            this.setData({ playing: true });
            this.startUpdateProgress();
            this.startCoverRotation();
        });

        // 暂停事件
        audioContext.onPause(() => {
            this.setData({ playing: false });
            this.stopUpdateProgress();
            this.stopCoverRotation();
        });

        // 停止事件
        audioContext.onStop(() => {
            this.setData({
                playing: false,
                currentTime: 0,
                sliderValue: 0
            });
            this.stopUpdateProgress();
            this.stopCoverRotation();
        });

        // 播放结束事件
        audioContext.onEnded(() => {
            // 根据播放模式决定下一步操作
            this.handlePlayEnd();
        });

        // 时间更新事件
        audioContext.onTimeUpdate(() => {
            if (this.data.sliderChanging) return;

            const currentTime = audioContext.currentTime;
            const duration = audioContext.duration;

            // 计算进度条值
            const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;

            this.setData({
                currentTime,
                duration,
                sliderValue
            });

            // 更新歌词显示
            this.updateLyric(currentTime);
        });

        // 错误事件
        audioContext.onError((err) => {
            console.error('音频播放错误:', err);
            wx.showToast({
                title: '音频播放失败',
                icon: 'none'
            });
        });
    },

    // 更新音乐状态
    updateMusicState() {
        if (!audioContext) return;

        this.setData({
            currentTime: audioContext.currentTime || 0,
            duration: audioContext.duration || 0,
            playing: !audioContext.paused,
            sliderValue: audioContext.duration > 0 ? (audioContext.currentTime / audioContext.duration) * 100 : 0
        });

        // 如果正在播放，启动进度更新
        if (!audioContext.paused) {
            this.startUpdateProgress();
            this.startCoverRotation();
        }
    },

    // 开始更新进度
    startUpdateProgress() {
        // 清除可能存在的定时器
        this.stopUpdateProgress();

        // 创建新的定时器，每秒更新一次进度
        this.progressTimer = setInterval(() => {
            if (!audioContext || this.data.sliderChanging) return;

            const currentTime = audioContext.currentTime;
            const duration = audioContext.duration;

            // 计算进度条值
            const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;

            this.setData({
                currentTime,
                duration,
                sliderValue
            });

            // 更新歌词显示
            this.updateLyric(currentTime);
        }, 1000);
    },

    // 停止更新进度
    stopUpdateProgress() {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    },

    // 播放/暂停切换
    togglePlay() {
        if (!audioContext || !this.data.musicInfo) return;

        if (this.data.playing) {
            audioContext.pause();
        } else {
            // 如果没有设置音频源，先设置
            if (!audioContext.src) {
                audioContext.src = this.data.musicInfo.url;
            }
            audioContext.play();
        }
    },

    // 播放上一首
    playPrev() {
        const { musicList, musicInfo } = this.data;
        if (!musicList.length || !musicInfo) return;

        // 找到当前歌曲索引
        const currentIndex = musicList.findIndex(item => item.id === musicInfo.id);
        if (currentIndex === -1) return;

        // 计算上一首索引
        let prevIndex;
        if (this.data.playMode === 'random') {
            // 随机模式：随机选择一首（排除当前歌曲）
            prevIndex = this.getRandomIndex(currentIndex);
        } else {
            // 其他模式：顺序选择上一首
            prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
        }

        // 播放上一首
        this.playSong(prevIndex);
    },

    // 播放下一首
    playNext() {
        const { musicList, musicInfo } = this.data;
        if (!musicList.length || !musicInfo) return;

        // 找到当前歌曲索引
        const currentIndex = musicList.findIndex(item => item.id === musicInfo.id);
        if (currentIndex === -1) return;

        // 计算下一首索引
        let nextIndex;
        if (this.data.playMode === 'random') {
            // 随机模式：随机选择一首（排除当前歌曲）
            nextIndex = this.getRandomIndex(currentIndex);
        } else {
            // 其他模式：顺序选择下一首
            nextIndex = (currentIndex + 1) % musicList.length;
        }

        // 播放下一首
        this.playSong(nextIndex);
    },

    // 获取随机索引（排除当前索引）
    getRandomIndex(excludeIndex) {
        const { musicList } = this.data;
        if (musicList.length <= 1) return 0;

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * musicList.length);
        } while (randomIndex === excludeIndex);

        return randomIndex;
    },

    // 播放结束处理
    handlePlayEnd() {
        const { playMode } = this.data;

        if (playMode === 'single') {
            // 单曲循环：重新播放当前歌曲
            audioContext.seek(0);
            audioContext.play();
        } else {
            // 其他模式：播放下一首
            this.playNext();
        }
    },

    // 播放指定索引的歌曲
    playSong(index) {
        const { musicList } = this.data;
        if (index < 0 || index >= musicList.length) return;

        // 获取歌曲信息
        const musicInfo = musicList[index];

        // 更新状态
        this.setData({
            musicInfo,
            currentTime: 0,
            sliderValue: 0,
            currentLyricIndex: -1
        });

        // 设置音频源并播放
        if (audioContext) {
            audioContext.stop();
            audioContext.src = musicInfo.url;
            audioContext.play();
        }

        // 加载歌词
        this.loadLyrics();

        // 同步更新列表页的当前播放索引
        this.updateListPageState(index);
    },

    // 更新列表页状态
    updateListPageState(index) {
        const pages = getCurrentPages();
        const musicListPage = pages.find(page => page.route === 'pages/music/list');

        if (musicListPage) {
            musicListPage.setData({
                currentSongIndex: index,
                playing: true
            });
        }
    },

    // 进度条变化中
    onSliderChanging(e) {
        this.setData({ sliderChanging: true });
    },

    // 进度条变化完成
    onSliderChange(e) {
        if (!audioContext || !this.data.duration) return;

        // 计算新的播放时间
        const value = e.detail.value;
        const seekTime = (value / 100) * this.data.duration;

        // 跳转到指定时间
        audioContext.seek(seekTime);

        // 更新状态
        this.setData({
            sliderChanging: false,
            currentTime: seekTime,
            sliderValue: value
        });

        // 如果当前是暂停状态，自动开始播放
        if (!this.data.playing) {
            audioContext.play();
        }
    },

    // 切换播放模式
    togglePlayMode() {
        const modeMap = {
            'list': 'single',
            'single': 'random',
            'random': 'list'
        };

        const newMode = modeMap[this.data.playMode];

        this.setData({ playMode: newMode });

        // 显示提示
        const modeText = {
            'list': '列表循环',
            'single': '单曲循环',
            'random': '随机播放'
        };

        wx.showToast({
            title: modeText[newMode],
            icon: 'none'
        });
    },

    // 加载歌词
    loadLyrics() {
        // 这里应该从服务器加载歌词，但由于没有实际的歌词数据，我们创建一些示例歌词
        const { musicInfo } = this.data;
        if (!musicInfo) return;

        // 示例歌词数据（时间:歌词文本）
        const sampleLyrics = [
            { time: 0, text: musicInfo.title },
            { time: 3, text: '演唱：' + musicInfo.artist },
            { time: 6, text: '钓鱼人测试应用' },
            { time: 9, text: '让音乐陪伴你的钓鱼时光' },
            { time: 12, text: '钓鱼，是一种生活态度' },
            { time: 15, text: '静静地享受这美好时刻' },
            { time: 18, text: '阳光、微风、湖面' },
            { time: 21, text: '还有这动听的音乐' },
            { time: 24, text: '生活不止眼前的苟且' },
            { time: 27, text: '还有诗和远方的田野' },
            { time: 30, text: '愿你钓鱼愉快' },
            { time: 33, text: '满载而归' }
        ];

        this.setData({ lyrics: sampleLyrics });
    },

    // 更新歌词显示
    updateLyric(currentTime) {
        const { lyrics } = this.data;
        if (!lyrics.length) return;

        // 查找当前时间对应的歌词
        let index = lyrics.findIndex(lyric => lyric.time > currentTime) - 1;
        if (index < 0) index = 0;

        // 如果歌词索引变化，更新状态
        if (index !== this.data.currentLyricIndex) {
            this.setData({ currentLyricIndex: index });
        }
    },

    // 切换歌词/封面显示
    toggleLyricsView() {
        this.setData({
            showLyrics: !this.data.showLyrics
        });
    },

    // 启动封面旋转动画
    startCoverRotation() {
        // 清除可能存在的定时器
        this.stopCoverRotation();

        // 如果正在播放，启动旋转动画
        if (this.data.playing) {
            this.coverRotateTimer = setInterval(() => {
                this.setData({
                    coverRotate: (this.data.coverRotate + 1) % 360
                });
            }, 100);
        }
    },

    // 停止封面旋转动画
    stopCoverRotation() {
        if (this.coverRotateTimer) {
            clearInterval(this.coverRotateTimer);
            this.coverRotateTimer = null;
        }
    },

    // 格式化时间（秒 -> MM:SS）
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    },

    // 返回列表页
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 页面卸载
    onUnload() {
        // 停止定时器
        this.stopUpdateProgress();
        this.stopCoverRotation();

        // 注意：不要在这里销毁audioContext，因为我们需要在列表页继续使用它
    }
})
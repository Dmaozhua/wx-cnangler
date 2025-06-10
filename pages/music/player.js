// pages/music/player.js

// 获取全局音频上下文
let audioContext = null;

Page({
    data: {
        musicInfo: null,        // 当前播放的音乐信息
        musicList: [],         // 音乐列表
        currentTime: 0,        // 当前播放时间（秒）
        duration: 0,           // 总时长（秒）
        currentTimeText: '00:00', // 格式化的当前时间文本
        durationText: '00:00',    // 格式化的总时长文本
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
            
            // iOS设备音频播放优化配置
            audioContext.obeyMuteSwitch = false; // 忽略静音开关
            audioContext.sessionCategory = 'playback'; // 设置音频会话类别

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
        audioContext.offCanplay();
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
                sliderValue: 0,
                currentTimeText: '00:00',
                durationText: '00:00',
                currentLyricIndex: -1,
                lyrics: [] // 确保歌词数组被重置
            });
            this.stopUpdateProgress();
            this.stopCoverRotation();
        });

        // 播放结束事件
        audioContext.onEnded(() => {
            // 检查听歌成就
            this.checkMusicAchievements();
            // 根据播放模式决定下一步操作
            this.handlePlayEnd();
        });

        // 音频可以播放事件（元数据加载完成）
        audioContext.onCanplay(() => {
            console.log('音频可以播放，duration:', audioContext.duration);
            // 确保duration正确获取
            if (audioContext.duration && audioContext.duration > 0) {
                const duration = audioContext.duration;
                this.setData({
                    duration: duration,
                    durationText: this.formatTime(duration)
                });
            }
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
                sliderValue,
                currentTimeText: this.formatTime(currentTime),
                durationText: this.formatTime(duration)
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
                    sliderValue,
                    currentTimeText: this.formatTime(currentTime),
                    durationText: this.formatTime(duration)
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
            currentTimeText: '00:00',
            durationText: '00:00',
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
        const { musicInfo } = this.data;
        if (!musicInfo) return;
        
        // 显示加载中提示
        wx.showLoading({
            title: '加载歌词中',
            mask: false
        });
        
        // 从歌曲标题中提取歌曲名
        const songName = musicInfo.title;
        // 构建歌词文件URL
        const lyricsUrl = `https://anglertest.xyz/music/${encodeURIComponent(songName)}.lrc`;
        
        console.log('尝试加载歌词:', lyricsUrl);
        
        // 请求歌词文件
        wx.request({
            url: lyricsUrl,
            success: (res) => {
                // 隐藏加载提示
                wx.hideLoading();
                
                if (res.statusCode === 200 && res.data) {
                    // 解析歌词
                    const lyrics = this.parseLyrics(res.data);
                    this.setData({ lyrics });
                    console.log('歌词加载成功');
                } else {
                    console.error('歌词文件加载失败:', res);
                    this.showLyricsError();
                }
            },
            fail: (err) => {
                // 隐藏加载提示
                wx.hideLoading();
                console.error('歌词请求失败:', err);
                this.showLyricsError();
            }
        });
    },
    
    // 解析LRC格式歌词
    parseLyrics(lrcContent) {
        if (!lrcContent) {
            return this.getDefaultLyrics();
        }
        
        try {
            // 按行分割歌词内容
            const lines = lrcContent.split('\n');
            const lyrics = [];
            
            // LRC时间标签正则表达式 [mm:ss.xx]
            const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
            
            for (let line of lines) {
                // 跳过空行
                if (!line.trim()) continue;
                
                // 匹配时间标签
                const match = timeRegex.exec(line);
                if (match) {
                    // 提取分钟、秒和毫秒
                    const minutes = parseInt(match[1]);
                    const seconds = parseInt(match[2]);
                    const milliseconds = parseInt(match[3]);
                    
                    // 计算总时间（秒）
                    const time = minutes * 60 + seconds + milliseconds / 100;
                    
                    // 提取歌词文本（去除时间标签）
                    const text = line.replace(timeRegex, '').trim();
                    
                    // 添加到歌词数组
                    if (text) {
                        lyrics.push({ time, text });
                    }
                }
            }
            
            // 按时间排序
            lyrics.sort((a, b) => a.time - b.time);
            
            return lyrics.length > 0 ? lyrics : this.getDefaultLyrics();
        } catch (error) {
            console.error('解析歌词出错:', error);
            return this.getDefaultLyrics();
        }
    },
    
    // 显示歌词加载错误
    showLyricsError() {
        wx.showToast({
            title: '歌词加载失败',
            icon: 'none',
            duration: 2000
        });
        
        // 使用默认歌词
        this.setData({ lyrics: this.getDefaultLyrics() });
    },
    
    // 获取默认歌词
    getDefaultLyrics() {
        const { musicInfo } = this.data;
        if (!musicInfo) return [];
        
        // 默认歌词数据
        return [
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
    },

    // 更新歌词显示
    updateLyric(currentTime) {
        const { lyrics } = this.data;
        if (!lyrics || !lyrics.length) {
            // 如果没有歌词，重置索引
            if (this.data.currentLyricIndex !== -1) {
                this.setData({ currentLyricIndex: -1 });
            }
            return;
        }

        // 查找当前时间对应的歌词
        let index = lyrics.findIndex(lyric => lyric.time > currentTime) - 1;
        if (index < 0) index = 0;
        
        // 确保索引在有效范围内
        if (index >= lyrics.length) index = lyrics.length - 1;

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
        // 添加调试信息
        // console.log('formatTime called with:', seconds, 'type:', typeof seconds);
        
        if (isNaN(seconds) || seconds === null || seconds === undefined) {
            console.log('formatTime returning 00:00 due to invalid input');
            return '00:00';
        }

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        
        const result = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        console.log('formatTime result:', result);
        return result;
    },

    // 返回列表页
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 检查听歌成就
    checkMusicAchievements() {
        const app = getApp();
        const achievementsData = require('../../data/achievements.js');
        
        console.log('[成就系统] 开始检查听歌成就');
        
        // 确保userAchievements已初始化
        if (!app.globalData.userAchievements) {
            app.globalData.userAchievements = {};
        }
        
        // 检查type 11成就（听一首路亚歌曲）
        const musicAchievements = achievementsData.achievements.filter(achievement => 
            achievement.type === 11
        );
        
        console.log('[成就系统] 找到听歌成就数量:', musicAchievements.length);
        console.log('[成就系统] 当前userAchievements:', app.globalData.userAchievements);
        
        musicAchievements.forEach(achievement => {
            console.log('[成就系统] 检查成就:', achievement.id, achievement.title);
            
            // 获取当前成就数据
            const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object' 
                ? app.globalData.userAchievements[achievement.id] 
                : { progress: 0, unlockTime: null };
            
            console.log('[成就系统] 当前成就数据:', achievementData);
            
            // 如果成就尚未解锁
            if (!achievementData.unlockTime) {
                console.log('[成就系统] 解锁听歌成就:', achievement.title);
                
                // 解锁成就
                app.globalData.userAchievements[achievement.id] = {
                    progress: 1,
                    unlockTime: new Date().toISOString()
                };
                
                // 增加成就分数
                app.globalData.achievementScore = (app.globalData.achievementScore || 0) + achievement.score;
                wx.setStorageSync('achievementScore', app.globalData.achievementScore);
                
                // 保存更新后的成就数据
                wx.setStorageSync('achievements', app.globalData.userAchievements);
                
                console.log('[成就系统] 成就数据已保存到本地存储');
                
                // 确保成就对象包含正确的icon属性
                const { getAchievementIcon } = require('../../data/achievements.js');
                const achievementWithIcon = {
                    ...achievement,
                    icon: achievement.getIcon ? achievement.getIcon(true) : getAchievementIcon(achievement.id, true)
                };
                
                console.log('[music/player.js] 成就图标地址:', achievementWithIcon.icon);
                
                // 将成就添加到待展示队列，等到返回Home页面时统一显示
                if (!app.globalData.pendingAchievements) {
                    app.globalData.pendingAchievements = [];
                }
                app.globalData.pendingAchievements.push(achievementWithIcon);
                wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
                
                console.log(`[成就系统] 解锁听歌成就: ${achievement.title}，已添加到待展示队列`);
                console.log(`[成就系统] 当前待展示队列长度: ${app.globalData.pendingAchievements.length}`);
            } else {
                console.log('[成就系统] 成就已解锁:', achievement.title);
            }
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
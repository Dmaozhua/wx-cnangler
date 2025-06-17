// 在Page对象顶部引入工具
const { getDominantColor, rgbToHex } = require('../../utils/colorAnalyzer')
Page({
    data: {
        showPrompt: true,
        searchQuery: "",
        showTips: false,
        tipsText: "",
        weatherModalVisible: false,
        weatherCityName: "",
        weatherData: {},
        weatherPressure: "",
        weatherSunsetTime: "",
        // 成就弹窗相关数据
        achievementPopupVisible: false,
        currentAchievement: null,
        pendingAchievements: [],
        currentAchievementIndex: 0,
        // 背景渐变样式
        containerStyle: "linear-gradient(to bottom, #BDC3C7 0%, #BDC3C7 75%, #ffffff 95%); transition: background 0.3s ease;",
        // 标题样式
        welcomeCardStyle: "linear-gradient(135deg,rgb(43, 75, 107), #F5F0E7)", // 蓝紫色渐变
        welcomeTextColor: "black", // 白色字体
        sectionTitleStyle: {},
        // 添加测试题目数量
        testCount: 0,
        // 添加bannerList初始化，支持webp格式
        bannerList: [
            { 
                imageUrl: "https://anglertest.xyz/Banner/2.jpg",
                webpUrl: "https://anglertest.xyz/Banner/2.webp",
                defaultUrl: "/images/banner/default.jpg" // 默认图片地址
            },
            { 
                imageUrl: "https://anglertest.xyz/Banner/3.jpg",
                webpUrl: "https://anglertest.xyz/Banner/3.webp",
                defaultUrl: "/images/banner/default.jpg"
            },
            { 
                imageUrl: "https://anglertest.xyz/Banner/4.jpg",
                webpUrl: "https://anglertest.xyz/Banner/4.webp",
                defaultUrl: "/images/banner/default.jpg"
            }
        ]
    },
    onLoad() {
        // 检查是否首次访问
        const hasClosed = wx.getStorageSync('hasClosedPrompt')
        if (hasClosed) {
          this.setData({ showPrompt: false })
        } else {
          // 设置3秒自动关闭
          this.autoCloseTimer = setTimeout(() => {
            this.closePrompt()
          }, 3000)
        }
        
        // 获取测试题目数量
        this.getTestCount();
      },
    closePrompt() {
        clearTimeout(this.autoCloseTimer)
        this.setData({ showPrompt: false })
        wx.setStorageSync('hasClosedPrompt', true)
    },
    
    // 触摸移动事件处理，阻止默认行为，防止出现半透明"划块"
    touchMove(e) {
        e.preventDefault && e.preventDefault();
        return false;
    },
    // 搜索相关功能
    onSearchInput(e) {
        this.setData({ searchQuery: e.detail.value });
    },

    onSearch() {
        console.log("搜索内容：", this.data.searchQuery);
        // 这里可以调用搜索功能或跳转到搜索结果页面
    },

    // 测试页面导航
    goToTest1() {
        // 防止连续点击
        if (this.isTest1Clicking) {
            return;
        }
        this.isTest1Clicking = true;
        
        // 跳转到第一个测试（钓鱼人格精密分析）
        const testData = require('../../data/testDataNew');
        // 确保使用id为1的测试数据
        wx.setStorageSync('selectedTest', testData.personalityTest);
        wx.navigateTo({ 
            url: "/pages/test/test?id=1",
            complete: () => {
                // 导航完成后重置标志
                setTimeout(() => {
                    this.isTest1Clicking = false;
                }, 500);
            }
        });
    },

    goToTest2() {
        // 防止连续点击
        if (this.isTest2Clicking) {
            return;
        }
        this.isTest2Clicking = true;
        
        // 跳转到第二个测试（钓鱼应急能力测试）
        const testData = require('../../data/testDataNew');
        // 确保使用id为2的测试数据
        wx.setStorageSync('selectedTest', testData.emergencyTest);
        wx.navigateTo({ 
            url: "/pages/test/test?id=2",
            complete: () => {
                // 导航完成后重置标志
                setTimeout(() => {
                    this.isTest2Clicking = false;
                }, 500);
            }
        });
    },
    
    goToRandomTest() {
        // 防止连续点击
        if (this.isRandomSelecting) {
            return;
        }
        this.isRandomSelecting = true;
        
        // 随机选择一个测试
        const testData = require('../../data/testDataNew');
        const testKeys = [];
        
        // 显示随机中的提示
        this.setData({
            showTips: true,
            tipsText: "随机选择中..."  
        });
        
        // 收集所有有效的测试数据
        for (const key in testData) {
            if (testData.hasOwnProperty(key) && typeof testData[key] === 'object' && testData[key].id && testData[key].title) {
                testKeys.push(key);
            }
        }
        
        // 随机选择一个测试，添加延迟增强随机感
        if (testKeys.length > 0) {
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * testKeys.length);
                const randomKey = testKeys[randomIndex];
                const randomTest = testData[randomKey];
                
                console.log(`随机选择了测试: ${randomTest.title} (ID: ${randomTest.id})`);
                wx.setStorageSync('selectedTest', randomTest);
                wx.navigateTo({ 
                    url: `/pages/test/test?id=${randomTest.id}`,
                    complete: () => {
                        // 隐藏提示并重置标志
                        this.setData({ showTips: false });
                        setTimeout(() => {
                            this.isRandomSelecting = false;
                        }, 500);
                    }
                });
            }, 800); // 延迟800毫秒，增强随机感
        } else {
            // 如果没有找到测试数据，重置状态
            this.setData({ showTips: false });
            this.isRandomSelecting = false;
        }
    },
    
    goToAllTests() {
        // 跳转到所有测试列表页面
        wx.navigateTo({ url: "/pages/test/test-list" });
    },

    // 齿轮测试页面导航
    goToGearTest1() {
        // 跳转到钓竿测试，使用testEquipment.js中的ganzi数据
        const testEquipment = require('../../data/testEquipment');
        // 使用ganzi数据
        wx.setStorageSync('selectedTest', testEquipment.ganzi);
        wx.navigateTo({ url: "/pages/test/test?id=1" });
    },

    goToGearTest2() {
        // 跳转到渔轮测试，使用testEquipment.js中的lunzi数据
        const testEquipment = require('../../data/testEquipment');
        // 使用lunzi数据
        wx.setStorageSync('selectedTest', testEquipment.multiDimTest);
        wx.navigateTo({ url: "/pages/test/test?id=3" });
    },
    
    // 处理更多按钮点击事件
    onMoreBtnTap() {
        wx.showToast({
            title: '数据正在准备中，敬请期待，谢谢',
            icon: 'none',
            duration: 2000
        });
    },

    goToGearTest3() {
        // 显示提示信息
        wx.showToast({
            title: '数据正在准备中，敬请期待，谢谢',
            icon: 'none',
            duration: 2000
        });
    },

    goToGearTest4() {
        wx.navigateTo({ url: "/pages/gearTest/test4" });
    },

    goToGearTest5() {
        wx.navigateTo({ url: "/pages/gearTest/test5" });
    },

    // 设备页面导航
    goToEquipment() {
        wx.navigateTo({ url: "/pages/equipment/equipment" });
    },
    // 音乐页面导航
    goTomusic() {
        wx.navigateTo({ url: "/pages/music/list" });
    },
    // 天气功能
    checkWeather() {
        // 检查并解锁首次使用天气功能的成就
        this.checkFeatureAchievement('checkWeather');
        
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation']) {
                    this.doGetLocation();
                } else {
                    this.requestLocationAuth();
                }
            },
            fail: () => this.showError('权限检查失败')
        });
    },
    requestLocationAuth() {
        wx.showModal({
            title: '权限申请',
            content: '需要您的位置权限以提供精准天气服务',
            success: (res) => {
                if (res.confirm) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => this.doGetLocation(),
                        fail: () => this.handleLocationError({ errMsg: 'auth deny' })
                    });
                }
            }
        });
    },

    doGetLocation() {
        wx.showLoading({ title: '定位中...' });
        wx.getLocation({
            type: 'gcj02',
            success: (locRes) => {
                console.log('[定位成功]', locRes);
                this.fetchWeatherByCoord(locRes.longitude, locRes.latitude);
            },
            fail: (err) => {
                wx.hideLoading();
                this.handleLocationError(err);
            }
        });
    },
    // 处理定位失败
    handleLocationError(err) {
        console.error('定位失败:', err);
        let msg = '获取位置失败，请检查是否开启定位权限';

        if (err.errMsg.includes('auth deny')) {
            msg = '需要位置权限获取当地天气，点击确定前往设置';
            wx.showModal({
                title: '权限提示',
                content: msg,
                success: (res) => {
                    if (res.confirm) {
                        wx.openSetting(); // 跳转权限设置页
                    }
                }
            });
        } else {
            wx.showToast({ title: msg, icon: 'none' });
        }
    },

    // 根据坐标获取天气
    fetchWeatherByCoord(lng, lat) {
        const key = '12ac567f073843fc9e1ea417883ce8e5'; // 替换为你的和风天气Key
        const location = `${lng},${lat}`;
        wx.request({
            url: 'https://geoapi.qweather.com/v2/city/lookup',
            data: { location: location, key: key },
            success: (geoRes) => {
                if (geoRes.data.code === '200' && geoRes.data.location?.length > 0) {
                    const cityInfo = geoRes.data.location[0];
                    this.fetchWeatherData(cityInfo.id, cityInfo.name);
                } else {
                    this.showError('定位失败：未找到匹配城市');
                }
            },
            fail: (err) => this.showError('城市查询服务异常')
        });
    },

    // 获取实时天气数据
    fetchWeatherData(cityId, cityName) {
        const key = '12ac567f073843fc9e1ea417883ce8e5';

        // 获取实时天气数据
        wx.request({
            url: 'https://devapi.qweather.com/v7/weather/now',
            data: { location: cityId, key: key },
            success: (res) => {
                if (res.data.code === '200') {
                    // 获取日出日落数据
                    this.fetchSunData(cityId, cityName, res.data.now);
                } else {
                    wx.hideLoading();
                    this.showError(`天气获取失败：${res.data.code}`);
                }
            },
            fail: (err) => {
                wx.hideLoading();
                this.showError('天气服务请求超时');
            }
        });
    },
    onImageError(e) {
        const index = e.currentTarget.dataset.index;
        const bannerList = this.data.bannerList;
        bannerList[index].imageUrl = bannerList[index].defaultUrl;
        this.setData({
            bannerList
        });
    },
    // 获取日出日落数据
    fetchSunData(cityId, cityName, weatherData) {
        const key = '12ac567f073843fc9e1ea417883ce8e5';

        wx.request({
            url: 'https://devapi.qweather.com/v7/astronomy/sun',
            data: {
                location: cityId,
                key: key,
                date: new Date().toISOString().split('T')[0].replace(/-/g, '') // 当前日期，格式：yyyyMMdd
            },
            success: (res) => {
                wx.hideLoading();
                if (res.data.code === '200') {
                    // 显示天气弹窗，包含日落时间
                    const sunsetTime = res.data.sunset || '未知';
                    this.showWeatherModal(cityName, weatherData, weatherData.pressure || '未知', sunsetTime);
                } else {
                    // 如果获取日出日落失败，仍然显示天气信息
                    this.showWeatherModal(cityName, weatherData, weatherData.pressure || '未知', '未知');
                }
            },
            fail: (err) => {
                // 如果获取日出日落失败，仍然显示天气信息
                wx.hideLoading();
                this.showWeatherModal(cityName, weatherData, weatherData.pressure || '未知', '未知');
            }
        });
    },

    // 显示天气弹窗
    showWeatherModal(cityName, weatherData, pressure, sunsetTime) {
        // 使用自定义弹窗组件显示天气信息
        this.setData({
            weatherModalVisible: true,
            weatherCityName: cityName,
            weatherData: weatherData,
            weatherPressure: pressure,
            weatherSunsetTime: sunsetTime
        });
    },

    // 关闭天气弹窗
    closeWeatherModal() {
        this.setData({
            weatherModalVisible: false
        });
    },

    // 统一错误处理
    showError(msg) {
        const errorMap = {
            '204': '查询位置无结果',
            '400': '请求参数错误',
            '401': '密钥无效',
            '402': '超过访问次数',
            '403': '无访问权限'
        };

        const displayMsg = errorMap[msg] || msg;

        wx.showModal({
            title: '提示',
            content: displayMsg,
            showCancel: false
        });
    },
    
    // 检查功能使用相关成就
    checkFeatureAchievement(featureId) {
        const app = getApp();
        const { achievements, getAchievementIcon } = require('../../data/achievements.js');
        
        console.log(`===== 功能使用成就检查 =====`);
        console.log(`当前使用功能: ${featureId}`);
        
        // 筛选出type:3类型的成就（首次使用特定功能）
        const featureAchievements = achievements.filter(a => a.type === 3 && a.value === featureId);
        console.log(`相关功能成就数量: ${featureAchievements.length}`);
        
        featureAchievements.forEach(achievement => {
            // 获取当前成就进度
            const achievementData = typeof app.globalData.userAchievements[achievement.id] === 'object'
                ? app.globalData.userAchievements[achievement.id]
                : { progress: 0, unlockTime: null };
            
            const current = achievementData.progress || 0;
            
            console.log(`检查成就[${achievement.id}] ${achievement.title}: 当前进度 ${current}`);
            
            // 如果成就尚未解锁，则解锁它
            if (current < 1) {
                console.log(`解锁功能使用成就: ${achievement.title}`);
                
                // 更新成就进度
                app.updateAchievementProgress(achievement.id, 1);
                
                // 获取成就数据 - 使用不同的变量名避免覆盖
                const achievementData = achievements.find(a => a.id === achievement.id);
                
                if (achievementData) {
                    // 确保成就对象包含正确的icon属性
                    const achievementWithIcon = {
                        ...achievementData,
                        icon: achievementData.getIcon ? achievementData.getIcon(true) : getAchievementIcon(achievementData.id, true)
                    };
                    
                    console.log('[checkFeatureAchievement] 成就图标地址:', achievementWithIcon.icon);
                    
                    // 增加成就分数
                    const oldScore = app.globalData.achievementScore || 0;
                    app.globalData.achievementScore = oldScore + achievementData.score;
                    wx.setStorageSync('achievementScore', app.globalData.achievementScore);
                    console.log(`成就分数更新: ${oldScore} -> ${app.globalData.achievementScore}`);
                    
                    // 检查成就分数相关的成就（type: 2）
                    app.checkScoreAchievements();
                    
                    // 将成就添加到待展示队列
                    if (!app.globalData.pendingAchievements) {
                        app.globalData.pendingAchievements = [];
                    }
                    app.globalData.pendingAchievements.push(achievementWithIcon);
                    wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
                    console.log(`成就已添加到展示队列，当前队列长度: ${app.globalData.pendingAchievements.length}`);
                }
            } else {
                console.log(`成就[${achievement.id}] ${achievement.title} 已解锁，无需更新`);
            }
        });
    },

    // 其他功能提示
    showOtherFeatures() {
        this.setData({
            showTips: true,
            tipsText: "敬请期待更多功能！"
        });

        // 1秒后自动隐藏提示
        setTimeout(() => {
            this.setData({
                showTips: false
            });
        }, 1000);
    },
    
    // 钓鱼模拟器功能
    goToFishingSimulator() {
        console.log('[钓鱼模拟器] 用户点击了钓鱼模拟器按钮');
        
        // 跳转到钓鱼模拟器首页
        wx.navigateTo({ 
            url: "/pages/fishingHome/fishingHome",
            success: (res) => {
                console.log('[钓鱼模拟器] 成功跳转到钓鱼模拟器首页', res);
            },
            fail: (err) => {
                console.error('[钓鱼模拟器] 跳转到钓鱼模拟器首页失败:', err);
                // 跳转失败时显示提示
                this.setData({
                    showTips: true,
                    tipsText: "跳转失败，请稍后再试！"
                });
                
                // 2秒后自动隐藏提示
                setTimeout(() => {
                    this.setData({
                        showTips: false
                    });
                }, 2000);
            },
            complete: () => {
                console.log('[钓鱼模拟器] 跳转操作完成');
            }
        });
    },
    
    // 跳转到动画测试页面
    goToDonghuaTest() {
        wx.navigateTo({
            url: '/pages/donghuatest/donghuatest'
        });
    },
    
    // 成就相关方法
    onShow() {
        // 检查是否有待展示的成就
        this.checkPendingAchievements();
    },
    
    // 检查待展示的成就
    checkPendingAchievements() {
        const app = getApp();
        if (app.globalData.pendingAchievements && app.globalData.pendingAchievements.length > 0) {
            // 获取所有待展示的成就
            const achievements = [...app.globalData.pendingAchievements];
            
            // 清空待展示队列
            app.globalData.pendingAchievements = [];
            wx.setStorageSync('pendingAchievements', app.globalData.pendingAchievements);
            
            this.setData({
                achievementPopupVisible: true,
                pendingAchievements: achievements,
                currentAchievement: achievements[0],
                currentAchievementIndex: 0
            });
        }
    },
    
    // 关闭成就弹窗
    onCloseAchievementPopup() {
        this.setData({
            achievementPopupVisible: false,
            currentAchievement: null,
            pendingAchievements: [],
            currentAchievementIndex: 0
        });
    },

    onSwitchAchievement(e) {
        const { newIndex } = e.detail;
        const achievements = this.data.pendingAchievements;
        
        if (newIndex >= 0 && newIndex < achievements.length) {
            this.setData({
                currentAchievement: achievements[newIndex],
                currentAchievementIndex: newIndex
            });
        }
    },
    
    // 查看成就详情
    onViewAchievementDetails(e) {
        this.setData({ achievementPopupVisible: false });
        
        // 获取成就信息
        const achievement = e && e.detail && e.detail.achievement ? e.detail.achievement : this.data.currentAchievement;
        
        // 跳转到成就页面并传递成就ID
        if (achievement && achievement.id) {
            wx.navigateTo({ url: `/pages/achievements/achievements?achievementId=${achievement.id}` });
        } else {
            wx.navigateTo({ url: "/pages/achievements/achievements" });
        }
    },
    // 处理轮播图点击事件
    onBannerTap(e) {
        const index = e.currentTarget.dataset.index;
        console.log('[Banner点击]', '点击了第', index, '张banner图');
        
        if (index == 0) {
            // 第一张图点击打开test-list页面
            wx.navigateTo({
                url: "/pages/test/test-list",
                success: (res) => {
                    console.log('[Banner跳转]', '成功跳转到test-list页面');
                },
                fail: (err) => {
                    console.error('[Banner跳转]', '跳转到test-list页面失败:', err);
                }
            });
        } else if (index == 1) {
            // 第二张图点击打开articlePage页面（tabBar页面使用switchTab）
            wx.switchTab({
                url: "/pages/articlePage/articlePage",
                success: (res) => {
                    console.log('[Banner跳转]', '成功跳转到articlePage页面');
                },
                fail: (err) => {
                    console.error('[Banner跳转]', '跳转到articlePage页面失败:', err);
                }
            });
        }
        else if (index == 2) {
            // 第san张图点击打开fishingHome页面（tabBar页面使用switchTab）
            wx.navigateTo({
                url: "/pages/fishingHome/fishingHome",
                success: (res) => {
                    console.log('[Banner跳转]', '成功跳转到fishingHome页面');
                },
                fail: (err) => {
                    console.error('[Banner跳转]', '跳转到fishingHome页面失败:', err);
                }
            });
        }
    },
    
    // 处理轮播图切换事件，提取主色调并设置背景渐变色
    onSwiperChange(e) {
        const index = e.detail.current;
        
        // 添加边界检查
        if (!this.data.bannerList || index >= this.data.bannerList.length) {
          console.error('Invalid banner index:', index);
          return;
        }
      
        const currentBanner = this.data.bannerList[index];
        
        // 添加图片路径检查，优先使用webp格式
        const imagePath = currentBanner?.webpUrl || currentBanner?.imageUrl;
        if (!imagePath) {
          console.error('Banner image path is undefined');
          return;
        }
      
        // 先设置一个临时状态，表示正在进行颜色分析
        this.isAnalyzingColor = true;
        
        getDominantColor(imagePath, (rgbColor) => {
          // 添加回调结果检查
          if (!rgbColor || typeof rgbColor !== 'string') {
            console.error('Invalid color result:', rgbColor);
            return;
          }
          
          try {
            const mainColorHex = rgbToHex(rgbColor);
            // 分析完成后，一次性更新所有样式
            this.updateStyles(mainColorHex);
            // 重置分析状态
            this.isAnalyzingColor = false;
          } catch (error) {
            console.error('Color conversion failed:', error);
            this.updateStyles('#ffffff'); // 降级处理
            this.isAnalyzingColor = false;
          }
        });
      },
        // 更新样式（统一处理颜色生成）
  updateStyles(mainColor) {
    // 生成渐变色（主色到白色）
    const gradientStyle = this.generateGradient(mainColor)
    // 生成欢迎卡样式
    const welcomeCardStyle = this.generateWelcomeCardGradient(mainColor)
    // 计算文字颜色
    const textColor = this.calculateTextColor(mainColor)
    
    // 获取导航栏组件
    const navigationBar = this.selectComponent('#navigation-bar')
    
    // 使用wx.nextTick确保在同一个渲染周期内完成所有更新
    wx.nextTick(() => {
      // 更新页面样式
      this.setData({
        containerStyle: gradientStyle,
        welcomeCardStyle: welcomeCardStyle,
        welcomeTextColor: textColor
      })
      
      // 直接在这里更新导航栏，确保与背景同步变化
      if (navigationBar) {
        navigationBar.setData({
          background: mainColor,
          color: this.calculateTextColor(mainColor)
        })
      }
    })
  },

  // 生成渐变背景
  generateGradient(baseColor) {
    return `linear-gradient(to bottom, ${baseColor} 0%, ${this.mixWithWhite(baseColor, 0.5)} 75%, #ffffff 95%); transition: background 0.3s ease;`
  },

  // 生成欢迎卡渐变
  generateWelcomeCardGradient(baseColor) {
    const darkenColor = this.shadeColor(baseColor, -20)
    return `linear-gradient(135deg, ${darkenColor}, ${baseColor}); transition: background 0.3s ease;`
  },

  // 颜色混合工具
  mixWithWhite(color, ratio) {
    // 校验输入颜色格式
    if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      console.error('Invalid color:', color);
      return '#ffffff';
    }

    // 展开为完整6位格式（处理#fff缩写）
    const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
    
    // 确保ratio在0-1之间
    const safeRatio = Math.max(0, Math.min(1, ratio));

    // 安全解析颜色分量
    const parseChannel = (str) => {
      const val = parseInt(str, 16);
      return Number.isNaN(val) ? 0 : val;
    };

    const r = parseChannel(hex.substr(1, 2));
    const g = parseChannel(hex.substr(3, 2));
    const b = parseChannel(hex.substr(5, 2));

    // 混合计算
    const mixedR = Math.round(r * (1 - safeRatio) + 255 * safeRatio);
    const mixedG = Math.round(g * (1 - safeRatio) + 255 * safeRatio);
    const mixedB = Math.round(b * (1 - safeRatio) + 255 * safeRatio);

    // 确保每个颜色分量都是两位十六进制
    const toHex = (c) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(mixedR)}${toHex(mixedG)}${toHex(mixedB)}`;
  },

  // 颜色加深/减淡
  shadeColor(color, percent) {
    // 校验输入颜色格式
    if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      console.error('Invalid color format for shading:', color);
      return '#ffffff';
    }

    try {
      // 确保颜色格式正确
      const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
      const num = parseInt(hex.replace('#',''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | 
              (G < 255 ? G < 1 ? 0 : G : 255) << 8 | 
              (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    } catch (error) {
      console.error('Error shading color:', error);
      return '#ffffff';
    }
  },

  // 计算文字颜色（基于亮度）
  calculateTextColor(hexColor) {
    // 校验输入颜色格式
    if (!hexColor || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
      console.error('Invalid color format for text color calculation:', hexColor);
      return '#000000'; // 默认黑色文字
    }

    // 展开为完整6位格式（处理#fff缩写）
    const hex = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
    
    // 安全解析颜色分量
    const parseChannel = (str) => {
      const val = parseInt(str, 16);
      return Number.isNaN(val) ? 0 : val;
    };
    
    const r = parseChannel(hex.substr(1,2))
    const g = parseChannel(hex.substr(3,2))
    const b = parseChannel(hex.substr(5,2))
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? 'black' : 'white'
  },

  // 获取测试题目数量
  getTestCount() {
      // 从testDataNew.js中获取测试题目数量
      const testData = require('../../data/testDataNew');
      // 计算对象中的成员数量
      const count = Object.keys(testData).length;
      this.setData({
          testCount: count
      });
  }

});

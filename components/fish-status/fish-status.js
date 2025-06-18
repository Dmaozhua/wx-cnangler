// components/fish-status/fish-status.js
import { Equipment } from '../../data/FishData2/Equipment';
Component({
    properties: {
        // 当前鱼的信息
        currentFish: {
            type: Object,
            value: null,
            observer: function(newVal, oldVal) {
                if (newVal) {
                    // 根据鱼的稀有度设置样式类
                    this.setRarityClass(newVal.rarity || 1);
                    
                    // 检查是否需要显示血量减少动画
                    if (oldVal && oldVal.hp > newVal.hp) {
                        // 优化：血量减少动画显示整数而不是小数
                        const damage = Number((oldVal.hp - newVal.hp).toFixed(0));
                        this.showDamageAnimation(damage);
                    }
                }
            }
        },
        // 钓线状态（玩家血量）
        playerHP: {
            type: Number,
            value: 100,
            observer: function(newVal, oldVal) {
                // 检查是否需要显示钓线状态减少动画
                if (oldVal && oldVal > newVal) {
                    const damage = Number((oldVal - newVal).toFixed(0));
                    this.showLineDamageAnimation(damage);
                }
            }
        },
        // 组件显示状态
        visible: {
            type: Boolean,
            value: false,
            observer: function(newVal) {
                // 当visible变为true时，触发滑入动画
                if (newVal) {
                    this.slideIn();
                } else {
                    this.slideOut();
                }
            }
        },
        // 动画速度（毫秒）
        animationDuration: {
            type: Number,
            value: 600
        },
        // QTE状态
        qteState: {
            type: String,
            value: ''
        }
    },

    data: {
        animationData: {},
        isAnimating: false,
        isVisible: false,
        isLocked: false, // 添加锁定状态，防止动画过程中的点击操作
        rarityClass: 'rarity-1', // 默认稀有度样式类
        rarityBgClass: 'rarity-bg-1', // 默认背景样式类
        rarityBorderClass: 'rarity-border-1', // 默认边框样式类
        damageAnimations: [], // 存储血量减少动画的数组
        damageAnimationId: 0, // 用于生成唯一的动画ID
        lineDamageAnimations: [], // 存储钓线状态减少动画的数组
        lineDamageAnimationId: 0 // 用于生成唯一的钓线动画ID
    },

    lifetimes: {
        attached: function() {
            this.animation = wx.createAnimation({
                duration: this.properties.animationDuration,
                timingFunction: 'ease',
                delay: 0
            });
            
            // 初始化时设置组件位置在屏幕外
            this.animation.translateX('-100%').translateY('-50%').step();
            this.setData({
                animationData: this.animation.export()
            });
        }
    },

    methods: {
        // 设置稀有度样式类
        setRarityClass: function(rarity) {
            // 将字符串常量稀有度映射到数字
            let rarityNum = 1; // 默认为1
            let isBoss = false;
            
            // 根据稀有度常量设置对应的数字
            if (rarity === 'COMMON') rarityNum = 1;
            else if (rarity === 'UNCOMMON') rarityNum = 2;
            else if (rarity === 'RARE') rarityNum = 3;
            else if (rarity === 'EPIC') rarityNum = 4;
            else if (rarity === 'MYTHIC') rarityNum = 5;
            else if (rarity === 'BOSS') {
                rarityNum = 5;
                isBoss = true;
            }
            else if (rarity === 'WASTE') rarityNum = 1; // 杂物使用最低稀有度样式
            else if (typeof rarity === 'number') rarityNum = Math.max(1, Math.min(5, rarity)); // 兼容旧版数字稀有度
            
            let rarityClass = `rarity-${rarityNum}`;
            let rarityBgClass = `rarity-bg-${rarityNum}`;
            let rarityBorderClass = `rarity-border-${rarityNum}`;
            
            if (isBoss) {
                rarityClass = 'rarity-5-boss';
                rarityBgClass = 'rarity-bg-5-boss';
                rarityBorderClass = 'rarity-border-5-boss';
                // 添加一个特定类名，用于标识 BOSS 状态下的鱼名
                this.setData({
                    isBossFish: true
                });
            } else {
                this.setData({
                    isBossFish: false
                });
            
            }
            
            this.setData({
                rarityClass,
                rarityBgClass,
                rarityBorderClass
            });
        },
        
        // 显示血量减少的动画
        showDamageAnimation: function(damage) {
            // 优化：确保即使在鱼血量为0或小于0的情况下也能正常显示动画
            if (!damage) return;
            
            // 确保damage为正数，用于显示
            const displayDamage = Math.abs(damage);
            
            // 生成唯一的动画ID
            const animId = this.data.damageAnimationId + 1;
            
            // 创建新的动画对象
            const newAnimation = {
                id: animId,
                damage: `-${displayDamage}`,
                animationData: {}
            };
            
            // 将新动画添加到数组中
            const animations = [...this.data.damageAnimations, newAnimation];
            
            this.setData({
                damageAnimations: animations,
                damageAnimationId: animId
            }, () => {
                // 在下一帧创建并执行动画
                setTimeout(() => {
                    // 创建动画实例
                    const animation = wx.createAnimation({
                        duration: 500,
                        timingFunction: 'ease-out'
                    });
                    
                    // 设置动画：向上移动并淡出
                    animation.translateY('-30rpx').opacity(0).step();
                    
                    // 更新特定动画的数据
                    const updatedAnimations = this.data.damageAnimations.map(anim => {
                        if (anim.id === animId) {
                            return {
                                ...anim,
                                animationData: animation.export()
                            };
                        }
                        return anim;
                    });
                    
                    this.setData({
                        damageAnimations: updatedAnimations
                    });
                    
                    // 动画结束后移除该动画
                    setTimeout(() => {
                        const filteredAnimations = this.data.damageAnimations.filter(anim => anim.id !== animId);
                        this.setData({
                            damageAnimations: filteredAnimations
                        });
                    }, 500);
                }, 0);
            });
        },
        
        // 显示钓线状态减少的动画
        showLineDamageAnimation: function(damage) {
            // 确保即使在钓线状态为0或小于0的情况下也能正常显示动画
            if (!damage) return;
            
            // 确保damage为正数，用于显示
            const displayDamage = Math.abs(damage);
            
            // 生成唯一的动画ID
            const animId = this.data.lineDamageAnimationId + 1;
            
            // 创建新的动画对象
            const newAnimation = {
                id: animId,
                damage: `-${displayDamage}`,
                animationData: {}
            };
            
            // 将新动画添加到数组中
            const animations = [...this.data.lineDamageAnimations, newAnimation];
            
            this.setData({
                lineDamageAnimations: animations,
                lineDamageAnimationId: animId
            }, () => {
                // 在下一帧创建并执行动画
                setTimeout(() => {
                    // 创建动画实例
                    const animation = wx.createAnimation({
                        duration: 500,
                        timingFunction: 'ease-out'
                    });
                    
                    // 设置动画：向上移动并淡出
                    animation.translateY('-30rpx').opacity(0).step();
                    
                    // 更新特定动画的数据
                    const updatedAnimations = this.data.lineDamageAnimations.map(anim => {
                        if (anim.id === animId) {
                            return {
                                ...anim,
                                animationData: animation.export()
                            };
                        }
                        return anim;
                    });
                    
                    this.setData({
                        lineDamageAnimations: updatedAnimations
                    });
                    
                    // 动画结束后移除该动画
                    setTimeout(() => {
                        const filteredAnimations = this.data.lineDamageAnimations.filter(anim => anim.id !== animId);
                        this.setData({
                            lineDamageAnimations: filteredAnimations
                        });
                    }, 500);
                }, 0);
            });
        },
        
        // 滑入动画
        // 修改后的 slideIn 方法
        slideIn: function() {
            if (this.data.isAnimating) return;
          
            // 先确保组件可见
            this.setData({
                isVisible: true,
                isLocked: true
            }, () => {
                // 在回调中执行动画，确保渲染完成
                this.animation = wx.createAnimation({
                    duration: this.properties.animationDuration,
                    timingFunction: 'ease'
                });
          
                // 重置动画参数
                this.animation
                  .translateX('0')
                  .translateY('-50%')
                  .opacity(1)
                  .step();
          
                this.setData({
                    animationData: this.animation.export(),
                    isAnimating: true
                });
          
                // 动画结束后解除锁定
                setTimeout(() => {
                    this.setData({ 
                        isAnimating: false, 
                        isLocked: false 
                    });
                    this.triggerEvent('lockInteraction', { locked: false });
                }, this.properties.animationDuration);
            });
          
            // 立即触发锁定
            this.triggerEvent('lockInteraction', { locked: true });
        },

        // 滑出动画
        slideOut: function() {
            if (this.data.isAnimating) return;
            
            // 设置锁定状态，防止动画过程中的点击操作
            this.setData({
                isAnimating: true,
                isLocked: true
            });
            
            // 触发锁定事件，通知父组件屏蔽点击
            this.triggerEvent('lockInteraction', { locked: true });

            // 确保从当前位置滑出到-100%位置
            // 添加缩放和透明度变化
            this.animation.scale(1.1).opacity(0).step({ duration: this.properties.animationDuration });
            
            this.setData({
                animationData: this.animation.export()
            });

            setTimeout(() => {
                this.setData({
                    isAnimating: false,
                    isVisible: false,
                    isLocked: false
                });
                // 通知父组件动画已完成并解除锁定
                this.triggerEvent('animationEnd');
                this.triggerEvent('lockInteraction', { locked: false });
            }, this.properties.animationDuration);
        },

        // 更新QTE结果
        updateQteResult: function(result) {
            // 可以在这里添加QTE结果的动画或显示效果
            console.log('QTE结果:', result);
            // 添加QTE状态变化动画
            const qteAnimation = wx.createAnimation({
                duration: 300,
                timingFunction: 'ease'
            });
            
            qteAnimation.scale(1.2).opacity(0).step();
            qteAnimation.scale(1).opacity(1).step();
            
            this.setData({
                qteState: result,
                qteAnimationData: qteAnimation.export()
            });
        }
    }
})
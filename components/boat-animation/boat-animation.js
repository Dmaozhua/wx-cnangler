// boat-animation.js
Component({
    data: {
      canvasWidth: 300,
      canvasHeight: 300,
      waveOffset1: 0,
      waveOffset2: 0,
      waveOffset3: 0,
      boatY: 0,
      boatRotation: 0,
      // 添加虚线偏移量
      dashOffset1: 0,
      dashOffset2: 25,
      dashOffset3: 0,
      // 显示描述文字
      showDescription: false,
      // 添加动画帧计数器
      frameCount: 0,
      // 添加上次动画时间戳
      lastTimestamp: 0
    },
    properties: {
      // 是否显示描述
      showDesc: {
        type: Boolean,
        value: false
      }
    },
    lifetimes: {
      ready() {
        this.ctx = wx.createCanvasContext('boatCanvas', this)
        this.setData({
          showDescription: this.properties.showDesc
        })
        // 初始化动画状态
        this.initAnimation()
        // 启动动画
        this.startAnimation()
      }
    },
    methods: {
      // 初始化动画状态
      initAnimation() {
        // 存储本地变量，避免频繁setData
        this._animState = {
          waveOffset1: 0,
          waveOffset2: 10,
          waveOffset3: 20,
          boatY: 0,
          boatRotation: 0,
          dashOffset1: 0,
          dashOffset2: 25,
          dashOffset3: 0,
          frameCount: 0,
          lastTimestamp: Date.now()
        }
      },
      
      drawBoat() {
        const ctx = this.ctx
        const { canvasWidth, canvasHeight } = this.data
        const { waveOffset1, waveOffset2, waveOffset3, boatY, boatRotation } = this._animState
        
        // 清空画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        
        // 注意：微信小程序中每次调用draw()后坐标系会自动重置，不需要手动重置变换矩阵
        
        // 设置坐标系，使原点位于中心
        ctx.translate(canvasWidth/2, canvasHeight/2)
        
        // 绘制波浪线（水）
        this.drawWaves(ctx, waveOffset1, waveOffset2, waveOffset3)
        
        // 尝试使用裁剪路径
        ctx.save()
        try {
          this.createClipPath(ctx)
          // 在裁剪区域内绘制船
          this.drawBoatBody(ctx, boatY, boatRotation)
        } catch(e) {
          console.error('裁剪路径失败，使用普通绘制', e)
          // 如果裁剪失败，使用普通方式绘制
          this.drawBoatWithoutClip(ctx, boatY, boatRotation)
        }
        ctx.restore()
        
        // 执行绘制
        ctx.draw()
      },
      
      // 创建裁剪区域
      createClipPath(ctx) {
        ctx.beginPath()
        ctx.moveTo(-100, 8)
        
        // 绘制波浪形状的裁剪路径
        let x = -100
        while (x < 100) {
          ctx.quadraticCurveTo(x + 10, 18, x + 20, 8)
          ctx.quadraticCurveTo(x + 30, -2, x + 40, 8)
          x += 40
        }
        
        ctx.lineTo(100, -100)
        ctx.lineTo(-100, -100)
        ctx.closePath()
        ctx.clip()
      },
      
      // 不使用裁剪区域绘制船
      drawBoatWithoutClip(ctx, boatY, boatRotation) {
        this.drawBoatBody(ctx, boatY, boatRotation)
      },
      
      // 绘制船体
      drawBoatBody(ctx, boatY, boatRotation) {
        // 应用船的动画变换
        ctx.save()
        ctx.translate(0, boatY)
        ctx.rotate(boatRotation * Math.PI / 180)
        
        // 绘制船身 - 更接近SVG中的纸船形状
        ctx.beginPath()
        ctx.moveTo(-80, -20)
        ctx.lineTo(80, -20)
        ctx.lineTo(40, 40)
        ctx.lineTo(-40, 40)
        ctx.closePath()
        ctx.setFillStyle('white')
        ctx.fill()
        
        // 绘制帆
        ctx.beginPath()
        ctx.moveTo(-30, -25)
        ctx.lineTo(0, -55)
        ctx.lineTo(30, -25)
        ctx.closePath()
        ctx.setFillStyle('white')
        ctx.fill()
        
        ctx.restore()
      },
      
      drawWaves(ctx, waveOffset1, waveOffset2, waveOffset3) {
        // 绘制三条波浪线
        this.drawWaveLine(ctx, 20, waveOffset1, this._animState.dashOffset1)
        this.drawWaveLine(ctx, 40, waveOffset2, this._animState.dashOffset2)
        this.drawWaveLine(ctx, 60, waveOffset3, this._animState.dashOffset3)
      },
      
      // 绘制单条波浪线
      drawWaveLine(ctx, y, waveOffset, dashOffset) {
        ctx.save()
        
        ctx.beginPath()
        // 使用waveOffset来移动波浪的起始位置，实现波浪运动效果
        ctx.moveTo(-100 + waveOffset, y)
        
        // 绘制波浪曲线 - 更接近SVG中的波浪效果
        let x = -100 + waveOffset
        while (x < 100 + waveOffset) {
          ctx.quadraticCurveTo(x + 10, y + 10, x + 20, y)
          ctx.quadraticCurveTo(x + 30, y - 10, x + 40, y)
          x += 40
        }
        
        ctx.setStrokeStyle('white')
        ctx.setLineWidth(5)
        ctx.setLineCap('round')
        
        // 设置虚线样式 - 模拟SVG中的stroke-dasharray
        // 根据dashOffset动态调整虚线模式，模拟虚线移动效果
        const dashLength = 20
        const gapLength = 15
        
        // 通过调整虚线模式的第一个值来模拟虚线偏移
        // 微信小程序不支持setLineDashOffset，所以我们通过调整虚线模式来模拟
        const adjustedDashLength = Math.max(1, (dashLength - (dashOffset % (dashLength + gapLength))))
        const adjustedGapLength = gapLength
        
        ctx.setLineDash([adjustedDashLength, adjustedGapLength, dashLength, gapLength])
        
        ctx.stroke()
        ctx.restore()
      },
      
      startAnimation() {
        // 使用setTimeout替代requestAnimationFrame，因为微信小程序不支持标准的requestAnimationFrame
        const animate = () => {
          const now = Date.now()
          const deltaTime = now - this._animState.lastTimestamp
          this._animState.lastTimestamp = now
          
          // 更新帧计数
          this._animState.frameCount++
          
          // 使用缓动函数计算船的位置和旋转 - 模拟SVG中的animateTransform
          this._animState.boatY = 8 * this.easeInOutSine((now % 2000) / 2000)
          this._animState.boatRotation = 8 * this.easeInOutSine((now % 6000) / 6000) - 4
          
          // 更新波浪偏移 - 实现波浪水平移动
          this._animState.waveOffset1 = (this._animState.waveOffset1 + 1.5) % 40
          this._animState.waveOffset2 = (this._animState.waveOffset2 - 1.2) % 40
          this._animState.waveOffset3 = (this._animState.waveOffset3 + 0.8) % 40
          
          // 更新虚线偏移量，创建流动效果
          this._animState.dashOffset1 = (this._animState.dashOffset1 + 2) % 50
          this._animState.dashOffset2 = (this._animState.dashOffset2 - 1.5) % 50
          this._animState.dashOffset3 = (this._animState.dashOffset3 + 1) % 50
          
          // 每5帧同步一次数据到setData，减少setData调用频率但保持足够的更新频率
          if (this._animState.frameCount % 5 === 0) {
            this.setData({
              boatY: this._animState.boatY,
              boatRotation: this._animState.boatRotation,
              waveOffset1: this._animState.waveOffset1,
              waveOffset2: this._animState.waveOffset2,
              waveOffset3: this._animState.waveOffset3,
              dashOffset1: this._animState.dashOffset1,
              dashOffset2: this._animState.dashOffset2,
              dashOffset3: this._animState.dashOffset3,
              frameCount: this._animState.frameCount
            })
          }
          
          // 重绘
          this.drawBoat()
          
          // 继续下一帧，固定16ms的帧率（约60fps）
          this.animationTimer = setTimeout(animate, 16)
        }
        
        // 启动动画循环
        this.animationTimer = setTimeout(animate, 0)
      },
      
      // 添加缓动函数，使动画更加平滑 - 模拟SVG中的keySplines
      easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2
      },
      
      stopAnimation() {
        if (this.animationTimer) {
          clearTimeout(this.animationTimer)
        }
      }
    },
    detached() {
      this.stopAnimation()
    }
  })
// circular-animations.js - 圆形动画组件
Component({
  data: {
    pulsatingCircles: [],
    rotatingOrbits: [],
    sequentialRings: [],
    concentricRings: [],
    circularWaves: [],
    expandingLines: []
  },

  lifetimes: {
    attached() {
      this.generatePulsatingCircles();
      this.generateRotatingOrbits();
      this.generateSequentialRings();
      this.generateConcentricRings();
      this.generateCircularWaves();
      this.generateExpandingLines();
    }
  },

  methods: {
    // 生成脉冲圆圈数据
    generatePulsatingCircles() {
      const circles = [];
      let id = 0;
      
      for (let r = 0; r < 4; r++) {
        const radius = 15 + r * 15;
        const count = 6 + r * 3;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sz = 3 + r * 0.3;
          
          circles.push({
            id: id++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); animation-delay: ${r * 0.2 + i * 0.1}s; background: rgba(255,255,255,${(90 - r * 10) / 100});`
          });
        }
      }
      
      this.setData({ pulsatingCircles: circles });
    },

    // 生成旋转轨道数据
    generateRotatingOrbits() {
      const orbits = [];
      let orbitId = 0;
      
      for (let r = 0; r < 3; r++) {
        const radius = 20 + r * 20;
        const count = 6 + r * 3;
        const dots = [];
        let dotId = 0;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sz = 4 - r * 0.5;
          
          dots.push({
            id: dotId++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); background: rgba(255,255,255,${(90 - r * 15) / 100});`
          });
        }
        
        orbits.push({
          id: orbitId++,
          containerStyle: `animation-duration: ${8 + r * 4}s; animation-direction: ${r % 2 ? 'reverse' : 'normal'};`,
          dots: dots
        });
      }
      
      this.setData({ rotatingOrbits: orbits });
    },

    // 生成序列环数据
    generateSequentialRings() {
      const rings = [];
      let id = 0;
      
      for (let i = 0; i < 5; i++) {
        const rad = 15 + i * 15;
        const count = 8 + i * 4;
        
        for (let j = 0; j < count; j++) {
          const angle = (j / count) * 2 * Math.PI;
          const x = Math.cos(angle) * rad;
          const y = Math.sin(angle) * rad;
          const sz = 3 + i * 0.2;
          
          rings.push({
            id: id++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); animation: expandRing 3s infinite; animation-delay: ${i * 0.3 + (j / count) * 0.1}s; background: rgba(255,255,255,${(90 - i * 15) / 100});`
          });
        }
      }
      
      this.setData({ sequentialRings: rings });
    },

    // 生成同心旋转数据
    generateConcentricRings() {
      const rings = [];
      let ringId = 0;
      
      for (let r = 0; r < 8; r++) {
        const radius = 10 + r * 10;
        const circ = 2 * Math.PI * radius;
        const count = Math.max(6, Math.floor(circ / 10));
        const dots = [];
        let dotId = 0;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          dots.push({
            id: dotId++,
            style: `width: 4px; height: 4px; left: calc(50% + ${x}px - 2px); top: calc(50% + ${y}px - 2px); background: rgba(255,255,255,${(90 - r * 5) / 100});`
          });
        }
        
        rings.push({
          id: ringId++,
          containerStyle: `animation-duration: ${3 * Math.pow(1.5, r)}s;`,
          dots: dots
        });
      }
      
      this.setData({ concentricRings: rings });
    },

    // 生成圆形波浪数据
    generateCircularWaves() {
      const waves = [];
      let id = 0;
      
      for (let r = 0; r < 5; r++) {
        const rad = 15 + r * 15;
        const count = 8 + r * 4;
        
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * rad;
          const y = Math.sin(angle) * rad;
          const sz = 3 + r * 0.2;
          
          waves.push({
            id: id++,
            style: `width: ${sz}px; height: ${sz}px; left: calc(50% + ${x}px - ${sz / 2}px); top: calc(50% + ${y}px - ${sz / 2}px); animation-delay: ${r * 0.2 + (i / count) * 0.5}s; background: rgba(255,255,255,${(90 - r * 10) / 100});`
          });
        }
      }
      
      this.setData({ circularWaves: waves });
    },

    // 生成扩展线条数据
    generateExpandingLines() {
      const lines = [];
      let id = 0;
      
      for (let g = 0; g < 3; g++) {
        for (let i = 0; i < 12; i++) {
          const rotation = (360 / 12) * i;
          
          lines.push({
            id: id++,
            style: `transform: rotate(${rotation}deg); animation-delay: ${(i / 12) * 2}s; animation-duration: ${8 + g * 4}s; animation-direction: ${g % 2 ? 'reverse' : 'normal'};`
          });
        }
      }
      
      this.setData({ expandingLines: lines });
    }
  }
});

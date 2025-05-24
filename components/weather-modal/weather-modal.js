Component({
    properties: {
      visible: {
        type: Boolean,
        value: false
      },
      cityName: {
        type: String,
        value: ''
      },
      weatherData: {
        type: Object,
        value: {}
      },
      sunsetTime: {
        type: String,
        value: ''
      },
      pressure: {
        type: String,
        value: ''
      }
    },
  
    data: {
      modalAnimation: {}
    },
  
    observers: {
      'visible': function(newVal) {
        if (newVal) {
          this.showModal();
        } else {
          this.hideModal();
        }
      }
    },
  
    methods: {
      showModal() {
        const animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
        animation.opacity(1).step();
        this.setData({
          modalAnimation: animation.export()
        });
      },
  
      hideModal() {
        const animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
        animation.opacity(0).step();
        this.setData({
          modalAnimation: animation.export()
        });
      },
  
      closeModal() {
        this.setData({
          visible: false
        });
        this.triggerEvent('close');
      },
  
      stopPropagation() {}
    }
  });
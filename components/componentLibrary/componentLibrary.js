// componentLibrary.js - 微信小程序组件库
Component({
  data: {
    // 组件库数据
    components: [
      {
        id: 'button',
        name: 'Button',
        title: '按钮组件',
        description: 'Neo Brutalist风格按钮',
        props: {
          text: 'Neo Button',
          color: 'yellow',
          textColor: 'black'
        }
      },
      {
        id: 'card',
        name: 'Card',
        title: '卡片组件',
        description: 'Neo Brutalist风格卡片',
        props: {
          title: 'Sample Card',
          content: 'A raw, functional Neo Brutalist card.'
        }
      },
      {
        id: 'input',
        name: 'Input',
        title: '输入框组件',
        description: 'Neo Brutalist风格输入框',
        props: {
          placeholder: 'Type here...',
          type: 'text'
        }
      },
      {
        id: 'toggle',
        name: 'Toggle',
        title: '开关组件',
        description: 'Neo Brutalist风格开关',
        props: {
          label: 'Switch Me',
          checked: false
        }
      },
      {
        id: 'alert',
        name: 'Alert',
        title: '提示组件',
        description: 'Neo Brutalist风格提示框',
        props: {
          message: 'Success Alert!',
          type: 'success'
        }
      },
      {
        id: 'modal',
        name: 'Modal',
        title: '模态框组件',
        description: 'Neo Brutalist风格模态框',
        props: {
          title: 'Neo Modal',
          content: 'A stark, no-nonsense modal window.',
          visible: false
        }
      },
      {
        id: 'nav',
        name: 'Nav',
        title: '导航组件',
        description: 'Neo Brutalist风格导航',
        props: {
          links: ['Home', 'Services', 'Blog', 'Contact']
        }
      },
      {
        id: 'progress',
        name: 'Progress',
        title: '进度条组件',
        description: 'Neo Brutalist风格进度条',
        props: {
          value: 75,
          color: 'black'
        }
      },
      {
        id: 'dropdown',
        name: 'Dropdown',
        title: '下拉菜单组件',
        description: 'Neo Brutalist风格下拉菜单',
        props: {
          label: 'Menu',
          options: ['Item 1', 'Item 2', 'Item 3'],
          visible: false
        }
      },
      {
        id: 'accordion',
        name: 'Accordion',
        title: '手风琴组件',
        description: 'Neo Brutalist风格手风琴',
        props: {
          items: [
            { title: 'Section A', content: 'Details for section A.', open: true },
            { title: 'Section B', content: 'Details for section B.', open: false }
          ]
        }
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        title: '工具提示组件',
        description: 'Neo Brutalist风格工具提示',
        props: {
          trigger: 'Info',
          content: 'This is a brutalist tooltip!',
          visible: false
        }
      },
      {
        id: 'avatar',
        name: 'Avatar',
        title: '头像组件',
        description: 'Neo Brutalist风格头像',
        props: {
          initials: 'AB',
          bgColor: 'yellow',
          textColor: 'black'
        }
      },
      {
        id: 'badge',
        name: 'Badge',
        title: '徽章组件',
        description: 'Neo Brutalist风格徽章',
        props: {
          text: 'Hot',
          color: 'red',
          textColor: 'white'
        }
      },
      {
        id: 'tabs',
        name: 'Tabs',
        title: '标签页组件',
        description: 'Neo Brutalist风格标签页',
        props: {
          tabs: ['Tab A', 'Tab B', 'Tab C'],
          contents: ['Content for Tab A.', 'Content for Tab B.', 'Content for Tab C.'],
          activeIndex: 0
        }
      }
    ]
  },

  methods: {
    // 按钮点击事件
    onButtonTap(e) {
      const { component } = e.currentTarget.dataset;
      wx.showToast({
        title: `${component.title}被点击`,
        icon: 'none'
      });
    },

    // 开关切换事件
    onToggleChange(e) {
      const { component, index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.checked = e.detail.value;
      this.setData({
        components
      });
    },

    // 输入框输入事件
    onInputChange(e) {
      const { component, index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.value = e.detail.value;
      this.setData({
        components
      });
    },

    // 模态框显示/隐藏
    onModalToggle(e) {
      const { index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.visible = !components[index].props.visible;
      this.setData({
        components
      });
    },

    // 下拉菜单切换
    onDropdownToggle(e) {
      const { index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.visible = !components[index].props.visible;
      this.setData({
        components
      });
    },

    // 手风琴切换
    onAccordionToggle(e) {
      const { index, itemIndex } = e.currentTarget.dataset;
      const components = this.data.components;
      const items = components[index].props.items;
      
      // 关闭所有其他项
      items.forEach((item, i) => {
        item.open = i === itemIndex ? !item.open : false;
      });
      
      this.setData({
        components
      });
    },

    // 工具提示显示/隐藏
    onTooltipToggle(e) {
      const { index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.visible = !components[index].props.visible;
      this.setData({
        components
      });
    },

    // 标签页切换
    onTabChange(e) {
      const { index, tabIndex } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.activeIndex = tabIndex;
      this.setData({
        components
      });
    },

    // 提示框关闭
    onAlertClose(e) {
      const { index } = e.currentTarget.dataset;
      wx.showToast({
        title: '提示框已关闭',
        icon: 'none'
      });
    },

    // 导航链接点击
    onNavLinkTap(e) {
      const { link } = e.currentTarget.dataset;
      wx.showToast({
        title: `导航到: ${link}`,
        icon: 'none'
      });
    },

    // 下拉菜单选项点击
    onDropdownOptionTap(e) {
      const { option, index } = e.currentTarget.dataset;
      const components = this.data.components;
      components[index].props.label = option;
      components[index].props.visible = false;
      this.setData({
        components
      });
      
      wx.showToast({
        title: `选择了: ${option}`,
        icon: 'none'
      });
    }
  }
});
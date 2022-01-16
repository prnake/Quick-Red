const Mock = require('mockjs')

module.exports = [
  {
    url: '/notice/unread',
    type: 'post',
    response: _ => {
      var EMPTY = false

      if (EMPTY) {
        return {
          code: 200,
          notices: []
        }
      }
      return {
        code: 200,
        notices: [
          {
            title: '[!][通知]您的账户已被永久封禁',
            message: '骗你的！',
            id: 123456,
            create_time: "2021-05-06 07:15:39"
          },
          {
            title: '[-][公告]快红平台即日起开放实名认证通道',
            message: '其实没开放！',
            id: 666612,
            create_time: "2021-05-06 07:15:39"
          },
          {
            title: '[!][新闻]快红献礼清华大学110周年校庆，推出紫色主题皮肤',
            message: '暂时还没上线。',
            id: 232212,
            create_time: "2021-05-06 07:15:39"
          },
          {
            title: '[-][广告]快手——记录世界，记录你。',
            message: '抖音，记录美好生活。',
            id: 663232,
            create_time: "2021-05-06 07:15:39"
          }
        ]
      }
    }
  },

  {
    url: '/notice/all',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        notices: [
          {
            title: '[!][通知]您的账户已被永久封禁',
            message: '骗你的！',
            id: 123456,
            read: false
          },
          {
            title: '[-][公告]快红平台即日起开放实名认证通道',
            message: '其实没开放！',
            id: 666612,
            read: false
          },
          {
            title: '[!][新闻]快红献礼清华大学110周年校庆，推出紫色主题皮肤',
            message: '暂时还没上线。',
            id: 232212,
            read: false
          },
          {
            title: '[-][广告]快手——记录世界，记录你。',
            message: '抖音，记录美好生活。',
            id: 663232,
            read: false
          }
        ]
      }
    }
  },

  {
    url: '/notice/markread',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
]
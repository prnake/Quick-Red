const Mock = require('mockjs')

const data = Mock.mock({
  'items|50': [{
    id: '@integer(300, 5000)',
    title: '@sentence(10, 20)',
    pic: 'https://images.squarespace-cdn.com/content/v1/53b0e2a2e4b02125b9194093/1583016666869-FK55GSR0KF32JT4K9HCO/ke17ZwdGBToddI8pDm48kHquW7lo7f1g4Yug1KNGNqoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcSKxi-A1pjvKEznBal7wwUB7y382cSPWFP-heM-uczoAJYr1j6jiGS2WvwCUw4hPZ/kuaishou.jpg?format=750w',
    pubdate: '@datetime',
    likes: '@integer(300, 5000)',
    comments: '@integer(300, 5000)',
    plays: '@integer(300, 5000)',
    tags: ['美食', '风景', '知识']
  }]
})

module.exports = [
  // get kuaishou videolist
  {
    url: '/kuaishou/videolist',
    type: 'post',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/kuaishou/settags',
    type: 'post',
    response: config => {
      const items = data.items
      return {
        code: 200,
        message: "set successfully"
      }
    }
  },
  // get a single video's data
  {
    url: '/kuaishou/vdata',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: {
          title: "ゆるキャンΔ·摇曳露营太好看建议你们都去看其实我只是想测试一下标题过长会怎样",
          play_url: "https://txmov2.a.yximgs.com/upic/2021/03/01/10/BMjAyMTAzMDExMDU1MTJfNDAzMDAxOTlfNDUyMzYxNTE3NzNfMF8z_b_B3d27163f240a94a01ee55042479323b3.mp4?tag=1-1618280422-unknown-0-noc6oe5gum-5f02fd75203c95ab&clientCacheKey=3x9uq3854724yyw_b.mp4&tt=b&di=3eea017d&bp=13360",
          likes: 9999,
          comments: 999,
          plays: 99999,
          cover: "https://tx-free-imgs.acfun.cn/H9PSY5pKgK-mEBJFb-QbIZ3m-uqYzyq-AfAB3y.png?imageView2/1/w/160/h/214|imageMogr2/auto-orient/format/webp/quality/75!/ignore-error/1",
          time_array: ['9/1', '9/2', '9/3', '9/4', '9/5', '9/6', '9/7', '9/8', '9/9', '9/10',
            '9/11', '9/12', '9/13', '9/14', '9/15', '9/16', '9/17', '9/18', '9/19', '9/20',
            '9/21', '9/22', '9/23', '9/24', '9/25', '9/26', '9/27', '9/28', '9/29', '9/30'],
          like_data: [820, 932, 901, 934, 1290, 1330, 1320, 2131, 321, 542,
            820, 932, 901, 934, 1290, 1330, 1320, 2131, 321, 542,
            820, 932, 901, 934, 1290, 1330, 1320, 2131, 321, 542],
          comment_data: [620, 711, 823, 934, 1445, 1456, 1178, 412, 733, 1231,
            620, 711, 823, 934, 1445, 1456, 1178, 412, 733, 1231,
            620, 711, 823, 934, 1445, 1456, 1178, 412, 733, 1231],
          play_data: [612, 920, 1140, 1160, 1190, 1234, 1321, 1668, 1828, 2121,
            612, 920, 1140, 1160, 1190, 1234, 1321, 1668, 1828, 2121,
            612, 920, 1140, 1160, 1190, 1234, 1321, 1668, 1828, 2121],
          time_array_24h: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
            '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
          like_data_24h: [820, 932, 901, 934, 1290, 1330, 1320, 2131,
            820, 932, 901, 934, 1290, 1330, 1320, 2131,
            820, 932, 901, 934, 1290, 1330, 1320, 2131],
          comment_data_24h: [620, 711, 823, 934, 1445, 1456, 1178, 412,
            620, 711, 823, 934, 1445, 1456, 1178, 412,
            620, 711, 823, 934, 1445, 1456, 1178, 412,],
          play_data_24h: [612, 920, 1140, 1160, 1190, 1234, 1321, 1668,
            612, 920, 1140, 1160, 1190, 1234, 1321, 1668,
            612, 920, 1140, 1160, 1190, 1234, 1321, 1668,]
        }
      }
    }
  },
  // get user info
  {
    url: '/kuaishou/user',
    type: 'get',
    response: config => {
      // for dev, I let info as the dic above
      // in real practice, when getting user info, I need to know the datas
      const json = {
        username: 'delphynium',
        info: {
          avatar: 'https://gitlab.secoder.net/uploads/-/system/user/avatar/84/avatar.png',
          name: '野原飞燕',
          details: {
            fans: 13,
            works: 96,
            likes: 2021,
            comments: 114514,
            plays: 1919810
          }
        },
        authurl: 'https://www.baidu.com'
      }

      // mock error
      if (!json) {
        return {
          code: 400,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 200,
        data: json
      }
    }
  },
  {
    url: '/kuaishou/hometf',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: {
          xAxis: ['1:00', '2:00', '3:00', '4:00',
            '5:00', '6:00', '7:00', '8:00',
            '9:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00',
            '17:00', '18:00', '19:00', '20:00',
            '21:00', '22:00', '23:00', '24:00'],
          series: [
            [820, 932, 901, 934, 1290, 1330, 1320, 234, 234, 823, 934, 1445, 820, 932, 901, 934, 1290, 1330, 1320, 234, 234, 823, 934, 1445],
            [620, 711, 823, 934, 1445, 1456, 1178, 932, 901, 934, 1290, 1100, 620, 711, 823, 934, 1445, 1456, 1178, 932, 901, 934, 1290, 1100],
            [612, 920, 1140, 1160, 1190, 1234, 1321, 1456, 1178, 932, 901, 800, 612, 920, 1140, 1160, 1190, 1234, 1321, 1456, 1178, 932, 901, 800],
            [234, 320, 453, 567, 789, 999, 200, 1456, 1178, 932, 901, 934, 234, 320, 453, 567, 789, 999, 200, 1456, 1178, 932, 901, 934]
          ]
        }
      }
    }
  }
]

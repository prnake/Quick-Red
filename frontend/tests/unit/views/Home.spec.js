import Home from '@/views/home/index.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from '@/store'

const routes = [
    {
        name: 'home',
        path: '/home',
    }
]

const router = new VueRouter({
    routes
})

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI)

// HERE IS HOW TO MOCK AN API IN @/api/* WHICH SENDS REQUESTS TO BACKEND
jest.mock('@/api/kuaishou', () => {
    var count = 0
    return {
        getInfo: () => {
            count += 1
            return Promise.resolve({
                code: count >= 2 ? 200 : 202,
                data: {
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
            })
        },
        getOneDayData: () => {
            return Promise.resolve({
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
            })
        },
        getVideoList: () => {
            return Promise.resolve({
                "code": 200,
                "data": {
                    "items": [
                        {
                            "comments": 1893,
                            "id": 3679,
                            "likes": 1899,
                            "pic": "https://images.squarespace-cdn.com/content/v1/53b0e2a2e4b02125b9194093/1583016666869-FK55GSR0KF32JT4K9HCO/ke17ZwdGBToddI8pDm48kHquW7lo7f1g4Yug1KNGNqoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcSKxi-A1pjvKEznBal7wwUB7y382cSPWFP-heM-uczoAJYr1j6jiGS2WvwCUw4hPZ/kuaishou.jpg?format=750w",
                            "plays": 4546,
                            "pubdate": "2002-09-04 03:31:08",
                            "tags": ["风景", "学习", "清华"],
                            "title": "Pdsifhbjp slywxlr lmkaqog fmyomiwkk fped orb fugy mduxcrwev fpdjemgsi xtcasalfj xbmaegda nhgc xaswabdv vett fhqgydpt unfsk iokxdprac."
                        },
                        {
                            "comments": 193,
                            "id": 369,
                            "likes": 1,
                            "pic": "https://images.squarespace-cdn.com/content/v1/53b0e2a2e4b02125b9194093/1583016666869-FK55GSR0KF32JT4K9HCO/ke17ZwdGBToddI8pDm48kHquW7lo7f1g4Yug1KNGNqoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcSKxi-A1pjvKEznBal7wwUB7y382cSPWFP-heM-uczoAJYr1j6jiGS2WvwCUw4hPZ/kuaishou.jpg?format=750w",
                            "plays": 456,
                            "pubdate": "2002-09-04 03:32:08",
                            "tags": ["风景", "北大"],
                            "title": "Pdsifhbjp slywxlr lmkaqog fmyomiwkk fped orb fugy mduxcrwev fpdjemgsi xtcasalfj xbmaegda nhgc xaswabdv vett fhqgydpt unfsk iokxdprac."
                        }],
                    "total": 1
                }
            })
        }
    }
})

describe('home page', () => {
    store.state.user.details = {
        comment24: 114423,
        comments: 114514,
        fans: 13,
        like24: 1909,
        likes: 2021,
        play24: 1919502,
        plays: 1919810,
        total24: 2035834,
        works: 96
    }
    //HERE IS HOW TO TEST MODULE BEHAVIORS WITH THE MOCKED API
    it(('test no auth'), async () => {
        store.state.user.hasAuth = false
        const wrapper = shallowMount(Home, { router, store, localVue })
        expect(wrapper.vm.hasAuth).toBe(false)
    })
    it(('test has auth'), async () => {
        store.state.user.hasAuth = true
        const wrapper = shallowMount(Home, { router, store, localVue })
        expect(wrapper.vm.hasAuth).toBe(true)
    })
    it(('test getdata'), async () => {
        store.state.user.notices = [{
            title: '[通知]您的账户已被永久封禁',
            message: '骗你的！',
            id: 123456
        }]
        const wrapper = shallowMount(Home, {
            router, store, localVue
        })
        wrapper.vm.$route.params.who = "ntdxtd"
        wrapper.vm.openReauthDialog()
        await wrapper.vm.getRecentData()
        expect(wrapper.vm.option.yAxis[0].min({ min: 10, max: 20 })).toBe(-100)
        wrapper.vm.negative = false
        expect(wrapper.vm.option.yAxis[0].min({ min: 10, max: 20 })).toBe(0)
        expect(wrapper.vm.option.yAxis[0].max({ min: 10, max: 20 })).toBe(100)
        wrapper.vm.openReauthDialog("ntdxtd")
        expect(wrapper.vm.option.xAxis['data'][1]).toBe('2:00')
        expect(wrapper.vm.option.xAxis['data'].length).toBe(24) // 1d = 24h
    })
})

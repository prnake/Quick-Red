import Videopage from '@/views/video/index.vue'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from '@/store'

const routes = [
	{
		path: '/video',
		children: [
			{
				path: ':id',
				name: '作品分析',
				meta: { title: '作品分析' }
			}
		]
	}
]

const router = new VueRouter({
	routes
})

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI)

const wrapper = shallowMount(Videopage, { router, store, localVue })

// HERE IS HOW TO MOCK AN API IN @/api/* WHICH SENDS REQUESTS TO BACKEND
jest.mock('@/api/kuaishou', () => {
	return {
		getInfo: () => {
			return Promise.resolve({
				code: 200,
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
		getVideoData: () => {
			return Promise.resolve({
				code: 200,
				data: {
					title: "ゆるキャンΔ",
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
			})
		}
	}
})

describe('video analysis page', () => {

	//HERE IS HOW TO TEST MODULE BEHAVIORS WITH THE MOCKED API
	it(('test getData'), async () => {
		await wrapper.vm.getNameAvatar()
		await wrapper.vm.getData()	// await is essential, otherwise Promise.prototype.then() may not be executed
		expect(wrapper.vm.kuaishou_nickname).toBe("野原飞燕")
		expect(wrapper.vm.video.title).toBe("ゆるキャンΔ")
		expect(wrapper.vm.option.xAxis.data.length).toBe(3)
	})

	it(('test slide&slice'), () => {
		wrapper.vm.setRange([1, 29])
		expect(wrapper.vm.option.xAxis.data.length).toBe(29)
		wrapper.vm.setRange([2, 2])
		wrapper.vm.setRange([1, 1])
		expect(wrapper.vm.option.xAxis.data.length).toBe(24) // 1d = 24h
		expect(wrapper.vm.getSum([])).toBe("no data")
	})

	it(('test parsers'), () => {
		const test_title = "0123456789012345678901234567890123456789"
		const short_title = "0123456789"
		expect(wrapper.vm.parseTitle(test_title).length).toBe(33)
		expect(wrapper.vm.parseTitle(short_title).length).toBe(10)
	})

	it('test dialog play', () => {
		wrapper.vm.playVideo()
		expect(wrapper.vm.dialogPlay).toBeTruthy()
		wrapper.vm.closeDialog()
		expect(wrapper.vm.dialogPlay).toBeFalsy()
		expect(wrapper.vm.option.yAxis[0].min({ min: 10, max: 20 })).toBe(-100)
		wrapper.vm.negative = false
		expect(wrapper.vm.option.yAxis[0].min({ min: 10, max: 20 })).toBe(0)
		expect(wrapper.vm.option.yAxis[0].max({ min: 10, max: 20 })).toBe(100)
	})
})

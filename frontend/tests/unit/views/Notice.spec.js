import Notice from '@/views/notice/index.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import store from '@/store'

const localVue = createLocalVue()
localVue.use(ElementUI)

const wrapper = shallowMount(Notice, { store, localVue })

jest.mock('@/api/notice', () => {
	var all_notices = [
		{
			title: '[通知]您的账户已被永久封禁',
			message: '骗你的！',
			id: 0,
			read: false
		},
		{
			title: '[公告]快红平台即日起开放实名认证通道',
			message: '其实没开放！',
			id: 1,
			read: false
		},
		{
			title: '[新闻]快红献礼清华大学110周年校庆，推出紫色主题皮肤',
			message: '暂时还没上线。',
			id: 2,
			read: true
		},
		{
			title: '[广告]快手——记录世界，记录你。',
			message: '抖音，记录美好生活。',
			id: 3,
			read: true
		}
	]
	return {
		getUnreadNotices: () => {
			return Promise.resolve({
				code: 200,
				notices: [
					{
						title: '[通知]您的账户已被永久封禁',
						message: '骗你的！',
						id: 123456
					},
					{
						title: '[公告]快红平台即日起开放实名认证通道',
						message: '其实没开放！',
						id: 666612
					},
					{
						title: '[新闻]快红献礼清华大学110周年校庆，推出紫色主题皮肤，即日起连续登录快红平台110天即可获得本站SSSSSSSSSSSSSSSSVIP权限一年！',
						message: '暂时还没上线。',
						id: 232212
					},
					{
						title: '[广告]快手——记录世界，记录你。',
						message: '抖音，记录美好生活。',
						id: 663232
					}
				]
			})
		},
		getAllNotices: () => {
			return Promise.resolve({
				code: 200,
				notices: all_notices
			})
		},
		setNoticeRead: (data) => {
			all_notices[data.id].read = true
			return Promise.resolve({
				code: 200
			})
		}
	}
})

describe('notice center page', () => {

	it(('test getUnreadNotices'), async () => {
		await wrapper.vm.refresh()	// await is essential, otherwise Promise.prototype.then() may not be executed
		expect(wrapper.vm.notices[0].id).toBe(123456)
	})

	it(('test getAllNotices'), async () => {
		wrapper.vm.radio = "ALL"
		await wrapper.vm.refresh()	// await is essential, otherwise Promise.prototype.then() may not be executed
		expect(wrapper.vm.notices[0].id).toBe(0)
	})

	it(('test handle change'), async () => {
		wrapper.vm.handleChange(-1)
		wrapper.vm.handleChange(0)
		wrapper.vm.refresh()
		expect(wrapper.vm.notices[0].read).toBe(true)
	})
})

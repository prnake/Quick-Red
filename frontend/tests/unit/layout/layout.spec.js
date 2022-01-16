import layout from '@/layout/index'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Layout:index', () => {
	let store
	let actions

	beforeEach(() => {
		actions = {
			closeSideBar: jest.fn()
		}
		store = new Vuex.Store({
			modules: {
				app: {
					namespaced: true,
					state: {
						sidebar: {
							tag: 'test',
							opened: true,
							withoutAnimation: false
						},
						device: 'mobile'
					},
					actions
				},
				settings: {
					state: {
						fixedHeader: 'header'
					}
				}
			}
		})
	})

	it('test layout', () => {
		const wrapper = shallowMount(layout, { store, localVue })
		expect(wrapper.vm.sidebar.tag).toBe('test')
		expect(wrapper.vm.device).toBe('mobile')
		expect(wrapper.vm.fixedHeader).toBe('header')
		expect(wrapper.vm.classObj.mobile).toBe(true)
		wrapper.vm.handleClickOutside()
		expect(actions.closeSideBar).toHaveBeenCalled()
	})
})
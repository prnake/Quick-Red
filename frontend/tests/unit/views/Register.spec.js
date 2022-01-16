import Register from '@/views/register/index.vue'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import SvgIcon from '@/components/SvgIcon'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.component('SvgIcon', SvgIcon)

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI)
const routes = [
  {
    path: '/',
    name: 'home'
  }]
const router = new VueRouter({ routes })

describe('Register.vue', () => {

  it(('show-pwd test'), async () => {
    const wrapper = mount(Register, { router, store, localVue })
    wrapper.vm.$refs.password.focus = jest.fn()
    await wrapper.find('.show-pwd').trigger('click')
    expect(wrapper.vm.$data.inputType).toBe('show')
    await wrapper.find('.show-pwd').trigger('click')
    expect(wrapper.vm.$data.inputType).toBe('hide')
  })
})

describe('Valid user', () => {
  it('Valid username', () => {
    const wrapper = mount(Register, { router, store, localVue })
    wrapper.vm.registerForm.username = "nldxtd"
    wrapper.vm.registerForm.password = "123456"
    wrapper.vm.$router.push = jest.fn()
    wrapper.vm.parseRegister({ code: 200 })
    wrapper.vm.handleRegister()
  })
})

describe('Invalid user', () => {
  it('invalid username', () => {
    const wrapper = mount(Register, { router, store, localVue })
    wrapper.vm.registerForm.username = "nld"
    wrapper.vm.registerForm.password = "123"
    wrapper.vm.parseRegister({ code: 400 })
    wrapper.vm.handleRegister()
  })
})
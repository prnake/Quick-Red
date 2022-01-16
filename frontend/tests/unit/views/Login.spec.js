import Login from '@/views/login/index.vue'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import SvgIcon from '@/components/SvgIcon'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.component('SvgIcon', SvgIcon)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(ElementUI)
const routes = [
  {
    path: '/',
    name: 'home'
  }]
const router = new VueRouter({ routes })

describe('ShowPwd', () => {
  it('showPwd', () => {
    const wrapper = shallowMount(Login, { router, localVue })
    wrapper.vm.$refs.password.focus = jest.fn()
    wrapper.vm.inputType = 'hide'
    wrapper.vm.showPwd()
    expect(wrapper.vm.inputType).toBe('show')
    wrapper.vm.showPwd()
    expect(wrapper.vm.inputType).toBe('hide')
  })
})

describe('Valid user', () => {
  jest.mock('@/api/user', () => {
    return {
      login: () => {
        return Promise.resolve({
          code: 200,
          data: {}
        })
      }
    }
  })
  it('valid username', async () => {
    const wrapper = mount(Login, { router, store, localVue })
    wrapper.vm.loginForm.username = "nldxtd"
    wrapper.vm.loginForm.password = "123456"
    wrapper.vm.$router.push = jest.fn()
    wrapper.vm.parseLogin({ code: 200 })
    await wrapper.vm.handleLogin()
  })
})

describe('Invalid user', () => {
  it('invalid username', () => {
    const wrapper = mount(Login, { router, store, localVue })
    wrapper.vm.loginForm.username = "nld"
    wrapper.vm.loginForm.password = "123"
    wrapper.vm.parseLogin({ code: 400 })
    wrapper.vm.handleLogin()
  })
})
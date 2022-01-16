<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="logo-container">
        <svg-icon icon-class="logo" />
      </div>
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名(6~18个字符)"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="password"
          ref="password"
          v-model="registerForm.password"
          :type="inputType === 'show' ? 'text' : 'password'"
          placeholder="密码(≥6个字符)"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span :ref="seen" class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="inputType === 'show' ? 'eye-open' : 'eye'" />
        </span>
      </el-form-item>

      <el-button
        class="registerButton"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
      >注册</el-button>
      <div>
        <div class="tips">
          <span
            style="margin-right: 20px"
          >注册即代表同意快红的用户协议(暂时还没有)。</span>
        </div>
        <div class="tips">
          <span
            style="margin-right: 20px"
          >已有账户？立即<el-link type="primary" href="/#/login">登录</el-link>。</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { showpwd } from '@/utils/showpwd'
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      // deal with username
      if (!validUsername(value)) {
        callback(new Error('Username: length between 6 and 18'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // deal with password
      if (value.length >= 6) {
        callback()
      } else {
        callback(new Error('Password: length longer than 6'))
      }
    }
    return {
      registerForm: {
        username: '',
        password: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      inputType: 'hide',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      showpwd(this)
    },
    parseRegister(res) {
      if (res.code === 200) {
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }
      if (res.code === 400) {
        this.loading = false
        this.$notify.error({
          title: 'Fail',
          message: '该用户名已被使用！',
          duration: 1000
        })
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid, callback) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/register', this.registerForm)
            .then((res) => this.parseRegister(res))
            .catch(() => (this.loading = false))
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #ffc6b3;
$light_gray: #c0c4cc;
$dark_gray: #606266;
$gray: #909399;
$cursor: #606266;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $dark_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid $gray;
    background: #ffffff;
    border-radius: 5px;
    color: $gray;
  }
}
</style>

<style lang="scss" scoped>
$bg: #303133;
$dark_gray: #606266;
$light_gray: #303233;
$vermilion: #ea4f19;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 100px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $vermilion;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $vermilion;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .logo-container {
    padding: 20px 20px 20px 20px;
    vertical-align: middle;
    text-align: center;
    font-size: 200px;
    color: $vermilion;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="logo-container">
        <svg-icon icon-class="logo" />
      </div>
      <div class="title-container">
        <h3 class="title">让你的快手红起来。</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="快红用户名"
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
          ref="password"
          v-model="loginForm.password"
          :type="inputType === 'show' ? 'text' : 'password'"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="inputType === 'show' ? 'eye-open' : 'eye'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <div>
        <div class="tips">
          <span
            style="margin-right: 20px"
          >第一次来？立即<el-link
            type="primary"
            href="/#/register"
          >注册</el-link>。</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { showpwd } from '@/utils/showpwd'
export default {
  name: 'Login',
  data() {
    const validateLoginUsername = (rule, value, callback) => {
      if (validUsername(value)) {
        callback()
      } else {
        callback(
          new Error('Please enter the correct username(length between 6-18)')
        )
      }
    }
    const validateLoginPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Please enter the correct password(longer than 6)'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateLoginUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validateLoginPassword }
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
    parseLogin(res) {
      if (res.code === 200) {
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }
      if (res.code === 400) {
        this.$notify.error({
          title: 'Fail',
          message: '用户名或密码错误！',
          duration: 1000
        })
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid, callback) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => this.parseLogin(res))
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
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
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

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
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

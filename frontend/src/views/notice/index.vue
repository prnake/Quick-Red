<template>
  <div class="notice-wrapper">
    <div class="notice-radio">
      <el-radio v-model="radio" label="UNREAD">显示未读</el-radio>
      <el-radio v-model="radio" label="ALL">显示全部</el-radio>
      <el-button
        type="primary"
        plain
        style="float: right"
        icon="el-icon-refresh"
        @click="refresh"
      />
    </div>
    <div v-if="notices.length > 0" class="notice-list">
      <el-collapse v-model="activeName" accordion @change="handleChange">
        <el-collapse-item v-for="(item, i) in notices" :key="i" :name="i">
          <template slot="title">
            {{ parseTitle(item.title) }} <el-badge v-if="isUnread[i]" is-dot />
          </template>
          <div class="notice">{{ item.message }}</div>
          <div class="time">{{ item.create_time }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else class="notice-nothinghere">
      <p>暂时没有通知。</p>
    </div>
  </div>
</template>

<script>
import { getUnreadNotices, getAllNotices, setNoticeRead } from '@/api/notice'
import { getPrefixlessTitle } from '@/utils/show-important-notices.js'

export default {
  data() {
    return {
      notices: [],
      activeName: -1,
      isUnread: [],
      radio: 'UNREAD'
    }
  },
  watch: {
    notices: {
      handler() {
        var i
        if (this.radio === 'UNREAD') {
          for (i = 0; i < this.notices.length; i++) {
            this.isUnread[i] = true
          }
        } else {
          for (i = 0; i < this.notices.length; i++) {
            this.isUnread[i] = !this.notices[i].read
          }
        }
      }
    },
    radio: {
      handler() {
        this.refresh()
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      if (this.radio === 'UNREAD') {
        getUnreadNotices().then((response) => {
          this.notices = response.notices
        })
      } else {
        getAllNotices().then((response) => {
          this.notices = response.notices
        })
      }
    },
    handleChange(val) {
      if (val >= 0 && this.isUnread[val]) {
        this.isUnread[val] = false
        var data = { id: this.notices[val].id }
        setNoticeRead(data).then((response) => {})
      }
    },
    parseTitle(title) {
      if (title.length > 30) {
        return getPrefixlessTitle(title.slice(0, 30) + '...')
      } else {
        return getPrefixlessTitle(title)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  &-wrapper {
    margin: 50px;
  }
  &-radio {
    height: 50px;
  }
  &-content {
    min-height: 100px;
  }
  &-nothinghere {
    font-size: 14px;
  }
}
.notice {
  min-height: 50px;
}
.time {
  color: #999;
  font-size: 12px;
  line-height: 22px;
}
</style>

<template>
  <div class="app-container">
    <el-collapse-transition>
      <div
        v-show="cloud.visible"
        style="
          position: fixed;
          z-index: 999999;
          background: white;
          opacity: 0.8;
        "
      >
        <cloud
          class="transition-box"
          :data="cloud.data"
          :on-word-click="cloud.onWordClick"
          :font-size-mapper="cloud.fontSizeMapper"
        />
      </div>
    </el-collapse-transition>
    <span class="demonstration">时间范围 </span>
    <el-date-picker
      v-model="time_value"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions"
      @change="fetchData"
    />
    <!-- 视频列表表格 -->
    <el-table
      v-loading="listLoading"
      :data="
        list.slice(
          (listQuery.page - 1) * listQuery.limit,
          listQuery.page * listQuery.limit
        )
      "
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="Title">
        <template slot-scope="scope">
          <el-popover placement="top-end" trigger="hover">
            <!-- 快手封面图片 -->
            <img :src="scope.row.pic" width="100">
            <el-link
              slot="reference"
              :href="'/#/video/' + scope.row.id"
              type="primary"
            >
              {{ scope.row.title }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Display_time"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.pubdate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Likes" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.likes }}
        </template>
      </el-table-column>
      <el-table-column label="Comments" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.comments }}
        </template>
      </el-table-column>
      <el-table-column label="Plays" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.plays }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Tags"
        width="400"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            style="margin-left: 10px"
            @close="handleClose(scope.row.num, tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-model="input[scope.row.num]"
            class="input-new-tag"
            placeholder="Add Tag"
            size="small"
            :clearable="true"
            style="width: 100px; margin-left: 10px; vertical-align: bottom"
            @keyup.enter.native="handleInputConfirm(scope.row.num)"
            @blur="handleInputConfirm(scope.row.num)"
            @focus="handleFocus(scope.row.num)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Cloud from '@/components/Cloud'
import { getVideoList, setTags } from '@/api/kuaishou'
import { parseTime, getTimePeriod } from '@/utils/index.js'

export default {
  components: { Pagination, Cloud },
  data() {
    return {
      cloud: {
        data: [
          { text: 'Vue', value: 1000 },
          { text: 'js', value: 200 },
          { text: 'is', value: 800 },
          { text: 'very cool', value: 1000000 },
          { text: 'lunch', value: 100 }
        ],
        fontSizeMapper: (word) => Math.log2(word.value),
        onWordClick: (word) => {
          this.input[this.cloud.selectRow] = word.text
          this.handleInputConfirm(this.cloud.selectRow)
        },
        visible: false,
        selectRow: 0
      },

      input: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              picker.$emit('pick', getTimePeriod(3600 * 1000 * 24 * 3))
            }
          },
          {
            text: '最近七天',
            onClick(picker) {
              picker.$emit('pick', getTimePeriod(3600 * 1000 * 24 * 7))
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              picker.$emit('pick', getTimePeriod(3600 * 1000 * 24 * 30))
            }
          }
        ]
      },
      time_value: '',
      list: [],
      listLoading: true
    }
  },
  created() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.time_value = [
      parseTime(start, '{y}-{m}-{d}'),
      parseTime(end, '{y}-{m}-{d}')
    ]
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      if (this.time_value) {
        getVideoList({
          userid: '',
          start_time: this.time_value[0],
          end_time: this.time_value[1]
        }).then((response) => {
          const cloud_data = []
          const words = {}
          this.list = response.data.items
          this.listLoading = false
          this.total = response.data.total
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].num = i
            for (let j = 0; j < this.list[i].tags.length; j++) {
              var word = this.list[i].tags[j]
              if (!words[word]) {
                words[word] = this.list[i].plays
              } else {
                words[word] += this.list[i].plays
              }
            }
          }
          for (const tmpword in words) {
            cloud_data.push({ text: tmpword, value: words[tmpword] })
          }
          this.cloud.data = cloud_data
            .sort((a, b) => {
              return -a.value + b.value
            })
            .slice(0, 50)
          this.input = Array(this.list.length).fill('')
        })
      } else {
        this.list = []
        this.listLoading = false
        this.total = 0
        this.cloud.data = []
      }
    },
    handleClose(num, tag) {
      const specTags = this.list[num].tags
      specTags.splice(specTags.indexOf(tag), 1)
      this.sendTags(this.list[num].id, specTags)
    },
    sendTags(id, tags) {
      setTags({
        userid: '',
        photo_id: id,
        tags: tags
      }).then((res) =>
        res.code === 200
          ? this.$notify({
            title: 'Success',
            message: 'Tag保存成功',
            type: 'success',
            duration: 1000
          })
          : this.$notify.error({
            title: 'Fail',
            message: 'Tag保存失败',
            duration: 1000
          })
      )
    },
    handleInputConfirm(num) {
      const specVideo = this.list[num]
      const inputValue = this.input[num]
      if (inputValue.length > 10) {
        this.$notify.error({
          title: 'Fail',
          message: 'Tag长度应小于10',
          duration: 1000
        })
      } else if (inputValue) {
        if (specVideo.tags.indexOf(inputValue) !== -1) {
          this.$notify.error({
            title: 'Fail',
            message: 'Tag已存在',
            duration: 1000
          })
        } else {
          specVideo.tags.push(inputValue)
          this.sendTags(this.list[num].id, specVideo.tags)
        }
      }
      this.input[num] = ''
      this.cloud.visible = false
    },
    handleFocus(num) {
      this.cloud.selectRow = num
      this.cloud.visible = true
    }
  }
}
</script>

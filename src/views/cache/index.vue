<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span=' 6'>
        <el-card>
          <div slot='header' class='clearfix'>
            <span>redis缓存命令统计信息</span>
            <el-divider align='center'>
              总数：{{ tablePileData.length }}
            </el-divider>
          </div>
          <div class='grid-content bg-purple'>
            <el-table
              :data='tablePileData.filter(data => !name || data.name.toLowerCase().includes(name.toLowerCase()))'
              border
              height='1000'
              style='width: 100%'
              v-loading='loading'
            >
              <el-table-column
                prop='name'
                label='缓存命令名'
                width='100%'>
              </el-table-column>
              <el-table-column
                prop='totalNum'
                label='缓存命令量'
                width='100%'>
              </el-table-column>
              <el-table-column
                align='center'>
                <template slot='header' slot-scope='scope'>
                  <el-input
                    v-model='name'
                    size='mini'
                    placeholder='输入缓存命令搜索' />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

      </el-col>
      <el-col :span=' 8'>
        <el-card>
          <div slot='header' class='clearfix'>
            <div>
              <span>缓存键名</span>
              <el-button
                @click='onBtnQueryClick()'
                style='float: right; padding: 3px 0'
                type='text'
                icon='el-icon-refresh-left'></el-button>
              <el-divider align='center'>
                总Key数：{{ dbSize }}
              </el-divider>
            </div>

          </div>
          <el-divider />
          <div class='grid-content bg-purple'>
            <el-table
              :data='tableKeyData.filter(data => !key || data.key.toLowerCase().includes(key.toLowerCase()))'
              border
              height='1000'
              style='width: 100%'
              v-loading='loading'
            >
              <el-table-column
                prop='key'
                label='缓存内容'
                width='250'>
              </el-table-column>
              <el-table-column
                align='center'>
                <template slot='header' slot-scope='scope'>
                  <el-input
                    v-model='key'
                    size='mini'
                    placeholder='输入Key关键字搜索' />
                </template>
                <template slot-scope='scope'>
                  <el-button
                    size='mini'
                    type='danger'
                    icon='el-icon-delete'
                    @click='onBtnDeleteKeyClick(scope.$index, scope.row)'>
                  </el-button>
                  <el-button
                    type='text'
                    icon='el-icon-view'
                    @click='handleByKeySearch(scope.row.key)'
                  >
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

      </el-col>
      <el-col :span='9'>
        <el-card>
          <div slot='header' class='clearfix'>
            <span>缓存内容</span>
            <el-button style='float: right; padding: 3px 0'
                       type='text'
                       @click='handleByKeySearch(serchKey)'
                       icon='el-icon-refresh-left'></el-button>
            <el-divider align='center'>
              {{ valuekey }}对应的数据
            </el-divider>
          </div>
          <div class='grid-content bg-purple' v-loading="searchLoading">
            <json-viewer :value='jsonData'></json-viewer>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import {
  deleteByKey,
  getCacheInfo, queryByKeyValue
} from '@/api/basedata/cache'

export default {
  data() {
    return {
      tableKeyData: [], //key键
      tablePileData: [], // redis缓存命令统计
      key: '',
      loading: false,
      searchLoading: false,
      name: '',
      dbSize: 0,
      jsonData: {
        key: '',
        value: ''
      },
      valuekey: '',
      serchKey: ''
    }
  },
  mounted() {
    console.log('mounted..')
    this.initData()
  },
  methods: {
    initData() {
      this.onBtnQueryClick()
    },

    /**
     * @description: 获取缓存信息
     * @return {*}
     */
    onBtnQueryClick() {
      this.loading = true
      this.key = ''
      getCacheInfo(this.key)
        .then((response) => {
          if (response != null) {
            this.loading = false
            this.tableKeyData = response.keyVos
            this.tablePileData = response.orderChcheVOS
            this.dbSize = response.dbSize
            // 获取第一行表格对应的value
          }
          // console.log(response)
        })
        .catch(() => {
          this.loading = false // 关闭查询
          this.$message.error('网络异常')
        })
    },
    /**
     * @description: 获取value
     * @return {*}
     * @param key
     */
    handleByKeySearch(key) {
      if (key == null) {
        this.$message.error('请选择需要查看的key')
        return
      }
      this.searchLoading = true
      this.serchKey = key
      this.jsonData = {}
      queryByKeyValue(this.serchKey).then((response) => {
        this.searchLoading = false
        if (response != null) {
          this.valuekey = this.serchKey
          this.jsonData = response
          console.log(response)
        }
      })
        .catch(() => {
          this.searchLoading = false
          this.$message.error('网络异常')
        })
      console.log(key)
    },
    /**
     * @description: 通过key删除缓存
     * @param {*}
     * @return {*}
     */
    onBtnDeleteKeyClick(index, row) {
      let message = ''
      if (row) {
        message = `确定要对 ${row.key} 进行删除吗？`
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteByKey(row.key)
            .then(response => {
              if (response) {
                this.$message.success('删除成功')
                this.tableKeyData.splice(index, 1)
                this.dbSize = this.dbSize - 1
              } else {
                this.$message.error('删除失败')
              }
            })
        })
        .catch(() => {
          this.$message.info('用户取消删除')
        })
    }
  }
}
</script>

<style scoped>

</style>

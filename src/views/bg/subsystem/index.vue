<!--
 * @Author: angula
 * @Date: 2020-12-11 17:07:02
 * @LastEditTime: 2022-03-22 23:14:18
 * @FilePath: \sd365-permission-centre-front-end\src\views\basedata\subsystem\index.vue
-->
<template>
  <el-container>
    <el-header>
      <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
      <sd-QueryPanel
        :query-model="subsystemQuery"
        class="sdQueryPanel"
        style="margin-top: 0px; position: relative; margin-left: -50px"
        @QueryButtonClick="onBtnQueryClick"
      >
        <!--这里在组件是slot 由用户自定义查询条件-->
        <el-form-item label="子系统名">
          <el-input v-model="subsystemQuery.name" style="width: 120px" />
        </el-form-item>
        <el-form-item label="子系统代码">
          <el-input v-model="subsystemQuery.code" style="width: 120px" />
        </el-form-item>
        <el-form-item label="子系统备注">
          <el-input v-model="subsystemQuery.remark" style="width: 120px" />
        </el-form-item>
      </sd-QueryPanel>
    </el-header>
    <el-container>
      <el-aside
        style="position: relative; top: 20px"
        :width="showmuenflag ? '0px' : '190px'"
      >
        <el-menu :collapse="showmuenflag">
          <el-col :span="24">
            <el-card shadow="always" style="height: 100%">
              <div slot="header" class="clearfix;">
                <em
                  class="el-icon-menu"
                  style="height: 22px"
                  @click="showmuenflag = !showmuenflag"
                >子系统管理</em>
              </div>
              <!-- <el-tree :data="data" :props="defaultProps" /> -->
              <el-tree
                :data="data"
                :props="defaultProps"
                accordion
                highlight-current="true"
                @node-click="handleNodeClick"
              />
            </el-card>
          </el-col> </el-menu></el-aside>

      <el-container>
        <el-main class="s">
          <div class="main-header" style="margin-top: -10px">
            <i
              :class="
                showmuenflag ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
              "
              class="i-sty"
              @click="showmuen"
            />
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click.native="onBtnAddClick"
            >增加</el-button>
            <el-button
              type="primary"
              icon="el-icon-copy-document"
              @click="onBtnCopyClick"
            >复制</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="onBtnBatchDelete"
            >删除</el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="onBtnEditClick"
            >编辑</el-button>
            <!-- <el-button style="margin-left: 7px" type="primary" @click="showmuen">子系统管理</el-button> -->
          </div>
          <!-- gutter为指定间隔 -->
          <el-row ref="multipleTable" :gutter="40" class="elrow-main">
            <div v-for="sub in subSystems" :key="sub.id">
              <el-col :span="6" class="item-rlrow">
                <!-- 在此进行展示系统得具体内容 -->
                <el-checkbox-group v-model="checkList">
                  <div
                    style="
                      width: 220px;
                      height: 220px;
                      background-color: #ffffff;
                      border-style: solid;
                    "
                  >
                    <el-checkbox
                      style="position: relative; left: 101px; top: -75px; "
                      :label="sub"
                    >
                      <br>
                    </el-checkbox>

                    <el-button
                      style="
                        width: 190px;
                        height: 195px;
                        border-style: solid;
                        background-color: #ffffff;
                        position: relative;
                        left: -11px;
                        top: -17px;
                        margin-top: 28px;
                      "
                      @click="onBtnSeeClick(sub)"
                      @dblclick.native="handleRowDoubleClick(sub)"
                    >
                      <!-- <img style="width:40px;height:40px;
                        position:relative;
                        left: 70px;
                        top: -40px;"-->
                      <el-image  style="width:50px; height:50px; font-size: 60px" :src="sub.imageUrl" :fit="fit"></el-image>
                      
                     <!-- <span
                        style="width: 60px; height: 60px; font-size: 60px"
                        :class="sub.imageUrl"
                      ></span>-->
                      <br>
                      <!-- <div style="position:relative;border-style:solid;
                        left: 15px;
                        top: -180px;">-->
                      <p>子系统名：{{ sub.name }}</p>
                      <p>子系统代码：{{ sub.code }}</p>
                      <p>子系统备注：{{ sub.remark }}</p>
                      <el-button
                        type="primary"
                        @click="jump(sub.link)"
                      >启用</el-button>
                    </el-button>
                  </div>
                </el-checkbox-group>
              </el-col>
            </div>
          </el-row>
          <sd-FormDialog
            :caption="dialogCaption"
            :visible="dialogVisible"
            width="70%"
            :model="subSystemVO"
            :rules="rules"
            height="300"
            @OkButtonClick="onBtnSaveClick"
            @CancelButtonClick="onBtnCancelClick"
          >
            <div v-if="dialogType != 'SEE'">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="子系统名" prop="name">
                    <el-input v-model="subSystemVO.name" placeholder />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="子系统代码"
                    label-width="120px"
                    prop="code"
                  >
                    <el-input v-model="subSystemVO.code" placeholder />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <!-- <el-col :span="11">
                  <el-form-item label="子系统图标" prop="imageUrl">
                    <el-input v-model="subSystemVO.imageUrl" placeholder="" />
                  </el-form-item>
                  </el-col>-->
                <el-col :span="11">
                  <el-form-item
                    label="子系统链接"
                    label-width="120px"
                    prop="link"
                  >
                    <el-input v-model="subSystemVO.link" placeholder />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="子系统备注"
                    label-width="120px"
                    prop="remark"
                  >
                    <el-input v-model="subSystemVO.remark" placeholder />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="5">
                <el-form-item
                  label="子系统图标"
                  label-width="120px"
                  prop="imageUrl"
                >
                  <el-select v-model="subSystemVO.imageUrl" placeholder>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :value="item.value"
                      :disabled="item.label == '不限'"
                      :label="item.label"
                    >
                      <el-image style="
                          width: 30px;
                          height: 30px;
                          position: relative;
                          left: 35px;
                        "
                        :src="item.value"
                      ></el-image>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <div v-if="dialogType == 'SEE'">
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统名："
                    label-width="100px"
                    prop="name"
                  >
                    <span>{{ subSystemVO.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统代码："
                    label-width="110px"
                    prop="code"
                  >
                    <span>{{ subSystemVO.code }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统图标："
                    label-width="110px"
                    prop="imageUrl"
                  >
                  <img
                      style="width: 80px; height: 80px"
                      :src="subSystemVO.imageUrl"
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统链接："
                    label-width="120px"
                    prop="link"
                  >
                    <span>{{ subSystemVO.link }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统备注："
                    label-width="110px"
                    prop="remark"
                  >
                    <span>{{ subSystemVO.remark }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统租户："
                    label-width="110px"
                    prop="tenant.name"
                  >
                    <span>{{ subSystemVO.tenant.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统机构："
                    label-width="110px"
                    prop="organization.name"
                  >
                    <span>{{ subSystemVO.organization.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统公司："
                    label-width="110px"
                    prop="company.name"
                  >
                    <span>{{ subSystemVO.company.name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统状态："
                    label-width="110px"
                    prop="status"
                  >
                    <span>{{ subSystemVO.status }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    style="margin-left: 50px"
                    label="子系统版本："
                    label-width="110px"
                    prop="version"
                  >
                    <span>{{ subSystemVO.version }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </sd-FormDialog>
        </el-main>
        <el-footer />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {
  add,
  remove,
  modify,
  commonQuery,
  querySubSystemById,
  querySubSystemByName,
  batchRemove,
  querySubSystemByTenantId,
  tenantQuery
} from '@/api/right/subSystem'
import { QueryPanel, FormDialog } from '../../../components/SD365UI'
import dialogDrag from '../../../utils/dialogdrap'
export default {
  name: 'Index',
  components: {},
  props: {},
  data() {
    return {
      fit:'cover',//插入图片样式
      showmuenflag: true,
      // eslint-disable-next-line no-undef
      queryLoading: false, // 查询进度条控制
      // eslint-disable-next-line no-undef
      updateLoading: false, // 修改进度条控制
      // eslint-disable-next-line no-undef
      copyLaoding: false, // 拷贝一条数据的进度控制
      multipleSelection: [],
      dialogVisible: false,
      subSystems: [], // 从vo取得的系统信息
      subsystemQuery: { name: '', code: '', imageUrl: '', ramark: '' }, // 查询对象
      subSystemVO: {}, // 显示查询回来的对象
      dialogCaption: '子系统信息',
      dialogType: 'EDIT', // 标记对话框处于那种状态 或者 ADD
      subsystemDTO: {}, // 增加和修改对象
      checkList: [],
      
      options: [
        {
          value:
            'https://s2.loli.net/2022/08/12/CL9n5rlhJducyVt.png',
          label: '图标1'
        },
        {
          value:
            'https://s2.loli.net/2022/08/12/SMh1gkazWOYPxnC.png',
          label: '图标2'
        },
        {
          value:
            'https://s2.loli.net/2022/08/12/h2fgmF3pzQK6WCo.png',
          label: '图标3'
        },
        {
          value:
            'https://s2.loli.net/2022/08/12/gvoz8XfS4nKC1UN.png',
          label: '图标4'
        },
        {
          value:
            'https://s2.loli.net/2022/08/12/Ny6HGA3mESarbVe.png',
          label: '图标5'
        },
         {
          value:
            'https://s2.loli.net/2022/08/12/HxGT5i6nNtkUbZR.png',
          label: '图标6'
        }
      ],
      data: [],
      length: 4,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入子系统代码', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入子系统图标', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '子系统链接不可为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '子系统备注不可为空', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '子系统图标不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    console.log('mounted..')
    this.initData()
  },
  created() {},
  methods: {
    showmuen() {
      // debugger
      this.showmuenflag = !this.showmuenflag
    },
    handleNodeClick(data) {
      console.log(data)
      // console.log()
      this.queryLoading = true
      querySubSystemByTenantId(data.id)
        .then((response) => {
          this.subSystems = response.data
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('侧边栏查询通知信息--网络异常')
        })
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    initData() {
      this.queryLoading = false
      this.updateLoading = false
      this.updateLoading = false
      this.listLoading = false

      this.onBtnQueryClick()
      this.tenantQue()
    },
    jump(url) {
      // window.location.href = url
      //window.open('https://' + url)
      window.open(url)
    },
    /**
     * 增删改查
     */
    /**
     * @description: 查询操作
     * @param {*}
     * @return {*}
     */
    onBtnQueryClick() {
      this.queryLoading = true
      commonQuery(this.subsystemQuery)
        .then((response) => {
          this.subSystems = response.data // 分页信息带回显示
          this.queryLoading = false // 关闭查询
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('查询通知信息--网络异常')
        })
      // 将 commonnPage 数据设在到 分页控件
    },
    /**
     * 树查询接口
     */
    tenantQue() {
      tenantQuery()
        .then((response) => {
          const tenantQ = response.data
          console.log(tenantQ)
          // this.data[0].children = []
          for (let i = 0; i < tenantQ.length; i++) {
            this.data.push({
              label: tenantQ[i].tenant.name,
              children: [],
              id: tenantQ[i].tenantId
            })
            this.tenant(tenantQ[i].tenantId, tenantQ, i)
          }
        })
        .catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('tenant--网络异常')
        })
    },
    tenant(tenantId, subSystems, i) {
      querySubSystemByTenantId(tenantId).then((response) => {
        const subs = response.data
        console.log(subs)
        console.log(subs.length)
        const tenantName = []
        const children = []

        console.log(subs)
        for (let j = 0; j < subs.length; j++) {
          this.data[i].children.push({
            label: subs[j].name,
            id: subs[i].tenantId
          })
        }
      })
    },
    /**
     * 查看
     */
    onBtnSeeClick(subSystem) {
      this.dialogVisible = true
      this.dialogType = 'SEE'
      // 调用 api 插入记录并且返回记录
      querySubSystemById(subSystem.id)
        .then((response) => {
          if (response != null) {
            this.subSystemVO = response
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('查看信息error')
          }
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('see---网络异常')
        })
    },
    /**
     * 增加
     */
    onBtnAddClick() {
      // get header from token  load organizations and companies
      try {
        this.subSystemVO = {} // 初始化
        this.dialogType = 'ADD'
        this.dialogVisible = true
      } catch (error) {
        this.$message.error('网络异常')
      }
    },
    /**
     * 复制
     */
    onBtnCopyClick() {
      // get header from token  load organizations and companies
      // 如果不是选择一条则提示消息并且返回
      if (this.checkList.length < 1) {
        this.$message.error('请选择一个子系统进行拷贝')
        return
      }
      if (this.checkList.length > 1) {
        this.$message.error('只能选择一个子系统进行拷贝')
        return
      } else {
        console.log(this.checkList)
        this.showSubSystem(this.checkList[0])
      }
    },
    /**
     * 删除
     */
    onBtnBatchDelete() {
      if (this.checkList.length < 1) {
        this.$message.error('没有对应记录可以删除')
        return
      } else {
        this.$confirm('确定删除记录吗').then((result) => {
          console.log('开始删除....')
          const deleteSubSystems = new Array(this.checkList.length)
          for (let i = 0; i < this.checkList.length; i++) {
            deleteSubSystems[i] = {
              id: this.checkList[i].id,
              version: this.checkList[i].version
            }
          }
          batchRemove(deleteSubSystems)
            .then((response) => {
              if (response) {
                this.$message.success('删除数据成功')
                this.checkList = []
                // 删除成功调用界面刷新方法
                this.onBtnQueryClick()
              }
            })
            .catch(() => {
              this.$message.error('网络错误')
            })
        })
      }
    },
    /**
     * 编辑
     */
    onBtnEditClick() {
      if (this.checkList.length < 1) {
        this.$message.error('选择一条进行编辑')
        return
      }
      if (this.checkList.length > 1) {
        this.$message.error('只能选择一条进行编辑')
        return
      } else {
        console.log(this.checkList)
        this.editSubSystem(this.checkList[0])
      }
    },
    /**
     * @description: 双击触发编辑
     */
    handleRowDoubleClick(subSystem) {
      this.dialogVisible = true
      // 调用 api 插入记录并且返回记录
      querySubSystemById(subSystem.id)
        .then((response) => {
          if (response != null) {
            this.subSystemVO = response
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('没有对应记录可以Edit')
          }
          this.dialogType = 'EDIT'
          this.dialogVisible = true
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('EDIT---网络异常')
        })
    },
    showSubSystem(subSysytem) {
      this.copyLaoding = true
      this.dialogVisible = true
      // 调用 api 插入记录并且返回记录
      querySubSystemById(subSysytem.id)
        .then((response) => {
          if (response != null) {
            this.subSystemVO = response
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('没有对应记录可以Copy')
          }
          this.dialogType = 'COPY'
          this.dialogVisible = true
          this.copyLaoding = false
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('copy---网络异常')
        })
    },
    editSubSystem(subSysytem) {
      this.dialogVisible = true
      // 调用 api 插入记录并且返回记录
      querySubSystemById(subSysytem.id)
        .then((response) => {
          if (response != null) {
            this.subSystemVO = response
            // eslint-disable-next-line no-undef
          } else {
            this.$message.info('没有对应记录可以Edit')
          }
          this.dialogType = 'EDIT'
          this.dialogVisible = true
          // 如果修改对话框将更新数据到数据库
        })
        .catch(() => {
          this.$message.error('EDIT---网络异常')
        })
    },
    onBtnSaveClick(source) {
    //  this.$message.success('onBtnSaveClick 被回调了 ')
      if (this.dialogType === 'ADD') {
        const currentSubsystemDTO = this.subSystemVO
        console.log(currentSubsystemDTO)
        add(currentSubsystemDTO)
          .then((response) => {
            // 显示保存成功并且返回
            this.$message.success('添加成功')
            this.onBtnQueryClick()
            this.dialogVisible = false
          })
          .catch(() => {
            this.dialogType = null
            this.subsystemVO = null
            this.dialogVisible = false
            this.$message.error('添加---网络异常')
          })
      } else if (this.dialogType === 'EDIT') {
        const currentSubsystemDTO = {}
        currentSubsystemDTO.id = this.subSystemVO.id
        currentSubsystemDTO.name = this.subSystemVO.name
        currentSubsystemDTO.code = this.subSystemVO.code
        currentSubsystemDTO.imageUrl = this.subSystemVO.imageUrl
        currentSubsystemDTO.link = this.subSystemVO.link
        currentSubsystemDTO.remark = this.subSystemVO.remark
        // currentSubsystemDTO.updateBy = this.subSystemVO.updateBy
        currentSubsystemDTO.version = this.subSystemVO.version
        console.log(currentSubsystemDTO)
        modify(currentSubsystemDTO)
          .then((response) => {
            console.log('==>' + response)
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('修改成功')
            } else {
              this.$message.success('修改失败')
            }

            // this.resetUIToInitStatus()
            this.dialogVisible = false
            this.checkList = []
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.subsystemVO = null
            this.dialogVisible = false
            this.$message.error('修改---网络异常')
          })
      } else if (this.dialogType === 'COPY') {
        const currentSubsystemDTO = this.subSystemVO
        console.log(currentSubsystemDTO)
        add(currentSubsystemDTO)
          .then((response) => {
            console.log('==>' + response)
            // 显示保存成功并且返回
            if (response) {
              this.$message.success('操作成功')
            } else {
              this.$message.success('操作失败')
            }

            // this.resetUIToInitStatus()
            this.dialogVisible = false
            this.checkList = []
            // 查询刷新当前增加数据为第一条
            this.onBtnQueryClick()
          })
          .catch(() => {
            this.dialogType = null
            this.subsystemVO = null
            this.dialogVisible = false
            this.$message.error('网络异常')
          })
      }
    },
    /**
     * @description: 对话框区域的点击操作,在这里添加你取消的逻辑
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      this.dialogType = null
      this.dialogVisible = false
      // 需要则这里实现
    }
  }
}
</script>
<style>
@import url('../../../assets/systemsicons/iconfont.css');

/* 容器布局 */

.el-aside {
  background-color: #fdfeff;
  color: #333;
  text-align: center;
  line-height: 20px;
}

.s {
  /* text-align: center; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
/* 图标显示布局 */
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 420px;
  min-width: 100px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
/* 老师模板 */
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/* 头部增加复制删除框布局 */
.main-header {
  margin-bottom: 40px;
  /* z-index: -1; */
}
/* 头部查询样式 */
.sdQueryPanel {
  margin-left: 100px;
}
/* 展示框布局 */
.item-rlrow {
  margin-top: 60px !important;
  width: 250px;
  height: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.elrow-main {
  /* margin: -100px; */
  margin: -40px;
}
.i-sty {
  cursor: pointer;
}
</style>

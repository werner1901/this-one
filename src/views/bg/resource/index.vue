<template>
  <el-container>
    <el-header height="60px">
      <el-header>
        <!--引入查询面板组件该组件封装基本的查询控制逻辑-->
        <div class="test">
          <div id="search" style="margin-left: 10px">
            <el-form :inline="true">
              <el-form-item label="资源名称">
                <el-input
                  v-model="resourceQuery.name"
                  placeholder="请输入资源名称"
                />
              </el-form-item>
              <el-button
                style="margin-left: 5px"
                type="primary"
                @click="queryByName"
              >查询</el-button>
            </el-form>
          </div>
        </div>
      </el-header>
    </el-header>
    <el-container>
      <!--    左边的树-->
      <el-aside
        style="position: relative; top: 20px"
        :width="showmuenflag ? '0px' : '190px'"
      >
        <el-menu :collapse="showmuenflag">
          <el-col :span="4">
            <el-card shadow="always" style="height: 100%; width: 190px">
              <div slot="header" style="width: 555px" class="clearfix">
                <em
                  class="el-icon-menu"
                  style="height: 22px"
                  @click="showmuenflag = !showmuenflag"
                >资源管理</em>
              </div>
              <el-tree
                class="treee"
                draggable
                :data="resourceData"
                @node-click="handleNodeClick"
              />
            </el-card>
          </el-col>
        </el-menu>
      </el-aside>
      <!--右边主体部分-->
      <el-main>
        <el-card shadow="always" style="margin-left: 3px">
          <!--搜索框-->

          <!--上方操作链接-->
          <div style="height: 50px; margin-bottom: 20px">
            <i
              :class="
                showmuenflag ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
              "
              class="i-sty"
              @click="showmuen"
            />
            <el-button
              style="margin-left: 7px"
              type="primary"
              @click="
                ;(adddialogVisible = true),
                  (resourceDTO.leaf = 0),
                  (resourceDTO.action = 0),
                  (resourceDTO.resourceType = 0)
              "
            ><em class="el-icon-plus">增加</em></el-button>
            <el-button
              type="primary"
              icon="el-icon-copy-document"
              @click="onBtnCopyClick"
            >复制</el-button>
            <el-button
              style="margin-left: 7px"
              type="danger"
              @click="batchRemoveResource"
            ><em class="el-icon-delete">删除</em></el-button>
            <el-button
              style="margin-left: 7px"
              type="primary"
              @click="refreshData"
            ><em class="el-icon-refresh">刷新</em></el-button>
            <!-- <el-button style="margin-left: 7px" type="primary" @click="showmuen">资源管理</el-button> -->
            <i
              class="el-icon-menu"
              type="primary"
              icon="el-icon-plus"
              style="font-size: 30px; color: #409eff; float: right"
              @click="onBtnHideClick"
            />
          </div>
          <!--主体表格-->
          <el-table
            ref="multipleTable"
            :key="Math.random()"
            v-loading="dataLoading"
            fit
            border
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            row-key="id"
            :row-style="iRowStyle"
            :cell-style="iCellStyle"
            :header-row-style="iHeaderRowStyle"
            :header-cell-style="iHeaderCellStyle"
            @row-dblclick="updateFromInfo"
          >
            <el-table-column type="selection" width="50px" align="center" />
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form inline label-position="left">
                  <el-row>
                    <el-col :span="3">
                      <el-form-item label="编号" style="margin-left: 20px">
                        <div>{{ scope.row.code }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="资源名称">
                        <div>{{ scope.row.name }}</div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" label="序号" width="95">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <!-- <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  fit
                  border
                  :data="scope.resourceDTOS"
                >
                  <el-table-column align="center" label="资源名称" prop="name" />
                  <el-table-column align="center" label="编号" prop="code" />
                  <el-table-column align="center" label="URL" prop="url" />
                  <el-table-column align="center" label="API" prop="api" />
                  <el-table-column align="center" label="资源类型" prop="resourceType" />
                </el-table>
              </template>
            </el-table-column> -->
            <!-- <el-table-column v-if="tableColumns[0].show" label="资源名称" align="center" width="170px" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column v-if="tableColumns[1].show" label="编号" align="center" width="70px">
              <template slot-scope="scope">
                {{ scope.row.code }}
              </template>
            </el-table-column> -->
            <el-table-column
              v-if="tableColumns[0].show"
              label="父亲节点"
              sort-by="resourceTypeName"
              sortable
              show-overflow-tooltip
              align="center"
              width="130px"
            >
              <template slot-scope="{ row }" style="width: 30px">
                {{ row.resourceVO ? row.resourceVO.name : '无' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[1].show"
              label="子系统"
              sort-by="resourceTypeName"
              sortable
              align="center"
              width="130px"
            >
              <template slot-scope="{ row }" style="width: 30px">
                {{ row.subSystemVO.name }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[2].show"
              label="URL"
              align="center"
              width="105"
            >
              <template slot-scope="scope">
                {{ scope.row.url }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[3].show"
              label="API"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.api }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[4].show"
              label="资源类型"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.resourceTypeName }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[5].show"
              label="打开图标"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <svg-icon
                  :icon-class="scope.row.openImg"
                  :class-name="scope.row.openImg"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[6].show"
              label="关闭图标"
              width="100"
              align="center"
              prop="closeImg"
            >
              <template slot-scope="scope">
                <svg-icon
                  :icon-class="scope.row.closeImg"
                  :class-name="scope.row.closeImg"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColumns[7].show"
              label="不可见"
              width="90"
              align="center"
            >
              <template slot-scope="scope">
                <el-button size="mini" type="primary">
                  {{ scope.row.status === 1 ? '是' : '否' }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250px">
              <template slot-scope="scope">
                <div>
                  <el-button
                    style="margin-left: 5px"
                    size="mini"
                    type="primary"
                    @click="copyResource(scope.row)"
                  >复制</el-button>
                  <el-button
                    style="margin-left: 5px"
                    size="mini"
                    @click="updateFromInfo(scope.row)"
                  >编辑</el-button>
                  <el-button
                    style="margin-left: 5px"
                    size="mini"
                    type="danger"
                    @click="removeResource(scope.row)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页条-->
          <el-pagination
            :v-model="commonPage"
            :current-page.sync="commonPage.pageNum"
            :page-size="commonPage.pageSize"
            layout="total,prev,sizes, pager, next, jumper"
            :total="commonPage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-main>
      <!--  增加的弹框-->
      <sd-FormDialog
        :caption="addTitle"
        :visible="adddialogVisible"
        :model="resourceDTO"
        :rules="rules"
        width="60%"
        @OkButtonClick="addResource"
        @CancelButtonClick="adddialogVisible = false"
      >
        <!-- <el-form label-width="80px" status-icon :rules="rules">  -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="资源名称" prop="name">
              <el-input v-model="resourceDTO.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="URL" prop="url">
              <el-input v-model="resourceDTO.url" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Api" prop="api">
              <el-input v-model="resourceDTO.api" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资源编号" prop="code">
              <el-input v-model="resourceDTO.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="resourceDTO.remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="打开图标" prop="openImg">
              <!-- <el-select v-model="resourceDTO.openImg" placeholder="请选择" style="width:96%">
                <el-option
                  v-for="item in openImgList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select> -->
              <e-icon-picker
                v-model="resourceDTO.openImg"
                :width="600"
                :z-index="3000"
                clearable
                style="width: 96%"
                :options="options"
                @change="iconOpenChange"
              >
                <template #icon="{ icon }">
                  <svg-icon :icon-class="icon" />
                </template>
              </e-icon-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="关闭图标" prop="closeImg">
              <!-- <el-select v-model="resourceDTO.closeImg" placeholder="请选择" style="width:96%">
                <el-option
                  v-for="item in closeImgList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select> -->
              <e-icon-picker
                v-model="iconClose"
                :width="600"
                :z-index="3000"
                clearable
                style="width: 96%"
                :options="options"
                @change="iconCloseChange"
              >
                <template #icon="{ icon }">
                  <svg-icon :icon-class="icon" />
                </template>
              </e-icon-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" /><el-col :span="11">
            <el-form-item label="子系统" prop="subSystemId">
              <el-select
                v-model="resourceDTO.subSystemId"
                placeholder="请选择"
                style="width: 96%"
              >
                <el-option
                  v-for="item in systemList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父亲节点" prop="parentId">
              <el-select
                v-model="nodeData.id"
                placeholder="请选择"
                style="width: 96%"
              >
                <el-option
                  :key="nodeData.id"
                  :label="nodeData.label"
                  :value="nodeData.id"
                  style="height: auto"
                >
                  <el-tree
                    ref="treeSelect"
                    class="treee"
                    :data="resourceData"
                    @node-click="handleCheckChange"
                  />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否叶子节点" label-width="120px" porp="leaf">
              <template>
                <el-radio v-model="resourceDTO.leaf" :label="1">是</el-radio>
                <el-radio v-model="resourceDTO.leaf" :label="0">否</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资源类型" porp="resourceType">
              <template>
                <el-radio
                  v-model="resourceDTO.resourceType"
                  :label="0"
                >菜单</el-radio>
                <el-radio
                  v-model="resourceDTO.resourceType"
                  :label="1"
                >按钮</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否隐藏" style="margin-left: 10px">
              <template>
                <el-radio v-model="resourceDTO.action" :label="1">是</el-radio>
                <el-radio v-model="resourceDTO.action" :label="0">否</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-form> -->
        <!-- <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addResource">确 定</el-button> -->
      </sd-FormDialog>
      <!--    更新的弹框-->
      <sd-FormDialog
        :caption="updateTitle"
        :visible="updatedialogVisible"
        :model="resourceDTO"
        :rules="rules"
        width="60%"
        @OkButtonClick="updateResource"
        @CancelButtonClick="updatedialogVisible = false"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="资源名称" prop="name">
              <el-input v-model="resourceDTO.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="URL" prop="url">
              <el-input v-model="resourceDTO.url" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Api" prop="api">
              <el-input v-model="resourceDTO.api" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资源编号" prop="code">
              <el-input v-model="resourceDTO.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="resourceDTO.remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="打开图标" prop="openImg">
              <e-icon-picker
                v-model="resourceDTO.openImg"
                :width="600"
                :z-index="3000"
                clearable
                style="width: 96%"
                :options="options"
                @change="iconOpenChange"
              >
                <template #icon="{ icon }">
                  <svg-icon :icon-class="icon" />
                </template>
              </e-icon-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="关闭图标" prop="closeImg">
              <e-icon-picker
                v-model="iconClose"
                :width="600"
                :z-index="3000"
                clearable
                style="width: 96%"
                :options="options"
                @change="iconCloseChange"
              >
                <template #icon="{ icon }">
                  <svg-icon :icon-class="icon" />
                </template>
              </e-icon-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" /><el-col :span="11">
            <el-form-item label="子系统" prop="subSystemId">
              <el-select
                v-model="resourceDTO.subSystemId"
                placeholder="请选择"
                style="width: 96%"
              >
                <el-option
                  v-for="item in systemList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父亲节点" prop="parentId">
              <el-select
                v-model="nodeData.id"
                placeholder="请选择"
                style="width: 96%"
              >
                <el-option
                  :key="nodeData.id"
                  :label="nodeData.label"
                  :value="nodeData.id"
                  style="height: auto"
                >
                  <el-tree
                    ref="treeSelect"
                    class="treee"
                    :data="resourceData"
                    @node-click="handleCheckChange"
                  />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否叶子节点" label-width="120px" porp="leaf">
              <template>
                <el-radio v-model="resourceDTO.leaf" :label="1">是</el-radio>
                <el-radio v-model="resourceDTO.leaf" :label="0">否</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="资源类型" porp="resourceType">
              <template>
                <el-radio
                  v-model="resourceDTO.resourceType"
                  :label="0"
                >菜单</el-radio>
                <el-radio
                  v-model="resourceDTO.resourceType"
                  :label="1"
                >按钮</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否隐藏" style="margin-left: 10px">
              <template>
                <el-radio v-model="resourceDTO.action" :label="1">是</el-radio>
                <el-radio v-model="resourceDTO.action" :label="0">否</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </sd-FormDialog>
      <sd-HideTable
        :visible.sync="hideDialogColumnVisible"
        :table-columns="tableColumns"
        :width="hideTableWidth"
        @hideTableClose="hideTableClose"
      />
    </el-container>
  </el-container>
</template>

<script>
import {
  add,
  remove,
  batchRemove,
  modify,
  //getMenu,  作废
  getSubsystem,
  copy,
  commonQuery,
  //commonQueryTree, 作废
  queryResourceById,
  Query,
  querySubSystemById,
  treeQuery
} from '@/api/right/resource'
// import { dialogDrag } from '../../../utils/dialogdrap'
import svgIcons from 'e-icon-picker/lib/getSvg'
export default {
  name: 'Resource',
  data() {
    return {
      nodeData: {
        id: '',
        label: ''
      },
      Active: 'el-icon-arrow-right',
      showmuenflag: true,
      addTitle: '增加资源',
      updateTitle: '修改资源',
      addIconTitle: '选择图标',
      systemList: [],
      dataLoading: false,
      // commonPage: { total: 17, pageCount: 1, pageSize: 10 },
      openImgList: [
        {
          id: 0,
          name: 'dashboard'
        },
        {
          id: 1,
          name: 'example'
        },
        {
          id: 2,
          name: 'eye-open'
        },
        {
          id: 3,
          name: 'eye'
        },
        {
          id: 4,
          name: 'form'
        },
        {
          id: 5,
          name: 'link'
        },
        {
          id: 6,
          name: 'nested'
        },
        {
          id: 7,
          name: 'password'
        },
        {
          id: 8,
          name: 'table'
        },
        {
          id: 9,
          name: 'tree'
        },
        {
          id: 10,
          name: 'user'
        }
      ],
      closeImgList: [
        {
          id: 0,
          name: 'dashboard'
        },
        {
          id: 1,
          name: 'example'
        },
        {
          id: 2,
          name: 'eye-open'
        },
        {
          id: 3,
          name: 'eye'
        },
        {
          id: 4,
          name: 'form'
        },
        {
          id: 5,
          name: 'link'
        },
        {
          id: 6,
          name: 'nested'
        },
        {
          id: 7,
          name: 'password'
        },
        {
          id: 8,
          name: 'table'
        },
        {
          id: 9,
          name: 'tree'
        },
        {
          id: 10,
          name: 'user'
        }
      ],
      commonPage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 10,

        pages: null
      }, // 分页数据对象
      parentData: [],
      adddialogVisible: false,
      updatedialogVisible: false,
      rules: {
        name: [
          { required: true, message: '节点名称不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, message: '节点编码不能为空', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '父亲结点不能为空', trigger: 'change' }
        ],
        resourceType: [
          { required: true, message: '资源类型不能为空', trigger: 'change' }
        ],
        // url: [
        //   { required: true, message: 'URL不能为空', trigger: 'blur' }
        // ],
        api: [{ required: true, message: 'API不能为空', trigger: 'change' }],
        openImg: [
          { required: true, message: '请上传打开图标', trigger: 'change' }
        ],
        closeImg: [
          { required: true, message: '请上传关闭图标', trigger: 'change' }
        ],
        leaf: [
          {
            required: true,
            message: '是否为叶子节点不能为空',
            trigger: 'change'
          }
        ],
        // remark: [
        //   { required: true, message: '请备注', trigger: 'blur' }
        // ],
        subSystemId: [
          { required: true, message: '子系统不能为空', trigger: 'change' }
        ]
      },
      tableData: null,
      testData: [
        { id: 0, name: '测试1', parentid: -1 },
        { id: 1, name: '测试2', parentid: 0 },
        { id: 2, name: '测试3', parentid: 1 },
        { id: 3, name: '测试4', parentid: null }
      ],
      resourceQuery: {
        level: ''
      },
      query: {},
      resourceDTO: {
        tenantId: '',
        companyId: '',
        orgId: '',
        name: '',
        code: '',
        orderIndex: '',
        parentId: '',
        api: '',
        url: '',
        method: '',
        openImg: '',
        closeImg: '',
        resourceType: '',
        leaf: '',
        action: '',
        remark: '',
        id: '',
        createdBy: '',
        createdTime: '',
        updatedBy: '',
        updatedTime: '',
        status: '',
        version: ''
      },
      data: [],
      resourceData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selected: '',
      iconOpen: '',
      iconClose: '',
      options: {
        FontAwesome: false,
        ElementUI: false,
        addIconList: [],
        removeIconList: []
      },
      hideTableWidth: '30%',
      hideDialogColumnVisible: false,
      tableColumns: [
        { prop: 'resourceVO.name', label: '父亲节点', show: true },
        { prop: 'subSystemVO.name', label: '子系统', show: true },
        { prop: 'url', label: 'URL', show: false },
        { prop: 'api', label: 'API', show: true },
        { prop: 'resourceTypeName', label: '资源类型', show: true },
        { prop: 'openImg', label: '打开图标', show: true },
        { prop: 'closeImg', label: '关闭图标', show: true },
        { prop: 'status', label: '不可见', show: false }
      ]
    }
  },
  mounted() {
    // this.addIcon()
  },
  created() {
    this.getTree()
    getSubsystem().then((res) => {
      this.systemList = res.data
    })
    // getMenu().then((res) => {
    //   this.parentData = res.body
    // })
    this.getResourceTree()
    this.fetchData(this.commonPage.pageNum)
    this.addIcon()
  },
  methods: {
    addIcon() {
      // this.resourceDTO.openImg = e.replace(/[\#]/, '')
      this.options.addIconList = svgIcons.map((item) => {
        return item.replace(/[\#]/, '')
      })
      console.log(this.options.addIconList)
      // debugger
    },
    iRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iHeaderRowStyle: function({ row, rowIndex }) {
      return 'height:35px'
    },
    iCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:7px'
    },
    iHeaderCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:7px'
    },
    showmuen() {
      // debugger
      this.showmuenflag = !this.showmuenflag
      // this.Active = 'el-icon-arrow-left'
      // if () {
      //   this.Active = 'el-icon-arrow-right'
      // } else {
      //   this.Active = 'el-icon-arrow-left'
      // }
    },
    getResourceTree() {
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      treeQuery(resourceQuery).then((response) => {
        // this.resourceData = response.data
        this.resourceData = JSON.parse(
          JSON.stringify(this.treetransform(response.data))
        )
        console.log(this.resourceData, '资源数据')
      })
    },

    treetransform(list) {
      // var map = {}; var node; var tree = []; var i
      var tree = []
      // var firstNode = []
      // var secondNode = []
      // 存储一级节点（系统）
      list.map((item) => {
        if (parseInt(item.parentId) === -1 && item.resourceType === 2) {
          tree.push({ label: item.name, id: item.id, children: [] })
        }
      })
      // 存储二级节点（主菜单）
      tree.map((itemParent) => {
        list.map((item) => {
          if (itemParent.id === item.parentId) {
            itemParent.children.push({
              id: item.id,
              label: item.name,
              children: []
            })
          }
        })
      })
      // 存储三级节点（子菜单）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          list.map((item) => {
            if (itemSecondParent.id === item.parentId) {
              itemSecondParent.children.push({
                id: item.id,
                label: item.name,
                children: []
              })
            }
          })
        })
      })
      // 存储四级节点（请求权限）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          itemSecondParent.children.map((itemthirdParent) => {
            list.map((item) => {
              if (itemthirdParent.id === item.parentId) {
                itemthirdParent.children.push({ id: item.id, label: item.name })
              }
            })
          })
        })
      })
      // list.map(item => {
      //   if (parseInt(item.parentId) === 1 && item.resourceType === 0) {
      //     tree.push({ label: item.name, id: item.id, children: [] })
      //   }
      // })
      // 存储二级节点
      // list.map(item => {
      //   tree.map(itemParent => {
      //     if (itemParent.id === item.parentId) {
      //
      //       itemParent.children.push({ id: item.id, label: item.name })
      //     }
      //   })
      // })
      // tree.map(itemParent => {
      //   list.map(item => {
      //     if (itemParent.id === item.parentId) {
      //       itemParent.children.push({ id: item.id, label: item.name })
      //     }
      //   })
      // })
      // console.log(tree)

      // for (i = 0; i < list.length; i++) {
      //   map[list[i].id] = list[i]
      //   list[i].children = []
      // }
      // for (i = 0; i < list.length; i += 1) {
      //   node = list[i]
      //   if (node.parentId !== '-1') {
      //     map[node.parentId].children.push(node)
      //   } else {
      //     tree.push(node)
      //   }
      // }
      return tree

      // let map = {};
      // data.forEach(item => {
      //     if (! map[item.id]) {
      //         map[item.id] = item;
      //     }
      // });

      // data.forEach(item => {
      //     if (item.parentId != -1) {
      //         map[item.parentId].children ? map[item.parentId].children.push(item) : map[item.parentId].children = [item];
      //     }
      // });

      // return data.filter(item => {
      //     return item.parentId == -1
      // })
    },

    transform(list) {
      var map = {}
      var node
      var tree = []
      var i
      for (i = 0; i < list.length; i++) {
        map[list[i].id] = list[i]
        list[i].children = []
      }
      for (i = 0; i < list.length; i += 1) {
        // debugger
        node = list[i]
        if (node.parentId !== '-1') {
          console.log('map:', map)
          map[node.parentId].children.push(node)
          console.log(map[node.parentId], '------------------------------->')
        } else {
          tree.push(node)
        }
      }
      return tree
      // let map = {};
      // data.forEach(item => {
      //     if (! map[item.id]) {
      //         map[item.id] = item;
      //     }
      // });

      // data.forEach(item => {
      //     if (item.parentId != -1) {
      //         map[item.parentId].children ? map[item.parentId].children.push(item) : map[item.parentId].children = [item];
      //     }
      // });

      // return data.filter(item => {
      //     return item.parentId === -1
      // })
    },
    changeSystemList(name) {
      getSubsystem({ name }).then((res) => {
        this.systemList = res.data
      })
    },
    changeParent(name) {},
    handleSizeChange(val) {
      this.commonPage.pageSize = val

      this.fetchData(this.commonPage.pageNum)
      // this.queryOrder(val, this.commonPage.pageNum)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    /**
     * abel.zhan 2022-09-28整理 ，
     * 原来版本调用后端/copy 根据id取得信息 后面版本直接将当前行的内容填写到复制界面所以废弃后端方法
     */
    copyResource(row) {
      this.adddialogVisible = true
      this.resourceDTO = row
      // debugger
      // addTitle
      // row.id
      // copy().then(response => {
      //   this.fetchData(1)
      //   this.$message({
      //     type: 'success',
      //     message: '复制成功!'
      //   })
      // })
      //   .catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '复制失败!'
      //     })
      //   })
      // this.getTree()
    },
    // 修改资源
    updateResource() {
      this.updatedialogVisible = false
      console.log(this.resourceDTO)
      modify(this.resourceDTO)
        .then((response) => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 新增之后重新加载
          this.fetchData(1)
          this.resourceDTO.tenantId = ''
          this.resourceDTO.companyId = ''
          this.resourceDTO.orgId = ''
          this.resourceDTO.name = ''
          this.resourceDTO.code = ''
          this.resourceDTO.orderIndex = ''
          this.resourceDTO.parentId = ''
          this.resourceDTO.api = ''
          this.resourceDTO.url = ''
          this.resourceDTO.method = ''
          this.resourceDTO.openImg = ''
          this.resourceDTO.closeImg = ''
          this.resourceDTO.resourceType = ''
          this.resourceDTO.leaf = ''
          this.resourceDTO.action = ''
          this.resourceDTO.remark = ''
          this.resourceDTO.id = ''
          this.resourceDTO.createdBy = ''
          this.resourceDTO.createdTime = ''
          this.resourceDTO.updatedBy = ''
          this.resourceDTO.updatedTime = ''
          this.resourceDTO.status = ''
          this.resourceDTO.version = ''
          // Just to simulate the time of the request
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        })
      this.getTree()
    },
    // 增加资源
    addResource() {
      this.adddialogVisible = false
      this.resourceDTO.version = '1'
      this.resourceDTO.createdBy = '2'
      this.resourceDTO.tenantId = '1'
      this.resourceDTO.companyId = '1'
      this.resourceDTO.status = '1'
      this.resourceDTO.orgId = '1337376369553833984'
      add(this.resourceDTO)
        .then((response) => {
          // 新增之后重新加载
          this.fetchData(1)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.dataLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.dataLoading = false
        })
      this.getTree()
    },
    // 复制资源
    onBtnCopyClick() {
      const rows = this.$refs.multipleTable.selection
      if (rows == null || rows.length === 0) {
        this.$message.error('选择一条进行拷贝')
        return
      }
      if (rows != null && rows.length > 1) {
        this.$message.error('只能选择一条进行拷贝')
        return
      } else {
        this.copyResource(rows[0])
      }
    },
    // 修改信息展示
    updateFromInfo(row) {
      this.updatedialogVisible = true
      this.resourceDTO.tenantId = ''
      this.resourceDTO.companyId = ''
      this.resourceDTO.orgId = ''
      this.resourceDTO.name = ''
      this.resourceDTO.code = ''
      this.resourceDTO.orderIndex = ''
      this.resourceDTO.parentId = ''
      this.resourceDTO.api = ''
      this.resourceDTO.url = ''
      this.resourceDTO.method = ''
      this.resourceDTO.openImg = ''
      this.resourceDTO.closeImg = ''
      this.resourceDTO.resourceType = ''
      this.resourceDTO.leaf = ''
      this.resourceDTO.action = ''
      this.resourceDTO.remark = ''
      this.resourceDTO.id = ''
      this.resourceDTO.createdBy = ''
      this.resourceDTO.createdTime = ''
      this.resourceDTO.updatedBy = ''
      this.resourceDTO.updatedTime = ''
      this.resourceDTO.status = ''
      this.resourceDTO.version = ''
      queryResourceById(row.id)
        .then((res) => {
          this.resourceDTO = res
          this.nodeData.id = this.resourceDTO.parentId
          this.iconOpen = this.resourceDTO.openImg
          this.iconClose = this.resourceDTO.closeImg
          this.selected = res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 通过名字查询
    queryByName() {
      this.commonPage.total = null
      this.commonPage.pages = null
      this.commonPage.pageNum = 1
      this.fetchData(this.commonPage.pageNum)
    },
    // 批量删除
    batchRemoveResource() {
      const resourceVo = this.$refs.multipleTable.selection
      if (resourceVo == null || resourceVo.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      const resourceDTOS = new Array(resourceVo.length)
      for (let i = 0; i < resourceVo.length; i++) {
        resourceDTOS[i] = {
          id: resourceVo[i].id,
          version: resourceVo[i].version
        }
      }
      if (resourceDTOS.length !== 0) {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            batchRemove(resourceDTOS).then((response) => {
              this.fetchData(1)
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'warning'
        })
      }
      this.getTree()
    },
    // 单个删除
    removeResource(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove(row.id)
            .then((response) => {
              this.fetchData(1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      this.getTree()
    },
    // 处理多选
    // handleSelectionChange(val) {

    // },
    // 关闭弹窗
    handleClose() {
      this.adddialogVisible = false
      this.updatedialogVisible = false
    },
    handleNodeClick(data) {
      // debugger
      this.resourceQuery.id = data.id
      if (data.children !== undefined) {
        if (data.children.length !== 0 && data.label.includes('系统')) {
          this.resourceQuery.level = 1
        }
        if (data.children.length !== 0 && !data.label.includes('系统')) {
          this.resourceQuery.level = 0
        }
      } else {
        this.resourceQuery.level = 2
      }
      // debugger
      // this.resourceQuery.name = data.name
      this.fetchData(1)
      this.resourceQuery = {}
    },
    refreshData() {
      this.fetchData(this.commonPage.pageNum)
    },
    getTree() {
      this.resourceQuery = {}
      this.resourceQuery.pageSize = 1000
      treeQuery(this.resourceQuery).then((response) => {
        this.data = []
        this.treeData = response.data
        this.data = this.transform(this.treeData)
        console.log('这里', this.data)
        // debugger
      })
    },
    fetchData(pageNum) {
      this.dataLoading = true
      this.resourceQuery.total = this.commonPage.total
      this.resourceQuery.pageNum = pageNum
      this.resourceQuery.pageSize = this.commonPage.pageSize
      commonQuery(this.resourceQuery)
        .then((response) => {
          this.tableData = response.data
          console.log(this.tableData)
          // debugger
          const { total, pageNum, pageSize, pages } = response // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          this.commonPage.pages = parseInt(pages)
          // 获取左边的树
          // this.data = this.tableData
          // this.data = this.transform(this.data)
          this.tableData.forEach((item) => {
            const newData = item // this.tableData.indexOf(item)
            if (newData.resourceType === 0) {
              newData.resourceTypeName = '菜单'
            } else newData.resourceTypeName = '按钮'
            if (newData.parentId === -1) newData.parentName = '资源管理'
            this.tableData.splice(this.tableData.indexOf(item), 1, newData)
          })
          this.dataLoading = false
        })
        .catch(() => {
          this.dataLoading = false
        })
    },
    // 切换父节点
    handleCheckChange(nodeData) {
      console.log(nodeData, '子节点')
      this.nodeData = nodeData
      this.resourceDTO.parentId = this.nodeData.id
      // debugger
    },
    iconOpenChange(e) {
      this.resourceDTO.openImg = e
    },
    iconCloseChange(e) {
      this.resourceDTO.closeImg = e
    },
    // 点击隐藏表格事件
    onBtnHideClick() {
      this.hideDialogColumnVisible = true
    },
    hideTableClose(visible) {
      this.hideDialogColumnVisible = visible
    }
  }
}
</script>

<style scoped>
.test {
  border-top: 15px solid;
  margin-left: -27px;
  border-color: rgba(0, 0, 0, 0);
}
.el-form-item .el-input {
  margin-left: -10px;
}
/* .dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
} */
/* .clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
} */
.box-card {
  height: 500px;
}
.treetable {
  cursor: pointer;
}
.i-sty {
  cursor: pointer;
}
.el-icon-search {
  position: absolute;
  top: 5px;
  bottom: 0;
  right: 15px;
  font-size: 30px;
}
</style>

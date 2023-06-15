<template>
  <basedialog
    :title="title"
    :dialogType="dialogType"
    :visible.sync="companydialogVisible"
    @assignCompany="assignCompany"
  >
    <el-table
      ref="companyTable"
      v-loading="listLoading"
      :data="companyData"
      selectable
      highlight-current-row
      height="350"
      style="width: 100%"
    >
      <el-table-column type="selection" />
      <el-table-column label="公司编号" align="center" prop="code" />
      <el-table-column label="公司名称" align="center" prop="name" />
    </el-table>
  </basedialog>
</template>
<script>
import basedialog from './components/base-dialog.vue'
import { commonQuery as companyQuery } from '@/api/org/company'
import { modifyRoleCompany, queryRoleCompany } from '@/api/right/role'
export default {
  name: 'assigncompany',
  components: { basedialog },
  props: {
    roleVo: { type: undefined, required: true, default: [] },
  },
  data() {
    return {
      title: '公司分配',
      dialogType: 'company',
      companydialogVisible: false,
      listLoading: false,
      //角色id列表
      roleIdList: [],
      //公司信息
      companyData: [],
      //公司分配参数
      roleCompanyDTO: {},
    }
  },
  methods: {
    /**
     * 获取所有公司信息
     */
    getCompanySearch() {
      this.companydialogVisible = true
      this.listLoading = true
      companyQuery({})
        .then((res) => {
          this.companyData = res.data
          this.fillCompanyInfo(this.roleVo)
        })
        .catch(() => {
          this.$message.error('公司信息获取失败')
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    /**
     * 公司信息预填入
     * @param roleVo 所选行的信息
     */
    fillCompanyInfo(roleVo) {
      if (roleVo.length === 1) {
        // 获取角色对应的授权公司列表
        queryRoleCompany(roleVo[0].id)
          .then((res) => {
            const roleAuthCompanyIds = res.authCompanyIds
            if (roleAuthCompanyIds) {
              this.$nextTick(() => {
                // 遍历table的数据并进行判断
                this.companyData.forEach((company) => {
                  // 如果某一行的company_id在该角色对应的授权公司列表中，将其勾选
                  if (roleAuthCompanyIds.indexOf(company.id) > -1) {
                    this.$refs.companyTable.toggleRowSelection(company, true)
                  }
                })
              })
            }
          })
          .catch(() => {
            this.$message.error('角色所属公司信息获取失败')
          })
      }
    },
    /**
     * 公司分配
     */
    assignCompany() {
      this.roleCompanyDTO.roleIds = this.roleVo.map((role) => role.id)
      this.roleCompanyDTO.authCompanyIds =
        this.$refs.companyTable.selection.map((company) => company.id)
      modifyRoleCompany(this.roleCompanyDTO)
        .then((res) => {
          if (res) {
            this.companydialogVisible = false
            this.$message.success('角色所属公司分配成功')
          } else {
            this.$message.error('角色所属公司信息分配失败')
          }
        })
        .catch(() => {
          this.$message.error('角色所属公司信息分配失败')
        })
        .finally(() => {
          this.roleCompanyDTO.roleIds = []
          this.roleCompanyDTO.authCompanyIds = []
        })
    },
  },
}
</script>

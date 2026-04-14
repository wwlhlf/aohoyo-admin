<script setup lang="ts">
defineOptions({ name: 'User' })
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useResponsive } from '@/composables/useResponsive'
import { useTable } from '@/composables/useTable'
import ResponsiveTable from '@/components/ResponsiveTable/index.vue'
import ResponsiveDialog from '@/components/ResponsiveDialog/index.vue'
import ResponsiveSearch from '@/components/ResponsiveSearch/index.vue'
import { getUserList } from '@/api/modules/system'

const { paginationLayout, paginationSmall } = useResponsive()

// 表格数据（useTable 管理）
const {
  loading,
  data: tableData,
  pagination,
  handleSearch,
  refresh
} = useTable({
  fetchFn: params => getUserList(params as { page: number; pageSize: number; keyword?: string }),
  defaultParams: { keyword: '' }
})

// 搜索参数
const searchKeyword = ref('')

const onSearch = () => {
  handleSearch({ keyword: searchKeyword.value })
}

const onReset = () => {
  searchKeyword.value = ''
  handleSearch({ keyword: '' })
}

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: 0,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
  roles: [] as string[]
})

// 角色选项
const roleOptions = [
  { label: '超级管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '编辑员', value: 'editor' }
]

// 表单规则
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: typeof formData) => {
  dialogTitle.value = '编辑用户'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: typeof formData) => {
  ElMessageBox.confirm(`确定要删除用户「${row.nickname}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功')
      refresh()
    })
    .catch(() => {})
}

// 提交
const submitting = ref(false)
const handleSubmit = async () => {
  if (!formRef.value || submitting.value) return
  submitting.value = true
  try {
    await formRef.value.validate()
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    refresh()
  } catch {
    // 验证失败
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.id = 0
  formData.username = ''
  formData.nickname = ''
  formData.email = ''
  formData.phone = ''
  formData.status = 1
  formData.roles = []
}

// 状态切换
const handleStatusChange = (row: typeof formData) => {
  const text = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`已${text}用户「${row.nickname}」`)
}
</script>

<template>
  <div class="page-container">
    <el-card>
      <!-- 搜索栏 -->
      <template #header>
        <ResponsiveSearch>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名/昵称"
            style="width: 200px"
            clearable
            @keyup.enter="onSearch"
          />
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
          <template #actions>
            <el-button v-permission="'user:create'" type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增用户
            </el-button>
          </template>
        </ResponsiveSearch>
      </template>

      <!-- 表格 -->
      <ResponsiveTable min-width="900px">
        <el-table v-loading="loading" :data="tableData" stripe border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="nickname" label="昵称" width="120" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column label="角色" width="150">
            <template #default="{ row }">
              <el-tag
                v-for="role in row.roles"
                :key="role"
                size="small"
                class="mr-1"
                type="primary"
                effect="dark"
              >
                {{ role }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="170" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button v-permission="'user:edit'" size="small" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                v-permission="'user:delete'"
                type="danger"
                size="small"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </ResponsiveTable>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          :layout="paginationLayout"
          :small="paginationSmall"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <ResponsiveDialog v-model="dialogVisible" :title="dialogTitle" desktop-width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="formData.roles" multiple placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </ResponsiveDialog>
  </div>
</template>

<style scoped>
.mr-1 {
  margin-right: 4px;
}
</style>

<script setup lang="ts">
defineOptions({ name: 'MenuManage' })
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ResponsiveTable from '@/components/ResponsiveTable/index.vue'
import ResponsiveDialog from '@/components/ResponsiveDialog/index.vue'

// 所有 Element Plus 图标名（来自 @iconify-json/ep）
import epIcons from '@iconify-json/ep/icons.json'
const iconList = Object.keys(epIcons.icons)

// 表格数据
const tableData = ref([
  {
    id: 1,
    parentId: 0,
    name: '首页',
    path: '/dashboard',
    icon: 'HomeFilled',
    sort: 1,
    status: 1,
    type: 'dir',
    children: []
  },
  {
    id: 2,
    parentId: 0,
    name: '系统管理',
    path: '/system',
    icon: 'Setting',
    sort: 2,
    status: 1,
    type: 'dir',
    children: [
      {
        id: 3,
        parentId: 2,
        name: '用户管理',
        path: '/system/user',
        icon: 'User',
        sort: 1,
        status: 1,
        type: 'menu',
        children: []
      },
      {
        id: 4,
        parentId: 2,
        name: '角色管理',
        path: '/system/role',
        icon: 'UserFilled',
        sort: 2,
        status: 1,
        type: 'menu',
        children: []
      },
      {
        id: 5,
        parentId: 2,
        name: '菜单管理',
        path: '/system/menu',
        icon: 'Menu',
        sort: 3,
        status: 1,
        type: 'menu',
        children: []
      }
    ]
  },
  {
    id: 6,
    parentId: 0,
    name: '示例页面',
    path: '/example',
    icon: 'Document',
    sort: 3,
    status: 1,
    type: 'dir',
    children: [
      {
        id: 7,
        parentId: 6,
        name: '表格示例',
        path: '/example/table',
        icon: 'Grid',
        sort: 1,
        status: 1,
        type: 'menu',
        children: []
      },
      {
        id: 8,
        parentId: 6,
        name: '表单示例',
        path: '/example/form',
        icon: 'EditPen',
        sort: 2,
        status: 1,
        type: 'menu',
        children: []
      }
    ]
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const formRef = ref<FormInstance>()
const iconPickerVisible = ref(false)
const iconSearch = ref('')
const submitting = ref(false)

const menuTypes = [
  { label: '目录', value: 'dir' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

// 父级菜单选项
const parentOptions = computed(() => {
  const result = [{ id: 0, name: '顶级菜单' }]
  const walk = (list: typeof tableData.value, prefix = '') => {
    for (const item of list) {
      result.push({ id: item.id, name: prefix + item.name })
      if (item.children?.length) walk(item.children, prefix + '  ')
    }
  }
  walk(tableData.value)
  return result
})

// 搜索过滤图标（分页，避免一次渲染 300+ 个）
const PAGE_SIZE = 60
const filteredIcons = computed(() => {
  if (!iconSearch.value) return iconList
  return iconList.filter(n => n.toLowerCase().includes(iconSearch.value.toLowerCase()))
})
const iconPage = ref(0)
const visibleIcons = computed(() => {
  const end = (iconPage.value + 1) * PAGE_SIZE
  return filteredIcons.value.slice(0, end)
})
const hasMore = computed(() => visibleIcons.value.length < filteredIcons.value.length)
const loadMoreIcons = () => {
  iconPage.value++
}

const formData = reactive({
  id: 0,
  parentId: 0,
  name: '',
  path: '',
  icon: '',
  sort: 1,
  status: 1,
  type: 'menu'
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }]
}

const handleAdd = (parentId = 0) => {
  dialogTitle.value = '新增菜单'
  Object.assign(formData, {
    id: 0,
    parentId,
    name: '',
    path: '',
    icon: '',
    sort: 1,
    status: 1,
    type: 'menu'
  })
  iconPickerVisible.value = false
  iconPage.value = 0
  dialogVisible.value = true
}

const handleEdit = (row: typeof formData) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  iconPickerVisible.value = false
  iconPage.value = 0
  dialogVisible.value = true
}

const handleDelete = (row: typeof formData) => {
  ElMessageBox.confirm(`确定要删除菜单「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => ElMessage.success('删除成功'))
    .catch(() => {
      /* 用户取消删除 */
    })
}

const handleSubmit = async () => {
  if (!formRef.value || submitting.value) return
  submitting.value = true
  try {
    await formRef.value.validate()
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
  } catch {
    /* 表单验证失败 */
  } finally {
    submitting.value = false
  }
}

const handleSelectIcon = (icon: string) => {
  formData.icon = icon
  iconPickerVisible.value = false
  iconSearch.value = ''
  iconPage.value = 0
}

const getTypeTag = (type: string) => {
  if (type === 'dir') return { text: '目录', type: 'primary' as const }
  if (type === 'menu') return { text: '菜单', type: 'success' as const }
  return { text: '按钮', type: 'warning' as const }
}
</script>

<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd()">
            <el-icon><Plus /></el-icon>
            新增菜单
          </el-button>
        </div>
      </template>

      <ResponsiveTable min-width="860px">
        <el-table :data="tableData" row-key="id" border default-expand-all style="width: 100%">
          <el-table-column prop="name" label="菜单名称" min-width="180" />
          <el-table-column label="类型" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="getTypeTag(row.type).type" size="small" effect="dark">
                {{ getTypeTag(row.type).text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路由路径" min-width="180" />
          <el-table-column prop="sort" label="排序" width="70" align="center" />
          <el-table-column label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small" effect="dark">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.type !== 'button'"
                type="primary"
                size="small"
                link
                @click="handleAdd(row.id)"
              >
                新增
              </el-button>
              <el-button size="small" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </ResponsiveTable>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <ResponsiveDialog v-model="dialogVisible" :title="dialogTitle" desktop-width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="上级菜单">
          <el-select v-model="formData.parentId" placeholder="请选择上级菜单" style="width: 100%">
            <el-option
              v-for="item in parentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in menuTypes" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 'button'" label="路由路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 'button'" label="图标">
          <div class="icon-picker-trigger" @click="iconPickerVisible = !iconPickerVisible">
            <span v-if="formData.icon" class="selected-icon">
              <Icon :icon="`ep:${formData.icon}`" />
              {{ formData.icon }}
            </span>
            <span v-else class="placeholder">点击选择图标</span>
            <el-icon class="arrow"><ArrowDown /></el-icon>
          </div>
          <div v-show="iconPickerVisible" class="icon-picker-panel">
            <el-input
              v-model="iconSearch"
              placeholder="搜索图标..."
              size="small"
              class="icon-search"
            />
            <div class="icon-grid">
              <div
                v-for="icon in visibleIcons"
                :key="icon"
                class="icon-item"
                :class="{ active: formData.icon === icon }"
                @click="handleSelectIcon(icon)"
              >
                <Icon :icon="`ep:${icon}`" :width="18" :height="18" />
              </div>
            </div>
            <div v-if="hasMore" class="load-more" @click="loadMoreIcons">
              加载更多 ({{ visibleIcons.length }}/{{ filteredIcons.length }})
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="1" :max="999" />
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: border-color 0.2s;
}
.icon-picker-trigger:hover {
  border-color: var(--el-color-primary);
}
.placeholder {
  color: var(--el-text-color-placeholder);
  font-size: 14px;
}
.selected-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.arrow {
  color: var(--el-text-color-placeholder);
}
.icon-picker-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}
.icon-search {
  margin-bottom: 8px;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}
.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.icon-item:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
.icon-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.load-more {
  text-align: center;
  padding: 8px;
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 13px;
}
.load-more:hover {
  opacity: 0.8;
}
</style>

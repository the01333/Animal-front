<template>
  <div class="admin-user-list">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="用户名/邮箱/手机" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryForm.role" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div v-if="activeFilters.length" class="active-filters">
        <span class="label">已选择：</span>
        <el-tag v-for="filter in activeFilters" :key="filter.key" closable type="info" size="small"
          @close="handleRemoveFilter(filter.key)">
          {{ filter.label }}：{{ filter.value }}
        </el-tag>
        <el-button text type="primary" size="small" @click="handleReset">清空筛选</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40"
              :src="processImageUrl(row.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'">
              {{ row.username?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createTime, 'YYYY-MM-DD') }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" :disabled="row.role === 'ADMIN'" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination :current-page="queryForm.current" :page-size="queryForm.size" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" background @size-change="fetchList"
          @current-change="fetchList" />
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <transition name="fade-zoom">
      <el-dialog v-model="editVisible" title="用户详情" width="780px" destroy-on-close :close-on-click-modal="false"
        :modal-class="'edit-dialog-overlay'" :custom-class="'edit-dialog-card'">
        <div class="edit-layout">
          <div class="user-info-card">
            <div class="user-info-header">
              <el-avatar :size="60"
                :src="processImageUrl(editForm.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'">
                {{ editForm.username?.charAt(0) }}
              </el-avatar>
              <div class="user-text">
                <div class="name-line">
                  <span class="username">{{ editForm.username || '-' }}</span>
                  <el-tag :type="editForm.status === 1 ? 'success' : 'danger'" effect="plain" size="small">
                    {{ editForm.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </div>
                <div class="sub-text">{{ editForm.nickname || '暂无昵称' }}</div>
              </div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">手机号</span>
                <span class="value muted">{{ editForm.phone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱</span>
                <span class="value muted">{{ editForm.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">角色</span>
                <el-tag class="user-role-chip" :type="getRoleType(editForm.role || '')" size="small">
                  {{ getRoleText(editForm.role || '') || '未分配' }}
                </el-tag>
              </div>
            </div>
            <div class="hint muted">基础资料仅供查看，如需修改请引导用户自行完善。</div>
          </div>

          <div class="action-card">
            <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="90px" class="edit-form">
              <el-form-item label="角色" prop="role" class="role-narrow">
                <el-select v-model="editForm.role" placeholder="选择角色">
                  <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="启用状态" prop="status">
                <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-form>
            <div class="action-footer">
              <el-button @click="handleCancel">取 消</el-button>
              <el-button type="primary" :loading="saving" @click="handleSubmit">保 存</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getUserList, deleteUser, updateUserStatus, updateAdminUser } from '@/api/user'
import type { User } from '@/types'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { formatDate } from '@/utils/format'
import { Search, RefreshLeft, Edit, Delete } from '@element-plus/icons-vue'

const loading = ref(false)
const tableData = ref<User[]>([])
const total = ref(0)

const queryForm = reactive({
  keyword: '',
  role: '',
  current: 1,
  size: 10
})

const roleOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '超级管理员', value: 'super_admin' }
]

const activeFilters = computed(() => {
  const filters: Array<{ key: 'keyword' | 'role'; label: string; value: string }> = []
  if (queryForm.keyword) {
    filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword })
  }
  if (queryForm.role) {
    filters.push({ key: 'role', label: '角色', value: getRoleText(queryForm.role) })
  }
  return filters
})

// 处理图片URL（移除@前缀，处理IP地址替换）
function processImageUrl(url: string | undefined): string {
  if (!url) return ''

  // 移除@前缀
  if (url.startsWith('@')) {
    url = url.substring(1)
  }

  // 将IP地址替换为localhost
  url = url.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000')

  // 如果是相对路径，添加MinIO前缀
  if (!url.startsWith('http')) {
    url = `http://localhost:9000/animal-adopt${url.startsWith('/') ? '' : '/'}${url}`
  }

  return url
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getUserList(queryForm)
    tableData.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryForm, { keyword: '', role: '', current: 1, size: 10 })
  fetchList()
}

function handleRemoveFilter(key: 'keyword' | 'role') {
  if (key === 'role') {
    queryForm.role = ''
  } else {
    queryForm.keyword = ''
  }
  fetchList()
}

function handleEdit(row: User) {
  editVisible.value = true
  saving.value = false
  Object.assign(editForm, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    phone: row.phone,
    email: row.email,
    avatar: row.avatar,
    role: row.role,
    status: row.status
  })
}

async function handleStatusChange(row: User) {
  try {
    await updateUserStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
  }
}

function handleDelete(row: User) {
  ElMessageBox.confirm(`确定要删除用户"${row.username}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => { })
}

function getRoleType(role: string) {
  const map: Record<string, any> = {
    super_admin: 'danger',
    admin: 'warning',
    application_auditor: 'info',
    housekeeper: 'success',
    user: 'success',
    ADMIN: 'warning',
    USER: 'success'
  }
  return map[role] || ''
}

function getRoleText(role: string) {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    application_auditor: '审核员',
    housekeeper: '管家',
    user: '用户',
    ADMIN: '管理员',
    USER: '用户'
  }
  return map[role] || role
}

const editVisible = ref(false)
const editFormRef = ref<FormInstance>()
const saving = ref(false)
const editForm = reactive<Partial<User> & { status: number }>({
  id: 0,
  username: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  role: '',
  status: 1
})

const editRules: FormRules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

function handleCancel() {
  editVisible.value = false
}

async function handleSubmit() {
  if (!editFormRef.value) return
  await editFormRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      saving.value = true
      await updateAdminUser(editForm.id as number, {
        role: editForm.role || undefined,
        status: editForm.status
      })
      ElMessage.success('保存成功')
      editVisible.value = false
      fetchList()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      saving.value = false
    }
  })
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.admin-user-list {
  position: relative;
}

.edit-dialog-overlay {
  backdrop-filter: blur(6px);
  background-color: rgba(8, 15, 26, 0.35);
}

.edit-dialog-card {
  border-radius: 18px;
  box-shadow: 0 16px 50px rgba(15, 23, 42, 0.28);
  overflow: hidden;
}

.edit-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #1f2937;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}

.user-info-card {
  background: #f9fbff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.user-text .name-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
}

.user-text .sub-text {
  color: #6b7280;
  margin-top: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  border: 1px dashed #e5e7eb;
}

.info-item .label {
  color: #9ca3af;
  font-size: 12px;
  margin-bottom: 4px;
}

.info-item .value {
  font-weight: 600;
  color: #111827;
}

.muted {
  color: #6b7280;
}

.hint {
  margin-top: 38px;
  font-size: 13px;
}

.action-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.action-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.info-item .user-role-chip {
  display: inline-flex !important;
  align-self: flex-start;
  width: auto !important;
  height: 26px !important;
  padding: 0 17px !important;
  font-size: 12px;
  white-space: nowrap;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.2s ease, opacity 0.2s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>

<style scoped lang="scss">
.admin-user-list {
  .search-form {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

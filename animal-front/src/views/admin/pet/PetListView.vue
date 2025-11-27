<template>
  <div class="admin-pet-list">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="queryForm.name"
            placeholder="宠物名称或品种"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.category" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="(label, value) in dictData.petCategories" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.adoptionStatus" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="(label, value) in dictData.adoptionStatuses" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div v-if="activeFilters.length" class="active-filters">
        <span class="label">已选择：</span>
        <el-tag
          v-for="filter in activeFilters"
          :key="filter.key"
          closable
          type="info"
          size="small"
          @close="handleRemoveFilter(filter.key)"
        >
          {{ filter.label }}：{{ filter.value }}
        </el-tag>
        <el-button text type="primary" size="small" @click="handleReset">清空筛选</el-button>
      </div>

      <!-- 操作按钮 -->
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">添加宠物</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="getFirstImage(row) || '/placeholder.png'"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="getImageList(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryText(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="breed" label="品种" min-width="120" />
        <el-table-column label="性别" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.gender === 1" type="primary">公</el-tag>
            <el-tag v-else-if="row.gender === 2" type="danger">母</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80">
          <template #default="{ row }"> {{ row.age }}岁 </template>
        </el-table-column>
        <el-table-column label="健康状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getHealthStatusType(row.healthStatus)">
              {{ getHealthStatusText(row.healthStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="领养状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getAdoptionStatusType(row.adoptionStatus)">
              {{ getAdoptionStatusText(row.adoptionStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="queryForm.current"
          :page-size="queryForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPetList, deletePet } from '@/api/pet'
import { getAllDictData } from '@/api/dict'
import type { Pet } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import { Search, RefreshLeft, Plus, Edit, Delete } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const tableData = ref<Pet[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 字典数据
const dictData = ref({
  petCategories: {} as Record<string, string>,
  adoptionStatuses: {} as Record<string, string>
})

const queryForm = reactive({
  name: '',
  category: '',
  adoptionStatus: '',
  current: 1,
  size: 10
})

const activeFilters = computed(() => {
  const filters: Array<{ key: 'name' | 'category' | 'adoptionStatus'; label: string; value: string }> = []
  if (queryForm.name) {
    filters.push({ key: 'name', label: '关键词', value: queryForm.name })
  }
  if (queryForm.category) {
    filters.push({ key: 'category', label: '类型', value: getCategoryText(queryForm.category) })
  }
  if (queryForm.adoptionStatus) {
    filters.push({ key: 'adoptionStatus', label: '状态', value: getAdoptionStatusText(queryForm.adoptionStatus) })
  }
  return filters
})

// 加载字典数据
async function loadDictData() {
  try {
    const res = await getAllDictData()
    if (res.code === 200) {
      dictData.value = res.data
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
  }
}

// 获取列表
async function fetchList() {
  loading.value = true
  try {
    const res = await getPetList(queryForm)
    tableData.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error('获取宠物列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  queryForm.current = 1
  fetchList()
}

// 重置
function handleReset() {
  Object.assign(queryForm, {
    name: '',
    category: '',
    adoptionStatus: '',
    current: 1,
    size: 10
  })
  fetchList()
}

// 添加
function handleAdd() {
  router.push('/admin/pet/add')
}

// 编辑
function handleEdit(row: Pet) {
  router.push(`/admin/pet/edit/${row.id}`)
}

// 删除
function handleDelete(row: Pet) {
  ElMessageBox.confirm(`确定要删除宠物"${row.name}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deletePet(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 批量删除
function handleBatchDelete() {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await Promise.all(selectedIds.value.map((id) => deletePet(id)))
        ElMessage.success('删除成功')
        fetchList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 选择变化
function handleSelectionChange(selection: Pet[]) {
  selectedIds.value = selection.map((item) => item.id)
}

// 分页
function handleSizeChange(size: number) {
  queryForm.size = size
  queryForm.current = 1
  fetchList()
}

function handleCurrentChange(page: number) {
  queryForm.current = page
  fetchList()
}

// 辅助函数
// 获取第一张图片
function getFirstImage(row: Pet): string {
  const images = getImageList(row)
  return images.length > 0 ? images[0] : ''
}

// 获取图片列表
function getImageList(row: Pet): string[] {
  if (!row.images) return []
  
  // 如果是字符串，尝试解析为JSON
  if (typeof row.images === 'string') {
    try {
      const trimmed = row.images.trim()
      // 检查是否是JSON格式
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map(img => processImageUrl(img))
        }
      }
    } catch (e) {
      console.warn('解析图片JSON失败:', e)
    }
    // 如果不是JSON，当作单个URL处理
    return [processImageUrl(row.images)]
  }
  
  // 如果已经是数组
  if (Array.isArray(row.images)) {
    return row.images.map(img => processImageUrl(img))
  }
  
  return []
}

// 处理图片URL（移除@前缀，处理相对路径）
function processImageUrl(url: string): string {
  if (!url) return ''
  
  // 移除@前缀
  if (url.startsWith('@')) {
    url = url.substring(1)
  }
  
  // 如果是相对路径，添加MinIO前缀
  if (!url.startsWith('http')) {
    url = `http://localhost:9000/animal-adopt${url.startsWith('/') ? '' : '/'}${url}`
  }
  
  return url
}

function getCategoryText(category: string) {
  const map: Record<string, string> = {
    cat: '猫咪',
    dog: '狗狗',
    rabbit: '兔子',
    bird: '鸟类',
    other: '其他'
  }
  return map[category] || category
}

function getHealthStatusType(status: string) {
  const map: Record<string, any> = {
    healthy: 'success',
    sick: 'danger',
    injured: 'danger',
    recovering: 'warning'
  }
  return map[status] || ''
}

function getHealthStatusText(status: string) {
  const map: Record<string, string> = {
    healthy: '健康',
    sick: '生病',
    injured: '受伤',
    recovering: '康复中'
  }
  return map[status] || status
}

function getAdoptionStatusType(status: string) {
  const map: Record<string, any> = {
    available: 'success',
    pending: 'warning',
    adopted: 'info'
  }
  return map[status] || ''
}

function getAdoptionStatusText(status: string) {
  const map: Record<string, string> = {
    available: '可领养',
    pending: '待审核',
    adopted: '已领养'
  }
  return map[status] || status
}

onMounted(() => {
  loadDictData()
  fetchList()
})
</script>

<style scoped lang="scss">
.admin-pet-list {
  .search-form {
    margin-bottom: 20px;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>


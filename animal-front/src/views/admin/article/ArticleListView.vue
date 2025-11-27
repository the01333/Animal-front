<template>
  <div class="admin-article-list">
    <el-card shadow="never">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="标题" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryForm.category" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option
              v-for="option in categoryOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
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

      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">发布文章</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="80">
          <template #default="{ row }">{{ row.serialNumber }}</template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryText(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="viewCount" label="浏览量" width="100" />
        <el-table-column prop="likeCount" label="点赞" width="90" />
        <el-table-column prop="favoriteCount" label="收藏" width="90" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="queryForm.current"
          :page-size="queryForm.size"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, deleteArticle, getArticleCategories } from '@/api/article'
import type { Article, ArticleCategoryOption } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import { Search, RefreshLeft, Plus, Edit, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const tableData = ref<Array<Article & { serialNumber: number }>>([])
const total = ref(0)
const categoryOptions = ref<ArticleCategoryOption[]>([])

const queryForm = reactive({
  keyword: '',
  category: '',
  current: 1,
  size: 10
})

const categoryMap = computed<Record<string, string>>(() => {
  return categoryOptions.value.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {} as Record<string, string>)
})

const activeFilters = computed(() => {
  const filters: Array<{ key: 'keyword' | 'category'; label: string; value: string }> = []
  if (queryForm.keyword) {
    filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword })
  }
  if (queryForm.category) {
    filters.push({ key: 'category', label: '分类', value: getCategoryText(queryForm.category) })
  }
  return filters
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getArticleList(queryForm)
    tableData.value = res.data.records.map((item, index) => ({
      ...item,
      serialNumber: (queryForm.current - 1) * queryForm.size + index + 1
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryForm, { keyword: '', category: '', current: 1, size: 10 })
  fetchList()
}

function handleRemoveFilter(key: 'keyword' | 'category') {
  if (key === 'category') {
    queryForm.category = ''
  } else {
    queryForm.keyword = ''
  }
  queryForm.current = 1
  fetchList()
}

function handlePageChange(page: number) {
  queryForm.current = page
  fetchList()
}

function handleSizeChange(size: number) {
  queryForm.size = size
  queryForm.current = 1
  fetchList()
}

function handleAdd() {
  router.push('/admin/article/add')
}

function handleEdit(row: Article) {
  router.push({
    path: `/admin/article/edit/${row.id}`,
    query: { category: row.category }
  })
}

function handleDelete(row: Article) {
  ElMessageBox.confirm(`确定要删除文章"${row.title}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteArticle(row.category, row.id!)
        ElMessage.success('删除成功')
        fetchList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

function getCategoryText(category: string) {
  return categoryMap.value[category] || category
}

onMounted(() => {
  Promise.all([fetchList(), loadCategories()])
})

async function loadCategories() {
  try {
    const res = await getArticleCategories()
    categoryOptions.value = res.data || []
  } catch (error) {
    categoryOptions.value = [
      { value: 'GUIDE', label: '领养指南' },
      { value: 'STORY', label: '领养故事' }
    ]
    console.warn('获取文章分类失败，使用默认分类', error)
  }
}
</script>

<style scoped lang="scss">
.admin-article-list {
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


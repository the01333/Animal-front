<template>
  <div class="guide-list-container">
    <h1>领养指南</h1>

    <div class="guide-categories">
      <div v-for="category in categories" :key="category.id" class="category-item"
        :class="{ active: activeCategory === category.id }" @click="handleCategoryChange(category.id)">
        {{ category.name }}
      </div>
    </div>

    <div class="guides-grid">
      <div v-for="guide in guides" :key="guide.id" class="guide-card" @click="viewGuide(guide.id!)">
        <div class="guide-image">
          <img :src="guide.coverImage || defaultImage" :alt="guide.title" />
        </div>
        <div class="guide-content">
          <h3>{{ guide.title }}</h3>
          <p>{{ guide.summary }}</p>
          <div class="guide-meta">
            <span class="meta-item">{{ guide.guideCategory || '通用' }}</span>
            <span class="meta-item">{{ guide.publishDate }}</span>
            <span class="meta-item">阅读: {{ guide.viewCount ?? 0 }}</span>
            <br />
            <span class="meta-item">❤ {{ guide.likeCount ?? 0 }}</span>
            <span class="meta-item">★ {{ guide.favoriteCount ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="totalItems" :page-size="itemsPerPage"
        :current-page="currentPage" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { getGuideList, getGuideCategories } from '@/api/guide'
import type { Article } from '@/types'
import { ElMessage } from 'element-plus'

// 指南分类
const categories = ref<{ id: string; name: string }[]>([
  { id: 'all', name: '全部' }
])

// 激活的分类
const activeCategory = ref('all')

// 监听分类变化，重置分页
const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1

  loadGuides()
}

// 分页数据
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalItems = ref(0)

// 默认图片
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 指南数据
const guides = ref<Article[]>([])
const loading = ref(false)

// 路由
const router = useRouter()

const buildGuideKeyword = () => {
  const categoryName = categories.value.find(c => c.id === activeCategory.value)?.name
  return activeCategory.value !== 'all' ? categoryName : ''
}

// 加载指南分类
const loadCategories = async () => {
  try {
    const response = await getGuideCategories()
    const categoryList = response.data || []
    // 添加分类到列表（保留"全部"）
    categories.value = [
      { id: 'all', name: '全部' },
      ...categoryList.map((cat, index) => ({
        id: `cat_${index}`,
        name: cat
      }))
    ]
  } catch (error) {
    console.error('加载指南分类失败:', error)
  }
}

// 加载指南列表
const loadGuides = async () => {
  loading.value = true
  try {
    const keywords = []
    const categoryKeyword = buildGuideKeyword()
    if (categoryKeyword) keywords.push(categoryKeyword)
    const response = await getGuideList({
      current: currentPage.value,
      size: itemsPerPage.value,
      keyword: keywords.join(' ').trim() || undefined
    })
    guides.value = response.data?.records || []
    totalItems.value = response.data?.total || 0
  } catch (error) {
    console.error('加载指南列表失败:', error)
    ElMessage.error('加载指南列表失败')
  } finally {
    loading.value = false
  }
}

// 查看指南详情
const viewGuide = (id: number) => {
  router.push(`/guide/${id}`)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadGuides()
}

const initUserInfo = () => {
  if (currentUserId.value) return
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      currentUserId.value = user.id || user.userId
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
}

onMounted(() => {
  initUserInfo()
  loadCategories()
  loadGuides()
})

onActivated(() => {
  loadGuides()
})
</script>

<style scoped>
.guide-list-container {
  padding: 1rem 0;
}

.guide-list-container h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.guide-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.category-item {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-item:hover {
  background-color: #e0e0e0;
}

.category-item.active {
  background-color: #42b983;
  color: white;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.guide-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background-color: white;
}

.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.guide-image {
  height: 200px;
  overflow: hidden;
}

.guide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guide-content {
  padding: 1rem;
}

.guide-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.guide-content p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-item {
  background-color: #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-pagination:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #359c6d;
}

.page-info {
  color: #666;
}

@media (max-width: 768px) {
  .guides-grid {
    grid-template-columns: 1fr;
  }
}
</style>
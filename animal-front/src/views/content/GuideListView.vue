<template>
  <div class="guide-list-container">
    <h1>领养指南</h1>
    
    <div class="guide-categories">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: activeCategory === category.id }"
        @click="handleCategoryChange(category.id)"
      >
        {{ category.name }}
      </div>
    </div>
    
    <div class="guides-grid">
      <div 
        v-for="guide in filteredGuides" 
        :key="guide.id" 
        class="guide-card"
        @click="viewGuide(guide.id)"
      >
        <div class="guide-image">
          <img :src="guide.image || defaultImage" :alt="guide.title" />
        </div>
        <div class="guide-content">
          <h3>{{ guide.title }}</h3>
          <p>{{ guide.excerpt }}</p>
          <div class="guide-meta">
            <span class="meta-item">{{ guide.category }}</span>
            <span class="meta-item">{{ guide.publishDate }}</span>
            <span class="meta-item">阅读: {{ guide.views }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="btn-pagination"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="btn-pagination"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllGuides, type GuideVO } from '@/api/guide'
import { ElMessage } from 'element-plus'

// 指南分类
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'preparation', name: '领养准备' },
  { id: 'care', name: '日常护理' },
  { id: 'training', name: '训练教育' },
  { id: 'health', name: '健康管理' },
  { id: 'behavior', name: '行为问题' }
])

// 激活的分类
const activeCategory = ref('all')

// 监听分类变化，重置分页
const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1
}

// 分页数据
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalItems = ref(0)

// 默认图片
const defaultImage = 'https://via.placeholder.com/300x200?text=指南'

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 指南数据
const guides = ref<GuideVO[]>([])

// 路由
const router = useRouter()

// 加载指南列表
const loadGuides = async () => {
  try {
    const response = await getAllGuides()
    guides.value = response.data as GuideVO[]
    totalItems.value = guides.value.length
  } catch (error) {
    console.error('加载指南列表失败:', error)
    ElMessage.error('加载指南列表失败')
  }
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value)
})

// 过滤后的指南列表
const filteredGuides = computed(() => {
  let result = guides.value
  
  // 分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(guide => 
      guide.category === categories.value.find(c => c.id === activeCategory.value)?.name
    )
  }
  
  // 更新总项目数
  totalItems.value = result.length
  
  // 分页处理
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return result.slice(start, end)
})

// 查看指南详情
const viewGuide = (id: number) => {
  router.push(`/guide/${id}`)
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  // 从localStorage获取当前用户ID
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      currentUserId.value = user.id || user.userId
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
  
  // 加载指南列表
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
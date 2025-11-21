<template>
  <div class="story-list-container">
    <h1>领养故事</h1>
    <p class="subtitle">每一只被领养的宠物都有一个温暖的故事</p>
    
    <div class="stories-filter">
      <div class="filter-group">
        <label for="category">分类:</label>
        <select id="category" v-model="filters.category">
          <option value="">全部</option>
          <option value="success">成功领养</option>
          <option value="reunion">失散重聚</option>
          <option value="rescue">救助故事</option>
        </select>
      </div>
      
      <div class="filter-group">
        <input 
          type="text" 
          v-model="filters.keyword" 
          placeholder="搜索故事标题或内容..." 
          class="search-input"
        />
      </div>
      
      <button @click="resetFilters" class="btn-reset">重置</button>
    </div>
    
    <div class="stories-grid">
      <div 
        v-for="story in filteredStories" 
        :key="story.id" 
        class="story-card"
      >
        <div class="story-image">
          <img :src="story.image || defaultImage" :alt="story.title" />
        </div>
        <div class="story-content">
          <div class="story-tags">
            <span 
              v-for="tag in story.tags" 
              :key="tag" 
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <h3>{{ story.title }}</h3>
          <p class="story-excerpt">{{ story.excerpt }}</p>
          <div class="story-meta">
            <span class="meta-item">{{ story.author }}</span>
            <span class="meta-item">{{ story.publishDate }}</span>
            <span class="meta-item">❤ {{ story.likes }}</span>
          </div>
          <router-link :to="`/story/${story.id}`" class="btn-read-more">
            阅读全文
          </router-link>
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
import { getAllStories, type StoryVO } from '@/api/story'
import { ElMessage } from 'element-plus'

// 过滤条件
const filters = ref({
  category: '',
  keyword: ''
})

// 分页数据
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalItems = ref(0)

// 默认图片
const defaultImage = 'https://via.placeholder.com/300x200?text=故事'

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 故事数据
const stories = ref<StoryVO[]>([])

// 加载故事列表
const loadStories = async () => {
  try {
    const response = await getAllStories()
    stories.value = response.data as StoryVO[]
    totalItems.value = stories.value.length
  } catch (error) {
    console.error('加载故事列表失败:', error)
    ElMessage.error('加载故事列表失败')
  }
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value)
})

// 过滤后的故事列表
const filteredStories = computed(() => {
  let result = stories.value
  
  // 分类过滤
  if (filters.value.category) {
    result = result.filter(story => 
      story.tags.includes(filters.value.category === 'success' ? '成功领养' :
                         filters.value.category === 'reunion' ? '失散重聚' :
                         filters.value.category === 'rescue' ? '救助故事' : '')
    )
  }
  
  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(story => 
      story.title.toLowerCase().includes(keyword) || 
      story.excerpt.toLowerCase().includes(keyword)
    )
  }
  
  // 更新总项目数
  totalItems.value = result.length
  
  // 分页处理
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return result.slice(start, end)
})

// 重置过滤器
const resetFilters = () => {
  filters.value = {
    category: '',
    keyword: ''
  }
  currentPage.value = 1
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
  
  // 加载故事列表
  loadStories()
})
</script>

<style scoped>
.story-list-container {
  padding: 1rem 0;
}

.story-list-container h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.stories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  color: #333;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-input {
  min-width: 200px;
}

.btn-reset {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
}

.btn-reset:hover {
  background-color: #ff5252;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.story-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
}

.story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.story-image {
  height: 200px;
  overflow: hidden;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-content {
  padding: 1rem;
}

.story-tags {
  margin-bottom: 0.5rem;
}

.tag {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.story-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.story-excerpt {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.story-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  color: #999;
  font-size: 0.8rem;
}

.btn-read-more {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-read-more:hover {
  background-color: #359c6d;
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
}

.page-info {
  color: #666;
}

@media (max-width: 768px) {
  .stories-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .search-input {
    min-width: auto;
    width: 100%;
  }
  
  .stories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
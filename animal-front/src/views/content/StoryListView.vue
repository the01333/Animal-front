<template>
  <div class="story-list-container">
    <h1>领养故事</h1>
    <p class="subtitle">每一只被领养的宠物都有一个温暖的故事</p>

    <div class="stories-filter">
      <div class="filter-group">
        <label for="category">分类:</label>
        <select id="category" v-model="filters.category" @change="handleFilterChange">
          <option value="">全部</option>
          <option value="success">成功领养</option>
          <option value="reunion">失散重聚</option>
          <option value="rescue">救助故事</option>
        </select>
      </div>

      <div class="filter-group">
        <input type="text" v-model="filters.keyword" @input="handleFilterChange" placeholder="搜索故事标题或内容..."
          class="search-input" />
      </div>

      <button @click="resetFilters" class="btn-reset">重置</button>
    </div>

    <div class="stories-grid">
      <div v-for="story in stories" :key="story.id" class="story-card">
        <div class="story-image">
          <img :src="story.coverImage || defaultImage" :alt="story.title" />
        </div>
        <div class="story-content">
          <div class="story-tags">
            <span v-for="tag in story.tags || []" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <h3>{{ story.title }}</h3>
          <p class="story-excerpt">{{ story.summary }}</p>
          <div class="story-meta">
            <div class="meta-row">
              <span class="meta-item">{{ story.author }}</span>
              <span class="meta-item">{{ story.publishDate }}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="footer-stats">
            <span class="meta-item">阅读 {{ story.viewCount ?? 0 }}</span>
            <span class="meta-item">❤ {{ story.likeCount ?? 0 }}</span>
            <span class="meta-item">★ {{ story.favoriteCount ?? 0 }}</span>
          </div>
          <router-link :to="`/story/${story.id}`" class="btn-read-more">
            阅读全文
          </router-link>
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
import { ref, computed, onMounted, onActivated } from 'vue'
import { getStoryList } from '@/api/story'
import type { Article } from '@/types'
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
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 故事数据
const stories = ref<Article[]>([])
const loading = ref(false)

const tagKeywordMap: Record<string, string> = {
  success: '成功领养',
  reunion: '失散重聚',
  rescue: '救助故事'
}

const buildKeyword = () => {
  const keywords: string[] = []
  const tagKey = filters.value.category ? tagKeywordMap[filters.value.category] : ''
  if (tagKey) {
    keywords.push(tagKey)
  }
  if (filters.value.keyword) {
    keywords.push(filters.value.keyword)
  }
  return keywords.join(' ').trim()
}

// 加载故事列表
const loadStories = async () => {
  loading.value = true
  try {
    const keyword = buildKeyword()
    const response = await getStoryList({
      current: currentPage.value,
      size: itemsPerPage.value,
      keyword: keyword || undefined
    })
    stories.value = response.data?.records || []
    totalItems.value = response.data?.total || 0
  } catch (error) {
    console.error('加载故事列表失败:', error)
    ElMessage.error('加载故事列表失败')
  } finally {
    loading.value = false
  }
}

// 重置过滤器
const resetFilters = () => {
  filters.value = {
    category: '',
    keyword: ''
  }
  currentPage.value = 1
  loadStories()
}

// 监听过滤条件变化，重新加载
const handleFilterChange = () => {
  currentPage.value = 1
  loadStories()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadStories()
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
  loadStories()
})

onActivated(() => {
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
  margin-bottom: 4rem;
}

.story-card {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
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
  padding: 1.35rem 1.35rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
}

.card-footer {
  padding: 0 1.35rem 1.25rem;
  margin-top: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-stats {
  display: flex;
  gap: 0.65rem;
  color: #666;
  font-size: 0.85rem;
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
  margin-bottom: 1.1rem;
  font-size: 0.9rem;
}

.story-meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: #888;
  margin-top: 0.55rem;
}

.story-meta .meta-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.story-meta .meta-row.stats {
  color: #5c5c5c;
  font-weight: 500;
}

.story-meta .meta-item {
  display: inline-flex;
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
  opacity: 0.6;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #359c6d;
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
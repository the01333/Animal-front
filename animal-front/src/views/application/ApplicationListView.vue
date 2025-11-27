<template>
  <div class="applications-container">
    <h1>我的领养申请</h1>

    <div class="applications-content">
      <div v-if="applications.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无领养申请</h3>
        <p>您还没有提交任何领养申请</p>
        <router-link to="/pets" class="btn-browse-pets">浏览可领养宠物</router-link>
      </div>

      <div v-else>
        <div class="filters">
          <div class="filter-group">
            <label for="status">状态:</label>
            <select id="status" v-model="filters.status">
              <option value="">全部</option>
              <option value="pending">审核中</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
              <option value="cancelled">已撤销</option>
            </select>
          </div>

          <div class="filter-group">
            <input type="text" v-model="filters.keyword" placeholder="搜索宠物名称..." class="search-input" />
          </div>

          <button @click="resetFilters" class="btn-reset">重置</button>
        </div>

        <div class="applications-list">
          <div v-for="application in filteredApplications" :key="application.id" class="application-item">
            <div class="application-header">
              <div class="pet-info">
                <img :src="application.petImage || defaultImage" :alt="application.petName" />
                <div>
                  <h3>{{ application.petName }}</h3>
                  <p>申请时间: {{ application.applyDate }}</p>
                </div>
              </div>
              <span :class="applicationStatusClass(application.status)">
                {{ applicationStatusText(application.status) }}
              </span>
            </div>

            <div class="application-details">
              <div class="detail-item">
                <label>申请编号:</label>
                <span>{{ application.id }}</span>
              </div>
              <div class="detail-item">
                <label>更新时间:</label>
                <span>{{ application.updateDate }}</span>
              </div>
            </div>

            <div class="application-actions">
              <button @click="viewApplication(application.id)" class="btn-view">
                查看详情
              </button>
              <button v-if="application.status === 'pending'" @click="cancelApplication(application.id)"
                class="btn-cancel">
                撤销申请
              </button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn-pagination">
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 申请状态类型
type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// 申请对象接口
interface Application {
  id: string
  petName: string
  petImage?: string
  status: ApplicationStatus
  applyDate: string
  updateDate: string
}

// 过滤条件
const filters = ref({
  status: '',
  keyword: ''
})

// 分页数据
const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalItems = ref(0)

// 申请列表数据
const applications = ref<Application[]>([
  {
    id: 'APP20251015001',
    petName: '小花',
    petImage: 'http://localhost:9000/animal-adopt/default.jpg',
    status: 'pending',
    applyDate: '2025-10-15',
    updateDate: '2025-10-15'
  },
  {
    id: 'APP20251010002',
    petName: '旺财',
    petImage: 'http://localhost:9000/animal-adopt/default.jpg',
    status: 'approved',
    applyDate: '2025-10-10',
    updateDate: '2025-10-12'
  },
  {
    id: 'APP20251001003',
    petName: '咪咪',
    petImage: 'http://localhost:9000/animal-adopt/default.jpg',
    status: 'rejected',
    applyDate: '2025-10-01',
    updateDate: '2025-10-05'
  }
])

// 默认图片
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

// 路由
const router = useRouter()

// 计算总项目数
totalItems.value = applications.value.length

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value)
})

// 过滤后的申请列表
const filteredApplications = computed(() => {
  let result = applications.value

  // 状态过滤
  if (filters.value.status) {
    result = result.filter(app => app.status === filters.value.status)
  }

  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(app =>
      app.petName.toLowerCase().includes(keyword)
    )
  }

  // 更新总项目数
  totalItems.value = result.length

  // 分页处理
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return result.slice(start, end)
})

// 申请状态文本
const applicationStatusText = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending': return '审核中'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    case 'cancelled': return '已撤销'
    default: return '未知'
  }
}

// 申请状态样式
const applicationStatusClass = (status: ApplicationStatus) => {
  return {
    'status-pending': status === 'pending',
    'status-approved': status === 'approved',
    'status-rejected': status === 'rejected',
    'status-cancelled': status === 'cancelled'
  }
}

// 重置过滤器
const resetFilters = () => {
  filters.value = {
    status: '',
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

// 查看申请详情
const viewApplication = (id: string) => {
  router.push(`/application/${id}`)
}

// 撤销申请
const cancelApplication = (id: string) => {
  if (confirm('确定要撤销此领养申请吗？')) {
    // 在实际应用中，这里会调用后端API撤销申请
    const application = applications.value.find(app => app.id === id)
    if (application) {
      application.status = 'cancelled'
    }
    alert('申请已撤销')
  }
}

onMounted(() => {
  // 在实际应用中，这里会从API获取申请列表
  console.log('申请列表数据加载完成')
})
</script>

<style scoped>
.applications-container {
  padding: 1rem 0;
}

.applications-container h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-browse-pets {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.filters {
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

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.application-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.pet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pet-info img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.pet-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.pet-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.status-pending {
  background-color: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-approved {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-rejected {
  background-color: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-cancelled {
  background-color: #999;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.application-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.detail-item label {
  font-weight: bold;
  color: #333;
}

.application-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-view,
.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}

.btn-cancel {
  background-color: #ff6b6b;
  color: white;
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
  .filters {
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

  .application-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .application-details {
    grid-template-columns: 1fr;
  }

  .application-actions {
    justify-content: center;
  }
}
</style>
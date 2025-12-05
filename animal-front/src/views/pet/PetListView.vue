<template>
  <div class="pet-list-view">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.name" placeholder="搜索宠物名称或品种" clearable @clear="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="宠物类型">
          <el-select v-model="queryForm.category" placeholder="全部" clearable @change="handleSearch"
            @clear="queryForm.category = ''" filterable>
            <el-option label="全部" :value="''" />
            <el-option v-for="(text, key) in dictData.petCategories" :key="key" :label="text" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item label="领养状态">
          <el-select v-model="queryForm.adoptionStatus" placeholder="全部" clearable @change="handleSearch"
            @clear="queryForm.adoptionStatus = ''" filterable>
            <el-option label="全部" :value="''" />
            <el-option v-for="(text, key) in dictData.adoptionStatuses" :key="key" :label="text" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="queryForm.gender" placeholder="全部" clearable @change="handleSearch"
            @clear="queryForm.gender = null" filterable>
            <el-option label="全部" :value="null" />
            <el-option v-for="(text, key) in dictData.genders" :key="key" :label="text"
              :value="parseInt(key as string)" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 结果统计 -->
    <div class="result-info">
      <el-text>找到 <b>{{ total }}</b> 只可爱的小伙伴</el-text>
    </div>

    <!-- 瀑布流展示 -->
    <div v-loading="loading" class="waterfall-container">
      <Waterfall :list="petList" row-key="id" :gutter="20" :min-line-gap="20" :max-line-gap="30" :breakpoints="{
        1200: { rowPerView: 4 },
        992: { rowPerView: 3 },
        768: { rowPerView: 2 },
        576: { rowPerView: 1 }
      }">
        <template #item="{ item }">
          <div class="pet-waterfall-card" @click="goToDetail(item.id)">
            <div class="pet-image-wrapper">
              <LazyImg :url="item.images?.[0] || getPlaceholderImage(item.category)" />
              <div class="pet-status-badge">
                <el-tag :type="getStatusType(item.adoptionStatus)" size="small" effect="dark" round>
                  {{ getStatusText(item.adoptionStatus) }}
                </el-tag>
              </div>
            </div>
            <div class="pet-info">
              <h3 class="pet-name">
                <el-icon v-if="item.gender === 1" color="#409EFF">
                  <Male />
                </el-icon>
                <el-icon v-else-if="item.gender === 2" color="#F56C6C">
                  <Female />
                </el-icon>
                {{ item.name }}
              </h3>
              <div class="pet-details">
                <el-tag size="small" effect="plain">{{ getCategoryText(item.category) }}</el-tag>
                <el-text type="info" size="small">{{ item.breed }}</el-text>
              </div>
              <div class="pet-meta">
                <div class="meta-item">
                  <el-icon>
                    <Calendar />
                  </el-icon>
                  <span>{{ item.age }}岁</span>
                </div>
                <div v-if="item.weight" class="meta-item">
                  <el-icon>
                    <ScaleToOriginal />
                  </el-icon>
                  <span>{{ item.weight }}kg</span>
                </div>
              </div>
              <div v-if="item.description" class="pet-desc">
                <el-text line-clamp="2" size="small">{{ item.description }}</el-text>
              </div>
              <div class="pet-actions">
                <el-button type="primary" size="small" :disabled="item.adoptionStatus !== 'available'"
                  @click.stop="applyAdoption(item.id)">
                  <el-icon>
                    <Star />
                  </el-icon>
                  申请领养
                </el-button>
                <el-button size="small" @click.stop="goToDetail(item.id)">
                  <el-icon>
                    <View />
                  </el-icon>
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <!-- 空状态 -->
      <el-empty v-if="!loading && petList.length === 0" description="暂无宠物信息" />
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination-wrapper">
      <el-pagination :current-page="queryForm.current" :page-size="queryForm.size" :page-sizes="[12, 24, 36, 48]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Search, RefreshLeft, Male, Female, Calendar, ScaleToOriginal, Star, View } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { openAuthDialog } from '@/utils/authHelper'
import { getPetList } from '@/api/pet'
import { getAllDictData } from '@/api/dict'
import type { Pet, PetQuery } from '@/types'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const loading = ref(false)
const petList = ref<Pet[]>([])
const total = ref(0)

// 字典数据
const dictData = ref({
  petCategories: {} as Record<string, string>,
  genders: {} as Record<number, string>,
  adoptionStatuses: {} as Record<string, string>
})

const queryForm = reactive<PetQuery>({
  name: '',
  category: '',
  adoptionStatus: '',
  gender: null,
  current: 1,
  size: 12
})

// 获取宠物列表
async function fetchPetList() {
  loading.value = true
  try {
    const res = await getPetList(queryForm)
    // 处理图片数据：将JSON字符串转换为数组
    petList.value = res.data.records.map((pet: any) => ({
      ...pet,
      images: normalizeImages(pet.images)
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('获取宠物列表失败:', error)
    ElMessage.error('获取宠物列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  queryForm.current = 1
  fetchPetList()
}

// 重置
function handleReset() {
  Object.assign(queryForm, {
    name: '',
    category: '',
    adoptionStatus: '',
    gender: null,
    current: 1,
    size: 12
  })
  fetchPetList()
}

// 分页大小变化
function handleSizeChange(size: number) {
  queryForm.size = size
  queryForm.current = 1
  fetchPetList()
}

// 当前页变化
function handleCurrentChange(page: number) {
  queryForm.current = page
  fetchPetList()
}

function normalizeImages(images: any): string[] {
  if (!images) {
    return []
  }

  if (Array.isArray(images)) {
    return images
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.warn('⚠️ 解析宠物图片失败，使用空数组', error, images)
      return []
    }
  }

  return []
}

// 前往详情页
function goToDetail(id: number) {
  router.push(`/pet/${id}`)
}

// 申请领养
function applyAdoption(petId: number) {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再申请领养')
    openAuthDialog('login')
    return
  }
  router.push(`/apply/${petId}`)
}

// 获取占位图
function getPlaceholderImage(category: string) {
  const placeholders: Record<string, string> = {
    cat: 'http://localhost:9000/animal-adopt/default.jpg',
    dog: 'http://localhost:9000/animal-adopt/default.jpg',
    rabbit: 'http://localhost:9000/animal-adopt/default.jpg',
    bird: 'http://localhost:9000/animal-adopt/default.jpg',
    other: 'http://localhost:9000/animal-adopt/default.jpg'
  }
  return placeholders[category?.toLowerCase()] || placeholders.other
}

// 获取状态类型
function getStatusType(status: string) {
  const types: Record<string, any> = {
    available: 'success',
    pending: 'warning',
    adopted: 'info',
    reserved: 'warning'
  }
  return types[status?.toLowerCase()] || 'info'
}

// 获取状态文本
function getStatusText(status: string) {
  const texts: Record<string, string> = {
    available: '可领养',
    pending: '待审核',
    adopted: '已领养',
    reserved: '已预订'
  }
  return texts[status?.toLowerCase()] || status
}

// 获取类型文本
function getCategoryText(category: string) {
  const texts: Record<string, string> = {
    cat: '猫咪',
    dog: '狗狗',
    other: '其他'
  }
  return texts[category?.toLowerCase()] || category
}

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

onMounted(() => {
  loadDictData()
  fetchPetList()
})

// 监听路由变化，当返回到列表页时重新加载数据
watch(() => route.path, (newPath) => {
  if (newPath === '/pets') {
    console.log('🔄 返回宠物列表页，重新加载数据')
    fetchPetList()
  }
}, { immediate: false })
</script>

<style scoped lang="scss">
.pet-list-view {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 12px;

  .search-form {
    margin: 0;
  }
}

.result-info {
  margin-bottom: 20px;
  padding: 10px;
  text-align: center;
  font-size: 16px;

  b {
    color: #409eff;
    font-size: 20px;
    margin: 0 5px;
  }
}

.waterfall-container {
  min-height: 400px;
  margin-bottom: 20px;
}

.pet-waterfall-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pet-waterfall-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.pet-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 135px;
  background: #f5f7fa;

  :deep(.lazy-img) {
    width: 100%;
    height: 100%;
    display: block;
    transition: transform 0.3s;
    object-fit: cover;
  }

  &:hover :deep(.lazy-img) {
    transform: scale(1.1);
  }

  .pet-status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.pet-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.pet-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.pet-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.pet-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #606266;

    .el-icon {
      font-size: 16px;
      min-width: 0;
    }
  }
}

.pet-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: -1rem;
  padding: 10px 12px 15px;
  box-sizing: border-box;
}

.pet-actions .el-button {
  flex: 1;
  margin: 0 !important;
  width: 100%;
  padding: 8px 2px;
  height: 27px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>

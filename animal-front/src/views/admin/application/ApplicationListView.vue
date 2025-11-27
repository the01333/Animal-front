<template>
  <div class="admin-application-list">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="申请人/申请编号/联系方式" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option label="待审核" value="PENDING" />
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
            <el-option label="已取消" value="CANCELLED" />
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

      <!-- 卡片列表 -->
      <div class="card-list" v-loading="loading">
        <el-empty v-if="!applications.length && !loading" description="暂无申请数据" />
        <el-row v-else :gutter="20">
          <el-col v-for="item in applications" :key="item.id" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <el-card shadow="hover" class="application-card">
              <div class="card-header">
                <div class="card-header__info">
                  <el-avatar :size="60" :src="item.petCoverImage || defaultPetImage" />
                  <div class="card-header__text">
                    <div class="pet-name">{{ item.petName || '未匹配宠物' }}</div>
                    <div class="application-no">申请编号：{{ item.applicationNo || '-' }}</div>
                  </div>
                </div>
                <el-tag :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</el-tag>
              </div>

              <el-descriptions :column="1" size="small" class="card-descriptions">
                <el-descriptions-item label="申请人">
                  {{ item.applicantNickname || item.applicantUsername || '匿名用户' }}
                  <el-tag v-if="item.applicantCertified" size="small" type="success" style="margin-left: 6px">
                    已认证
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="联系方式">
                  {{ item.contactPhone || item.applicantPhone || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="联系地址">
                  {{ item.contactAddress || item.applicantAddress || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item label="提交时间">
                  {{ formatDate(item.createTime) }}
                </el-descriptions-item>
              </el-descriptions>

              <div class="card-actions">
                <el-button type="primary" text :icon="View" @click="handleView(item)">详情</el-button>
                <el-button v-if="item.status === 'PENDING'" type="success" text :icon="Select"
                  @click="handleApprove(item)">
                  通过
                </el-button>
                <el-button v-if="item.status === 'PENDING'" type="danger" text :icon="CloseBold"
                  @click="handleReject(item)">
                  拒绝
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination :current-page="queryForm.current" :page-size="queryForm.size" :page-sizes="[6, 12, 24, 48]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" background @size-change="fetchList"
          @current-change="fetchList" />
      </div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer v-model="detailVisible" title="申请详情" size="50%" :destroy-on-close="true">
      <el-skeleton v-if="detailLoading" :rows="6" animated />
      <template v-else>
        <div class="detail-section">
          <h3>申请状态</h3>
          <el-tag :type="getStatusType(detailData?.status)">
            {{ getStatusText(detailData?.status) }}
          </el-tag>
          <p class="detail-subtext">申请编号：{{ detailData?.applicationNo || '-' }}</p>
          <p class="detail-subtext">提交时间：{{ formatDate(detailData?.createTime) }}</p>
        </div>

        <div class="detail-grid">
          <section>
            <h4>申请人信息</h4>
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="昵称">
                {{ detailData?.applicantNickname || detailData?.applicantUsername || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="联系方式">
                {{ detailData?.contactPhone || detailData?.applicantPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ detailData?.applicantEmail || '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                {{ detailData?.contactAddress || detailData?.applicantAddress || '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="养宠经验">
                <el-tag :type="detailData?.applicantHasExperience ? 'success' : 'info'">
                  {{ detailData?.applicantHasExperience ? '有' : '无' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </section>

          <section>
            <h4>宠物信息</h4>
            <el-card shadow="never" class="pet-summary">
              <div class="pet-summary__body">
                <el-avatar :size="70" :src="detailData?.petCoverImage || defaultPetImage" />
                <div>
                  <p class="pet-name">{{ detailData?.petName || '未匹配宠物' }}</p>
                  <p class="detail-subtext">
                    品类：{{ detailData?.petCategory || '-' }} ｜ 状态：{{ detailData?.petAdoptionStatus || '-' }}
                  </p>
                </div>
              </div>
            </el-card>
          </section>
        </div>

        <section class="detail-section">
          <h4>申请信息</h4>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="申请理由">{{ detailData?.reason || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="家庭情况">{{ detailData?.familyInfo || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="养护计划">{{ detailData?.careplan || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="补充说明">{{ detailData?.additionalInfo || '未填写' }}</el-descriptions-item>
          </el-descriptions>
        </section>

        <section class="detail-section" v-if="detailData?.reviewComment">
          <h4>审核记录</h4>
          <p>
            审核人：{{ detailData?.reviewerName || '系统' }} ｜ 时间：{{ formatDate(detailData?.reviewTime) }}
          </p>
          <el-alert :closable="false" type="info" :description="detailData?.reviewComment" />
        </section>

        <div class="detail-actions" v-if="detailData?.status === 'PENDING'">
          <el-button type="success" :icon="Select" @click="handleApprove(detailData!)">通过</el-button>
          <el-button type="danger" :icon="CloseBold" @click="handleReject(detailData!)">拒绝</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 审核对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="审核意见">
          <el-input v-model="reviewForm.reviewComment" type="textarea" :rows="4" placeholder="请输入审核意见（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReview">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getAllApplications, getApplicationDetail, reviewApplication } from '@/api/application'
import type { AdoptionApplication } from '@/types'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import { Search, RefreshLeft, View, Select, CloseBold } from '@element-plus/icons-vue'

const loading = ref(false)
const applications = ref<AdoptionApplication[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref<AdoptionApplication | null>(null)
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<AdoptionApplication | null>(null)
const defaultPetImage = 'http://localhost:9000/animal-adopt/default.jpg'

const queryForm = reactive({
  keyword: '',
  status: '',
  current: 1,
  size: 12
})

const activeFilters = computed(() => {
  const filters: Array<{ key: 'keyword' | 'status'; label: string; value: string }> = []
  if (queryForm.keyword) {
    filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword })
  }
  if (queryForm.status) {
    filters.push({ key: 'status', label: '状态', value: getStatusText(queryForm.status) })
  }
  return filters
})

const reviewForm = reactive({
  status: '',
  reviewComment: ''
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getAllApplications(queryForm)
    applications.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error('获取申请列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryForm, { keyword: '', status: '', current: 1, size: 12 })
  fetchList()
}

function handleRemoveFilter(key: 'keyword' | 'status') {
  if (key === 'status') {
    queryForm.status = ''
  } else {
    queryForm.keyword = ''
  }
  fetchList()
}

async function handleView(row: AdoptionApplication) {
  detailVisible.value = true
  detailLoading.value = true
  try {
    const res = await getApplicationDetail(row.id)
    detailData.value = res.data
  } catch (error) {
    console.error('获取申请详情失败:', error)
    ElMessage.error('获取详情失败')
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

function handleApprove(row: AdoptionApplication) {
  currentRow.value = row
  dialogTitle.value = '通过申请'
  reviewForm.status = 'APPROVED'
  reviewForm.reviewComment = ''
  dialogVisible.value = true
}

function handleReject(row: AdoptionApplication) {
  currentRow.value = row
  dialogTitle.value = '拒绝申请'
  reviewForm.status = 'REJECTED'
  reviewForm.reviewComment = ''
  dialogVisible.value = true
}

async function confirmReview() {
  if (!currentRow.value) return

  try {
    await reviewApplication(currentRow.value.id, reviewForm)
    ElMessage.success('审核成功')
    dialogVisible.value = false
    detailVisible.value = false
    fetchList()
  } catch (error) {
    ElMessage.error('审核失败')
  }
}

function getStatusType(status: string) {
  const map: Record<string, any> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    CANCELLED: 'info'
  }
  return map[status] || ''
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    PENDING: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    CANCELLED: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.admin-application-list {
  .search-form {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .card-list {
    min-height: 200px;
  }

  .application-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      &__info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .card-header__text {
        .pet-name {
          font-size: 16px;
          font-weight: 600;
        }

        .application-no {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .card-descriptions {
      margin-bottom: 12px;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.detail-section {
  margin-bottom: 24px;

  h3,
  h4 {
    margin-bottom: 8px;
  }

  .detail-subtext {
    color: #909399;
    margin: 4px 0;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.pet-summary {
  .pet-summary__body {
    display: flex;
    align-items: center;
    gap: 16px;

    .pet-name {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>

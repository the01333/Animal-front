<template>
  <div class="certification-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>认证审核</span>
          <div class="header-actions">
            <el-button :loading="loading" type="primary" @click="fetchList">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-form label-width="80px" class="search-form" :model="queryForm">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input v-model="queryForm.keyword" placeholder="身份证号、手机号等" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="未提交" value="not_submitted" />
                <el-option label="审核中" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已拒绝" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="search-actions">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="records" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="nickname" label="昵称" width="140" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="idCard" label="身份证号" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button
              type="success"
              link
              @click="handleReview(row, 'approved')"
              :disabled="row.status !== 'pending'"
            >通过</el-button>
            <el-button
              type="danger"
              link
              @click="handleReview(row, 'rejected')"
              :disabled="row.status !== 'pending'"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="queryForm.current"
          :page-size="queryForm.size"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="认证详情" size="40%" destroy-on-close>
      <el-descriptions v-if="currentRecord" :column="2" border>
        <el-descriptions-item label="用户名">{{ currentRecord.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentRecord.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRecord.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentRecord.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="身份证号" :span="2">{{ currentRecord.idCard || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">{{ statusText(currentRecord.status) }}</el-descriptions-item>
        <el-descriptions-item label="是否已认证">
          <el-tag :type="currentRecord.certified ? 'success' : 'info'">
            {{ currentRecord.certified ? '已认证' : '未认证' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核人">{{ currentRecord.reviewerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ formatDate(currentRecord.reviewTime) }}</el-descriptions-item>
        <el-descriptions-item label="拒绝原因" :span="2">{{ currentRecord.rejectReason || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="image-group" v-if="currentRecord">
        <div class="image-item">
          <div class="label">身份证正面</div>
          <el-image
            v-if="currentRecord.idCardFrontUrl"
            :src="processImageUrl(currentRecord.idCardFrontUrl)"
            fit="cover"
            :preview-src-list="[processImageUrl(currentRecord.idCardFrontUrl)]"
          />
          <div v-else class="placeholder">暂无图片</div>
        </div>
        <div class="image-item">
          <div class="label">身份证反面</div>
          <el-image
            v-if="currentRecord.idCardBackUrl"
            :src="processImageUrl(currentRecord.idCardBackUrl)"
            fit="cover"
            :preview-src-list="[processImageUrl(currentRecord.idCardBackUrl)]"
          />
          <div v-else class="placeholder">暂无图片</div>
        </div>
      </div>
    </el-drawer>

    <el-dialog
      v-model="reviewDialogVisible"
      :title="reviewForm.status === 'approved' ? '通过认证' : '拒绝认证'"
      width="420px"
    >
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item v-if="reviewForm.status === 'rejected'" label="拒绝原因">
          <el-input
            v-model="reviewForm.rejectReason"
            type="textarea"
            rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
        <el-alert
          v-else
          type="success"
          show-icon
          :closable="false"
          title="确认通过该用户的认证申请吗？"
        />
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="reviewLoading" @click="submitReview">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search, RefreshLeft } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import {
  getCertificationList,
  getCertificationDetail,
  reviewCertification
} from '@/api/user'
import type { UserCertificationRecord } from '@/types'

const loading = ref(false)
const reviewLoading = ref(false)
const detailVisible = ref(false)
const reviewDialogVisible = ref(false)
const total = ref(0)

const queryForm = reactive({
  keyword: '',
  status: '',
  current: 1,
  size: 10
})

const records = ref<UserCertificationRecord[]>([])
const currentRecord = ref<UserCertificationRecord | null>(null)
const reviewForm = reactive<{ id: number | null; status: 'approved' | 'rejected'; rejectReason?: string }>(
  {
    id: null,
    status: 'approved',
    rejectReason: ''
  }
)

const statusText = (status?: string) => {
  switch (status) {
    case 'pending':
      return '审核中'
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已拒绝'
    default:
      return '未提交'
  }
}

const statusTagType = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

const processImageUrl = (url?: string) => {
  if (!url) return ''
  let normalized = url.trim()
  if (normalized.startsWith('@')) {
    normalized = normalized.substring(1)
  }
  normalized = normalized.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000')
  if (!normalized.startsWith('http')) {
    normalized = `http://localhost:9000/animal-adopt${normalized.startsWith('/') ? '' : '/'}${normalized}`
  }
  return normalized
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getCertificationList(queryForm)
    records.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取认证列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryForm.current = 1
  fetchList()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.status = ''
  queryForm.current = 1
  fetchList()
}

const handlePageChange = (page: number) => {
  queryForm.current = page
  fetchList()
}

const handleSizeChange = (size: number) => {
  queryForm.size = size
  queryForm.current = 1
  fetchList()
}

const handleView = async (row: UserCertificationRecord) => {
  try {
    const res = await getCertificationDetail(row.id)
    currentRecord.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('获取认证详情失败')
    console.error(error)
  }
}

const handleReview = (row: UserCertificationRecord, status: 'approved' | 'rejected') => {
  if (row.status !== 'pending') {
    ElMessage.warning('仅审核中的记录可以操作')
    return
  }
  currentRecord.value = row
  reviewForm.id = row.id
  reviewForm.status = status
  reviewForm.rejectReason = ''
  reviewDialogVisible.value = true
}

const submitReview = async () => {
  if (!reviewForm.id) return
  if (reviewForm.status === 'rejected' && !reviewForm.rejectReason) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  reviewLoading.value = true
  try {
    await reviewCertification(reviewForm.id, {
      status: reviewForm.status,
      rejectReason: reviewForm.rejectReason
    })
    ElMessage.success('审核成功')
    reviewDialogVisible.value = false
    fetchList()
  } catch (error) {
    console.error(error)
    ElMessage.error('审核失败')
  } finally {
    reviewLoading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.certification-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .search-form {
    margin-bottom: 16px;
  }

  .search-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pagination {
    margin-top: 16px;
    text-align: right;
  }

  .image-group {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;

    .image-item {
      border: 1px dashed #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;

      .label {
        margin-bottom: 8px;
        font-weight: 500;
      }

      .placeholder {
        color: #bbb;
      }

      :deep(.el-image) {
        width: 100%;
        height: 200px;
        border-radius: 6px;
      }
    }
  }
}
</style>

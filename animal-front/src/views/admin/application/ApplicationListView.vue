<template>
  <div class="admin-application-list">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="宠物名称/申请人" clearable />
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

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="petName" label="宠物名称" min-width="120" />
        <el-table-column prop="applicantName" label="申请人" min-width="100" />
        <el-table-column prop="applicantPhone" label="联系电话" width="120" />
        <el-table-column prop="applicantAddress" label="地址" min-width="150" show-overflow-tooltip />
        <el-table-column label="养宠经验" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hasExperience ? 'success' : 'info'">
              {{ row.hasExperience ? '有' : '无' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              type="success"
              link
              :icon="Select"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              type="danger"
              link
              :icon="CloseBold"
              @click="handleReject(row)"
            >
              拒绝
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
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="审核意见">
          <el-input
            v-model="reviewForm.reviewComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见（选填）"
          />
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
import { ref, reactive, onMounted } from 'vue'
import { getAllApplications, reviewApplication } from '@/api/application'
import type { AdoptionApplication } from '@/types'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import { Search, RefreshLeft, View, Select, CloseBold } from '@element-plus/icons-vue'

const loading = ref(false)
const tableData = ref<AdoptionApplication[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref<AdoptionApplication | null>(null)

const queryForm = reactive({
  keyword: '',
  status: '',
  current: 1,
  size: 10
})

const reviewForm = reactive({
  status: '',
  reviewComment: ''
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getAllApplications(queryForm)
    tableData.value = res.data.records
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
  Object.assign(queryForm, { keyword: '', status: '', current: 1, size: 10 })
  fetchList()
}

function handleView(row: AdoptionApplication) {
  ElMessage.info('查看详情功能开发中...')
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
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>


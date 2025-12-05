<template>
  <div class="application-detail-page" v-loading="loading">
    <div class="detail-header">
      <button class="btn-back" type="button" @click="goBack">返回</button>
        <div class="detail-header__info" v-if="detail">
          <p class="application-no">申请编号：{{ detail.applicationNo || '—' }}</p>
          <span :class="['status-chip', statusClass]">{{ detail.statusText || statusText }}</span>
        </div>
    </div>

    <el-empty v-if="!loading && !detail" description="未找到申请记录" />

    <div v-else-if="detail" class="detail-content">
      <section class="summary-card">
        <div class="summary-text">
          <h1>{{ detail.petName || '领养申请详情' }}</h1>
          <p>提交时间：{{ formatDateTime(detail.createTime) }}</p>
          <p>最近更新：{{ formatDateTime(detail.updateTime) }}</p>
        </div>
        <div class="summary-actions">
          <button type="button" class="btn-view-pet" @click="viewPetDetail">查看宠物</button>
          <button v-if="isPending" class="btn-cancel" :disabled="canceling" @click="handleCancel">{{
            canceling ? '撤销中…' : '撤销申请'
          }}</button>
        </div>
      </section>

      <section class="content-grid">
        <div class="card pet-card">
          <img :src="petCover" :alt="detail.petName || '宠物图片'" />
          <div class="pet-info">
            <h3>{{ detail.petName || '未匹配宠物' }}</h3>
            <p>品类：{{ detail.petCategoryText || formatPetCategory(detail.petCategory) }}</p>
            <p>宠物状态：{{ detail.petAdoptionStatusText || formatPetStatus(detail.petAdoptionStatus) }}</p>
          </div>
        </div>

        <div class="card applicant-card">
          <h3>申请人信息</h3>
          <ul>
            <li><span>昵称：</span>{{ detail.applicantNickname || detail.applicantUsername || '—' }}</li>
            <li><span>电话：</span>{{ detail.contactPhone || detail.applicantPhone || '—' }}</li>
            <li><span>邮箱：</span>{{ detail.applicantEmail || '—' }}</li>
            <li><span>地址：</span>{{ detail.contactAddress || detail.applicantAddress || '—' }}</li>
            <li><span>养宠经验：</span>{{ detail.applicantHasExperience ? '有' : '暂无' }}</li>
          </ul>
        </div>
      </section>

      <section class="card info-card">
        <h3>申请说明</h3>
        <div class="info-row">
          <label>申请理由</label>
          <p>{{ detail.reason || '未填写' }}</p>
        </div>
        <div class="info-row">
          <label>家庭情况</label>
          <p>{{ detail.familyInfo || '未填写' }}</p>
        </div>
        <div class="info-row">
          <label>养护计划</label>
          <p>{{ detail.careplan || '未填写' }}</p>
        </div>
        <div class="info-row">
          <label>补充说明</label>
          <p>{{ detail.additionalInfo || '未填写' }}</p>
        </div>
      </section>

      <section v-if="detail.reviewComment || detail.reviewTime" class="card review-card">
        <h3>审核记录</h3>
        <div class="review-meta">
          <p>审核人：{{ detail.reviewerName || '系统' }}</p>
          <p>时间：{{ formatDateTime(detail.reviewTime) }}</p>
        </div>
        <p class="review-comment">{{ detail.reviewComment || '暂无审核意见' }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApplicationDetail, cancelApplication as cancelApplicationApi } from '@/api/application'
import { processImageUrl } from '@/utils/image'
import type { AdoptionApplication } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const detail = ref<AdoptionApplication | null>(null)
const canceling = ref(false)
const defaultPetCover = 'http://localhost:9000/animal-adopt/default.jpg'

const normalizeStatus = (status?: string) => String(status || '').toLowerCase()

const statusText = computed(() => detail.value?.statusText || '未知状态')

const statusClass = computed(() => `status-${normalizeStatus(detail.value?.status)}`)
const isPending = computed(() => normalizeStatus(detail.value?.status) === 'pending')

const petCover = computed(() => processImageUrl(detail.value?.petCoverImage) || defaultPetCover)

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

const formatPetCategory = (category?: string) => {
  if (!category) return '宠物'
  const map: Record<string, string> = { dog: '狗狗', cat: '猫咪' }
  return map[category.toLowerCase()] || category
}

const formatPetStatus = (status?: string) => {
  if (!status) return '未知'
  const map: Record<string, string> = {
    available: '可领养',
    pending: '审核中',
    adopted: '已领养'
  }
  return map[status.toLowerCase()] || status
}

const fetchDetail = async () => {
  const id = Number(route.params.id)
  if (!id) {
    loading.value = false
    detail.value = null
    return
  }
  loading.value = true
  try {
    const res = await getApplicationDetail(id)
    detail.value = res.data
  } catch (error) {
    console.error('获取申请详情失败:', error)
    detail.value = null
    ElMessage.error('无法获取申请详情')
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  if (!detail.value || canceling.value) return
  try {
    await ElMessageBox.confirm('确定要撤销此领养申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  canceling.value = true
  try {
    await cancelApplicationApi(detail.value.id)
    ElMessage.success('申请已撤销')
    await fetchDetail()
  } catch (error) {
    console.error('撤销申请失败:', error)
    ElMessage.error('撤销失败，请稍后重试')
  } finally {
    canceling.value = false
  }
}

const goBack = () => {
  router.push({ name: 'profile', query: { tab: 'applications' } })
}

const viewPetDetail = () => {
  if (!detail.value?.petId) return
  router.push({
    name: 'pet-detail',
    params: { id: detail.value.petId },
    query: {
      from: 'application-detail',
      applicationId: detail.value.id ? String(detail.value.id) : undefined
    }
  })
}

onMounted(fetchDetail)
watch(
  () => route.params.id,
  () => {
    fetchDetail()
  }
)
</script>

<style scoped>
.application-detail-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.detail-header__info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.btn-back {
  border: none;
  background: #f3f4f6;
  color: #111827;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
}

.application-no {
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.status-chip {
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-approved {
  background: #ecfdf5;
  color: #047857;
}

.status-rejected {
  background: #fef2f2;
  color: #b91c1c;
}

.status-cancelled {
  background: #f3f4f6;
  color: #374151;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(135deg, #eef2ff, #fdf2f8);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.summary-text h1 {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  color: #111827;
}

.summary-text p {
  margin: 0.25rem 0;
  color: #4b5563;
}

.summary-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-view-pet,
.btn-cancel {
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-view-pet {
  background: #fff;
  color: #111827;
  border: 1px solid rgba(15, 23, 42, 0.12);
  text-decoration: none;
}

.btn-cancel {
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: #fff;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.pet-card {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.pet-card img {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  object-fit: cover;
}

.pet-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  color: #111827;
}

.pet-info p {
  margin: 0.15rem 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.applicant-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.applicant-card li {
  margin-bottom: 0.6rem;
  color: #4b5563;
  display: flex;
  gap: 0.4rem;
  align-items: baseline;
}

.applicant-card span {
  color: #111827;
  font-weight: 600;
  min-width: 5em;
}

.info-card .info-row {
  margin-bottom: 1.2rem;
}

.info-card label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #111827;
}

.info-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.info-card .info-row:last-of-type {
  margin-bottom: 0;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.content-grid .card h3 {
  margin-bottom: 0.5rem;
}

.review-card .review-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.review-comment {
  margin: 0;
  padding: 0.85rem;
  background: #f8fafc;
  border-radius: 12px;
  color: #1f2937;
}

@media (max-width: 640px) {
  .summary-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

<template>
  <div class="dashboard-view">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6f7ff">
              <el-icon color="#1890ff" :size="40"><Orange /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalPets }}</div>
              <div class="stat-label">宠物总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f6ffed">
              <el-icon color="#52c41a" :size="40"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.availablePets }}</div>
              <div class="stat-label">可领养</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff7e6">
              <el-icon color="#fa8c16" :size="40"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingApplications }}</div>
              <div class="stat-label">待审核申请</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff0f6">
              <el-icon color="#eb2f96" :size="40"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">注册用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>宠物分类统计</span>
            </div>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>申请状态统计</span>
            </div>
          </template>
          <div ref="statusChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>访问趋势（最近7天）</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card shadow="hover" class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6">
          <div class="quick-action-item" @click="$router.push('/admin/pet/add')">
            <el-icon :size="32" color="#409EFF"><Plus /></el-icon>
            <div>添加宠物</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="quick-action-item" @click="$router.push('/admin/application/pending')">
            <el-icon :size="32" color="#67C23A"><DocumentChecked /></el-icon>
            <div>审核申请</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="quick-action-item" @click="$router.push('/admin/article/add')">
            <el-icon :size="32" color="#E6A23C"><Edit /></el-icon>
            <div>发布文章</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="quick-action-item" @click="$router.push('/admin/user/list')">
            <el-icon :size="32" color="#F56C6C"><UserFilled /></el-icon>
            <div>用户管理</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import { getStatistics, getPetCategoryStats, getApplicationStatusStats, getVisitTrend } from '@/api/stats'

const stats = reactive({
  totalPets: 0,
  availablePets: 0,
  adoptedPets: 0,
  pendingApplications: 0,
  totalUsers: 0,
  todayVisits: 0
})

const categoryChartRef = ref<HTMLElement>()
const statusChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

let categoryChart: EChartsType | null = null
let statusChart: EChartsType | null = null
let trendChart: EChartsType | null = null

// 获取统计数据
async function fetchStatistics() {
  try {
    const res = await getStatistics()
    if (res.data) {
      Object.assign(stats, {
        totalPets: res.data.totalPets || 0,
        availablePets: res.data.availablePets || 0,
        adoptedPets: res.data.adoptedPets || 0,
        pendingApplications: res.data.pendingApplications || 0,
        totalUsers: res.data.totalUsers || 0,
        todayVisits: 0
      })
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 使用模拟数据
    Object.assign(stats, {
      totalPets: 0,
      availablePets: 0,
      adoptedPets: 0,
      pendingApplications: 0,
      totalUsers: 0,
      todayVisits: 0
    })
  }
}

// 初始化宠物分类图表
async function initCategoryChart() {
  if (!categoryChartRef.value) return

  categoryChart = echarts.init(categoryChartRef.value)

  try {
    const res = await getPetCategoryStats()
    // 这里 res 是 ApiResponse，真实数据在 res.data 中
    const data = (res.data || []).map((item: any) => ({
      value: item.count,
      name: getCategoryName(item.category)
    }))

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    categoryChart.setOption(option)
  } catch (error) {
    console.error('获取宠物分类统计失败:', error)
    // 使用模拟数据
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 48, name: '猫咪' },
            { value: 52, name: '狗狗' },
            { value: 18, name: '兔子' },
            { value: 10, name: '其他' }
          ]
        }
      ]
    })
  }
}

// 初始化申请状态图表
async function initStatusChart() {
  if (!statusChartRef.value) return

  statusChart = echarts.init(statusChartRef.value)

  try {
    const res = await getApplicationStatusStats()
    // 这里 res 是 ApiResponse，真实数据在 res.data 中
    const data = (res.data || []).map((item: any) => ({
      value: item.count,
      name: getStatusName(item.status)
    }))

    const option = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 20, fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: data
        }
      ]
    }

    statusChart.setOption(option)
  } catch (error) {
    console.error('获取申请状态统计失败:', error)
    // 使用模拟数据
    statusChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 15, name: '待审核' },
            { value: 72, name: '已通过' },
            { value: 8, name: '已拒绝' }
          ]
        }
      ]
    })
  }
}

// 初始化访问趋势图表
async function initTrendChart() {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  try {
    const res = await getVisitTrend(7)
    // 这里 res 是 ApiResponse，真实数据在 res.data 中
    const dates = (res.data || []).map((item: any) => item.date)
    const counts = (res.data || []).map((item: any) => item.count)

    const option = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates },
      yAxis: {
        type: 'value',
        min: 0,
        interval: 1 // Y 轴刻度间隔 1
      },
      series: [
        {
          data: counts,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
              ]
            }
          }
        }
      ]
    }

    trendChart.setOption(option)
  } catch (error) {
    console.error('获取访问趋势失败:', error)
    // 使用模拟数据
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [{ data: [120, 132, 101, 134, 90, 230, 210], type: 'line', smooth: true }]
    })
  }
}

function getCategoryName(category: string) {
  const names: Record<string, string> = {
    CAT: '猫咪',
    DOG: '狗狗',
    RABBIT: '兔子',
    BIRD: '鸟类',
    OTHER: '其他'
  }
  return names[category] || category
}

function getStatusName(status: string) {
  const names: Record<string, string> = {
    PENDING: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    CANCELLED: '已取消'
  }
  return names[status] || status
}

// 响应式调整
function handleResize() {
  categoryChart?.resize()
  statusChart?.resize()
  trendChart?.resize()
}

onMounted(async () => {
  await fetchStatistics()
  await Promise.all([initCategoryChart(), initStatusChart(), initTrendChart()])

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  categoryChart?.dispose()
  statusChart?.dispose()
  trendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.dashboard-view {
  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    margin-bottom: 20px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        width: 80px;
        height: 80px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;
  }

  .chart-card {
    margin-bottom: 20px;
    border-radius: 8px;

    .card-header {
      font-weight: bold;
      font-size: 16px;
    }

    .chart-container {
      width: 100%;
      height: 350px;
    }
  }

  .quick-actions-card {
    border-radius: 8px;

    .quick-action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      gap: 10px;

      &:hover {
        background: #e6e8eb;
        transform: translateY(-3px);
      }

      div {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }
    }
  }
}
</style>


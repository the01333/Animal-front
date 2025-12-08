<template>
  <div class="settings-view">
    <el-card shadow="never">
      <template #header>
        <div class="settings-header">
          <span class="title">系统设置</span>
          <el-tabs v-model="activeSection" class="settings-section-tabs" type="card">
            <el-tab-pane label="下拉选项管理" name="dict" />
            <el-tab-pane label="系统工具" name="tools" />
          </el-tabs>
        </div>
      </template>

      <div v-if="activeSection === 'dict'">
        <el-tabs v-model="activeTab" class="dict-tabs">
          <el-tab-pane label="宠物类型" name="pet_category" />
          <el-tab-pane label="领养状态" name="adoption_status" />
          <el-tab-pane label="健康状态" name="health_status" />
          <el-tab-pane label="文章分类" name="article_category" />
        </el-tabs>

        <div class="toolbar">
          <el-button type="primary" @click="handleCreate">新增</el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
          <el-table-column prop="dictKey" label="编码" min-width="160" />
          <el-table-column prop="dictLabel" label="显示名称" min-width="180" />
          <el-table-column prop="sortOrder" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="160" fixed="right" header-align="center">
            <template #default="{ row }">
              <el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <div class="tools-placeholder">
          <p class="tools-tip">系统级操作，请谨慎执行以下工具：</p>
          <div class="tools-actions">
            <el-button type="primary" :loading="refreshing" @click="handleRefreshDictCache">刷新字典缓存</el-button>
            <el-button type="warning" :loading="syncing" @click="handleManualSyncViewCount">立即同步浏览统计</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑字典项' : '新增字典项'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="字典类型" prop="dictType">
          <el-select v-model="form.dictType" placeholder="请选择字典类型" :disabled="isEdit">
            <el-option v-for="item in tabOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="dictKey">
          <el-input v-model="form.dictKey" />
        </el-form-item>
        <el-form-item label="显示名称" prop="dictLabel">
          <el-input v-model="form.dictLabel" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { listDictItems, createDictItem, updateDictItem, deleteDictItem, refreshDictCache, type DictItem } from '@/api/dict'
import { manualSyncViewCount } from '@/api/stats'

type DictType = 'pet_category' | 'adoption_status' | 'health_status' | 'article_category'

const tabOptions: { label: string; value: DictType }[] = [
  { label: '宠物类型', value: 'pet_category' },
  { label: '领养状态', value: 'adoption_status' },
  { label: '健康状态', value: 'health_status' },
  { label: '文章分类', value: 'article_category' }
]

const activeSection = ref<'dict' | 'tools'>('dict')
const activeTab = ref<DictType>('pet_category')
const tableData = ref<DictItem[]>([])
const loading = ref(false)
const refreshing = ref(false)
const syncing = ref(false)

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Partial<DictItem>>({
  id: undefined,
  dictType: 'pet_category',
  dictKey: '',
  dictLabel: '',
  sortOrder: 0,
  status: 1,
  remark: ''
})

const formStatus = computed({
  get: () => form.status ?? 1,
  set: (val: number) => {
    form.status = val
  }
})

const rules: FormRules = {
  dictType: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
  dictKey: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  dictLabel: [{ required: true, message: '请输入显示名称', trigger: 'blur' }]
}

async function loadData() {
  loading.value = true
  try {
    const res = await listDictItems(activeTab.value)
    tableData.value = res.data || []
  } catch (error) {
    ElMessage.error('加载字典数据失败')
  } finally {
    loading.value = false
  }
}

function resetForm(type: DictType) {
  form.id = undefined
  form.dictType = type
  form.dictKey = ''
  form.dictLabel = ''
  form.sortOrder = (tableData.value?.length || 0) + 1
  form.status = 1
  form.remark = ''
}

function handleCreate() {
  isEdit.value = false
  resetForm(activeTab.value)
  dialogVisible.value = true
}

function handleEdit(row: DictItem) {
  isEdit.value = true
  form.id = row.id
  form.dictType = row.dictType
  form.dictKey = row.dictKey
  form.dictLabel = row.dictLabel
  form.sortOrder = row.sortOrder
  form.status = row.status
  form.remark = row.remark
  dialogVisible.value = true
}

async function handleDelete(row: DictItem) {
  try {
    await ElMessageBox.confirm(`确认删除【${row.dictLabel}】吗？`, '提示', {
      type: 'warning'
    })
    await deleteDictItem(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 用户取消或请求失败
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const payload = {
        dictType: form.dictType,
        dictKey: form.dictKey,
        dictLabel: form.dictLabel,
        sortOrder: form.sortOrder,
        status: form.status,
        remark: form.remark
      }
      if (isEdit.value && form.id) {
        await updateDictItem(form.id, payload)
        ElMessage.success('更新成功')
      } else {
        await createDictItem(payload)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  })
}

async function handleRefreshDictCache() {
  try {
    await ElMessageBox.confirm('确认刷新所有字典缓存吗？\n通常在修改字典配置后使用。', '提示', {
      type: 'warning'
    })
  } catch {
    return
  }

  refreshing.value = true
  try {
    await refreshDictCache()
    ElMessage.success('字典缓存已刷新')
  } catch (error) {
    ElMessage.error('刷新字典缓存失败')
  } finally {
    refreshing.value = false
  }
}

async function handleManualSyncViewCount() {
  try {
    await ElMessageBox.confirm('确认立即同步浏览统计数据到数据库吗？', '提示', {
      type: 'warning'
    })
  } catch {
    return
  }

  syncing.value = true
  try {
    await manualSyncViewCount()
    ElMessage.success('浏览统计同步任务已执行')
  } catch (error) {
    ElMessage.error('执行浏览统计同步失败')
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(activeTab, () => {
  loadData()
})
</script>

<style scoped>
.settings-view {
  padding: 16px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 12px;
}

.settings-header .title {
  font-weight: 600;
  font-size: 17px;
  color: #303133;
}

.toolbar {
  margin-top: 3px !important;
  margin-bottom: 18px !important;
  text-align: center;
}

.tools-placeholder {
  padding: 16px 4px;
}

/* 顶部“下拉选项管理 / 系统工具”小 Tab 栏样式 */
.settings-section-tabs {
  margin-top: 0;
  margin-right: 5px;
}

.settings-section-tabs :deep(.el-tabs__item) {
  font-size: 15px !important;
  height: 45px !important;
  border-radius: 23px !important;
}

.settings-section-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

.settings-section-tabs :deep(.el-tabs__nav) {
  border: none;
  box-shadow: none;
}

/* 去掉整行灰色分隔线 */
.settings-section-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.settings-section-tabs :deep(.el-tabs__item) {
  padding: 8px 16px;
  height: 36px;
  line-height: 20px;
  font-size: 13px;
  color: #606266;
  border-radius: 14px;
  border: none;
}

.settings-section-tabs :deep(.el-tabs__item:hover) {
  color: #409eff;
}

.settings-section-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 500;
  color: #409eff;
  background-color: #ecf5ff;
  border: none;
}

/* 下方字典类型 Tab：去掉整行灰色底线，只保留激活项下方蓝色 active bar */
.dict-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.dict-tabs :deep(.el-tabs__header) {
  margin-bottom: 10px;
  border-bottom: none;
}

.tools-tip {
  color: #66686b;
  margin-bottom: 20px;
}
</style>

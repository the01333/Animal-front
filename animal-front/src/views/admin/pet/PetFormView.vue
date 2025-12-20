<template>
  <div class="admin-pet-form-page">
    <div class="admin-pet-form">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑宠物' : '添加宠物' }}</span>
          </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="宠物名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入宠物名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="宠物类型" prop="category">
                <el-select v-model="form.category" placeholder="请选择宠物类型" filterable default-first-option
                  @change="handleCategoryChange">
                  <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                  <el-option :value="ADD_CATEGORY_FLAG" class="add-category-option">
                    <div class="add-category-entry">
                      <el-icon>
                        <Plus />
                      </el-icon>
                      <span>新增类别...</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="品种" prop="breed">
                <el-input v-model="form.breed" placeholder="请输入品种" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio :value="1">公</el-radio>
                  <el-radio :value="2">母</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="0" :max="30" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体重(kg)" prop="weight">
                <el-input-number v-model="form.weight" :min="0" :precision="2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="颜色" prop="color">
                <el-input v-model="form.color" placeholder="例如：白色、棕色、黑白相间" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性格描述" prop="personality">
                <el-input v-model="form.personality" placeholder="例如：活泼、温顺、调皮" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="健康状态" prop="healthStatus">
                <el-select v-model="form.healthStatus" placeholder="请选择健康状态">
                  <el-option v-for="opt in healthStatusOptions" :key="opt.value" :label="opt.label"
                    :value="opt.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领养状态" prop="adoptionStatusText">
                <el-select v-model="form.adoptionStatusText" placeholder="请选择领养状态">
                  <el-option v-for="opt in adoptionStatusOptions" :key="opt.value" :label="opt.label"
                    :value="opt.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入宠物详细描述" />
          </el-form-item>

          <el-form-item label="封面图片">
            <div class="image-upload-section">
              <el-upload ref="coverUploadRef" class="cover-uploader" :auto-upload="false" accept="image/*"
                @change="handleCoverSelect">
                <template #default>
                  <div v-if="coverImagePreview" class="cover-preview">
                    <img :src="coverImagePreview" alt="封面图片预览" />
                    <div class="cover-actions">
                      <el-button type="danger" size="small" @click.stop="handleRemoveCover">删除</el-button>
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <el-icon class="icon">
                      <Plus />
                    </el-icon>
                    <span>点击上传封面图片</span>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item label="宠物图片">
            <div class="image-upload-section">
              <el-upload ref="imagesUploadRef" class="pet-images-uploader" :auto-upload="false" multiple
                accept="image/*" @change="handleImagesSelect">
                <template #default>
                  <el-button type="primary">点击上传图片</el-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip">支持上传多张图片，每张不超过5MB</div>
                </template>
              </el-upload>
              <div v-if="imageList.length > 0" class="image-list">
                <div v-for="(img, index) in imageList" :key="index" class="image-item">
                  <img :src="img" :alt="`宠物图片${index + 1}`" />
                  <el-button type="danger" size="small" @click="handleRemoveImage(index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 新增类别弹窗 -->
    <el-dialog v-model="showAddCategoryDialog" title="新增宠物类别" width="400px" @closed="handleAddCategoryDialogClosed">
      <div class="add-category-dialog-body">
        <el-form label-width="80px">
          <el-form-item label="类别名称" :error="newCategoryError">
            <el-input v-model="newCategoryName" placeholder="请输入新的宠物类别" maxlength="20" show-word-limit
              @keyup.enter="confirmAddCategory" />
          </el-form-item>
        </el-form>
        <div class="add-category-tip">【提示：新增的类别会同步到系统中，供所有宠物使用】</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelAddCategory">取 消</el-button>
          <el-button type="primary" @click="confirmAddCategory">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPetDetail, createPet, updatePet } from '@/api/pet'
import { getPetCategories, getAdoptionStatuses, getHealthStatuses, createPetCategoryAuto } from '@/api/dict'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Pet } from '@/types'

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const coverUploadRef = ref()
const imagesUploadRef = ref()
const isEdit = computed(() => !!route.params.id)
const imageList = ref<string[]>([])
const coverImagePreview = ref<string>('')
const coverImageFile = ref<File | null>(null)
const imageFiles = ref<File[]>([])

// 下拉框数据
const categoryOptions = ref<Array<{ label: string; value: string }>>([])
const adoptionStatusOptions = ref<Array<{ label: string; value: string }>>([])
const healthStatusOptions = ref<Array<{ label: string; value: string }>>([])

const ADD_CATEGORY_FLAG = '__ADD_CATEGORY__'
const showAddCategoryDialog = ref(false)
const newCategoryName = ref('')
const newCategoryError = ref('')
const lastValidCategory = ref<string>('')

const form = reactive<Partial<Pet>>({
  name: '',
  category: '',
  breed: '',
  gender: 1,
  age: 0,
  weight: 0,
  color: '',
  personality: '',
  healthStatus: 'healthy',
  adoptionStatus: 'available',
  description: '',
  coverImage: '',
  images: '',
  adoptionStatusText: ''
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入宠物名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择宠物类型', trigger: 'change' }],
  breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
}

// 加载字典数据
async function loadDictData() {
  try {
    const [categoriesRes, adoptionStatusRes, healthStatusRes] = await Promise.all([
      getPetCategories(),
      getAdoptionStatuses(),
      getHealthStatuses()
    ])

    if (categoriesRes.code === 200) {
      categoryOptions.value = Object.entries(categoriesRes.data).map(([value, label]) => ({
        value,
        label: label as string
      }))
      lastValidCategory.value = form.category || ''
    }

    if (adoptionStatusRes.code === 200) {
      adoptionStatusOptions.value = Object.entries(adoptionStatusRes.data).map(([value, label]) => ({
        value,
        label: label as string
      }))
    }

    if (healthStatusRes.code === 200) {
      healthStatusOptions.value = Object.entries(healthStatusRes.data).map(([value, label]) => ({
        value,
        label: label as string
      }))
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
    ElMessage.error('加载字典数据失败')
  }
}

async function fetchDetail() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getPetDetail(id)
    Object.assign(form, res.data)
    lastValidCategory.value = form.category || ''
    // 解析图片列表
    if (form.images) {
      try {
        imageList.value = JSON.parse(form.images)
      } catch {
        imageList.value = []
      }
    }
  } catch (error) {
    ElMessage.error('获取宠物详情失败')
  }
}

function handleCoverSelect(file: any) {
  if (!file.raw) return

  const reader = new FileReader()
  reader.onload = (e) => {
    coverImagePreview.value = e.target?.result as string
    coverImageFile.value = file.raw
  }
  reader.readAsDataURL(file.raw)
}

function handleImagesSelect(file: any) {
  if (!file.raw) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageList.value.push(e.target?.result as string)
    imageFiles.value.push(file.raw)
  }
  reader.readAsDataURL(file.raw)
}

function handleRemoveCover() {
  coverImagePreview.value = ''
  coverImageFile.value = null
  if (coverUploadRef.value) {
    coverUploadRef.value.clearFiles()
  }
  ElMessage.success('已删除封面图片')
}

function handleRemoveImage(index: number) {
  imageList.value.splice(index, 1)
  imageFiles.value.splice(index, 1)
  ElMessage.success('已删除图片')
}

function openAddCategoryDialog() {
  newCategoryName.value = ''
  newCategoryError.value = ''
  showAddCategoryDialog.value = true
}

function handleCategoryChange(value: string) {
  if (value === ADD_CATEGORY_FLAG) {
    form.category = lastValidCategory.value
    openAddCategoryDialog()
    return
  }
  lastValidCategory.value = value
}

function handleAddCategoryDialogClosed() {
  showAddCategoryDialog.value = false
  newCategoryName.value = ''
  newCategoryError.value = ''
}

async function confirmAddCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    newCategoryError.value = '请输入类别名称'
    return
  }

  // 按中文显示名称去重，避免重复添加同名类别
  const exists = categoryOptions.value.some(opt => opt.label === name)
  if (exists) {
    newCategoryError.value = '该类别已存在'
    return
  }

  try {
    // 仅传中文名称，由后端通过 AI 翻译生成英文编码并写入字典
    await createPetCategoryAuto(name)

    ElMessage.success('已新增宠物类别')
    showAddCategoryDialog.value = false

    // 重新加载字典，确保与后端数据保持一致
    await loadDictData()
    const newOption = categoryOptions.value.find(opt => opt.label === name)
    if (newOption) {
      form.category = newOption.value
      lastValidCategory.value = newOption.value
    }
  } catch (error) {
    console.error('新增宠物类别失败:', error)
    ElMessage.error('新增宠物类别失败，请稍后重试')
  }
}

function cancelAddCategory() {
  handleAddCategoryDialogClosed()
}

async function uploadImages(petId: number) {
  const uploadPromises = []

  // 上传封面图片
  if (coverImageFile.value) {
    const formData = new FormData()
    formData.append('file', coverImageFile.value)

    const coverPromise = fetch(`/api/pet/${petId}/upload-cover`, {
      method: 'POST',
      headers: {
        ...uploadHeaders.value
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          form.coverImage = data.data
          // ElMessage.success('封面图片上传成功')
        } else {
          throw new Error(data.message || '封面图片上传失败')
        }
      })

    uploadPromises.push(coverPromise)
  }

  // 上传宠物图片
  if (imageFiles.value.length > 0) {
    const imagePromises = imageFiles.value.map((file, index) => {
      const formData = new FormData()
      formData.append('file', file)

      return fetch(`/api/pet/${petId}/upload-image`, {
        method: 'POST',
        headers: {
          ...uploadHeaders.value
        },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            imageList.value[index] = data.data
          } else {
            throw new Error(data.message || `第${index + 1}张图片上传失败`)
          }
        })
    })

    uploadPromises.push(...imagePromises)
  }

  // 等待所有上传完成
  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises)
    form.images = JSON.stringify(imageList.value)
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      let petId: number

      if (isEdit.value) {
        petId = Number(route.params.id)
        await updatePet(petId, form)
        ElMessage.success('宠物信息更新成功')
      } else {
        const res = await createPet(form)
        if (!res.data || !res.data.id) {
          throw new Error('创建宠物失败：无法获取宠物ID')
        }
        petId = res.data.id
        ElMessage.success('宠物添加成功')
      }

      // 上传图片
      if (coverImageFile.value || imageFiles.value.length > 0) {
        // ElMessage.info('正在上传图片...')
        await uploadImages(petId)

        // 上传完成后，使用完整表单数据保存（包含最新图片URL）
        await updatePet(petId, form)
        // ElMessage.success('图片已保存')
        console.log('图片已保存');
      }

      router.push('/admin/pet/list')
    } catch (error: any) {
      ElMessage.error(error.message || (isEdit.value ? '更新失败' : '添加失败'))
    }
  })
}

function handleCancel() {
  router.back()
}

onMounted(() => {
  loadDictData()
  if (isEdit.value) {
    fetchDetail()
  }
})
</script>

<style scoped lang="scss">
.admin-pet-form {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }

  .image-upload-section {
    width: 100%;
  }

  .cover-uploader {
    width: 100%;
  }

  .cover-preview {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px;
      display: flex;
      justify-content: center;
    }
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border: 2px dashed #dcdfe6;
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      background-color: #f5f7fa;
    }

    .icon {
      font-size: 32px;
      color: #909399;
      margin-bottom: 8px;
    }

    span {
      color: #606266;
      font-size: 14px;
    }
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 16px;

    .image-item {
      position: relative;
      width: 150px;
      height: 150px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        button {
          opacity: 1;
        }
      }

      button {
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
      }
    }
  }

  :deep(.el-upload__tip) {
    margin-top: 8px;
    color: #909399;
  }
}

.add-category-option {
  .add-category-entry {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #409eff;
  }
}

.add-category-dialog-body .add-category-tip {
  font-size: 14px;
  color: #96979a;
  margin: 32px 0 0 0;
}
</style>

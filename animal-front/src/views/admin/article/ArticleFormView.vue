<template>
  <div class="admin-article-form">
    <el-card shadow="never">
      <template #header>
        <span>{{ isEdit ? '编辑文章' : '发布文章' }}</span>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option v-for="option in categoryOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
          <el-upload class="cover-uploader" :show-file-list="false" :auto-upload="false" accept="image/*"
            :disabled="coverUploading" @change="handleCoverChange">
            <div v-if="coverImagePreview || form.coverImage" class="cover-preview">
              <img :src="coverImagePreview || form.coverImage" alt="封面预览" />
              <div class="cover-actions">
                <el-button type="danger" size="small" text @click.stop.prevent="handleRemoveCover">删除</el-button>
              </div>
            </div>
            <div v-else class="cover-placeholder">
              <el-icon>
                <Plus />
              </el-icon>
              <span>{{ coverUploading ? '上传中...' : '点击上传封面' }}</span>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="form.category === 'GUIDE'" label="指南分类" prop="guideCategory">
          <el-input v-model="form.guideCategory" placeholder="请输入指南分类" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <MdEditor v-model="form.content" :toolbars="editorToolbars" height="400px"
            placeholder="请输入文章内容，支持 Markdown 语法" />
        </el-form-item>

        <el-form-item v-if="form.category === 'STORY'" label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>

        <el-form-item v-if="form.category === 'STORY'" label="标签" prop="tags">
          <el-input v-model="tagsInput" placeholder="请输入标签，逗号分隔" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail, createArticle, updateArticle, getArticleCategories, uploadArticleCover } from '@/api/article'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'
import type { Article, ArticleCategoryOption } from '@/types'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = computed(() => !!route.params.id)
const categoryOptions = ref<ArticleCategoryOption[]>([])
const editorToolbars = ['bold', 'underline', 'italic', 'strikeThrough', 'title', 'quote', 'unorderedList', 'orderedList', 'task', 'codeBlock', 'link', 'image', 'table', 'mermaid', 'pageFullscreen', 'preview', 'previewOnly', 'fullscreen', 'catalog']

const form = reactive<Partial<Article>>({
  id: undefined,
  title: '',
  category: 'GUIDE',
  summary: '',
  content: '',
  author: '',
  guideCategory: '',
  coverImage: '',
  tags: []
})

const tagsInput = ref('')
const coverImagePreview = ref('')
const coverUploading = ref(false)
const coverImageFile = ref<File | null>(null)

const rules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  category: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'change'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ],
  guideCategory: [
    {
      required: () => form.category === 'GUIDE',
      message: '请输入指南分类',
      trigger: 'blur'
    }
  ],
  author: [
    {
      required: () => form.category === 'STORY',
      message: '请输入作者',
      trigger: 'blur'
    }
  ]
}

async function fetchDetail() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const preferredCategory = (route.query.category as string) || form.category || 'GUIDE'
    const candidates = preferredCategory ? [preferredCategory, preferredCategory === 'GUIDE' ? 'STORY' : 'GUIDE'] : ['GUIDE', 'STORY']
    let detailFetched = false
    for (const cat of candidates) {
      try {
        const res = await getArticleDetail(cat, id)
        Object.assign(form, res.data)
        form.category = cat
        tagsInput.value = (res.data.tags || []).join(',')
        coverImagePreview.value = res.data.coverImage || ''
        detailFetched = true
        break
      } catch (err) {
        continue
      }
    }
    if (!detailFetched) {
      throw new Error('not found')
    }
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await uploadCoverIfNeeded()
      form.tags = tagsInput.value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (isEdit.value) {
        await updateArticle(form.category!, Number(route.params.id), form)
        ElMessage.success('更新成功')
      } else {
        await createArticle(form)
        ElMessage.success('发布成功')
      }
      router.push('/admin/article/list')
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '发布失败')
    }
  })
}

function handleCancel() {
  router.back()
}

const handleCoverChange = (uploadFile: UploadFile, uploadFiles?: UploadFiles) => {
  if (!uploadFile.raw) return
  const reader = new FileReader()
  reader.onload = () => {
    coverImagePreview.value = reader.result as string
  }
  reader.readAsDataURL(uploadFile.raw)
  coverImageFile.value = uploadFile.raw
  if (uploadFiles) {
    uploadFiles.splice(0, uploadFiles.length)
  }
}

const handleRemoveCover = () => {
  coverImagePreview.value = ''
  form.coverImage = ''
  coverImageFile.value = null
}

const uploadCoverIfNeeded = async () => {
  if (!coverImageFile.value) return
  coverUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', coverImageFile.value)
    const res = await uploadArticleCover(fd)
    form.coverImage = res.data
    coverImageFile.value = null
  } catch (error) {
    ElMessage.error('封面上传失败，请重试')
    throw error
  } finally {
    coverUploading.value = false
  }
}

onMounted(() => {
  loadCategories()
  if (isEdit.value) {
    fetchDetail()
  }
})

async function loadCategories() {
  try {
    const res = await getArticleCategories()
    categoryOptions.value = res.data || []
  } catch (error) {
    categoryOptions.value = [
      { value: 'GUIDE', label: '领养指南' },
      { value: 'STORY', label: '领养故事' }
    ]
    console.warn('获取文章分类失败，使用默认分类', error)
  }
}
</script>

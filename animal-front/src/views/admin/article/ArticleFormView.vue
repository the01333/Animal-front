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
            <el-option label="领养指南" value="GUIDE" />
            <el-option label="领养故事" value="STORY" />
            <el-option label="新闻资讯" value="NEWS" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="请输入文章内容" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
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
import { getArticleDetail, createArticle, updateArticle } from '@/api/article'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = computed(() => !!route.params.id)

const form = reactive<Partial<Article>>({
  title: '',
  category: 'GUIDE',
  summary: '',
  content: '',
  author: ''
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

async function fetchDetail() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getArticleDetail(id)
    Object.assign(form, res.data)
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        await updateArticle(Number(route.params.id), form)
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

onMounted(() => {
  if (isEdit.value) {
    fetchDetail()
  }
})
</script>


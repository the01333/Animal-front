<template>
  <el-dialog
    v-model="dialogVisible"
    title="管理员登录"
    width="420px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入管理员账号" clearable />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'login-success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loading = ref(false)
const userStore = useUserStore()

const handleLogin = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.loginWithPassword({
        username: form.username,
        password: form.password
      })
      ElMessage.success('登录成功')
      dialogVisible.value = false
      emit('login-success')
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      form.username = ''
      form.password = ''
      formRef.value?.clearValidate()
    }
  }
)
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

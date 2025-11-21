<template>
  <div class="register-container">
    <div class="register-wrapper">
      <el-card class="register-card" shadow="always">
        <template #header>
          <div class="card-header">
            <el-avatar :size="60" class="header-avatar">
              <el-icon>
                <UserFilled />
              </el-icon>
            </el-avatar>
            <h2>创建新账户</h2>
            <p>加入我们，开启爱心领养之旅</p>
          </div>
        </template>

        <el-form ref="registerFormRef" :model="registerForm" :rules="rules" label-position="top" size="large">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" :prefix-icon="User" clearable />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱" :prefix-icon="Message" clearable />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（至少6个字符）" :prefix-icon="Lock"
              show-password />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" :prefix-icon="Lock"
              show-password @keyup.enter="handleRegister" />
          </el-form-item>

          <el-form-item prop="agreeTerms">
            <el-checkbox v-model="agreeTerms">
              我已阅读并同意
              <el-link type="primary" :underline="false">《用户协议》</el-link>
              和
              <el-link type="primary" :underline="false">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="loading" :icon="CirclePlus" class="register-btn"
              @click="handleRegister">
              {{ loading ? '注册中...' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-link">
          <el-text>已有账户?</el-text>
          <el-link type="primary" :underline="false" @click="$router.push('/login')">
            立即登录
          </el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Message, Lock, CirclePlus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreeTerms = (rule: any, value: any, callback: any) => {
  if (!agreeTerms.value) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  agreeTerms: [
    { validator: validateAgreeTerms, trigger: 'change' }
  ]
})

const agreeTerms = ref(false)
const loading = ref(false)
const router = useRouter()

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      setTimeout(() => {
        ElMessage.success({
          message: '注册成功！请登录您的账户。',
          duration: 2000
        })

        loading.value = false
        router.push('/login')
      }, 1000)
    } else {
      ElMessage.error('请填写完整的注册信息')
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background: url('https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1920') center center no-repeat;
  background-size: cover;
  position: relative;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.4) 0%, rgba(245, 87, 108, 0.4) 100%);
  z-index: 1;
}

.register-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.register-card {
  border-radius: 24px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
  text-align: center;
  padding: 20px 0;
}

.header-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  margin-bottom: 15px;
}

.card-header h2 {
  margin: 15px 0 10px;
  color: #303133;
  font-size: 26px;
}

.card-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.register-btn {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  border-radius: 25px;
}

.login-link {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
  color: #303133;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
}

:deep(.el-card__header) {
  padding: 30px 20px 20px;
}

:deep(.el-card__body) {
  padding: 20px 40px 30px;
}

:deep(.el-checkbox__label) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .register-container {
    padding: 20px 10px;
  }
}
</style>

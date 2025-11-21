<template>
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
              <el-select v-model="form.category" placeholder="请选择类型">
                <el-option label="猫咪" value="cat" />
                <el-option label="狗狗" value="dog" />
                <el-option label="兔子" value="rabbit" />
                <el-option label="鸟类" value="bird" />
                <el-option label="其他" value="other" />
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
            <el-form-item label="健康状态" prop="healthStatus">
              <el-select v-model="form.healthStatus" placeholder="请选择健康状态">
                <el-option label="健康" value="healthy" />
                <el-option label="生病" value="sick" />
                <el-option label="受伤" value="injured" />
                <el-option label="康复中" value="recovering" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领养状态" prop="adoptionStatus">
              <el-select v-model="form.adoptionStatus" placeholder="请选择领养状态">
                <el-option label="可领养" value="available" />
                <el-option label="待审核" value="pending" />
                <el-option label="已预订" value="reserved" />
                <el-option label="已领养" value="adopted" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入宠物描述" />
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
import { getPetDetail, createPet, updatePet } from '@/api/pet'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Pet } from '@/types'

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const isEdit = computed(() => !!route.params.id)

const form = reactive<Partial<Pet>>({
  name: '',
  category: 'cat',
  breed: '',
  gender: 1,
  age: 0,
  weight: 0,
  healthStatus: 'healthy',
  adoptionStatus: 'available',
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入宠物名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择宠物类型', trigger: 'change' }],
  breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
}

async function fetchDetail() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getPetDetail(id)
    Object.assign(form, res.data)
  } catch (error) {
    ElMessage.error('获取宠物详情失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        await updatePet(Number(route.params.id), form)
        ElMessage.success('更新成功')
      } else {
        await createPet(form)
        ElMessage.success('添加成功')
      }
      router.push('/admin/pet/list')
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
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

<style scoped lang="scss">
.admin-pet-form {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>


<template>
  <div class="pending-application-view">
    <el-card shadow="never">
      <el-alert title="待审核申请" type="info" :closable="false" style="margin-bottom: 20px">
        仅显示状态为"待审核"的申请
      </el-alert>
      <!-- 此处可引入ApplicationListView组件并传入status='PENDING'参数 -->
      <el-empty description="待审核申请列表（开发中）" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 待完善：集成ApplicationListView组件
</script>


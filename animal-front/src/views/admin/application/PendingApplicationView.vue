<template>
  <div class="pending-application-view">
    <ApplicationListView default-status="PENDING" lock-status-filter />
  </div>
</template>

<script setup lang="ts">
import ApplicationListView from './ApplicationListView.vue'
</script>


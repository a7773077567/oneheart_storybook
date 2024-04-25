<script setup lang="ts">
import type { ClientScheduleDetail } from '@/api';
import { computed } from 'vue';

defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

// const clientId = computed(() => props.scheduleDetail.clientId);
</script>

<template>
  <div class="body-analysis">
    <div class="body-analysis__item">
      <div class="img">
        <div class="img__date">
          2024/04/25
        </div>
        <div class="img__item">
          <img src="https://i0.wp.com/www.yehclinic.com/wp-content/uploads/2019/12/inbody-2019-12-23-14.10.09.png?resize=496%2C698&ssl=1">
        </div>
      </div>
      <div class="body-analysis__item">
        <div class="img">
          <div class="img__date">
            2024/04/25
          </div>
          <div class="img__item">
            <img src="https://i0.wp.com/www.yehclinic.com/wp-content/uploads/2019/12/inbody-2019-12-23-14.10.09.png?resize=496%2C698&ssl=1">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.img {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

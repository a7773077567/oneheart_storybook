<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import type { QTableProps } from 'quasar';
import { type ReviewListContent, getGoogleReviewList } from '@/api';
import ReviewForm from '@/components/home/googleReview/GoogleReviewForm.vue';
import { useTrafficLight, useUserStore } from '@/stores';
import dayjs from 'dayjs';

const userStore = useUserStore();
const trafficLightStore = useTrafficLight();

const selectedTherapist = ref(trafficLightStore.therapistOptions[0].value);
const reviewList = ref<ReviewListContent[]>([]);

const stateOfreviewForm = ref(false);
const formType = ref<'add' | 'edit'>('add');
const reviewInfo = ref(null);
const role = computed(() => userStore.role);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});
const cols: QTableProps['columns'] = [
  {
    name: 'user',
    required: true,
    label: '治療師(得分者)',
    align: 'left',
    style: 'width:150px',
    field: row => row.user.name,
  },
  {
    name: 'title',
    required: true,
    label: '項目名稱',
    align: 'left',
    field: 'title',
  },
  {
    name: 'reviewDateTime',
    required: true,
    label: '上傳日期',
    align: 'left',
    style: 'width:150px',
    field: row => dayjs(row.reviewDateTime).format('YYYY-MM-DD'),
  },
  {
    name: 'reviewTime',
    required: true,
    label: '上傳時間',
    align: 'left',
    field: row => dayjs(row.reviewDateTime).format('hh:mm'),
  },
  {
    name: 'reviewScreenshotUrl',
    required: true,
    label: '截圖',
    align: 'left',
    field: 'reviewScreenshotUrl',
  },
  {
    name: 'action',
    label: '',
    align: 'right',
    field: 'action',
  },
];

// before mounted
trafficLightStore.getTherapistList();
console.log(selectedTherapist.value);

if (selectedTherapist.value !== null) {
  getReviewList();
}

async function getReviewList() {
  console.log('getReviewListgetReviewListgetReviewList');
  const { data, meta } = await getGoogleReviewList({ page: pagination.value.page, take: pagination.value.rowsPerPage });
  reviewList.value = data;
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.page ?? 1;
}
</script>

<template>
  <div class="google-review">
    <h2>Google評論管理</h2>
    <p class="note">Google 評論數為 KPI 紅綠燈分數中的評分項目</p>
    <QSeparator />
    <section class="google-review-content">
      <div class="google-review-content__header">
        <OptionSelect v-model="selectedTherapist" :options="trafficLightStore.therapistOptions" />
        <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(stateOfreviewForm = true), (formType = 'add')" />
      </div>
      <QTable
        :columns="cols"
        :rows="reviewList"
        row-key="id"
        class="no-shadow"
        :rows-per-page-options="[10, 20, 50]"
        @request="getReviewList"
      >
        <template #body-cell-reviewScreenshotUrl="{ value }">
          <img :src="value" alt="screen shot" style="height:30px;width:60px">
        </template>
        <template #body-cell-action>
          <QBtn flat icon="edit" />
          <QBtn flat icon="delete" />
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfreviewForm">
    <ReviewForm :type="formType" :init-val="reviewInfo" :role="role" :therapist-options="trafficLightStore.scorerOptions" @cancel="stateOfreviewForm = false" @create="getReviewList" />
  </QDialog>
</template>

<style scoped lang="scss">
.google-review {
  h2 {
    margin-bottom: 12px;
    @include headline-medium($on-surface);
  }
  .note {
    @include body-medium($on-surface-variant);
    margin-bottom: 18px;
  }
  &-content {
    &__header {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
    }
  }
}
</style>

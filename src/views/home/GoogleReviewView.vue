<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import type { QTableProps } from 'quasar';
import { type GoogleReview, type ReviewListContent, getAGoogleReview, getGoogleReviewList } from '@/api';
import ReviewForm from '@/components/home/googleReview/GoogleReviewForm.vue';
import { useTrafficLight, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import type { ExtractPropTypes } from 'vue';

const userStore = useUserStore();
const trafficLightStore = useTrafficLight();

const selectedTherapist = ref(trafficLightStore.therapistOptions[0].value);
const reviewList = ref<ReviewListContent[]>([]);
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
    // headerStyle: '120px',
  },
];

// before mounted
trafficLightStore.getTherapistList();
console.log(selectedTherapist.value);

if (selectedTherapist.value !== null) {
  getReviewList();
}

async function getReviewList() {
  const { data, meta } = await getGoogleReviewList({ page: pagination.value.page, take: pagination.value.rowsPerPage });
  reviewList.value = data;
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.page ?? 1;
}

const stateOfReviewForm = ref(false);
const formType = ref<'add' | 'edit'>('add');
;

const reviewInfo = ref<any>(null);
const targetReview = ref();
const role = computed(() => userStore.role);

async function editReview(reviewId: number) {
  const data = await getAGoogleReview({ id: reviewId });
  targetReview.value = data.id;
  reviewInfo.value = {
    title: data.title,
    userId: data.user.id,
    reviewDate: dayjs(data.reviewDateTime).format('YYYY-MM-DD'),
    reviewTime: dayjs(data.reviewDateTime).format('hh:mm'),
    reviewScreenshot: data.reviewScreenshotUrl,
  };
  formType.value = 'edit';
  stateOfReviewForm.value = true;
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
        <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(stateOfReviewForm = true), (formType = 'add')" />
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
          <QTd>
            <img :src="value" alt="screen shot" style="height:30px;width:60px">
          </QTd>
        </template>
        <template #body-cell-action="{ row }">
          <QTd auto-width>
            <QBtn flat round icon="delete" class="q-mr-sm" />
            <QBtn flat round icon="edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfReviewForm">
    <ReviewForm
      :type="formType" :init-vals="reviewInfo" :role="role"
      :review-id="targetReview"
      :therapist-options="trafficLightStore.scorerOptions"
      @close="stateOfReviewForm = false"
      @create="(stateOfReviewForm = false), (getReviewList())"
    />
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

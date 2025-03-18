<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import type { QTableProps } from 'quasar';
import { type ReviewListContent, getGoogleReviewList } from '@/api';
import ReviewForm from '@/components/home/googleReview/ReviewForm.vue';
import { useTrafficLight, useUserStore } from '@/stores';

const userStore = useUserStore();
const trafficLightStore = useTrafficLight();

const selectedTherapist = ref(trafficLightStore.therapistOptions[0].value);
const reviewList = ref<ReviewListContent[]>([]);
const userId = ref(null);
const pagination = ref({
  page: 1,
});
const cols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '治療師(得分者)',
    align: 'left',
    style: 'width:150px',
    field: row => row.date,
  },
  {
    name: 'contractUrl',
    required: true,
    label: '項目名稱',
    align: 'left',
    field: row => row.contractUrl,
  },
  {
    name: 'date',
    required: true,
    label: '上傳日期',
    align: 'left',
    style: 'width:150px',
    field: row => row.date,
  },
  {
    name: 'contractUrl',
    required: true,
    label: '上傳時間',
    align: 'left',
    field: row => row.contractUrl,
  },
  {
    name: 'contractUrl',
    required: true,
    label: '截圖',
    align: 'left',
    field: row => row.contractUrl,
  },
  {
    name: 'action',
    label: '',
    align: 'right',
    field: 'action',
  },
];
const stateOfreviewForm = ref(false);

trafficLightStore.getTherapistList();
if (userId.value !== null) {
  const { data, meta } = await getGoogleReviewList({ userId: 1, ...pagination.value });
  reviewList.value = data;
  pagination.value.page = meta?.page ?? 1;
}

const formType = ref<'add' | 'edit'>('add');
const reviewInfo = ref(null);

const role = computed(() => userStore.role);
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
        hide-pagination
        class="no-shadow"
        :rows-per-page-options="[0]"
      >
        <template #body-cell-action>
          <QBtn flat icon="edit" />
          <QBtn flat icon="delete" />
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfreviewForm">
    <ReviewForm :type="formType" :init-val="reviewInfo" :role="role" @cancel="stateOfreviewForm = false" />
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

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { type EducationPointContent, deleteEducationPoint, getAEducationPoint, getEducationPointList } from '@/api';
import EducationReviewForm from '@/components/home/educationPoints/EducationPointsForm.vue';
import { useTrafficLight, useUserStore } from '@/stores';
import dayjs from 'dayjs';

const userStore = useUserStore();
const trafficLightStore = useTrafficLight();

const selectedTherapist = ref(trafficLightStore.therapistFilterOptions?.[0]?.value);
const reviewList = ref<EducationPointContent[]>([]);

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
    label: '教育積分',
    align: 'left',
    style: 'width:150px',
    field: row => dayjs(row.reviewDateTime).format('YYYY-MM-DD'),
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
    field: row => dayjs(row.reviewDateTime).format('HH:mm'),
  },
  {
    name: 'action',
    label: '',
    align: 'right',
    field: 'action',
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

// before mounted
await trafficLightStore.getAvailableTherapistList();
selectedTherapist.value = trafficLightStore.therapistFilterOptions?.[0]?.value;
await getReviewList();

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getReviewList();
};

async function getReviewList() {
  const userId = selectedTherapist.value || null;
  const { data, meta } = await getEducationPointList({ ...(userId && { userId }), page: pagination.value.page, take: pagination.value.rowsPerPage });
  reviewList.value = data;
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.itemCount ?? 1;
}

const stateOfReviewForm = ref(false);
const formType = ref<'add' | 'edit'>('add');
;

const reviewInfo = ref<any>(null);
const targetReview = ref();
const role = computed(() => userStore.role);

async function editReview(reviewId: number) {
  const data = await getAEducationPoint({ id: reviewId });
  targetReview.value = data.id;
  reviewInfo.value = {
    title: data.title,
    userId: data.user.id,
    point: data.point,
    reviewDate: dayjs(data.reviewDateTime).format('YYYY-MM-DD'),
    reviewTime: dayjs(data.reviewDateTime).format('HH:mm'),
  };
  formType.value = 'edit';
  stateOfReviewForm.value = true;
}

const $q = useQuasar();
function uploadReview() {
  stateOfReviewForm.value = false;
  $q.notify({ message: `教育積分${formType.value === 'add' ? '上傳' : '編輯'}成功`, timeout: 600, position: 'top' });
  getReviewList();
}

function deleteConfirm(id: number) {
  $q.dialog({
    title: '確定要刪除評論嗎？',
    message: '這個動作無法復原。',
    ok: '確定刪除',
    cancel: '取消',
  }).onOk(async () => {
    try {
      await deleteEducationPoint({ id });
      $q.notify({ message: '教育積分已刪除', timeout: 600, position: 'top' });
      getReviewList();
    }
    catch (err) {
      console.log(err);
    }
  });
}
</script>

<template>
  <div class="education-review">
    <h2>教育積分管理</h2>
    <p class="note">教育積分為 KPI 紅綠燈分數中的評分項目</p>
    <QSeparator />
    <section class="education-review-content">
      <div class="education-review-content__header">
        <OptionSelect v-if="userStore.canI('EDIT_EDUCATION_REVIEW')" v-model="selectedTherapist" :options="trafficLightStore.therapistFilterOptions" @update:model-value="getReviewList" />
        <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(stateOfReviewForm = true), (formType = 'add')" />
      </div>
      <QTable
        v-model:pagination="pagination"
        :columns="cols"
        :rows="reviewList"
        row-key="id"
        class="no-shadow"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      >
        <template #body-cell-reviewScreenshotUrl="{ value }">
          <QTd>
            <img :src="value" alt="screen shot" style="height:30px;width:60px">
          </QTd>
        </template>
        <template #body-cell-action="{ row }">
          <QTd auto-width>
            <QBtn v-if="userStore.canI('EDIT_EDUCATION_REVIEW')" flat round icon="o_delete" class="q-mr-sm" @click="deleteConfirm(row.id)" />
            <QBtn v-if="userStore.canI('EDIT_EDUCATION_REVIEW')" flat round icon="o_edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfReviewForm">
    <EducationReviewForm
      :type="formType" :init-vals="reviewInfo" :role="role"
      :review-id="targetReview"
      :therapist-options="trafficLightStore.scorerOptions"
      @close="stateOfReviewForm = false"
      @create="uploadReview"
    />
  </QDialog>
</template>

<style scoped lang="scss">
.education-review {
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

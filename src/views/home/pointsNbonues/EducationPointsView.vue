<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { type EducationPointContent, ReviewState, deleteEducationPoint, getAEducationPoint, getEducationPointList } from '@/api';
import EducationPointsForm from '@/components/home/educationPoints/EducationPointsForm.vue';
import { useBonusStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { type FileType, detectFileType } from '@/utils/helpers';
import ReviewChip from '@/components/home/review/ReviewChip.vue';

const userStore = useUserStore();
const bonusStore = useBonusStore();

const selectedTherapist = ref(bonusStore.therapistFilterOptions?.[0]?.value);
const reviewList = ref<(EducationPointContent & { fileType: null | FileType })[]>([]);

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
    name: 'status',
    required: true,
    label: '審核狀態',
    align: 'left',
    style: 'width:150px',
    field: 'status',
  },
  {
    name: 'title',
    required: true,
    label: '項目名稱',
    align: 'left',
    field: 'title',
    style: 'width: fit-content; max-width: 200px; white-space: pre-wrap',
  },
  {
    name: 'point',
    required: true,
    label: '教育積分',
    align: 'right',
    style: 'width:150px',
    field: 'point',
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
    name: 'attachmentUrl',
    required: true,
    label: '附件',
    align: 'left',
    field: 'attachmentUrl',
    format: (val, row) => {
      if (!val)
        return null;

      return row.fileType === 'image' ? ({ type: 'image', url: val }) : ({ type: 'pdf', url: val });
    },
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
await bonusStore.getAvailableTherapistList();
selectedTherapist.value = bonusStore.therapistFilterOptions?.[0]?.value;
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
  reviewList.value = await Promise.all(data.map(async (review) => {
    if (!review.attachmentUrl)
      return { ...review, fileType: null };

    // if alreay get fileType, skip fetch again
    const _file = reviewList.value.find(file => file.id === review.id);
    if (!!_file && !!_file.fileType)
      return { ...review, fileType: _file.fileType };

    const fileType = await detectFileType(review.attachmentUrl);
    return { ...review, fileType };
  }));
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.itemCount ?? 1;
}

const stateOfPointForm = ref(false);
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
    attachment: data.attachmentUrl,
  };
  formType.value = 'edit';
  stateOfPointForm.value = true;
}

const $q = useQuasar();
function uploadReview() {
  stateOfPointForm.value = false;
  $q.notify({ message: `教育積分${formType.value === 'add' ? '上傳' : '編輯'}成功`, timeout: 600, position: 'top' });
  getReviewList();
}

function deleteConfirm(id: number) {
  $q.dialog({
    title: '確定要刪除教育積分嗎？',
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

const stateOfLightbox = ref(false);
const lightBoxImg = ref('');

function checkAttachment(url: string) {
  window.open(url, '_black');
}
</script>

<template>
  <div class="education-review">
    <div class="row items-end q-py-md">
      <div>
        <h2 class="text-headline-medium">教育積分管理</h2>
        <p class="text-body-medium">教育積分為 KPI 紅綠燈分數中的評分項目</p>
      </div>
      <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(stateOfPointForm = true), (formType = 'add')" />
    </div>
    <QSeparator />
    <section class="education-review-content">
      <div class="education-review-content__header">
        <OptionSelect v-if="userStore.canI('EDIT_EDUCATION_REVIEW')" v-model="selectedTherapist" :options="bonusStore.therapistFilterOptions" @update:model-value="getReviewList" />
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
        <template #body-cell-status="{ value }">
          <QTd>
            <ReviewChip :state="value" />
          </QTd>
        </template>
        <template #body-cell-attachmentUrl="{ value }">
          <QTd>
            <QIcon v-if="value?.type === 'pdf'" name="attach_file" size="sm" @click="checkAttachment(value.url)" />
            <img v-else-if="value?.type === 'image'" :src="value.url" alt="attachment" style="height:30px;width:60px" @click="(lightBoxImg = value.url), (stateOfLightbox = true)">
            <span v-else>-</span>
          </QTd>
        </template>
        <template #body-cell-action="{ row }">
          <QTd auto-width>
            <QBtn v-if="userStore.canI('EDIT_EDUCATION_REVIEW') && (row.status === ReviewState['待審核'] || userStore.canI('EDIT_REVIEW'))" flat round icon="o_delete" class="q-mr-sm" @click="deleteConfirm(row.id)" />
            <QBtn v-if="userStore.canI('EDIT_EDUCATION_REVIEW') && (row.status === ReviewState['待審核'] || userStore.canI('EDIT_REVIEW'))" flat round icon="o_edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfPointForm">
    <EducationPointsForm
      :type="formType" :init-vals="reviewInfo" :role="role"
      :review-id="targetReview"
      :therapist-options="bonusStore.scorerOptions"
      @close="stateOfPointForm = false"
      @create="uploadReview"
    />
  </QDialog>
  <VueEasyLightbox
    :visible="stateOfLightbox"
    :imgs="lightBoxImg"
    @hide="stateOfLightbox = false"
  />
</template>

<style scoped lang="scss">
.education-review {
  h2 {
    margin-bottom: 12px;
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

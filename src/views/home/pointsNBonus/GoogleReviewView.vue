<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator, useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { type ReviewListContent, RoleType, deleteGoogleReview, getAGoogleReview, getGoogleReviewList } from '@/api';
import ReviewForm from '@/components/home/googleReview/GoogleReviewForm.vue';
import { useBonusStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';

const userStore = useUserStore();
const bonusStore = useBonusStore();

const selectedTherapist = ref(bonusStore.therapistFilterOptions?.[0]?.value);
const reviewList = ref<ReviewListContent[]>([]);

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
    style: 'width: fit-content; max-width: 200px; white-space: pre-wrap',
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
  const { data, meta } = await getGoogleReviewList({ ...(userId && { userId }), page: pagination.value.page, take: pagination.value.rowsPerPage });
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
  const data = await getAGoogleReview({ id: reviewId });
  targetReview.value = data.id;
  reviewInfo.value = {
    title: data.title,
    userId: data.user.id,
    reviewDate: dayjs(data.reviewDateTime).format('YYYY-MM-DD'),
    reviewTime: dayjs(data.reviewDateTime).format('HH:mm'),
    reviewScreenshot: data.reviewScreenshotUrl,
  };
  formType.value = 'edit';
  stateOfReviewForm.value = true;
}

const $q = useQuasar();
function uploadReview() {
  stateOfReviewForm.value = false;
  $q.notify({ message: `Google評論${formType.value === 'add' ? '上傳' : '編輯'}成功`, timeout: 600, position: 'top' });
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
      await deleteGoogleReview({ id });
      $q.notify({ message: '評論已刪除', timeout: 600, position: 'top' });
      getReviewList();
    }
    catch (err) {
      console.log(err);
    }
  });
}

const stateOfLightbox = ref(false);
const lightBoxImg = ref('');
</script>

<template>
  <div class="google-review">
    <div class="row items-end q-py-md">
      <div>
        <h2 class="text-headline-medium text-on-surface">Google評論管理</h2>
        <p class="note text-body-medium text-on-surface-variant">Google 評論數為 KPI 紅綠燈分數中的評分項目</p>
      </div>
      <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(stateOfReviewForm = true), (formType = 'add')" />
    </div>
    <QSeparator />
    <section class="google-review-content">
      <div class="google-review-content__header">
        <OptionSelect v-if="userStore.canI('EDIT_GOOGLE_REVIEW')" v-model="selectedTherapist" :options="bonusStore.therapistFilterOptions" @update:model-value="getReviewList" />
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
            <img :src="value" alt="screen shot" style="height: 30px; max-width:60px" @click="(lightBoxImg = value), (stateOfLightbox = true)">
          </QTd>
        </template>
        <template #body-cell-action="{ row }">
          <QTd auto-width>
            <QBtn v-if="userStore.canI('EDIT_GOOGLE_REVIEW')" flat round icon="o_delete" class="q-mr-sm" @click="deleteConfirm(row.id)" />
            <QBtn v-if="userStore.canI('EDIT_GOOGLE_REVIEW')" flat round icon="o_edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="stateOfReviewForm">
    <ReviewForm
      :type="formType" :init-vals="reviewInfo" :role="role"
      :review-id="targetReview"
      :therapist-options="bonusStore.scorerOptions"
      @close="stateOfReviewForm = false"
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
.google-review {
  h2 {
    margin-bottom: 12px;
  }
  .note {
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

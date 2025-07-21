<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useBonusStore, useUserStore } from '@/stores';
import { type QTableProps, useQuasar } from 'quasar';
import { ReviewState, type TrainingAllowance, deleteTrainingAllowance, getTrainingAllowance, getTrainingAllowanceList } from '@/api';
import dayjs from 'dayjs';
import TrainingAllowanceForm from '@/components/home/pointsNbonus/TrainingAllowanceForm.vue';
import { type FileType, detectFileType } from '@/utils/helpers';
import ReviewChip from '@/components/home/review/ReviewChip.vue';
import { BasicDialog } from '@/components/shared';

const userStore = useUserStore();
const bonusStore = useBonusStore();

const showUploadForm = ref(false);
const formType = ref<'add' | 'edit'>('add');
const selectedTherapist = ref();

const list = ref<(TrainingAllowance & { fileType: null | FileType })[]>([]);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

const cols: QTableProps['columns'] = [
  {
    name: 'user',
    required: true,
    label: '治療師',
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
    name: 'amount',
    required: true,
    label: '金額',
    align: 'right',
    style: 'width:150px',
    field: row => `$${row.amount}`,
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

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getReviewList();
};
async function getReviewList() {
  const userId = selectedTherapist.value || null;
  const { data, meta } = await getTrainingAllowanceList({ ...(userId && { userId }), page: pagination.value.page, take: pagination.value.rowsPerPage });
  list.value = await Promise.all(data.map(async (review) => {
    if (!review.attachmentUrl)
      return { ...review, fileType: null };

    // if alreay get fileType, skip fetch again
    const _file = list.value.find(file => file.id === review.id);
    if (!!_file && !!_file.fileType)
      return { ...review, fileType: _file.fileType };

    const fileType = await detectFileType(review.attachmentUrl);
    return { ...review, fileType };
  }));
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.itemCount ?? 1;
}

// upload
const targetBonus = ref();
const bonusInfo = ref<any>(null);
const role = computed(() => userStore.role);

async function editReview(id: number) {
  const data = await getTrainingAllowance(id);
  targetBonus.value = data.id;
  bonusInfo.value = {
    title: data.title,
    userId: data.user.id,
    amount: data.amount,
    reviewDate: dayjs(data.reviewDateTime).format('YYYY-MM-DD'),
    reviewTime: dayjs(data.reviewDateTime).format('HH:mm'),
    attachment: data.attachmentUrl,
  };
  formType.value = 'edit';
  showUploadForm.value = true;
}

const $q = useQuasar();
const showSuccess = ref(false);
function uploadReview() {
  showUploadForm.value = false;
  if (formType.value === 'add') {
    showSuccess.value = true;
  }
  else {
    $q.notify({ message: `培訓津貼編輯成功`, timeout: 600, position: 'top' });
  }
  getReviewList();
}

function deleteConfirm(id: number) {
  $q.dialog({
    title: '確定要刪除培訓津貼嗎？',
    message: '這個動作無法復原。',
    ok: '確定刪除',
    cancel: '取消',
  }).onOk(async () => {
    try {
      await deleteTrainingAllowance(id);
      $q.notify({ message: '培訓津貼已刪除', timeout: 600, position: 'top' });
      getReviewList();
    }
    catch (err) {
      console.log(err);
    }
  });
}

await bonusStore.getAvailableTherapistList();
selectedTherapist.value = bonusStore.therapistFilterOptions?.[0]?.value;
await getReviewList();

const stateOfLightbox = ref(false);
const lightBoxImg = ref('');

function checkAttachment(url: string) {
  window.open(url, '_black');
}
</script>

<template>
  <div>
    <section class="row items-end q-py-md">
      <div>
        <h3 class="text-headline-medium q-mb-md">培訓津貼管理</h3>
        <p class="text-body-medium">此項目計入薪資。將依「上傳時間」納入對應月份薪資。</p>
      </div>
      <div class="q-ml-auto">
        <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(showUploadForm = true), (formType = 'add')" />
      </div>
    </section>
    <QSeparator />
    <section>
      <div class="q-py-md">
        <OptionSelect v-if="userStore.canI('EDIT_TRAINING_ALLOWANCE')" v-model="selectedTherapist" :options="bonusStore.therapistFilterOptions" @update:model-value="getReviewList" />
      </div>
      <QTable
        v-model:pagination="pagination"
        :columns="cols"
        :rows="list"
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
            <QBtn v-if="userStore.canI('EDIT_TRAINING_ALLOWANCE') && (row.status === ReviewState['待審核'] || userStore.canI('EDIT_REVIEW'))" flat round icon="o_delete" class="q-mr-sm" @click="deleteConfirm(row.id)" />
            <QBtn v-if="userStore.canI('EDIT_TRAINING_ALLOWANCE') && (row.status === ReviewState['待審核'] || userStore.canI('EDIT_REVIEW'))" flat round icon="o_edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="showUploadForm">
    <TrainingAllowanceForm
      :type="formType" :init-vals="bonusInfo" :role="role"
      :bonus-id="targetBonus"
      :therapist-options="bonusStore.scorerOptions"
      @close="showUploadForm = false"
      @create="uploadReview"
    />
  </QDialog>
  <VueEasyLightbox
    :visible="stateOfLightbox"
    :imgs="lightBoxImg"
    @hide="stateOfLightbox = false"
  />
  <BasicDialog v-model="showSuccess" title="已上傳，等待審核中" close-label="我知道了" content="上傳成功，等待主管審核中。" max-width="312px" />
</template>

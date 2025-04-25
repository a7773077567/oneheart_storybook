<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useBonusStore, useUserStore } from '@/stores';
import { type QTableProps, useQuasar } from 'quasar';
import { type SupportBonus, deleteSupportBonus, getSupportBonus, getSupportBonusList } from '@/api';
import dayjs from 'dayjs';
import SupportBonusForm from '@/components/home/pointsNbonus/SupportBonusForm.vue';

const userStore = useUserStore();
const bonusStore = useBonusStore();

const showUploadForm = ref(false);
const formType = ref<'add' | 'edit'>('add');
const selectedTherapist = ref();

const list = ref<SupportBonus[]>([]);
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
  const { data, meta } = await getSupportBonusList({ ...(userId && { userId }), page: pagination.value.page, take: pagination.value.rowsPerPage });
  list.value = data;
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.itemCount ?? 1;
}

// upload
const targetBonus = ref();
const bonusInfo = ref<any>(null);
const role = computed(() => userStore.role);

async function editReview(id: number) {
  const data = await getSupportBonus(id);
  targetBonus.value = data.id;
  bonusInfo.value = {
    title: data.title,
    userId: data.user.id,
    amount: data.amount,
    reviewDate: dayjs(data.reviewDateTime).format('YYYY-MM-DD'),
    reviewTime: dayjs(data.reviewDateTime).format('HH:mm'),
  };
  formType.value = 'edit';
  showUploadForm.value = true;
}

const $q = useQuasar();
function uploadReview() {
  showUploadForm.value = false;
  $q.notify({ message: `支援獎金${formType.value === 'add' ? '上傳' : '編輯'}成功`, timeout: 600, position: 'top' });
  getReviewList();
}

function deleteConfirm(id: number) {
  $q.dialog({
    title: '確定要刪除支援獎金嗎？',
    message: '這個動作無法復原。',
    ok: '確定刪除',
    cancel: '取消',
  }).onOk(async () => {
    try {
      await deleteSupportBonus(id);
      $q.notify({ message: '支援獎金已刪除', timeout: 600, position: 'top' });
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
</script>

<template>
  <div>
    <section class="row items-end q-py-md">
      <div>
        <h3 class="text-headline-medium q-mb-md">支援獎金管理</h3>
        <p class="text-body-medium">此項目計入薪資。將依「上傳時間」納入對應月份薪資。</p>
      </div>
      <div class="q-ml-auto">
        <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="(showUploadForm = true), (formType = 'add')" />
      </div>
    </section>
    <QSeparator />
    <section>
      <div class="q-py-md">
        <OptionSelect v-if="userStore.canI('VIEW_SUPPORT_BONUS')" v-model="selectedTherapist" :options="bonusStore.therapistFilterOptions" @update:model-value="getReviewList" />
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
        <template #body-cell-reviewScreenshotUrl="{ value }">
          <QTd>
            <img :src="value" alt="screen shot" style="height:30px;width:60px">
          </QTd>
        </template>
        <template #body-cell-action="{ row }">
          <QTd auto-width>
            <QBtn v-if="userStore.canI('EDIT_SUPPORT_BONUS')" flat round icon="o_delete" class="q-mr-sm" @click="deleteConfirm(row.id)" />
            <QBtn v-if="userStore.canI('EDIT_SUPPORT_BONUS')" flat round icon="o_edit" @click="editReview(row.id)" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <QDialog v-model="showUploadForm">
    <SupportBonusForm
      :type="formType" :init-vals="bonusInfo" :role="role"
      :bonus-id="targetBonus"
      :therapist-options="bonusStore.scorerOptions"
      @close="showUploadForm = false"
      @create="uploadReview"
    />
  </QDialog>
</template>

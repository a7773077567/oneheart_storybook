<script setup lang='ts'>
import { ref } from 'vue';
import dayjs from 'dayjs';
import { type Review, type ReviewTypes, RoleType, approveReview, fetchUsers, getReivewNonapproveList, rejectReview } from '@/api';
import type { QTableProps } from 'quasar';
import { type FileType, detectFileType } from '@/utils/helpers';
import ReviewChip from '@/components/home/review/ReviewChip.vue';
import { BasicDialog } from '@/components/shared';
import { useNotify } from '@/composables/notify';

const therapistList = ref<{ label: string; value: number }[]>([]);
const selectedTherapist = ref(0);
const reviewList = ref<(Review & { fileType: null | FileType })[]>([]);
const showApproval = ref(false);
const showDecline = ref(false);

const reviewTypes: { [key in ReviewTypes]: string } = {
  TrainingAllowances: '培訓津貼',
  WritingAllowances: '寫作津貼',
  ExpatAllowances: '外派獎金',
  EducationPoints: '教育積分',
  GoogleReviews: 'Google 評論',
  SupportBonuses: '支援獎金',
  OtherBonuses: '其他津貼',
};
const cols: QTableProps['columns'] = [
  {
    name: 'type',
    required: true,
    label: '項目類型',
    align: 'left',
    style: 'width:150px',
    field: row => reviewTypes[row.type as ReviewTypes],
  },
  {
    name: 'status',
    required: true,
    label: '審核狀態',
    align: 'left',
    style: 'width:150px',
    field: row => row.status,
  },
  {
    name: 'applicantUser',
    required: true,
    label: '治療師',
    align: 'left',
    style: 'width:150px',
    field: row => row.applicantUser.name,
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
    label: '積分/金額',
    align: 'left',
    field: row => (row.amount && `$${row.amount}`) || (row.point && `${row.point} 積分`) || '-',
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

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getReviewList();
};

async function getReviewList() {
  const userId = selectedTherapist.value || null;
  const { data, meta } = await getReivewNonapproveList({ ...(userId && { userId }), page: pagination.value.page, take: pagination.value.rowsPerPage });

  reviewList.value = await Promise.all(data.map(async (review) => {
    if (!review.attachmentUrl)
      return { ...review, fileType: null };

    // if alreay get fileType, skip fetch again
    const _file = reviewList.value.find(file => file.id === review.id && file.type === review.type);
    if (!!_file && !!_file.fileType)
      return _file;

    const fileType = await detectFileType(review.attachmentUrl);
    return { ...review, fileType };
  }));
  pagination.value.page = meta?.page ?? 1;
  pagination.value.rowsNumber = meta?.itemCount ?? 1;
}

const stateOfLightbox = ref(false);
const lightBoxImg = ref('');

function checkAttachment(url: string) {
  window.open(url, '_black');
}

// 批准 or 駁回
const targetReview = ref<{ id: number; type: ReviewTypes } | null>(null);
async function handleApprove(review: typeof targetReview.value) {
  showApproval.value = false;
  if (!review)
    return;
  try {
    await approveReview(review);
    useNotify('審核已批准');
    getReviewList();
  }
  catch (error) {
    useNotify('審核失敗');
  }
}

async function handleDecline(review: typeof targetReview.value) {
  showDecline.value = false;
  if (!review)
    return;
  try {
    await rejectReview(review);
    useNotify('審核已駁回');
    getReviewList();
  }
  catch (error) {
    useNotify('審核失敗');
  }
}

// before mount
fetchUsers({ roleTypes: [RoleType['物理治療師'], RoleType['物理治療師組長'], RoleType['副院長'], RoleType['院長']] }).then(data => therapistList.value = [{ label: '所有治療師', value: 0 }, ...(data.map(p => ({ label: p.name, value: p.id })))]);
getReviewList();
</script>

<template>
  <div class="review">
    <h2 class="text-headline-medium text-on-surface">積分與獎金審核</h2>
    <div class="q-py-md">
      <OptionSelect v-model="selectedTherapist" :options="therapistList" @update:model-value="getReviewList" />
    </div>
    <section class="review-content">
      <QTable
        v-model:pagination="pagination"
        :columns="cols"
        :rows="reviewList"
        :row-key="(row: Review) => `${row.id}-${row.type}`"
        class="no-shadow"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
        @row-click="(_:Event, row: Review) => targetReview = ({ id: row.id, type: row.type })"
      >
        <template #body-cell-status="{ value }">
          <QTd>
            <ReviewChip :state="value" />
          </QTd>
        </template>
        <template #body-cell-attachmentUrl="{ value }">
          <QTd>
            <template v-if="value?.type === 'pdf'">
              <QIcon name="attach_file" size="sm" @click="checkAttachment(value.url)" />pdf
            </template>
            <img v-else-if="value?.type === 'image'" :src="value.url" alt="attachment" style="height:30px;width:60px" @click="(lightBoxImg = value.url), (stateOfLightbox = true)">
            <span v-else>-</span>
          </QTd>
        </template>
        <template #body-cell-action>
          <QTd auto-width>
            <QBtn rounded color="primary" class="q-mr-sm" label="批准" @click="showApproval = true" />
            <QBtn rounded color="error" label="駁回" @click="showDecline = true" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
  <BasicDialog v-model="showApproval" title="確定要批准嗎？" confirm-label="確定批准" max-width="312px" confirm-mode @cancel="showApproval = false" @confirm="handleApprove(targetReview)">
    <p>批准後將記入薪資或 KPI 紅綠燈分數。此動作無法復原。</p>
  </BasicDialog>
  <BasicDialog v-model="showDecline" title="確定要駁回嗎？" confirm-label="確定駁回" max-width="312px" confirm-mode @confirm="handleDecline(targetReview)" @cancel="showDecline = false">
    <p>駁回後將不記入薪資或 KPI 紅綠燈分數。此動作無法復原。</p>
  </BasicDialog>

  <VueEasyLightbox
    :visible="stateOfLightbox"
    :imgs="lightBoxImg"
    @hide="stateOfLightbox = false"
  />
</template>

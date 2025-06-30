<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator, QSpinner, is, useQuasar } from 'quasar';
import { type GoogleCommentDetail, type GoogleCommentOverview, RoleType, getGoogleCommentCountStatsList, getGoogleCommentCountStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import ReviewForm from '@/components/home/googleReview/GoogleReviewForm.vue';
import dayjs from 'dayjs';
import { showDecimal } from '@/utils/helpers';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<GoogleCommentOverview>({} as GoogleCommentOverview);

const scoreCols: QTableProps['columns'] = [
  {
    name: 'month',
    label: '月份',
    field: 'month',
    align: 'left',
    format: (val: number, row) => getMonthDifference(row.year, val) === 0 ? `${row.year} / ${val} (本月)` : `${row.year} / ${val}`,
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'commentCount',
    label: '評論數',
    field: 'commentCount',
    align: 'left',
    format: (val: number) => `${val} 則`,
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'points',
    required: true,
    label: '得分',
    field: 'points',
    format: val => `${val} 分`,
    headerStyle: 'font-size: 14px',
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.points));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.points));

// light box
const stateOfLightbox = ref(false);
const lightBoxImg = ref('');

// referral table
const googleCommentTable = ref<GoogleCommentDetail[]>([]);
const googleCommentCols: QTableProps['columns'] = [
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
    label: '上傳時間',
    align: 'left',
    field: 'reviewDateTime',
    format: val => dayjs(val).format('YYYY-MM-DD HH:mm'),
  },
  {
    name: 'reviewScreenshotUrl',
    required: true,
    label: '截圖',
    align: 'left',
    field: 'reviewScreenshotUrl',
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

async function getReferralClientList() {
  const { data, meta } = await getGoogleCommentCountStatsList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
  });
  googleCommentTable.value = data;
  pagination.value = {
    page: meta?.page ?? 1,
    rowsNumber: meta?.itemCount ?? 0,
    rowsPerPage: meta?.take ?? 10,
  };
}
const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;

  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getReferralClientList();
};

// upload review
const stateOfReviewForm = ref(false);
const $q = useQuasar();

function uploadReview() {
  stateOfReviewForm.value = false;
  $q.notify({ message: `Google評論上傳成功`, timeout: 600, position: 'top' });
  fetchAllData();
}

const isLoading = ref(true);
fetchAllData();

async function fetchAllData() {
  isLoading.value = true;
  await Promise.all([
    getGoogleCommentCountStatsOverview({ userId: +userId.value }),
    getReferralClientList(),
  ]).then(([data]) => {
    overview.value = data;
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="google_comment_detail">
    <h2 class="text-headline-medium">Google 評論計分詳情</h2>
    <h3 class="text-title-large">計分說明</h3>
    <p class="text-title-small">客戶在 Google 的評論次數，可於 <span class="text-primary text-title-small cursor-pointer" @click="$router.push({ name: 'googleReview' })">積分與獎金管理</span> 登錄積分。</p>
    <QSeparator style="margin: 32px 0" />
    <h3 class="text-title-large">計分明細</h3>
    <div class="row no-wrap">
      <section class="col-7">
        <div v-if="isLoading" class="text-center"> <QSpinner /></div>
        <template v-else>
          <QTable
            flat
            :rows="overview.detailList"
            :columns="scoreCols"
            row-key="index"
            virtual-scroll
            :rows-per-page-options="[0]"
            hide-pagination
          />
          <QSeparator class="q-mb-md" />
          <div class="score_calculation row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <span class="text-body-medium-highlight">計分方式</span>
              <p class="text-body-medium-highlight">三個月平均得分</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="text-body-medium q-mb-sm text-right">前三個月 ({{ previous3Scores.join('+') }}) / 3 </p>
              <p class="text-title-medium text-right">目前得分 {{ showDecimal(overview.currentPoint) }} 分</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="text-body-medium q-mb-sm text-right">近三個月 ({{ recent3Scores.join('+') }}) / 3 </p>
              <p class="text-title-medium text-right">預測得分 {{ showDecimal(overview.predictionPoint) }} 分</p>
            </div>
          </div>
        </template>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="text-label-large-perminent q-mb-sm">得分標準</h4>
        <p class="text-body-medium q-mb-sm">Google 評論適用統一得分標準不受職階影響</p>
        <div v-if="isLoading" class="text-center">
          <QSpinner />
        </div>
        <RuleList v-else :rules="overview.rules" class="q-mb-sm" label="次數" />
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3 class="text-title-large">Google 評論明細</h3>
      <div class="flex items-center q-mb-md justify-between">
        <p class="text-title-small">以下為近 4 個月內影響得分的 Google 評論明細。</p>
        <div class="flex">
          <QBtn color="primary" flat label="Google 評論管理" icon-right="chevron_right" class="q-mr-sm text-capitalize" @click="$router.push({ name: 'googleReview' })" />
          <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="stateOfReviewForm = true" />
        </div>
      </div>
      <div v-if="isLoading" class="text-center">
        <QSpinner />
      </div>
      <QTable
        v-else
        v-model:pagination="pagination"
        flat
        :rows="googleCommentTable"
        :columns="googleCommentCols"
        row-key="clientId"
        virtual-scroll
        rows-per-page-label="每頁顯示筆數"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      >
        <template #body-cell-reviewScreenshotUrl="{ row }">
          <QTd>
            <img :src="row.reviewScreenshotUrl" alt="screen shot" style="height: 100%; max-width: 60px;" @click="(lightBoxImg = row.reviewScreenshotUrl), (stateOfLightbox = true)">
          </QTd>
        </template>
      </QTable>
    </section>
    <VueEasyLightbox
      :visible="stateOfLightbox"
      :imgs="lightBoxImg"
      @hide="stateOfLightbox = false"
    />
    <QDialog v-model="stateOfReviewForm">
      <ReviewForm
        type="add"
        :role="RoleType['物理治療師']"
        :therapist-options="[{ label: $route.params.userName as string, value: +$route.params.userId }]"
        @close="stateOfReviewForm = false"
        @create="uploadReview"
      />
    </QDialog>
  </div>
</template>

<style scoped lang="scss">
.google_comment_detail {
  h2 {
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    margin-bottom: 16px;
  }
}
</style>

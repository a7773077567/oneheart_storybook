<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator, QSpinner, useQuasar } from 'quasar';
import { type EducationPointDetail, type EducationPointOverview, RoleType, getEducationPointList, getEducationPointStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import EducationPointsForm from '@/components/home/educationPoints/EducationPointsForm.vue';
import dayjs from 'dayjs';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<EducationPointOverview>({} as EducationPointOverview);

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
    name: 'educationPoints',
    required: true,
    label: '積分',
    field: 'educationPoints',
    format: val => `${val} 分`,
    headerStyle: 'font-size: 14px',
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.educationPoints));
const previous3ScoresTotal = computed(() => previous3Scores.value.reduce((total, score) => total += score, 0));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.educationPoints));
const recent3ScoresTotal = computed(() => recent3Scores.value.reduce((total, score) => total += score, 0));

// education point table
const educationPointTable = ref<EducationPointDetail[]>([]);
const educationPointCols: QTableProps['columns'] = [
  {
    name: 'title',
    required: true,
    label: '項目名稱',
    align: 'left',
    field: 'title',
  },
  {
    name: 'point',
    required: true,
    label: '教育積分',
    field: 'point',
    align: 'left',
    style: 'width: fit-content; max-width: 200px; white-space: pre-wrap',
  },
  {
    name: 'reviewDateTime',
    required: true,
    label: '建立時間',
    align: 'left',
    field: 'reviewDateTime',
    format: val => dayjs(val).format('YYYY-MM-DD HH:mm'),
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

async function getList() {
  const { data, meta } = await getEducationPointList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
  });
  educationPointTable.value = data;
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
  getList();
};

// upload point
const stateOfPointForm = ref(false);
const $q = useQuasar();

function uploadReview() {
  stateOfPointForm.value = false;
  $q.notify({ message: `教育積分上傳成功`, timeout: 600, position: 'top' });
  fetchAllData();
}

const isLoading = ref(false);
fetchAllData();

async function fetchAllData() {
  isLoading.value = true;
  await Promise.all([
    getEducationPointStatsOverview({ userId: +userId.value }),
    getList(),
  ]).then(([data]) => {
    overview.value = data;
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="education_detail">
    <h2 class="text-headline-medium text-on-surface">教育積分計分詳情</h2>
    <h3 class="text-title-large text-on-surface">計分說明</h3>
    <p class="note text-title-small text-on-surface">參與內部培訓或進修課程的積分，由管理者登錄積分。</p>
    <QSeparator style="margin: 32px 0" />
    <h3 class="text-title-large text-on-surface">計分明細</h3>
    <div class="row no-wrap">
      <section class="col-7">
        <div v-if="isLoading" class="text-center">
          <QSpinner />
        </div>
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
              <span class="body_medium_highlight">計分方式</span>
              <p class="body_medium_highlight">三個月加總後轉換得分</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="text-body-medium text-on-surface q-mb-sm text-right">前三個月 {{ previous3Scores.join('+') }} = {{ previous3ScoresTotal }} 積分 =</p>
              <p class="text-title_medium text-on-surface text-right">目前得分 {{ overview.currentPoint }} 分</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="text-body-medium text-on-surface q-mb-sm text-right">前三個月 {{ recent3Scores.join('+') }} = {{ recent3ScoresTotal }} 積分 =</p>
              <p class="text-title-medium text-on-surface text-right">預測得分 {{ overview.predictionPoint }} 分</p>
            </div>
          </div>
        </template>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="q-mb-sm text-label-large text-on-surface">得分標準</h4>
        <p class="text-body-medium q-mb-sm">教育積準適用統一得分標準不受職階影響</p>
        <div v-if="isLoading" class="text-center">
          <QSpinner />
        </div>
        <RuleList v-else :rules="overview.rules" class="q-mb-sm" label="積分" />
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section class="education_point_table">
      <h3 class="text-title-large text-on-surface">教育積分明細</h3>
      <div class="education_point_table--header q-mb-md">
        <p class="text-title-small text-on-surface">以下為近 4 個月內影響得分的教育積分明細。</p>
        <div>
          <QBtn color="primary" flat label="教育積分管理" icon-right="chevron_right" class="q-mr-sm" @click="$router.push({ name: 'educationPoints' })" />
          <QBtn color="primary" label="上傳" rounded icon="add" class="q-ml-auto" @click="stateOfPointForm = true" />
        </div>
      </div>
      <div v-if="isLoading" class="text-center">
        <QSpinner />
      </div>
      <QTable
        v-else
        v-model:pagination="pagination"
        flat
        :rows="educationPointTable"
        :columns="educationPointCols"
        row-key="clientId"
        virtual-scroll
        rows-per-page-label="每頁顯示筆數"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      />
    </section>
    <QDialog v-model="stateOfPointForm">
      <EducationPointsForm
        type="add"
        :role="RoleType['物理治療師']"
        :therapist-options="[{ label: $route.params.userName as string, value: +$route.params.userId }]"
        @close="stateOfPointForm = false"
        @create="uploadReview"
      />
    </QDialog>
  </div>
</template>

<style scoped lang="scss">
.education_detail {
  h2 {
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    margin-bottom: 16px;
  }
  .body_medium_highlight {
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 171.429% */
  }
  .education_point_table {
    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

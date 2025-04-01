<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import { type ReturnVisitRateDetail, type ReturnVisitRateOverview, getReturnVisitRateStatsList, getReturnVisitRateStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<ReturnVisitRateOverview>({} as ReturnVisitRateOverview);

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
    name: 'firstScheduleCount',
    required: true,
    label: '回診 / 初診人數',
    field: 'firstScheduleCount',
    format: (val, row) => `${row.returnVisitCount} 名 / ${val} 名`,
    headerStyle: 'font-size: 14px',
    align: 'left',
  },
  {
    name: 'returnVisitRate',
    required: true,
    label: '回診率',
    field: 'returnVisitRate',
    format: val => `${val}%`,
    headerStyle: 'font-size: 14px',
    align: 'left',
  },
  {
    name: 'points',
    required: true,
    label: '得分',
    field: 'points',
    format: val => `${val} 分`,
    headerStyle: 'font-size: 14px',
    align: 'right',
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.points));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.points));

// return visit rate table
const returnVisitRateTable = ref<ReturnVisitRateDetail[]>([]);
const cols: QTableProps['columns'] = [
  {
    name: 'clientName',
    required: true,
    label: '姓名',
    align: 'left',
    field: 'clientName',
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'clientPhoneNumber',
    required: true,
    label: '手機號碼',
    field: 'clientPhoneNumber',
    align: 'left',
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'isReturning',
    required: true,
    label: '回診狀況',
    align: 'left',
    field: 'isReturning',
    sortable: true,
    format: val => val ? '已回診' : '未回診',
    style: row => row.isReturning ? 'color: rgba(231, 93, 0, 1)' : 'color: rgba(26, 27, 33, 1)',
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'action',
    field: '',
    label: '',
    align: 'right',
    headerStyle: 'width: 50px',
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
  descending: false,
  sortBy: '',
});

async function getReturnVisitRateList() {
  const { data, meta } = await getReturnVisitRateStatsList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
    ...(pagination.value.sortBy ? { order: pagination.value.descending ? 'DESC' : 'ASC' } : {}),
  });
  returnVisitRateTable.value = data;
  pagination.value = {
    ...pagination.value,
    page: meta?.page ?? 1,
    rowsNumber: meta?.itemCount ?? 0,
    rowsPerPage: meta?.take ?? 10,
  };
}
const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, descending, sortBy } = props.pagination;

  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;

  pagination.value.descending = descending;
  pagination.value.sortBy = sortBy;
  getReturnVisitRateList();
};

await Promise.all([
  getReturnVisitRateStatsOverview({ userId: +userId.value }),
  getReturnVisitRateList(),
]).then(([data]) => {
  overview.value = data;
});
</script>

<template>
  <div class="return_rate">
    <h2>回診率計分詳情</h2>
    <h3>計分說明</h3>
    <p class="note">「初診患者」在 2 個月內的回診比例。</p>
    <QSeparator style="margin: 32px 0" />
    <h3>計分明細</h3>
    <div class="row no-wrap">
      <section class="col-7">
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
            <p class="body_medium_highlight">三個月平均得分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="body_medium q-mb-sm text-right">前三個月 ({{ previous3Scores.join('+') }}) / 3</p>
            <p class="title_medium text-right">目前得分 {{ overview.currentPoint }} 分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="body_medium q-mb-sm text-right">前三個月 ({{ recent3Scores.join('+') }}) / 3</p>
            <p class="title_medium text-right">預測得分 {{ overview.predictionPoint }} 分</p>
          </div>
        </div>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="label_large q-mb-sm">得分標準</h4>
        <p class="body_medium q-mb-sm">您本月職階為 PT {{ overview.currentPTLevel }}，得分標準如下：</p>
        <RuleList :rules="overview.rules" class="q-mb-sm" unit="%" label="回診率" />
        <p class="body_medium q-mb-sm">*職階由管理者設定，每月可能變動</p>
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3>初診客戶回診明細</h3>
      <p class="title_small q-mb-md">聯繫「未回診客戶」以提高您本月的回診率得分。</p>
      <QTable
        v-model:pagination="pagination"
        flat
        :rows="returnVisitRateTable"
        :columns="cols"
        row-key="clientId"
        virtual-scroll
        rows-per-page-label="每頁顯示筆數"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      >
        <template #body-cell-action="{ row }">
          <QTd>
            <QBtn flat round icon="chevron_right" @click="$router.push({ name: 'clientInfo', params: { clientId: row.clientId } })" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
</template>

<style scoped lang="scss">
.return_rate {
  h2 {
    @include headline-medium($on-surface);
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    @include title-large($on-surface);
    margin-bottom: 16px;
  }
  .note {
    @include title-small($on-surface);
  }
  .label_large {
    @include label-large($on-surface);
    font-weight: 700;
  }
  .title_medium {
    @include title-medium($on-surface);
  }
  .title_small {
    @include title-small($on-surface);
  }
  .body_medium {
    @include body-medium($on-surface);
  }
  .body_medium_highlight {
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 171.429% */
  }
}
</style>

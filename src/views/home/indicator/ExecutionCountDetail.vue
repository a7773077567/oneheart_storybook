<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import { type ExecutionCountDetail, type ExecutionCountOverview, PTLevel, getExecutionCountStatsList, getExecutionCountStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import { ShiftType } from '@/const/general';
import { showDecimal } from '@/utils/helpers';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<ExecutionCountOverview>({} as ExecutionCountOverview);

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
    name: 'executionCount',
    required: true,
    label: '執行數',
    field: 'executionCount',
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
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.points));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.points));

// executed reservation table
const executedReservationTable = ref<ExecutionCountDetail[]>([]);
const executedReservationCols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    field: 'date',
  },
  {
    name: 'scheduleStartTime',
    field: 'scheduleStartTime',
    required: true,
    label: '時間',
    align: 'left',
    format: (startTime, row) => `${startTime} - ${row.scheduleEndTime}`,
  },
  {
    name: 'client',
    field: 'client',
    required: true,
    label: '客戶名稱',
    align: 'left',
    format: val => val.name,
  },
  {
    name: 'userShift',
    required: true,
    label: '項目',
    field: 'userShift',
    align: 'left',
    format: val => ShiftType[val.type],
  },
  {
    name: 'addOnServices',
    field: 'addOnServices',
    format: (val) => {
      const services = (val as ExecutionCountDetail['addOnServices']).filter(service => service.isAddOn).map(service => service.serviceName);
      return services.length === 0 ? '-' : services.join('、');
    },
    label: '加購服務',
    align: 'left',
  },
  {
    name: 'executionCount',
    field: 'executionCount',
    label: '執行數',
    align: 'left',
    headerStyle: 'width: 150px',
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
});

async function getReferralClientList() {
  const { data, meta } = await getExecutionCountStatsList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
  });
  executedReservationTable.value = data;
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

await Promise.all([
  getExecutionCountStatsOverview({ userId: +userId.value }),
  getReferralClientList(),
]).then(([data]) => {
  overview.value = data;
});
</script>

<template>
  <div class="execution_detail">
    <h2 class="text-headline-medium text-on-surface">執行數計分詳情</h2>
    <h3 class="text-title-large text-on-surface">計分說明</h3>
    <p class="note text-title-small text-on-surface">已完成服務與病例的「一般預約」與「射頻治療」時數，依不同權重計算，換算為最終執行數。</p>
    <QSeparator style="margin: 32px 0" />
    <h3 class="text-title-large text-on-surface">計分明細</h3>
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
            <span class="text-body-medium-highlight">計分方式</span>
            <p class="text-body-medium-highlight">三個月平均得分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">前三個月 ({{ previous3Scores.join('+') }}) / 3</p>
            <p class="text-title-medium text-on-surface text-right">目前得分 {{ showDecimal(overview.currentPoint) }} 分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">近三個月 ({{ recent3Scores.join('+') }}) / 3</p>
            <p class="text-title-medium text-right">預測得分 {{ showDecimal(overview.predictionPoint) }} 分</p>
          </div>
        </div>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="text-label-large text-on-surface q-mb-sm" style="font-weight: 700;">得分標準</h4>
        <p class="text-body-medium text-on-surface q-mb-sm">
          您本月職階為 {{ PTLevel[overview.currentPTLevel] }}
          <template v-if="overview.currentPTLevel !== PTLevel['PT院長']">，得分標準如下：</template>
        </p>
        <RuleList v-if="overview.currentPTLevel !== PTLevel['PT院長']" :rules="overview.rules" class="q-mb-sm" label="執行數" />
        <p class="text-body-medium text-on-surface q-mb-sm">*職階由管理者設定，每月可能變動</p>
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3 class="text-title-large text-on-surface">預約單執行數明細</h3>
      <p class="text-title-small text-on-surface q-mb-md">以下為近 4 個月內影響執行數得分的預約單。需注意，執行數依「一般預約」與「射頻治療」適用不同權重計算，非單純累計服務時數。</p>

      <QTable
        v-model:pagination="pagination"
        flat
        :rows="executedReservationTable"
        :columns="executedReservationCols"
        row-key="clientId"
        virtual-scroll
        rows-per-page-label="每頁顯示筆數"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      >
        <template #body-cell-action="{ row }">
          <QTd>
            <QBtn :disable="!row.id" flat round icon="chevron_right" @click="$router.push({ name: 'appointmentListInfo', params: { scheduleId: row.id } })" />
          </QTd>
        </template>
      </QTable>
    </section>
  </div>
</template>

<style scoped lang="scss">
.execution_detail {
  h2 {
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    margin-bottom: 16px;
  }
}
</style>

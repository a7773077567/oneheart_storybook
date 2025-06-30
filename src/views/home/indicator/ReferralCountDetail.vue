<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import { PTLevel, type ReferralDetail, type ReferralOverview, getReferralStatsList, getReferralStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import { ShiftType } from '@/const/general';
import { showDecimal } from '@/utils/helpers';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<ReferralOverview>({} as ReferralOverview);

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
    name: 'referralCount',
    required: true,
    label: '轉介人數',
    field: 'referralCount',
    format: val => `${val} 人`,
    headerStyle: 'font-size: 14px',
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.referralCount));
const previous3ScoresTotal = computed(() => previous3Scores.value.reduce((total, score) => total += score, 0));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.referralCount));
const recent3ScoresTotal = computed(() => recent3Scores.value.reduce((total, score) => total += score, 0));

// referral table
const referralClientTable = ref<ReferralDetail[]>([]);
const referralDetailCols: QTableProps['columns'] = [
  {
    name: 'clientName',
    required: true,
    label: '初診轉介客戶',
    align: 'left',
    field: 'clientName',
  },
  {
    name: 'userShiftType',
    required: true,
    label: '項目',
    field: 'userShiftType',
    align: 'left',
    format: val => ShiftType[val],
  },
  {
    name: 'referralClientName',
    required: true,
    label: '推薦人',
    align: 'left',
    field: 'referralClientName',
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
  const { data, meta } = await getReferralStatsList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
  });
  referralClientTable.value = data;
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
  getReferralStatsOverview({ userId: +userId.value }),
  getReferralClientList(),
]).then(([data]) => {
  overview.value = data;
});
</script>

<template>
  <div class="referral_detail">
    <h2 class="text-headline-medium text-on-surface">轉介數計分詳情</h2>
    <h3 class="text-title-large text-on-surface">計分說明</h3>
    <p class="text-title-small text-on-surface">初診客戶的推薦人為您的既有客戶。客戶 A 為您的客戶，並推薦客戶 B 進行服務，當客戶 B 完成治療，您的轉介數 +1。</p>
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
            <p class="text-body-medium-highlight">三個月加總後轉換得分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">前三個月 {{ previous3Scores.join('+') }} = {{ previous3ScoresTotal }} 人 =</p>
            <p class="text-title-medium text-on-surface text-right">目前得分 {{ showDecimal(overview.currentPoint) }} 分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">近三個月 {{ recent3Scores.join('+') }} = {{ recent3ScoresTotal }} 人 =</p>
            <p class="text-title-medium text-on-surface text-right">預測得分 {{ showDecimal(overview.predictionPoint) }} 分</p>
          </div>
        </div>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="text-label-large-perminent text-on-surface q-mb-sm">得分標準</h4>
        <p class="text-body-medium text-on-surface q-mb-sm">
          您本月職階為 {{ PTLevel[overview.currentPTLevel] }}
          <template v-if="overview.currentPTLevel !== PTLevel['PT院長']">，得分標準如下：</template>
        </p>
        <RuleList v-if="overview.currentPTLevel !== PTLevel['PT院長']" :rules="overview.rules" unit="人" class="q-mb-sm" label="數值" />
        <p class="text-body-medium text-on-surface q-mb-sm">*職階由管理者設定，每月可能變動</p>
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3 class="text-title-large text-on-surface">轉介數明細</h3>
      <p class="text-title-small text-on-surface q-mb-md">以下為近 4 個月內成功轉介，並影響得分的初診客戶名單。</p>

      <QTable
        v-model:pagination="pagination"
        flat
        :rows="referralClientTable"
        :columns="referralDetailCols"
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
.referral_detail {
  h2 {
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    margin-bottom: 16px;
  }
}
</style>

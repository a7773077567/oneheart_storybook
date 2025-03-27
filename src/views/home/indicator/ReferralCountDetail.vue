<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import { type ReferralDetail, type ReferralOverview, getReferralStatsList, getReferralStatsOverview } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import { ShiftType } from '@/const/general';

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
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.referralCount));

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
    <h2>轉介數計分詳情</h2>
    <h3>計分說明</h3>
    <p class="note">初診客戶的推薦人為您的既有客戶。客戶 A 為您的客戶，並推薦客戶 B 進行服務，當客戶 B 完成治療，您的轉介數 +1。</p>
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
            <p class="body_medium_highlight">三個月加總後轉換得分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="body_medium q-mb-sm text-right">前三個月 {{ previous3Scores.join('+') }} = {{ overview.currentPoint }} 人 =</p>
            <p class="title_medium text-right">目前得分 {{ overview.currentPoint }} 分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="body_medium q-mb-sm text-right">前三個月 {{ recent3Scores.join('+') }} = {{ overview.predictionPoint }} 人 =</p>
            <p class="title_medium text-right">預測得分 {{ overview.predictionPoint }} 分</p>
          </div>
        </div>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-3">
        <h4 class="label_large q-mb-sm">得分標準</h4>
        <p class="body_medium q-mb-sm">您本月職階為 PT {{ overview.currentPTLevel }}，得分標準如下：</p>
        <RuleList :rules="overview.rules" unit="人" class="q-mb-sm" label="數值" />
        <p class="body_medium q-mb-sm">*職階由管理者設定，每月可能變動</p>
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3>轉介數明細</h3>
      <p class="title_small q-mb-md">以下為近 4 個月內成功轉介，並影響得分的初診客戶名單。</p>

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

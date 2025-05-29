<script setup lang="ts">
import { RoleType } from '@/api';
import { ExpansionItem, MoneyDisplay, OrganizationChart, Table } from '@/components/home/salaryReport';
import { BasicBtn, BasicTabs } from '@/components/shared';
import { useSalaryReportStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { computed, reactive, watch } from 'vue';
import { RouterLink } from 'vue-router';

const salaryStore = useSalaryReportStore();
const userStore = useUserStore();
const $q = useQuasar();

// reset authentication to ensure whenever we enter this page, we need to re-authenticate
salaryStore.isAuthenticated = false;

const tabs = ['當前月', '上個月', '上上個月'].map((item, idx) => {
  return {
    name: `${getDate(0 - idx, 'YYYY/MM')}`,
    label: `${getDate(0 - idx)} 月 (${item})`,
  };
});

const state = reactive({
  currentTab: tabs[0].name,
  showAmount: true,
  educationSharingExpand: false,
});

watch(
  () => state.currentTab,
  async () => {
    $q.loading.show();
    await salaryStore.getTherapistSalaryDetail(
      userStore.userInfo!.id,
      state.currentTab,
    );
    $q.loading.hide();
  },
  { immediate: true },
);

const expansionItems = computed(() => {
  return [
    { ...salaryStore.executionAmount },
    salaryStore.shockWaveSharing,
    salaryStore.magneticWaveSharing,
    salaryStore.gChairSharing,
    salaryStore.SecondmentBonus,
    salaryStore.educationSharing,
    salaryStore.recommendationBonus,
    salaryStore.writingBonus,
    salaryStore.positionBonus,
    salaryStore.assistanceBonus,
  ];
});

function getDate(offset: number, format?: string) {
  const date = offset < 0
    ? dayjs().subtract(Math.abs(offset), 'month')
    : dayjs().add(offset, 'month');

  return format
    ? date.format(format)
    : date.month() + 1;
}

function showPositionBonus(itemLabel: string) {
  return itemLabel !== '職務獎金' || [RoleType['院長'], RoleType['副院長'], RoleType['物理治療師組長']].includes(userStore.role);
}
</script>

<template>
  <div class="details">
    <div class="details__header">
      <BasicTabs
        v-model="state.currentTab"
        :tabs="tabs"
      />
      <MoneyDisplay
        v-model="state.showAmount"
        :dot-number="5"
        :amount="salaryStore.totalAmount"
        label="薪資"
        visibility-toggle
      />
      <!-- <BasicBtn label="確認薪資" style="justify-self: end;" /> -->
    </div>
    <div class="details__body">
      <QList>
        <template
          v-for="(item, idx) in expansionItems"
          :key="idx"
        >
          <ExpansionItem
            v-if="showPositionBonus(item.label)"
            :model-value="item.label === '教育分潤' ? state.educationSharingExpand : undefined"
            :label="item.label"
            :amount="item.amount"
            :show-amount="state.showAmount"
            :details="item.details"
            :disable="!state.showAmount"
            @update:model-value="item.label === '教育分潤' && (state.educationSharingExpand = $event)"
          >
            <template
              v-if="!state.showAmount"
              #tooltip
            >
              <QTooltip v-if="!state.showAmount">為保護您的隱私，請開啟眼睛以查看薪資詳情。</QTooltip>
            </template>

            <template v-if="item.label === '教育分潤'" #body>
              <div v-if="state.educationSharingExpand" class="table-wrapper">
                <Table
                  :columns="salaryStore.educationSharingTable.columns"
                  :rows="salaryStore.educationSharingTable.rows"
                />
                <OrganizationChart
                  :data="salaryStore.educationSharingRelationship"
                />
              </div>
            </template>
            <template v-else-if="item.label === '推薦獎金'" #body>
              <div class="table-wrapper">
                <Table
                  :columns="salaryStore.recommendationBonusTable.columns"
                  :rows="salaryStore.recommendationBonusTable.rows"
                />
              </div>
            </template>
            <template v-else-if="item.label === '職務獎金' && RoleType[userStore.role] === '系統管理者'" #body>
              <div class="table-wrapper">
                <div class="caption--position">
                  <QIcon name="o_info" size="20px" />
                  <span>$10,000 或 營收 1% 擇優發放。</span>
                </div>
                <Table
                  :columns="salaryStore.positionBonusTable.columns"
                  :rows="salaryStore.positionBonusTable.rows"
                >
                  <template
                    #body-cell="props"
                  >
                    <QTd :props="props">
                      <template v-if="props.row.performanceTarget === '狀態'">
                        <template v-if="props.value === '狀態'">
                          狀態
                        </template>
                        <template v-else>
                          <span
                            :class="[props.value ? 'text-forest' : 'text-warning']"
                          >{{ props.value ? '達成' : '未達成' }}</span>
                        </template>
                      </template>
                      <template v-else>
                        {{ props.value }}
                      </template>
                    </QTd>
                  </template>
                </Table>
              </div>
            </template>
            <template v-if="item.label === '執行時段應發總金額'" #row-0>
              <div class="caption">
                <QIcon name="o_info" size="20px" />
                <span>由「本薪」或「總執行數 * 單價」擇優發放。</span>
              </div>
            </template>
            <template v-else-if="item.label === '外派獎金'" #row-1>
              <RouterLink :to="{ name: 'relocationBonus' }" class="anchor">查看外派獎金列表</RouterLink>
            </template>
            <template v-else-if="item.label === '寫作津貼'" #row-1>
              <RouterLink :to="{ name: 'writingAllowance' }" class="anchor">查看寫作津貼列表</RouterLink>
            </template>
            <template v-else-if="item.label === '支援獎金'" #row-1>
              <RouterLink :to="{ name: 'supportBonus' }" class="anchor">查看支援獎金列表</RouterLink>
            </template>
          </ExpansionItem>
        </template>
      </QList>
    </div>
    <div class="details__actions">
      <!-- <BasicBtn label="確認薪資" /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: scroll;
  &__header {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 24px;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

.amount-caption {
  display: flex;
  align-items: center;
  gap: 8px;

  > p {
    @include text-style($body-large, $on-surface-variant);
  }
}

.table-wrapper {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.caption {
  display: flex;
  gap: 8px;
  align-items: center;
  color: $on-surface-variant;
  span {
    @include text-style($body-large, $on-surface-variant);
  }

  &--position {
    @extend .caption;
    border-bottom: 1px solid $outline-variant;
    padding: 12px;
  }
}

.anchor {
  @include text-style($body-large, $primary);
}

:deep(.q-item__label) {
  @include text-style($title-small, $on-surface);
}

:global(.q-tooltip) {
  background-color: $inverse-surface;
  @include text-style($body-small, $inverse-on-surface);
}
</style>

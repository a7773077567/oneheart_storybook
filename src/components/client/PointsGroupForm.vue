<script setup lang='ts'>
import { computed } from 'vue';
import { OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { pointsGroupOptions } from '@/const/general';
import GroupMemberField from './GroupMemberField.vue';

const props = defineProps<{
  type: 'add' | 'edit';
  initialValues: any;
  state: boolean;
}>();

defineEmits<{
  (e: 'update:state', val: boolean): void;
}>();

const { handleSubmit } = useForm({ initialValues: computed(() => props.initialValues) });

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <QDialog :model-value="state" @update:model-value="$emit('update:state', $event)">
    <QCard class="points_group_form">
      <QCardSection>
        <span class="points_group_form--title">{{ type === 'add' ? '新增' : '編輯' }}群組</span>
      </QCardSection>
      <QCardSection class="q-py-lg">
        <form class="row q-col-gutter-md" @submit.prevent>
          <fieldset class="col-6">
            <span class="label">群組類別</span>
            <OSelect name="type" :options="pointsGroupOptions" hide-bottom-space :virtual-scroll-item-size="50" />
          </fieldset>
          <fieldset class="col-12">
            <span class="label">群組名稱</span>
            <OInput name="name" hide-bottom-space placeholder="請輸入群組名稱" />
          </fieldset>
          <section class="col-12">
            <div class="label_divider">
              群長
            </div>
            <GroupMemberField :model-value="{ name: '123', phone: null, id: null }" />
          </section>
          <section class="col-12">
            <div class="label_divider">
              群組人員
            </div>
            <GroupMemberField :model-value="{ name: '123', phone: null, id: null }" />
          </section>
        </form>
      </QCardSection>
      <QCardActions vertical class="q-pa-lg">
        <QBtn :label="type === 'add' ? '新增' : '確認修改'" color="black" @click="onSubmit" />
        <QBtn label="取消" @click="$emit('update:state', false)" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<style scoped lang="scss">
.points_group_form {
  max-width: 800px;

  form {
    fieldset {
      display: flex;
      align-items: center;
    }
    .label {
      margin-right: 8px;
    }
    .label_divider {
      background: #e0e0e0;
      padding: 6px;
      margin-bottom: 12px;
    }
  }
  &--title {
    font-weight: 500;
    text-align: center;
  }
  .group_member {
    display: flex;
  }
}
</style>

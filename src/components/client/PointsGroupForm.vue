<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { computed, ref } from 'vue';
import { ClientSearch, OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { PointTypes, pointsGroupOptions } from '@/const/general';
import GroupMemberField from './GroupMemberField.vue';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';
import type { Client, CreateGroupField, EditGroupField, PointsGroup } from '@/api';

const props = defineProps<{
  type: 'add' | 'edit';
  initVal: Partial<PointsGroup> | PointsGroup;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'create', values: CreateGroupField): void;
  (e: 'edit', values: { clientGroupId: number } & EditGroupField): void;
}>();

const pointGroupSchema = z.object({
  type: z.nativeEnum(PointTypes),
  name: z.string(),
  adminClient: z.object({ name: z.string(), phone: z.string(), id: z.number() }),
  memberClients: z.array(z.object({ name: z.string(), phone: z.string(), id: z.number() })).optional(),
});

const initialValues = computed(() => props.initVal);
const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: toTypedSchema(pointGroupSchema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit((values) => {
  const memberClientIds = values.memberClients?.map(member => member.id) ?? [];
  if (props.type === 'add') {
    const { name, type } = values;
    const adminClientId = values.adminClient.id;
    emit('create', { type, name, adminClientId, memberClientIds });
  }
  else {
    emit('edit', { clientGroupId: (props.initVal as PointsGroup).id, name: values.name, memberClientIds });
  }
});

const showClientSearch = ref(false);

function handleMemberChose(members: Client[]) {
  showClientSearch.value = false;

  const duplicateMember = members.filter(newMember => !((values.memberClients ?? []) as Client[]).map(c => c.id).includes(newMember.id));
  const newMemberList = [...values.memberClients ?? [], ...duplicateMember];
  setFieldValue('memberClients', newMemberList);
}

function removeMember(delMember: Client) {
  const newMemberList = (values.memberClients as Client[])?.filter(member => member.id !== delMember.id);
  setFieldValue('memberClients', newMemberList);
}
</script>

<template>
  <QCard class="points_group_form">
    <QCardSection>
      <span class="points_group_form--title">{{ type === 'add' ? '新增' : '編輯' }}群組</span>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <form class="row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-6">
          <span class="label">群組類別</span>
          <OSelect name="type" :options="pointsGroupOptions" hide-bottom-space :virtual-scroll-item-size="50" error-message="" />
        </fieldset>
        <fieldset class="col-12">
          <span class="label">群組名稱</span>
          <OInput name="name" hide-bottom-space placeholder="請輸入群組名稱" error-message="" />
        </fieldset>
        <section class="col-12">
          <div class="label_divider">
            群長
          </div>
          <GroupMemberField name="adminClient" hide-delete />
        </section>
        <section class="col-12">
          <div class="label_divider">
            群組人員
          </div>
          <template v-for="(member, idx) in values.memberClients" :key="member.id">
            <GroupMemberField :name="`memberClients[${idx}]`" class="q-my-sm" @remove="removeMember" />
          </template>
        </section>
        <div class="q-mt-md">
          <QBtn flat label="新增群組人員" icon="o_add" @click="showClientSearch = true" />
        </div>
      </form>
    </QCardSection>
    <QCardActions vertical class="q-pa-lg">
      <QBtn :label="type === 'add' ? '新增' : '確認修改'" color="black" @click="onSubmit" />
      <QBtn label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
  <QDialog v-model="showClientSearch">
    <ClientSearch multiple @select="handleMemberChose" @cancel="showClientSearch = false" />
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

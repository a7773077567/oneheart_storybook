<script setup lang='ts'>
import { OInput, OSelect } from '@/components/shared';
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { useClientStore } from '@/stores';
import { pick } from 'radash';

const props = defineProps<{
  clientId: string;
}>();

const clientStore = useClientStore();
await clientStore.getClientInfo(+props.clientId);

const initialValues = computed(() => clientStore.targetClient ? pick(clientStore.targetClient, ['name', 'phone', 'identityNumber', 'birthDate']) : {});
useForm({ initialValues });

const isEdit = ref(false);
const genderOptions = ['生理男', '生理女'].map(o => ({ label: o, value: o }));
</script>

<template>
  <div>
    <div class="q-mb-lg flex justify-between">
      <QBadge color="blue" class="q-px-sm text-body1">
        客戶編號
        #{{ clientId }}
      </QBadge>
      <QBtn round :icon="isEdit ? 'o_save' : 'o_edit'" size="sm" @click="isEdit = !isEdit" />
    </div>
    <div class="user-settings__form">
      <form class="client_basic_info_form row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-12 col-md-4">
          <span class="label">姓名</span>
          <OInput name="name" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-4">
          <span class="label">電話</span>
          <OInput name="phone" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-4">
          <span class="label">性別</span>
          <OSelect name="gender" hide-bottom-space :readonly="!isEdit" :options="genderOptions" class="col-grow" />
        </fieldset>

        <fieldset class="col-12 col-md-4">
          <span class="label">身分證</span>
          <OInput name="identityNumber" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>

        <fieldset class="col-12 col-md-4">
          <span class="label">生日</span>
          <OInput name="birthDate" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>

        <fieldset class="col-12">
          <span class="label">地址</span>
          <OInput name="address" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <span class="label">備註</span>
          <OInput name="remark" hide-bottom-space type="textarea" class="full-width" :readonly="!isEdit" />
        </fieldset>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.client_basic_info_form {
  fieldset {
    display: flex;
    align-items: center;
    gap: 8px;
    > span.label {
      width: 50px;
    }
    .q-field {
      flex: 1;
    }
    .q-field.q-field--readonly {
      background: #e0e0e0;
    }
  }
}
</style>

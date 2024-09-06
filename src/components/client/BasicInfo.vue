<script setup lang='ts'>
import { OInput, OMemberSearch, OSelect } from '@/components/shared';
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { useClientStore } from '@/stores';
import { omit, pick } from 'radash';
import { type Client, updateClient, updateIntroducer } from '@/api';
import { useQuasar } from 'quasar';
import { ShiftType, genderOptions } from '@/const/general';

const props = defineProps<{
  clientId: string;
}>();

const clientStore = useClientStore();
await Promise.allSettled([clientStore.getClientInfo(+props.clientId), clientStore.getDepInChargeTherapist(+props.clientId)]);

const initialValues = computed<Partial<Client>>(() => clientStore.targetClient ? pick(clientStore.targetClient, ['name', 'phone', 'identityNumber', 'birthDate', 'gender', 'address', 'note', 'howToKnowUs', 'introducer']) : {});
const { handleSubmit } = useForm({ initialValues: initialValues.value });

const isEdit = ref(false);

// introducer
const isIntroducerNull = computed(() => initialValues.value.introducer === null);

const $q = useQuasar();
const onSubmit = handleSubmit(async (value) => {
  const apiValues = omit(value as Client, ['howToKnowUs', 'introducer']);
  const fetch = [updateClient(props.clientId, apiValues)];
  if (isIntroducerNull.value && !!value.introducer) {
    fetch.push(updateIntroducer(+props.clientId, { introducerClientId: +value.introducer }));
  }
  await Promise.all(fetch);
  isEdit.value = false;
  $q.notify({ message: '已存檔！', timeout: 200, position: 'center' });
});

const departmentTherapists = computed(() => [{
  key: '科別',
  val: '治療師',
}, ...clientStore.inChargeUsers.map(therapist => ({
  key: ShiftType[therapist.userShiftType],
  val: therapist.inChargeUserName,
}))]);
</script>

<template>
  <div>
    <section class="user-settings__form q-mb-lg">
      <div class="flex items-center justify-between q-mb-md">
        <h3 class="subtitle">基本資料</h3>
        <div>
          <QBtn v-if="isEdit" outlined label="儲存" class="q-px-lg" @click="onSubmit" />
          <QBtn v-else color="black" label="編輯" class="q-px-lg" @click="isEdit = true" />
        </div>
      </div>
      <form class="client_basic_info_form row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-12 col-md-6">
          <span class="label">姓名</span>
          <OInput name="name" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">電話</span>
          <OInput name="phone" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">性別</span>
          <OSelect name="gender" hide-bottom-space :readonly="!isEdit" :options="genderOptions" class="col-grow" style="background:white" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">生日</span>
          <OInput name="birthDate" hide-bottom-space :readonly="!isEdit" class="col-grow" date-mode />
        </fieldset>

        <fieldset class="col-12">
          <span class="label">身分證</span>
          <OInput name="identityNumber" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>

        <fieldset class="col-12">
          <span class="label">地址</span>
          <OInput name="address" hide-bottom-space :readonly="!isEdit" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <span class="label">介紹人</span>
          <OMemberSearch name="introducer" class="full-width" :readonly="!isEdit || !isIntroducerNull" />
        </fieldset>
        <fieldset class="col-12">
          <span class="label">從哪裡知道我們</span>
          <OInput name="howToKnowUs" hide-bottom-space class="full-width" readonly />
        </fieldset>
        <fieldset class="col-12">
          <span class="label">備註</span>
          <OInput name="note" hide-bottom-space type="textarea" class="full-width" :readonly="!isEdit" />
        </fieldset>
      </form>
    </section>

    <section>
      <h3 class="subtitle q-mb-md">科別負責人員</h3>
      <div class="department_list">
        <div v-for="department in departmentTherapists" :key="department.key" class="row">
          <div class="col-auto department_list__key">
            {{ department.key }}
          </div>
          <div class="col department_list__val">
            {{ department.val }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.subtitle {
  font-size: 16px;
  font-weight: 700;
}
.client_basic_info_form {
  fieldset {
    display: flex;
    align-items: center;
    gap: 8px;
    > span.label {
      width: 90px;
      text-align: right;
      flex-shrink: 0;
    }
    .q-field {
      flex: 1;
    }
    .q-field.q-field--readonly {
      background: #e0e0e0;
    }
  }
}

.department_list {
  max-width: 600px;
  .row > div {
    padding: 10px;
    border: 1px solid black;
  }
  &__key {
    width: 250px;
  }
}
</style>

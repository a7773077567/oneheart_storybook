<script setup lang="ts">
import { authenticateSalaryDetail } from '@/api/home/salaryReport/therapist';
import { useDialog } from '@/composables/dialog';
import { useSalaryReportTherapistStore } from '@/stores/home/salaryReport/therapist';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const salaryReportStore = useSalaryReportTherapistStore();
const isPwd = ref(true);
const pwd = ref('');

async function onSubmit() {
  try {
    const res = await authenticateSalaryDetail(pwd.value);
    if (res === 'Password matched') {
      salaryReportStore.isAuthenticated = true;
      router.push({ name: 'salaryReportDetails' });
    }
  }
  catch (err) {
    console.error(err);
    useDialog({
      title: '密碼錯誤',
      message: '請重新輸入密碼',
      type: 'confirm',
    });
  }
}
</script>

<template>
  <div class="authentication">
    <div class="authentication__title">
      <div class="title">輸入登入密碼以查看個人薪資</div>
    </div>
    <div class="authentication__pwd">
      <QInput
        v-model="pwd"
        :type="isPwd ? 'password' : 'text'"
        outlined placeholder="密碼"
      >
        <template #append>
          <QIcon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </QInput>
    </div>
    <div class="authentication__btn">
      <BasicBtn
        label="確定密碼"
        padding="10px 24px"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authentication {
  width: 592px;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;

  &__pwd {
    align-self: stretch;
  }
}

.title {
  @include text-style($title-medium, $on-surface);
}
</style>

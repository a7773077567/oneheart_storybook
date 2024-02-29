<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { removeCookie } from '@/utils/helpers';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();

const locationOptions = userInfo.value?.locations.map((location) => {
  const type = location.type === 'clinic' ? '運動物理治療所' : '運動場館';
  const label = `${type} | ${location.name}`;
  return { label, value: location.id };
});
const currentLocation = ref(locationOptions?.[0].value);

function optionDisable(option: any): boolean {
  return option.value === currentLocation.value;
}

function goUserSettings() {
  router.push({ name: 'userSettings' });
}

function logout() {
  removeCookie('token');
  router.go(0);
}
</script>

<template>
  <QAvatar class="cursor-pointer">
    <img :src="userInfo?.avatar">
    <QMenu style="border-radius: 20px;">
      <QCard class="q-pa-md bg-grey-1" style="width: 270px">
        <QCardSection class="column flex-center q-gutter-sm q-pa-none">
          <span class="text-body2 text-grey-9">
            {{ userInfo?.email }}
          </span>
          <QAvatar size="80px">
            <img :src="userInfo?.avatar">
          </QAvatar>
          <span class="text-caption text-grey-10">目前位置</span>
          <QSelect v-model="currentLocation" :options="locationOptions" map-options hide-dropdown-icon borderless :option-disable="optionDisable" class="q-mt-none self-stretch" />
        </QCardSection>
        <QSeparator />
        <QCardActions vertical>
          <QBtn label="編輯" color="white" unelevated text-color="black" rounded class="q-mb-xs" @click="goUserSettings" />
          <QBtn label="登出" color="white" unelevated text-color="black" rounded @click="logout" />
        </QCardActions>
      </QCard>
    </QMenu>
  </QAvatar>
</template>

<style lang="scss" scoped>
:deep(.q-field__native) {
  justify-content: center;
}
</style>

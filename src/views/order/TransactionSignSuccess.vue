<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const contractDetail = computed(() => {
  console.log(route.query.payload);
  // console.log(JSON.parse(route?.query));

  return route.query.payload;
});

function handleRedirect() {
  // todo, decide redirect page

  router.push({ name: 'pointsTopup', query: {
    isSigned: 'true',
    content: JSON.stringify(contractDetail.value),
  } });
}
</script>

<template>
  <div class="sign_success">
    <h2 class="q-mb-md">合約書簽約已完成</h2>
    <QIcon name="check_circle" color="green" />
    <p>請返回交易流程繼續完成結帳</p>
    <pre>{{ contractDetail }}</pre>
    <QBtn label="返回" @click="handleRedirect" />
  </div>
</template>

<style scoped lang="scss">
.sign_success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>

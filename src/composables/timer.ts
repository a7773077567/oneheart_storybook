import { computed, ref } from 'vue';
import dayjs from 'dayjs';

export function useCountdown(seconds: number) {
  const left = ref<number>();
  const done = computed(() => !!left.value && left.value <= 0);

  function start() {
    left.value = seconds;
    const now = dayjs();
    const then = now.add(seconds, 's');

    const countdown = setInterval(() => {
      const present = dayjs();
      left.value = then.unix() - present.unix();
      if (done.value) {
        clearInterval(countdown);
      }
    }, 1000);
  }

  return {
    left,
    done,
    start,
  };
}

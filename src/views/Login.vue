<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { OInput } from '@/components/shared';

const validationSchema = toTypedSchema(z.object({
  account: z.string().min(6),
}));

const { handleSubmit } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values, null, 2));
});
</script>

<template>
  <main>Login</main>
  <QCard>
    <QCardSection>
      <OInput name="account" />
    </QCardSection>
    <QCardActions>
      <QBtn label="Submit" @click="onSubmit" />
    </QCardActions>
  </QCard>
</template>

<style lang="scss" scoped>

</style>

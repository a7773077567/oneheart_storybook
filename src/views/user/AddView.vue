<script setup lang="ts">
import { ref } from 'vue';
import { createUser, fetchSpaces } from '@/api/userSettings';
import type { UsersPost } from '@/api/userSettings';
import { useForm } from 'vee-validate';

const spaces = await fetchSpaces();

const weightForOrderOptions = [1, 2, 3, 4, 5].map(order => ({ label: `${order}`, value: order }));
const roleIdOptions = [
  { label: '管理者', value: 1 },
  { label: '櫃檯', value: 2 },
];
const spaceOptions = spaces.map(space => ({ label: space.name, value: space.id }));

interface Input {
  element: 'input';
  label: string;
  name: string;
  type: 'text' | 'textarea';
  fluid?: boolean;
}

interface Select {
  element: 'select';
  label: string;
  name: string;
  options: {
    label: string;
    value: any;
  }[];
  fluid?: boolean;
  multiple?: boolean;
  maxSelection?: number;
}

type FormItem = Input | Select;

const formItems: FormItem[] = [
  { label: '姓名', name: 'name', element: 'input', type: 'text' },
  { label: '權重', name: 'weightForOrder', element: 'select', options: weightForOrderOptions },
  { label: '職稱', name: 'roleId', element: 'select', options: roleIdOptions },
  { label: '場館', name: 'spaceIds', element: 'select', options: spaceOptions, multiple: true, maxSelection: 1 },
  { label: '帳號', name: 'email', element: 'input', type: 'text', fluid: true },
  { label: '描述', name: 'description', element: 'input', type: 'textarea', fluid: true },
];

const { handleSubmit } = useForm<UsersPost>();
const onSubmit = handleSubmit(async (values) => {
  // const payload = {
  //   ...values,
  //   spaceIds: values.spaceIds,
  // };
  await createUser(values);
});

const state = ref(2); // temporary
</script>

<template>
  <div class="user-adding">
    <div class="user-adding__header">
      <div :class="[state === 1 ? 'state' : 'state--active']">
        開通
      </div>
    </div>
    <div class="user-adding__body">
      <div class="form">
        <div v-for="(input, idx) in formItems" :key="idx" :class="[input.fluid ? 'form__item--fluid' : 'form__item']">
          <div class="input">
            <div class="input__item--key">
              {{ input.label }}
            </div>
            <div class="input__item--val">
              <OInput v-if="input.element === 'input'" :type="input.type" :name="input.name" hide-bottom-space borderless :outlined="false" />
              <OSelect v-else :name="input.name" :options="input.options" :multiple="input.multiple" :max-values="input.maxSelection" dense hide-bottom-space borderless :outlined="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-adding__actions">
      <QBtn label="完成" outline @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-adding {
  &__header {
    margin-bottom: 10px;
  }
  &__body {
    max-width: 556px;
    margin-bottom: 30px;
  }
}

.state {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 10px;
  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #e86969;
  }
  &--active {
    @extend .state;
    &::after {
      background-color: #91d0c1;
    }
  }
}

.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  column-gap: 10px;
  &__item {
    &--fluid {
      @extend .form__item;
      grid-column: span 2;
    }
  }
}

.input {
  display: flex;
  &__item {
    border: 1px solid #79747e;
    &--key {
      @extend .input__item;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
    &--val {
      @extend .input__item;
      flex-grow: 1;
      padding-left: 10px;
    }
  }
}
</style>

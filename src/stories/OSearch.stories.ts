import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OSearch from '@/components/shared/OSearch.vue';

const meta = {
  title: 'OSearch',
  component: OSearch,
} satisfies Meta<typeof OSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  render: args => ({
    components: { OSearch },
    setup() {
      return { args };
    },
    template: '<OSearch v-bind="args" />',
  }),
};

// export const Search: Story = {
//   args: {
//     placeholder: '搜尋客戶姓名或手機號碼',
//   },
// };

import BasicTabs from '@/components/shared/BasicTabs.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'BasicTabs',
  component: BasicTabs,
} satisfies Meta<typeof BasicTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const model = ref('1');
const tabs = [{ name: '1', label: 'Tab 1' }, { name: '2', label: 'Tab 2' }, { name: '3', label: 'Tab 3' }];

export const Basic: Story = {
  args: {
    modelValue: model.value,
    tabs: [{ name: '1', label: 'Tab 1' }, { name: '2', label: 'Tab 2' }, { name: '3', label: 'Tab 3' }],
  },
  render: args => ({
    components: { BasicTabs },
    setup() {
      return { args, model, tabs };
    },
    template: '<BasicTabs  v-model="model" :tabs="tabs"   />',
  }),
};

// export const Basic: Story = {
//   args: {
//     'modelValue': '1',
//     tabs,
//     'onUpdate:modelValue': (val: string) => { model.value = val; },

//   },
// };

import BasicBtn from '@/components/shared/BasicBtn.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'BasicBtn',
  component: BasicBtn,
  // argTypes: {
  //   color: { control: 'select', options: ['primary', 'secondary'] },
  // },
  args: {
    label: 'Button',
  },

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof BasicBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: args => ({
    components: { BasicBtn },
    setup() {
      return { args };
    },
    template: '<BasicBtn v-bind="args" />',
  }),
};

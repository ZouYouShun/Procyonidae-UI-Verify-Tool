import { Story, Meta } from '@storybook/react';
import { Rainbowfish, RainbowfishProps } from './rainbowfish';

export default {
  component: Rainbowfish,
  title: 'Rainbowfish',
} as Meta;

const Template: Story<RainbowfishProps> = (args) => <Rainbowfish {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

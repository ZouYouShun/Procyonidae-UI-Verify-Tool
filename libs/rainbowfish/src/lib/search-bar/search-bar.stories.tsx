import { Story, Meta } from '@storybook/react';
import { SearchBar, SearchBarProps } from './search-bar';

export default {
  component: SearchBar,
  title: 'SearchBar',
} as Meta;

const Template: Story<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

import { shallowMount } from '@vue/test-utils';
import Enterprises from '@/components/Enterprises.vue';

describe('Enterprises.vue', () => {
  it('renders props.enterprises when passed', () => {
    const enterprises = [{ name: 'Chez Julou' }];
    const wrapper = shallowMount(Enterprises, {
      props: { enterprises },
    });
    expect(wrapper.text()).toMatch(enterprises[0].name);
  });
});

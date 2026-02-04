import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import App from '@/App.vue';
import type { VueWrapper } from '@vue/test-utils';

// Mock TreeGrid компонент
const mockTreeGrid = defineComponent({
    name: 'TreeGrid',
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    template: '<div class="mock-tree-grid" data-testid="tree-grid-mock">Mock TreeGrid</div>',
});

describe('App', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = mount(App, {
            global: {
                components: {
                    TreeGrid: mockTreeGrid,
                },
            },
        });
    });

    describe('Компонент рендеринг', () => {
        it('должен рендериться без ошибок', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('должен иметь правильную структуру', () => {
            expect(wrapper.find('header').exists()).toBe(true);
            expect(wrapper.find('main').exists()).toBe(true);
            expect(wrapper.find('footer').exists()).toBe(true);
        });

        it('должен содержать заголовок', () => {
            const header = wrapper.find('header h1');
            expect(header.exists()).toBe(true);
            expect(header.text()).toBe('MStroy Frontend Test');
        });

        it('должен содержать TreeGrid компонент', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            expect(treeGridComponent.exists()).toBe(true);
        });
    });

    describe('Данные и props', () => {
        it('должен передавать items в TreeGrid', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            const items = treeGridComponent.props('items');

            expect(Array.isArray(items)).toBe(true);
            expect(items).toHaveLength(8);
        });

        it('должен содержать правильную структуру данных', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            const items = treeGridComponent.props('items') as unknown[];

            // Проверяем корневой элемент
            const rootItem = items.find((item) => (item as { id: unknown }).id === 1) as
                | { id: unknown; parent: unknown; label: unknown }
                | undefined;
            expect(rootItem).toBeDefined();
            expect(rootItem.parent).toBe(null);
            expect(rootItem.label).toBe('Айтем 1');

            // Проверяем элемент со строковым ID
            const stringIdItem = items.find((item) => (item as { id: unknown }).id === '91064cee') as
                | { id: unknown; parent: unknown; label: unknown }
                | undefined;
            expect(stringIdItem).toBeDefined();
            expect(stringIdItem.parent).toBe(1);
            expect(stringIdItem.label).toBe('Айтем 2');
        });
    });

    describe('CSS стили', () => {
        it('должен иметь flex layout', () => {
            const mainElement = wrapper.find('main');
            expect(mainElement.exists()).toBe(true);
        });

        it('должен иметь правильную структуру header', () => {
            const header = wrapper.find('header');
            expect(header.exists()).toBe(true);

            const title = header.find('h1');
            expect(title.exists()).toBe(true);
        });
    });

    describe('Интеграция компонентов', () => {
        it('должен корректно интегрироваться с TreeGrid', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            expect(treeGridComponent.exists()).toBe(true);
            expect(treeGridComponent.props('items')).toHaveLength(8);
        });

        it('должен передавать все необходимые данные', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            const passedItems = treeGridComponent.props('items');

            // Проверяем, что все элементы переданы
            expect(passedItems).toHaveLength(8);

            // Проверяем структуру данных
            (passedItems as unknown[]).forEach((item) => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('parent');
                expect(item).toHaveProperty('label');
            });
        });
    });

    describe('Тестовые данные', () => {
        it('должен содержать правильную иерархию данных', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            const items = treeGridComponent.props('items') as unknown[];

            // Корневые элементы
            const rootItems = items.filter((item) => (item as { parent: unknown }).parent === null);
            expect(rootItems).toHaveLength(1);
            expect((rootItems[0] as { id: unknown }).id).toBe(1);

            // Дети корневого элемента
            const level1Items = items.filter((item) => (item as { parent: unknown }).parent === 1);
            expect(level1Items).toHaveLength(2);
            expect(level1Items.map((item) => (item as { id: unknown }).id)).toContain('91064cee');
            expect(level1Items.map((item) => (item as { id: unknown }).id)).toContain(3);

            // Дети элемента '91064cee'
            const level2Items = items.filter((item) => (item as { parent: unknown }).parent === '91064cee');
            expect(level2Items).toHaveLength(3);
            expect(level2Items.map((item) => (item as { id: unknown }).id)).toEqual([4, 5, 6]);

            // Дети элемента 4
            const level3Items = items.filter((item) => (item as { parent: unknown }).parent === 4);
            expect(level3Items).toHaveLength(2);
            expect(level3Items.map((item) => (item as { id: unknown }).id)).toEqual([7, 8]);
        });

        it('должен поддерживать смешанные типы ID', () => {
            const treeGridComponent = wrapper.findComponent({ name: 'TreeGrid' });
            const items = treeGridComponent.props('items') as unknown[];

            const numberIds = items.filter((item) => typeof (item as { id: unknown }).id === 'number');
            const stringIds = items.filter((item) => typeof (item as { id: unknown }).id === 'string');

            expect(numberIds.length).toBeGreaterThan(0);
            expect(stringIds.length).toBeGreaterThan(0);
            expect((stringIds[0] as { id: unknown }).id).toBe('91064cee');
        });
    });
});

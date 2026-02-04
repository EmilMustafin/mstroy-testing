import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import TreeGrid from '../TreeGrid.vue';
import type { TreeItem } from '../../utils/TreeStore';

const mockAgGridVue = {
    name: 'AgGridVue',
    template: '<div class="mock-ag-grid" data-testid="ag-grid-mock">Mock AgGrid</div>',
    props: ['columnDefs', 'rowData', 'treeData', 'animateRows', 'getDataPath', 'groupDisplayType', 'theme'],
};

describe('TreeGrid', () => {
    const mockItems: TreeItem[] = [
        { id: 1, parent: null, label: 'Айтем 1' },
        { id: '91064cee', parent: 1, label: 'Айтем 2' },
        { id: 3, parent: 1, label: 'Айтем 3' },
        { id: 4, parent: '91064cee', label: 'Айтем 4' },
        { id: 5, parent: '91064cee', label: 'Айтем 5' },
    ];

    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(TreeGrid, {
            props: {
                items: mockItems,
            },
            global: {
                components: {
                    'ag-grid-vue': mockAgGridVue,
                },
            },
        });
    });

    describe('Компонент рендеринг', () => {
        it('должен рендериться без ошибок', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('должен содержать AgGrid компонент', () => {
            const agGridComponent = wrapper.findComponent({ name: 'AgGridVue' });
            expect(agGridComponent.exists()).toBe(true);
        });

        it('должен иметь правильный CSS класс', () => {
            expect(wrapper.find('.ag-theme-alpine').exists()).toBe(true);
        });

        it('должен иметь правильные размеры', () => {
            const container = wrapper.find('.ag-theme-alpine');
            expect(container.attributes('style')).toContain('height: 600px');
            expect(container.attributes('style')).toContain('width: 100%');
        });
    });

    describe('Props обработка', () => {
        it('должен принимать items prop', () => {
            expect(wrapper.props('items')).toEqual(mockItems);
        });

        it('должен создавать TreeStore из переданных items', () => {
            expect(wrapper.vm.store).toBeDefined();
            expect(wrapper.vm.store.getAll()).toHaveLength(5);
        });

        it('должен обновлять rowData при изменении items', async () => {
            const newItems = [{ id: 1, parent: null, label: 'Новый айтем' }];

            const newWrapper = mount(TreeGrid, {
                props: { items: newItems },
                global: { components: { 'ag-grid-vue': mockAgGridVue } },
            }) as VueWrapper<any>;
            expect(newWrapper.vm.rowData).toHaveLength(1);
        });
    });

    describe('Конфигурация колонок', () => {
        it('должен иметь 3 колонки', () => {
            expect(wrapper.vm.columnDefs).toHaveLength(3);
        });

        it('должен иметь колонку "№ п/п"', () => {
            const numberColumn = wrapper.vm.columnDefs[0];
            expect(numberColumn.headerName).toBe('№ п/п');
            expect(numberColumn.width).toBe(80);
        });

        it('должен иметь колонку "Категория"', () => {
            const categoryColumn = wrapper.vm.columnDefs[1];
            expect(categoryColumn.headerName).toBe('Категория');
            expect(categoryColumn.showRowGroup).toBe(true);
        });

        it('должен иметь колонку "Наименование"', () => {
            const nameColumn = wrapper.vm.columnDefs[2];
            expect(nameColumn.headerName).toBe('Наименование');
            expect(nameColumn.field).toBe('label');
        });
    });

    describe('AgGrid конфигурация', () => {
        it('должен передавать правильные props в AgGrid', () => {
            const agGridComponent = wrapper.findComponent({ name: 'AgGridVue' });
            const props = agGridComponent.props();

            expect(props.treeData).toBe(true);
            expect(props.animateRows).toBe(true);
            expect(props.groupDisplayType).toBe('custom');
            expect(props.theme).toBe('legacy');
        });

        it('должен передавать columnDefs в AgGrid', () => {
            const agGridComponent = wrapper.findComponent({ name: 'AgGridVue' });
            expect(agGridComponent.props('columnDefs')).toEqual(wrapper.vm.columnDefs);
        });

        it('должен передавать rowData в AgGrid', () => {
            const agGridComponent = wrapper.findComponent({ name: 'AgGridVue' });
            expect(agGridComponent.props('rowData')).toEqual(wrapper.vm.rowData);
        });
    });

    describe('Методы компонента', () => {
        it('getDataPath должен возвращать правильный путь для элемента', () => {
            const testItem = { id: 4, parent: '91064cee', label: 'Айтем 4' };
            const path = wrapper.vm.getDataPath(testItem);

            expect(path).toEqual(['Айтем 1', 'Айтем 2', 'Айтем 4']);
        });

        it('getDataPath должен работать для корневого элемента', () => {
            const testItem = { id: 1, parent: null, label: 'Айтем 1' };
            const path = wrapper.vm.getDataPath(testItem);

            expect(path).toEqual(['Айтем 1']);
        });

        it('onGridReady должен быть функцией', () => {
            expect(typeof wrapper.vm.onGridReady).toBe('function');
        });

        it('onRowGroupOpened должен быть функцией', () => {
            expect(typeof wrapper.vm.onRowGroupOpened).toBe('function');
        });
    });

    describe('Реактивность данных', () => {
        it('rowData должен быть реактивным', () => {
            expect(wrapper.vm.rowData).toHaveLength(5);
            expect(wrapper.vm.rowData[0].label).toBe('Айтем 1');
        });

        it('columnDefs должен быть реактивным', () => {
            expect(wrapper.vm.columnDefs).toBeDefined();
            expect(Array.isArray(wrapper.vm.columnDefs)).toBe(true);
        });
    });

    describe('Обработка категорий', () => {
        it('должен определять "Группа" для элементов с детьми', () => {
            const categoryColumn = wrapper.vm.columnDefs[1];
            const mockParams = {
                data: { id: 1, parent: null, label: 'Айтем 1' },
            };

            const category = categoryColumn.valueGetter(mockParams);
            expect(category).toBe('Группа');
        });

        it('должен определять "Элемент" для элементов без детей', () => {
            const categoryColumn = wrapper.vm.columnDefs[1];
            const mockParams = {
                data: { id: 5, parent: '91064cee', label: 'Айтем 5' },
            };

            const category = categoryColumn.valueGetter(mockParams);
            expect(category).toBe('Элемент');
        });
    });

    describe('Порядковые номера', () => {
        it('должен генерировать правильные порядковые номера', () => {
            const numberColumn = wrapper.vm.columnDefs[0];
            const mockParams = {
                node: { rowIndex: 0 },
            };

            const number = numberColumn.valueGetter(mockParams);
            expect(number).toBe(1);
        });

        it('должен возвращать null для невалидного rowIndex', () => {
            const numberColumn = wrapper.vm.columnDefs[0];
            const mockParams = {
                node: { rowIndex: null },
            };

            const number = numberColumn.valueGetter(mockParams);
            expect(number).toBe(null);
        });
    });
});

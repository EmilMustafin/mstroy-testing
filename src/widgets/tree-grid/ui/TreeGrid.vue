<script setup lang="ts">
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AgGridVue } from 'ag-grid-vue3';
import { ref } from 'vue';
import { TreeStore } from '@/shared/lib/tree-store';
import type { TreeItem } from '@/shared/lib/tree-store';
import type {
    ColDef,
    GridReadyEvent,
    ICellRendererParams,
    RowGroupOpenedEvent,
    ValueGetterParams,
} from 'ag-grid-community';

const props = defineProps<{ items: TreeItem[] }>();

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const store = new TreeStore(props.items);
const rowData = ref<TreeItem[]>(store.getAll());

const columnDefs = ref<ColDef<TreeItem>[]>([
    {
        headerName: '№ п/п',
        valueGetter: (params: ValueGetterParams<TreeItem>) => {
            const rowIndex = params.node?.rowIndex;
            return rowIndex !== null && rowIndex !== undefined ? rowIndex + 1 : null;
        },
        width: 80,
        lockPosition: true,
        suppressMovable: true,
        cellRenderer: (params: ICellRendererParams<TreeItem, number | null>) => params.value,
    },
    {
        headerName: 'Категория',
        valueGetter: (params: ValueGetterParams<TreeItem>) => {
            if (!params.data) return null;
            return store.getChildren(params.data.id).length > 0 ? 'Группа' : 'Элемент';
        },
        flex: 1,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            suppressCount: true,
        },
    },
    {
        headerName: 'Наименование',
        field: 'label',
        flex: 1,
    },
]);

const onRowGroupOpened = (params: RowGroupOpenedEvent<TreeItem>) => {
    params.api.refreshCells({ force: true });
};

const getDataPath = (data: TreeItem) => {
    const path = store
        .getAllParents(data.id)
        .reverse()
        .map((p) => p.label);
    path.push(data.label);
    return path;
};

const onGridReady = (params: GridReadyEvent<TreeItem>) => {
    params.api.expandAll();
};
</script>

<template>
    <div class="ag-theme-alpine" style="height: 600px; width: 100%">
        <AgGridVue
            style="width: 100%; height: 100%"
            :column-defs="columnDefs"
            :row-data="rowData"
            tree-data
            animate-rows
            :get-data-path="getDataPath"
            :group-display-type="'custom'"
            :theme="'legacy'"
            @grid-ready="onGridReady"
            @row-group-opened="onRowGroupOpened"
        />
    </div>
</template>

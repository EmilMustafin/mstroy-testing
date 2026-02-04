export interface TreeItem {
    id: string | number;
    parent: string | number | null;
    label: string;
}

export class TreeStore {
    private itemsMap = new Map<string | number, TreeItem>();
    private childrenMap = new Map<string | number, TreeItem[]>();

    constructor(items: TreeItem[]) {
        items.forEach((item) => {
            this.addToIndices(item);
        });
    }

    getAll(): TreeItem[] {
        return Array.from(this.itemsMap.values());
    }

    getItem(id: string | number): TreeItem | undefined {
        return this.itemsMap.get(id);
    }

    getChildren(id: string | number): TreeItem[] {
        return this.childrenMap.get(id) ?? [];
    }

    getAllChildren(id: string | number): TreeItem[] {
        const result: TreeItem[] = [];
        const visited = new Set<string | number>();
        const traverse = (currentId: string | number) => {
            if (visited.has(currentId)) return;
            visited.add(currentId);
            const children = this.getChildren(currentId);
            children.forEach((child) => {
                result.push(child);
                traverse(child.id);
            });
        };
        traverse(id);
        return result;
    }

    getParent(id: string | number): TreeItem | undefined {
        const item = this.getItem(id);
        if (item && item.parent !== null) {
            return this.getItem(item.parent);
        }
        return undefined;
    }

    getAllParents(id: string | number): TreeItem[] {
        const parents: TreeItem[] = [];
        let currentItem = this.getItem(id);

        while (currentItem && currentItem.parent !== null) {
            const parent = this.getItem(currentItem.parent);
            if (parent) {
                parents.push(parent);
                currentItem = parent;
            } else {
                break;
            }
        }
        return parents;
    }

    addItem(item: TreeItem): void {
        if (this.itemsMap.has(item.id)) return;
        this.addToIndices(item);
    }

    removeItem(id: string | number): void {
        const item = this.getItem(id);
        if (!item) return;

        if (item.parent !== null) {
            const siblings = this.childrenMap.get(item.parent) ?? [];
            this.childrenMap.set(
                item.parent,
                siblings.filter((s) => s.id !== id),
            );
        }

        const descendants = this.getAllChildren(id);

        descendants.forEach((descendant) => {
            this.itemsMap.delete(descendant.id);
            this.childrenMap.delete(descendant.id);
        });

        this.itemsMap.delete(id);
        this.childrenMap.delete(id);
    }

    updateItem(item: TreeItem): void {
        const existingItem = this.getItem(item.id);
        if (!existingItem) return;

        if (existingItem.parent !== item.parent) {
            if (existingItem.parent !== null) {
                const oldSiblings = this.childrenMap.get(existingItem.parent) ?? [];
                this.childrenMap.set(
                    existingItem.parent,
                    oldSiblings.filter((s) => s.id !== item.id),
                );
            }

            if (item.parent !== null) {
                if (!this.childrenMap.has(item.parent)) {
                    this.childrenMap.set(item.parent, []);
                }
                this.childrenMap.get(item.parent)?.push(item);
            }
        }

        this.itemsMap.set(item.id, item);
    }

    private addToIndices(item: TreeItem): void {
        this.itemsMap.set(item.id, item);
        if (item.parent !== null) {
            if (!this.childrenMap.has(item.parent)) {
                this.childrenMap.set(item.parent, []);
            }
            this.childrenMap.get(item.parent)?.push(item);
        }
    }
}

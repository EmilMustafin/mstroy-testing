import { describe, it, expect, beforeEach } from 'vitest';
import { TreeStore } from '../TreeStore';
import type { TreeItem } from '../TreeStore';

describe('TreeStore Full Suite', () => {
  const items: TreeItem[] = [
        { id: 1, parent: null, label: 'Айтем 1' },
        { id: '91064cee', parent: 1, label: 'Айтем 2' },
        { id: 3, parent: 1, label: 'Айтем 3' },
        { id: 4, parent: '91064cee', label: 'Айтем 4' },
        { id: 5, parent: '91064cee', label: 'Айтем 5' },
        { id: 6, parent: '91064cee', label: 'Айтем 6' },
        { id: 7, parent: 4, label: 'Айтем 7' },
        { id: 8, parent: 4, label: 'Айтем 8' }
    ];

  let store: TreeStore;

  beforeEach(() => {
    store = new TreeStore([...items]);
  });

  describe('constructor', () => {
    it('должен корректно индексировать начальные данные', () => {
      expect(store.getItem(1)).toBeDefined();
      expect(store.getChildren(1)).toHaveLength(2);
    });

    it('должен работать с пустым массивом', () => {
      const emptyStore = new TreeStore([]);
      expect(emptyStore.getAll()).toHaveLength(0);
    });

    it('должен работать с одним элементом', () => {
      const singleStore = new TreeStore([{ id: 1, parent: null, label: 'Один' }]);
      expect(singleStore.getAll()).toHaveLength(1);
      expect(singleStore.getItem(1)).toBeDefined();
    });

    it('должен корректно обрабатывать дубликаты ID', () => {
      const duplicateItems = [
        { id: 1, parent: null, label: 'Первый' },
        { id: 1, parent: null, label: 'Второй' }
      ];
      const duplicateStore = new TreeStore(duplicateItems);
      expect(duplicateStore.getAll()).toHaveLength(1);
    });

    it('должен работать с неправильными ссылками на родителей', () => {
      const brokenItems = [
        { id: 1, parent: 999, label: 'Сирота' },
        { id: 2, parent: 1, label: 'Ребенок' }
      ];
      const brokenStore = new TreeStore(brokenItems);
      expect(brokenStore.getAll()).toHaveLength(2);
      expect(brokenStore.getChildren(999)).toHaveLength(1);
    });
  });

  describe('getAll', () => {
    it('должен возвращать исходный массив элементов', () => {
      const all = store.getAll();
      expect(all).toHaveLength(8);
      expect(all).toEqual(expect.arrayContaining([items[0]]));
    });

    it('должен возвращать пустой массив для пустого хранилища', () => {
      const emptyStore = new TreeStore([]);
      expect(emptyStore.getAll()).toEqual([]);
    });

    it('должен возвращать копию массива (не изменять оригинал)', () => {
      const all = store.getAll();
      all.push({ id: 999, parent: null, label: 'Тест' });
      expect(store.getAll()).toHaveLength(8);
    });
  });

  describe('getItem', () => {
    it('должен возвращать элемент по корректному ID', () => {
      expect(store.getItem(4)?.label).toBe('Айтем 4');
      expect(store.getItem('91064cee')?.label).toBe('Айтем 2');
    });

    it('должен возвращать undefined для несуществующего ID', () => {
      expect(store.getItem(999)).toBeUndefined();
      expect(store.getItem('nonexistent')).toBeUndefined();
    });

    it('должен корректно работать с null и undefined', () => {
      expect(store.getItem(null as any)).toBeUndefined();
      expect(store.getItem(undefined as any)).toBeUndefined();
    });

    it('должен работать с разными типами ID', () => {
      expect(store.getItem(1)).toBeDefined();
      expect(store.getItem('91064cee')).toBeDefined();
    });
  });

  describe('getChildren', () => {
    it('должен возвращать массив прямых потомков', () => {
      const children = store.getChildren('91064cee');
      expect(children).toHaveLength(3);
      expect(children.map(c => c.id)).toEqual([4, 5, 6]);
    });

    it('должен возвращать пустой массив, если потомков нет', () => {
      expect(store.getChildren(8)).toEqual([]);
      expect(store.getChildren(7)).toEqual([]);
    });

    it('должен возвращать пустой массив для несуществующего родителя', () => {
      expect(store.getChildren(999)).toEqual([]);
      expect(store.getChildren('nonexistent')).toEqual([]);
    });

    it('должен корректно работать с null и undefined', () => {
      expect(store.getChildren(null as any)).toEqual([]);
      expect(store.getChildren(undefined as any)).toEqual([]);
    });

    it('должен работать с разными типами ID', () => {
      expect(store.getChildren(1)).toHaveLength(2);
      expect(store.getChildren('91064cee')).toHaveLength(3);
    });
  });

  describe('getAllChildren', () => {
    it('должен рекурсивно возвращать всех потомков', () => {
      const allChildren = store.getAllChildren('91064cee');
      expect(allChildren).toHaveLength(5);
      expect(allChildren.map(c => c.id)).toContain(7);
      expect(allChildren.map(c => c.id)).toContain(8);
    });

    it('должен возвращать пустой массив для листового элемента', () => {
      expect(store.getAllChildren(7)).toEqual([]);
      expect(store.getAllChildren(8)).toEqual([]);
    });

    it('должен возвращать пустой массив для несуществующего элемента', () => {
      expect(store.getAllChildren(999)).toEqual([]);
      expect(store.getAllChildren('nonexistent')).toEqual([]);
    });

    it('должен корректно работать с null и undefined', () => {
      expect(store.getAllChildren(null as any)).toEqual([]);
      expect(store.getAllChildren(undefined as any)).toEqual([]);
    });

    it('должен возвращать правильный порядок элементов', () => {
      const allChildren = store.getAllChildren(1);
      expect(allChildren).toHaveLength(7);
      expect(allChildren.map(c => c.id)).toEqual(['91064cee', 4, 7, 8, 5, 6, 3]);
    });
  });

  describe('getParent', () => {
    it('должен возвращать прямого родителя', () => {
      expect(store.getParent(4)?.id).toBe('91064cee');
      expect(store.getParent(7)?.id).toBe(4);
    });

    it('должен возвращать undefined для корневого элемента (parent: null)', () => {
      expect(store.getParent(1)).toBeUndefined();
    });

    it('должен возвращать undefined для несуществующего элемента', () => {
      expect(store.getParent(999)).toBeUndefined();
      expect(store.getParent('nonexistent')).toBeUndefined();
    });

    it('должен корректно работать с null и undefined', () => {
      expect(store.getParent(null as any)).toBeUndefined();
      expect(store.getParent(undefined as any)).toBeUndefined();
    });
  });

  describe('getAllParents', () => {
    it('должен возвращать цепочку от родителя до корня', () => {
      const parents = store.getAllParents(7);
      expect(parents.map(p => p.id)).toEqual([4, '91064cee', 1]);
    });

    it('должен возвращать пустой массив для корневого элемента', () => {
      expect(store.getAllParents(1)).toEqual([]);
    });

    it('должен возвращать пустой массив для несуществующего элемента', () => {
      expect(store.getAllParents(999)).toEqual([]);
      expect(store.getAllParents('nonexistent')).toEqual([]);
    });

    it('должен корректно работать с null и undefined', () => {
      expect(store.getAllParents(null as any)).toEqual([]);
      expect(store.getAllParents(undefined as any)).toEqual([]);
    });

    it('должен возвращать правильный порядок родителей', () => {
      const parents = store.getAllParents(8);
      expect(parents.map(p => p.id)).toEqual([4, '91064cee', 1]);
    });

    it('должен работать для элементов на разных уровнях', () => {
      expect(store.getAllParents(3).map(p => p.id)).toEqual([1]);
      expect(store.getAllParents(4).map(p => p.id)).toEqual(['91064cee', 1]);
    });
  });

  describe('addItem', () => {
    it('должен добавлять новый элемент и обновлять индексы', () => {
      const newItem = { id: 9, parent: 6, label: 'Новый' };
      store.addItem(newItem);
      expect(store.getItem(9)).toEqual(newItem);
      expect(store.getChildren(6)).toContainEqual(newItem);
    });

    it('должен корректно добавлять новый корень (parent: null)', () => {
      store.addItem({ id: 10, parent: null, label: 'Второй корень' });
      expect(store.getItem(10)).toBeDefined();
      const rootItems = store.getAll().filter(item => item.parent === null);
      expect(rootItems).toHaveLength(2);
    });

    it('не должен добавлять элемент с существующим ID', () => {
      const initialCount = store.getAll().length;
      store.addItem({ id: 1, parent: null, label: 'Дубликат' });
      expect(store.getAll()).toHaveLength(initialCount);
      expect(store.getItem(1)?.label).toBe('Айтем 1');
    });

    it('должен добавлять элемент к несуществующему родителю', () => {
      const newItem = { id: 11, parent: 999, label: 'Сирота' };
      store.addItem(newItem);
      expect(store.getItem(11)).toEqual(newItem);
      expect(store.getChildren(999)).toContainEqual(newItem);
    });

    it('должен работать с разными типами ID', () => {
      store.addItem({ id: 'string-id', parent: 1, label: 'Строковый ID' });
      store.addItem({ id: 12, parent: 'string-id', label: 'Числовой ID' });
      expect(store.getItem('string-id')).toBeDefined();
      expect(store.getItem(12)).toBeDefined();
    });
  });

  describe('updateItem', () => {
    it('должен обновлять существующий элемент', () => {
      const updatedItem = { id: 4, parent: '91064cee', label: 'Обновленный Айтем 4' };
      store.updateItem(updatedItem);
      expect(store.getItem(4)?.label).toBe('Обновленный Айтем 4');
    });

    it('должен обновлять родителя и перестраивать индексы', () => {
      const updatedItem = { id: 4, parent: 3, label: 'Перенесенный Айтем 4' };
      store.updateItem(updatedItem);
      expect(store.getChildren('91064cee')).not.toContainEqual(expect.objectContaining({ id: 4 }));
      expect(store.getChildren(3)).toContainEqual(updatedItem);
    });

    it('не должен изменять хранилище при обновлении несуществующего элемента', () => {
      const initialCount = store.getAll().length;
      store.updateItem({ id: 999, parent: null, label: 'Несуществующий' });
      expect(store.getAll()).toHaveLength(initialCount);
      expect(store.getItem(999)).toBeUndefined();
    });

    it('должен корректно обновлять корневой элемент', () => {
      const updatedRoot = { id: 1, parent: null, label: 'Обновленный корень' };
      store.updateItem(updatedRoot);
      expect(store.getItem(1)?.label).toBe('Обновленный корень');
    });

    it('должен работать с разными типами ID', () => {
      const updatedItem = { id: '91064cee', parent: 3, label: 'Обновленный строковый ID' };
      store.updateItem(updatedItem);
      expect(store.getItem('91064cee')?.label).toBe('Обновленный строковый ID');
    });
  });

  describe('removeItem', () => {
    // Основной функционал
    it('должен удалять листовой элемент (без детей)', () => {
      store.removeItem(8);
      expect(store.getItem(8)).toBeUndefined();
      expect(store.getChildren(4)).not.toContainEqual(expect.objectContaining({ id: 8 }));
    });

    it('должен удалять элемент с одним уровнем детей', () => {
      store.removeItem(4); // У 4 есть дети 7, 8
      expect(store.getItem(4)).toBeUndefined();
      expect(store.getItem(7)).toBeUndefined();
      expect(store.getItem(8)).toBeUndefined();
      expect(store.getChildren('91064cee')).not.toContainEqual(expect.objectContaining({ id: 4 }));
    });

    it('должен каскадно удалять элемент со всеми потомками', () => {
      store.removeItem('91064cee'); // У '91064cee' дети: 4, 5, 6 и внуки: 7, 8
      expect(store.getItem('91064cee')).toBeUndefined();
      expect(store.getItem(4)).toBeUndefined();
      expect(store.getItem(5)).toBeUndefined();
      expect(store.getItem(6)).toBeUndefined();
      expect(store.getItem(7)).toBeUndefined();
      expect(store.getItem(8)).toBeUndefined();
      expect(store.getChildren(1)).toHaveLength(1); // Остался только элемент 3
    });

    it('должен удалять корневой элемент со всем поддеревом', () => {
      store.removeItem(1); // Корень со всеми потомками
      expect(store.getItem(1)).toBeUndefined();
      expect(store.getAll()).toHaveLength(0); // Все элементы удалены
    });

    it('должен корректно обновлять индексы после удаления', () => {
      store.removeItem(4); // Удаляем 4 с детьми 7, 8
      expect(store.getChildren('91064cee')).toHaveLength(2); // Остались 5, 6
      expect(store.getAllChildren('91064cee')).toHaveLength(2); // Только 5, 6
    });

    // Исключительные ситуации
    it('не должен падать при удалении несуществующего ID', () => {
      expect(() => store.removeItem(999)).not.toThrow();
      expect(() => store.removeItem('nonexistent')).not.toThrow();
    });

    it('не должен падать при удалении null или undefined', () => {
      expect(() => store.removeItem(null)).not.toThrow();
      expect(() => store.removeItem(undefined)).not.toThrow();
    });

    it('не должен изменять хранилище при удалении несуществующего элемента', () => {
      const initialCount = store.getAll().length;
      store.removeItem(999);
      expect(store.getAll()).toHaveLength(initialCount);
    });

    it('должен корректно работать с повторным удалением того же элемента', () => {
      store.removeItem(8);
      expect(store.getItem(8)).toBeUndefined();
      expect(() => store.removeItem(8)).not.toThrow();
      expect(store.getItem(8)).toBeUndefined();
    });

    it('должен корректно удалять элементы с разными типами ID', () => {
      store.removeItem('91064cee'); // строковый ID
      store.removeItem(3); // числовой ID
      expect(store.getItem('91064cee')).toBeUndefined();
      expect(store.getItem(3)).toBeUndefined();
    });
  });
});

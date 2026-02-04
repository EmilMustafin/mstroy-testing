# mstroy-testing

## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Запуск дев-сервера с хот-релоадом:
   ```bash
   npm run dev
   ```

3. Сборка для продакшена:
   ```bash
   npm run build
   ```

4. Предпросмотр собранного проекта:
   ```bash
   npm run preview
   ```

### Полезные команды

- Проверка типов:
  ```bash
  npm run type-check
  ```
- Линтинг:
  ```bash
  npm run lint
  ```
- Тесты:
  ```bash
  npm run test:unit
  ```

## Структура проекта

```
.
├── public/                 # Статические файлы
├── src/                    # Исходный код
│   ├── app/                # Инициализация приложения, глобальные стили
│   │   ├── main.ts          # Точка входа
│   │   └── styles/          # Глобальные стили
│   ├── pages/               # Страницы приложения
│   ├── widgets/             # Крупные UI-блоки
│   └── shared/              # Общие утилиты и компоненты
├── index.html               # HTML-шаблон
├── vite.config.ts           # Конфигурация Vite
├── tsconfig*.json           # Конфигурация TypeScript
└── package.json             # Скрипты и зависимости
```

## Стек

- Vue 3
- TypeScript
- Vite
- Vue Router
- Tailwind CSS

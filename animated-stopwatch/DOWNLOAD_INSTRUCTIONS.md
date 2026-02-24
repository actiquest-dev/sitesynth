# Как скачать проект локально

Поскольку в Figma Make нет прямой кнопки экспорта, вот пошаговая инструкция:

## Способ 1: Создать новый Vue проект локально

### Шаг 1: Создайте новый Vue проект

```bash
npm create vite@latest sitesynth-vue -- --template vue-ts
cd sitesynth-vue
```

### Шаг 2: Установите зависимости

```bash
npm install
npm install -D @tailwindcss/vite tailwindcss
```

### Шаг 3: Скопируйте файлы

Скопируйте содержимое следующих файлов из Figma Make в ваш локальный проект:

#### Конфигурация (корневая папка):
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `env.d.ts`
- `index.html`

#### Исходники (/src):
- `src/main.ts`
- `src/app/App.vue`

#### Компоненты (/src/app/components):
- `src/app/components/CountdownWidget.vue`
- `src/app/components/SplitFlap.vue`
- `src/app/components/FlipGroup.vue`
- `src/app/components/TimeUnit.vue`
- `src/app/components/Ticker.vue`
- `src/app/components/OrbSvg.vue`
- `src/app/components/AnimatedBackground.vue`

#### Стили (/src/styles):
- `src/styles/index.css`
- `src/styles/tailwind.css`
- `src/styles/theme.css`
- `src/styles/fonts.css`

### Шаг 4: Запустите проект

```bash
npm run dev
```

---

## Способ 2: Ручное копирование файлов

Если вы хотите создать проект с нуля:

1. Создайте новую папку `sitesynth-vue`
2. Скопируйте все файлы вручную из списка выше
3. Запустите `npm install`
4. Запустите `npm run dev`

---

## Список всех файлов для копирования

```
/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── env.d.ts
├── index.html
├── README.md
│
└── src/
    ├── main.ts
    ├── app/
    │   ├── App.vue
    │   └── components/
    │       ├── CountdownWidget.vue
    │       ├── SplitFlap.vue
    │       ├── FlipGroup.vue
    │       ├── TimeUnit.vue
    │       ├── Ticker.vue
    │       ├── OrbSvg.vue
    │       └── AnimatedBackground.vue
    │
    └── styles/
        ├── index.css
        ├── tailwind.css
        ├── theme.css
        └── fonts.css
```

---

## Примечания

- Убедитесь, что у вас установлен Node.js (версия 18 или выше)
- После копирования всех файлов запустите `npm install`
- Проект использует Vite + Vue 3 + TypeScript + Tailwind CSS v4
- Все шрифты загружаются через Google Fonts (см. `src/styles/index.css`)

---

## Если возникли проблемы

1. Проверьте версию Node.js: `node --version` (должна быть >= 18)
2. Очистите кеш: `rm -rf node_modules package-lock.json && npm install`
3. Проверьте консоль браузера на наличие ошибок
4. Убедитесь, что все файлы скопированы правильно

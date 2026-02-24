# SiteSynth Studio - Vue Version

Умный виджет с календарём и обратным отсчётом, переписанный на Vue 3.

## Структура проекта

```
/src
  /app
    App.vue              # Главный компонент
    /components
      CountdownWidget.vue    # Виджет с flip-clock анимацией
      SplitFlap.vue         # Компонент перелистывания цифр
      FlipGroup.vue         # Группа flip-цифр
      TimeUnit.vue          # Единица времени (часы/мин/сек)
      Ticker.vue            # Бегущая строка
      OrbSvg.vue            # Градиентный орб
      AnimatedBackground.vue # Плавающие блобы
  /styles
    index.css             # Импорт стилей и шрифтов
  main.ts                 # Точка входа Vue
```

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите dev сервер:
```bash
npm run dev
```

3. Соберите для продакшена:
```bash
npm run build
```

## Технологии

- **Vue 3** - Composition API с TypeScript
- **Vite** - Сборщик
- **Tailwind CSS v4** - Стилизация
- **CSS Animations** - Flip-clock эффекты вместо motion/react

## Особенности

✅ Полная портация с React на Vue  
✅ Flip-clock анимация (имитация аэропортного табло)  
✅ Плавающие градиентные блобы на Canvas  
✅ Вращающаяся граница с градиентом  
✅ Пульсирующий орб из Figma SVG  
✅ Бегущая строка (ticker)  
✅ Прогресс-бар обратного отсчёта  
✅ Шрифты: Share Tech Mono + Inter

## Отличия от React версии

- Используется `<script setup>` синтаксис Vue 3
- Анимации на чистом CSS вместо motion/react
- `ref()` и `computed()` вместо `useState()` и `useMemo()`
- `onMounted()` / `onUnmounted()` вместо `useEffect()`
- Однофайловые компоненты `.vue` вместо `.tsx`

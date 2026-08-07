# 1tzKonst Website

Официальный сайт разработчика ROBLOX проектов и скриптов.

🔗 **Live**: [itzkonstcreator.github.io](https://itzkonstcreator.github.io/)

## 📋 Описание

Этот репозиторий содержит исходный код официального сайта **1tzKonst** — платформы для распространения ROBLOX скриптов, uncopylocked игр и других инструментов.

## 🚀 Возможности

- 🎮 **Uncopylocked Games** — открытые ROBLOX-игры с поиском и фильтрами.
- 🛠️ **Scripts** — готовые скрипты для ROBLOX (Solara) с копированием в один клик и предпросмотром кода.
- ⌨️ **WPM Test** — тест скорости печати с режимами на время, историей, графиком WPM и личным рекордом.
- 🔍 **Поиск и фильтры** — единая панель на главной и страницах списков.
- 🌗 **Тёмная и светлая темы** — переключаются одной кнопкой, сохраняются в браузере.
- 📱 **Адаптивность** — гамбургер-меню, мобильная вёрстка, корректно на любом экране.
- ⚡ **PWA** — устанавливается как приложение, имеет manifest и иконки.
- 🎨 **Единая дизайн-система** — все страницы используют общий `styles.css` и общий shell из `app.js`.
- 🔎 **SEO** — полные Open Graph, Twitter Card, canonical, lang=`ru` на всех страницах.
- ♿ **Доступность** — `aria-*`, `skip-link`, `:focus-visible`, `prefers-reduced-motion`.

## 📂 Структура

```
docs/
├── index.html            # Главная — герой, поиск, фильтры, статистика
├── about.html            # О проекте — bio, технологии, таймлайн, контакты
├── uncopylocked.html     # Список игр (динамически из data.json)
├── scripts.html          # Список скриптов с копированием и предпросмотром
├── wpmtest.html          # WPM-тест (стриминг words.txt, режимы, история)
├── styles.css            # Единая дизайн-система + тёмная/светлая темы
├── app.js                # Общий shell: навигация, футер, тема, поиск, тосты
├── data.json             # Единый источник правды: игры, скрипты, статистика
├── manifest.webmanifest  # PWA
├── favicon.svg           # SVG-иконка ⚡
├── og-image.svg          # Open Graph превью
├── words.txt             # Словарь для WPM (~466k слов) — НЕ ТРОГАТЬ
└── itzkonsthub.lua       # Главный скрипт
```

## 🎨 Дизайн

- Glassmorphism + soft glows + анимированные градиенты.
- CSS Grid + Flexbox для адаптивной вёрстки.
- Reveal-on-scroll через `IntersectionObserver`.
- Mobile-first: hamburger-меню, touch-friendly кнопки.
- Полная кастомизация через CSS-переменные.

## 🛠️ Технологии

- **HTML5**, **CSS3** (custom properties, grid, flexbox, animations)
- **Vanilla JavaScript** — без сборщиков и зависимостей
- **Streams API** для стриминга `words.txt` (загрузка < 1 МБ)
- **IntersectionObserver**, **localStorage**, **PWA**
- **Google Fonts** (Montserrat, weights 400/500/700/800)

## ✏️ Как добавить игру или скрипт

Всё содержимое хранится в [`docs/data.json`](docs/data.json). Чтобы добавить новую игру:

```json
{
  "id": "my-game",
  "title": "My New Game",
  "tag": "uncopylocked",
  "size": "12 MB",
  "url": "https://drive.google.com/file/d/.../view",
  "added": "2026-08-15",
  "tags": ["uncopylocked", "roblox"]
}
```

Аналогично для секции `scripts[]`. Изменения появятся на главной и в соответствующих разделах без правки HTML.

## 📝 Лицензия

MIT License — see [LICENSE](LICENSE) file for details.

## 📬 Контакты

- GitHub: [itzkonstCreator](https://github.com/itzkonstCreator)
- YouTube: [@Itzkonst](https://www.youtube.com/@Itzkonst)

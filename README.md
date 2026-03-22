# AI Репетитор

Сайт для учнів 3 класу. Дає **тільки підказки** — ніколи не каже відповідь.

## Як залити на GitHub

1. Створи новий репозиторій на [github.com/new](https://github.com/new)
2. Назва: `ai-tutor` (або будь-яка)
3. НЕ став галочку "Add README"
4. Натисни **Create repository**

5. У терміналі (або через GitHub Desktop):
```bash
cd шлях-до-папки-ai-tutor-web
git init
git add .
git commit -m "AI Репетитор"
git branch -M main
git remote add origin https://github.com/ТВІЙ_ЛОГІН/ai-tutor.git
git push -u origin main
```

## Як увімкнути сайт (GitHub Pages)

1. Відкрий свій репозиторій на GitHub
2. **Settings** → **Pages**
3. У "Source" вибери **Deploy from a branch**
4. Branch: **main**, папка: **/ (root)**
5. **Save**

Через хвилину сайт буде тут: `https://ТВІЙ_ЛОГІН.github.io/ai-tutor/`

## Що всередині

- `index.html` — головна сторінка
- `style.css` — стилі
- `app.js` — логіка чату і підказок

Без Node.js, без API, без сторонніх сервісів. Тільки HTML, CSS, JS.

## iOS Shortcut — аналіз тестів

Є також iOS Shortcut для швидкого аналізу тестових завдань: сфоткав → отримав відповідь у нотифікації.

Інструкція: [ios-shortcut-guide.md](ios-shortcut-guide.md)

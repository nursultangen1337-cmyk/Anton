const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const cameraBtn = document.getElementById('camera');
const uploadBtn = document.getElementById('upload');
const voiceBtn = document.getElementById('voice');
const fileInput = document.getElementById('file-input');
const photoPreview = document.getElementById('photo-preview');
const photoImg = document.getElementById('photo-img');
const clearPhotoBtn = document.getElementById('clear-photo');
const loading = document.getElementById('loading');

let history = [];
let currentPhoto = null;

const HINTS = {
  math: [
    'Що в задачі ми шукаємо? Прочитай умову ще раз уважно.',
    'Скільки всього предметів/чисол у задачі? Порахуй.',
    'Яку дію треба використати — додавання, віднімання, множення чи ділення? Подумай, що означає кожна.',
    'Спробуй намалювати задачу на папері. Що бачиш?',
    'Розбій задачу на частини. Що можна зробити спочатку?',
    'Порахуй на пальцях або малюнку. Крок за кроком.',
    'Якщо це додавання — скільки всього буде? Якщо віднімання — скільки залишиться?',
    'Перечитай питання задачі. Що саме в нас питають?'
  ],
  reading: [
    'Прочитай текст ще раз повільно. Що головне в кожному реченні?',
    'Знайди в тексті ключові слова. Що вони означають?',
    'Про що йдеться в цьому уривку? Одним реченням.',
    'Хто головний герой? Що він робить?',
    'Що сталося спочатку, а що потім?'
  ],
  ukrainian: [
    'Яке це слово — назва, дія чи ознака? Подумай.',
    'Прочитай речення вголос. Звучить правильно?',
    'Згадай правило. Що ми вивчали про цю тему?',
    'Подивись на сусідні слова. Що вони підказують?',
    'Як би це слово звучало в іншому реченні?'
  ],
  general: [
    'Що вже знаєш про це? З чого можна почати?',
    'Намалюй або запиши, що дано. Це допоможе.',
    'Розбій на прості кроки. Який перший крок?',
    'Прочитай уважно ще раз. Може, щось пропустив?',
    'Поділись, що вже спробував. Я підкажу далі.',
    'Подумай, що означає кожне слово в завданні.',
    'Якби ти пояснював це другові — з чого б почав?'
  ]
};

function getHint(userText) {
  const text = userText.toLowerCase();
  
  if (/\d+\s*[\+\-\×\*\/÷]\s*\d+|\d+\s+і\s+\d+|скільки|склад|віднім|множ|діл|задач/.test(text)) {
    return HINTS.math[Math.floor(Math.random() * HINTS.math.length)];
  }
  if (/прочит|текст|оповід|казк|герой|абзац/.test(text)) {
    return HINTS.reading[Math.floor(Math.random() * HINTS.reading.length)];
  }
  if (/слово|речення|букв|правил|граматик|орфограф|суфікс|префікс/.test(text)) {
    return HINTS.ukrainian[Math.floor(Math.random() * HINTS.ukrainian.length)];
  }
  
  return HINTS.general[Math.floor(Math.random() * HINTS.general.length)];
}

function addWelcome() {
  if (chat.querySelector('.welcome')) return;
  const div = document.createElement('div');
  div.className = 'welcome';
  div.innerHTML = `
    <strong>Сфотографуй задачу або напиши питання</strong>
    <p>Я задам тобі питань, щоб ти сам знайшов відповідь. Не проси відповідь — попроси підказку!</p>
  `;
  chat.appendChild(div);
}

addWelcome();

function addMessage(text, isUser) {
  const welcome = chat.querySelector('.welcome');
  if (welcome) welcome.remove();

  const div = document.createElement('div');
  div.className = `msg ${isUser ? 'user' : 'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  div.appendChild(bubble);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showError(msg) {
  const existing = chat.querySelector('.error');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = 'error';
  div.textContent = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => div.remove(), 5000);
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text && !currentPhoto) return;

  const userText = text || 'Допоможи з цією задачею (я сфотографував)';
  addMessage(userText, true);
  messageInput.value = '';
  loading.classList.remove('hidden');

  if (currentPhoto) {
    currentPhoto = null;
    photoPreview.classList.add('hidden');
  }

  await new Promise(r => setTimeout(r, 400));
  
  const hint = getHint(userText);
  history.push({ user: userText, assistant: hint });
  addMessage(hint, false);
  loading.classList.add('hidden');
}

function handlePhoto(file) {
  if (!file || !file.type.startsWith('image/')) return;
  currentPhoto = file;
  photoImg.src = URL.createObjectURL(file);
  photoPreview.classList.remove('hidden');
}

cameraBtn.addEventListener('click', () => {
  fileInput.setAttribute('capture', 'environment');
  fileInput.click();
});

uploadBtn.addEventListener('click', () => {
  fileInput.removeAttribute('capture');
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handlePhoto(file);
  e.target.value = '';
});

clearPhotoBtn.addEventListener('click', () => {
  currentPhoto = null;
  photoPreview.classList.add('hidden');
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

voiceBtn.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showError('Голос не підтримується в цьому браузері');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'uk-UA';
  recognition.continuous = false;

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    messageInput.value = text;
  };

  recognition.onerror = () => {
    showError('Не вдалося розпізнати голос');
  };

  recognition.start();
});

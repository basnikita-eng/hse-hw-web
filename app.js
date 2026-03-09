window.onload = function () {
  // ===== Карта =====
  var mapElement = document.getElementById('map');
  if (mapElement) {
    var map = L.map('map').setView([55.759, 37.648], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var marker = L.marker([55.759, 37.648]).addTo(map);
    marker.bindPopup('Примерная точка на карте').openPopup();
  }

  // ===== Чат =====
  var chatForm = document.getElementById('chat-form');
  var chatInput = document.getElementById('chat-input');
  var chatMessages = document.getElementById('chat-messages');
  var voiceBtn = document.getElementById('voice-btn');
  var voiceStatus = document.getElementById('voice-status');

  function addMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = 'chat-message ' + type;

    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotReply(text) {
    var value = text.toLowerCase();

    var rules = [
      {
        keywords: ['привет', 'здарова', 'здравствуйте', 'hello', 'hi'],
        answers: [
          'Привет. Рад, что заглянул.',
          'Привет, чем могу помочь?',
          'Здравствуйте. Можете написать вопрос прямо сюда.'
        ]
      },
      {
        keywords: ['вшэ', 'hse', 'университет'],
        answers: [
          'Я учусь в ВШЭ, поэтому тема сайта связана с учебой.',
          'Да, страница посвящена учебе и студенческому профилю.',
          'Сайт сделан в формате личной страницы студента ВШЭ.'
        ]
      },
      {
        keywords: ['учеба', 'курс', 'математика', 'прикладная математика'],
        answers: [
          'Сейчас основной фокус — учеба и работа с задачами.',
          'Прикладная математика нравится тем, что в ней много логики и практики.',
          'Обычно все строится вокруг теории, задач и регулярной практики.'
        ]
      },
      {
        keywords: ['проект', 'сайт', 'верстка', 'html', 'css', 'js', 'javascript'],
        answers: [
          'Этот сайт собран как учебный проект и постепенно дорабатывался.',
          'Тут обычный статический сайт: HTML, CSS, JavaScript и GitHub Pages.',
          'Старался сделать страницу аккуратной и понятной.'
        ]
      },
      {
        keywords: ['карта', 'где', 'место', 'локация'],
        answers: [
          'На странице есть интерактивная карта с примерной точкой.',
          'Карта добавлена как часть задания и работает прямо в браузере.',
          'Можно приблизить карту и посмотреть окружение.'
        ]
      },
      {
        keywords: ['спасибо', 'благодарю'],
        answers: [
          'Пожалуйста.',
          'Не за что.',
          'Всегда пожалуйста.'
        ]
      }
    ];

    for (var i = 0; i < rules.length; i++) {
      for (var j = 0; j < rules[i].keywords.length; j++) {
        if (value.indexOf(rules[i].keywords[j]) !== -1) {
          var arr = rules[i].answers;
          return arr[Math.floor(Math.random() * arr.length)];
        }
      }
    }

    var fallback = [
      'Понял. Можешь написать чуть подробнее.',
      'Интересный вопрос. Если хочешь, уточни формулировку.',
      'Принято. Я бы ответил так: все зависит от контекста.',
      'Сообщение получено. Напиши еще пару деталей.',
      'Можно сформулировать короче или точнее — так будет проще ответить.'
    ];

    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';

      setTimeout(function () {
        addMessage(getBotReply(text), 'bot');
      }, 500);
    });
  }

  // ===== Голосовые сообщения (фиктивные) =====
  var mediaRecorder = null;
  var audioChunks = [];
  var isRecording = false;

  if (voiceBtn && voiceStatus && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    voiceBtn.addEventListener('click', function () {
      if (!isRecording) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function (stream) {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', function (event) {
              if (event.data.size > 0) {
                audioChunks.push(event.data);
              }
            });

            mediaRecorder.addEventListener('stop', function () {
              addMessage('Голосовое сообщение отправлено', 'user');
              voiceStatus.textContent = 'Голосовое сообщение готово';

              setTimeout(function () {
                addMessage('Услышал голосовое. Отвечу текстом: сообщение получено.', 'bot');
              }, 500);

              stream.getTracks().forEach(function (track) {
                track.stop();
              });
            });

            mediaRecorder.start();
            isRecording = true;
            voiceBtn.textContent = 'Остановить запись';
            voiceStatus.textContent = 'Идет запись...';
          })
          .catch(function () {
            voiceStatus.textContent = 'Не удалось получить доступ к микрофону';
          });
      } else {
        if (mediaRecorder) {
          mediaRecorder.stop();
        }
        isRecording = false;
        voiceBtn.textContent = 'Записать голосовое';
      }
    });
  } else if (voiceStatus) {
    voiceStatus.textContent = 'Запись голосовых не поддерживается в этом браузере';
  }
};

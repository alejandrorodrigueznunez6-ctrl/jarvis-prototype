// JARVIS CORE SYSTEM v2.0
const chatOutput = document.getElementById('chatOutput');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const historyBtn = document.getElementById('historyBtn');
const voiceModal = document.getElementById('voiceModal');
const historyModal = document.getElementById('historyModal');

// User Info
const USER_WHATSAPP = '+52 5659913650';
const USER_INSTAGRAM = '@razb_15';

// Local Storage for History
let conversationHistory = JSON.parse(localStorage.getItem('jarvisHistory')) || [];
let deviceStates = JSON.parse(localStorage.getItem('deviceStates')) || {};

// Update Time
function updateTime() {
  const now = new Date();
  document.getElementById('sysTime').textContent = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });
}
setInterval(updateTime, 1000);
updateTime();

// Add Message to Chat
function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatOutput.appendChild(msg);
  chatOutput.scrollTop = chatOutput.scrollHeight;
  
  // Save to history
  conversationHistory.push({ role, text, timestamp: new Date().toLocaleString() });
  localStorage.setItem('jarvisHistory', JSON.stringify(conversationHistory));
}

// AI-like Responses
function generateResponse(input) {
  const t = input.trim().toLowerCase();
  if (!t) return 'Please provide input.';

  let response = 'I have logged your request and I am ready to assist.';

  // Greetings
  if (t.match(/hola|hello|hi|saludo|hey jarvis/)) {
    response = 'Hello. JARVIS is online and ready. What would you like me to do?';
  }
  // GPS & Maps
  else if (t.match(/gps|mapa|ruta|location|where|dirección/)) {
    response = 'GPS lock confirmed. Current location: New York City (40.7128°N, 74.0060°W). Route optimization is active. Would you like directions to a specific location?';
  }
  // Camera Feeds
  else if (t.match(/camara|camera|feed|surveillance|monitoreo/)) {
    response = 'Live camera feeds are connected for Tokyo, Paris, London, and New York. All systems are streaming at 4K resolution. Would you like to focus on a specific location?';
  }
  // Weather
  else if (t.match(/clima|weather|temperatura|temp|lluvia|rain/)) {
    response = 'External weather feed is online. Current conditions: Temperature 21°C, clear sky, low wind conditions. No precipitation expected in the next 6 hours.';
  }
  // Smart Home
  else if (t.match(/luz|light|lights|smart home|casa|dispositivo/)) {
    response = 'Smart home subsystem is fully active. All 14 devices are synchronized and responding to commands. Living room lights, thermostat, security lock, TV, and speaker system are all under control.';
  }
  // Memory & Recording
  else if (t.match(/guardar|record|memory|recordar|save/)) {
    response = 'Your request has been stored in the local memory log. Timestamp: ' + new Date().toLocaleString() + '. I can recall this information at any time.';
  }
  // Time
  else if (t.match(/hora|time|que hora|what time/)) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: true });
    response = `System time is synchronized globally. Current timestamp: ${time} UTC. All operations are on schedule.`;
  }
  // Help
  else if (t.match(/ayuda|help|qué|what can you/)) {
    response = 'I can assist with: GPS navigation, camera surveillance, smart home control, weather updates, security monitoring, voice commands, calendar management, device control, and more. What would you like?';
  }
  // Contact Info
  else if (t.match(/whatsapp|instagram|contacto|contact|social/)) {
    response = `My contact information: WhatsApp: ${USER_WHATSAPP} | Instagram: ${USER_INSTAGRAM}. Feel free to reach out anytime.`;
  }
  // Devices Control
  else if (t.match(/encender|turn on|apagar|turn off|control/)) {
    response = 'Device control protocol initiated. I can toggle lights, thermostat, security lock, TV, and speaker system. Which device would you like me to control?';
  }
  // Tasks & Automation
  else if (t.match(/tarea|task|automatizar|automata|automation/)) {
    response = 'Automation systems are online. I can create tasks, set reminders, schedule actions, and automate routines. What automation would you like to set up?';
  }
  // Status Check
  else if (t.match(/estado|status|sistema|system/)) {
    response = 'All systems are operational. CPU load: 42%, Power: 78%, Security: 92%. No issues detected. Network connectivity is stable.';
  }
  // Default
  else {
    const responses = [
      'I have processed your request. Analyzing data...',
      'Your command has been received and logged.',
      'System is processing. What else can I help you with?',
      'I understand. Executing protocols...',
      'Information stored in memory banks. Awaiting next command.'
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }

  return response;
}

// Send Message
function sendMessage() {
  const input = chatInput.value.trim();
  if (!input) return;
  
  addMessage('user', input);
  chatInput.value = '';
  
  setTimeout(() => {
    const response = generateResponse(input);
    addMessage('ai', response);
    showNotification('Request processed');
  }, 300);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Voice Recognition
function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  document.getElementById('voiceStatus').textContent = '🎤 Listening...';
  
  recognition.onstart = () => {
    document.getElementById('voiceStatus').textContent = '🔴 Recording...';
  };
  
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    document.getElementById('voiceTranscript').textContent = transcript;
    chatInput.value = transcript;
  };
  
  recognition.onerror = () => {
    document.getElementById('voiceStatus').textContent = '❌ Error. Try again.';
  };
  
  recognition.onend = () => {
    document.getElementById('voiceStatus').textContent = '✓ Completed';
  };
  
  recognition.start();
}

voiceBtn.addEventListener('click', () => {
  voiceModal.classList.remove('hidden');
});

function closeVoiceModal() {
  voiceModal.classList.add('hidden');
}

// History Modal
historyBtn.addEventListener('click', () => {
  const historyContent = document.getElementById('historyContent');
  historyContent.innerHTML = conversationHistory.map((h, i) => `
    <div class="history-item">
      <strong>[${h.role.toUpperCase()}]</strong> ${h.timestamp}<br/>
      ${h.text}
    </div>
  `).join('');
  historyModal.classList.remove('hidden');
});

function closeHistoryModal() {
  historyModal.classList.add('hidden');
}

function clearHistory() {
  conversationHistory = [];
  localStorage.removeItem('jarvisHistory');
  document.getElementById('historyContent').innerHTML = '<p>History cleared.</p>';
  showNotification('History cleared');
}

// Smart Device Toggle
document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('on');
    const device = toggle.dataset.device;
    deviceStates[device] = toggle.classList.contains('on');
    localStorage.setItem('deviceStates', JSON.stringify(deviceStates));
    showNotification(`${device.charAt(0).toUpperCase() + device.slice(1)} ${toggle.classList.contains('on') ? 'turned ON' : 'turned OFF'}`);
  });
});

// Restore device states
Object.entries(deviceStates).forEach(([device, state]) => {
  const toggle = document.querySelector(`[data-device="${device}"]`);
  if (toggle && state) {
    toggle.classList.add('on');
  }
});

// Notifications
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = '✓ ' + message;
  document.getElementById('notifications').appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Initialize
window.addEventListener('load', () => {
  addMessage('ai', 'JARVIS initialization complete. All systems online and operational. Ready to serve you.');
});

// Expose functions to window
window.startVoiceRecognition = startVoiceRecognition;
window.closeVoiceModal = closeVoiceModal;
window.closeHistoryModal = closeHistoryModal;
window.clearHistory = clearHistory;
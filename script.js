// ------------------------ Navigation ------------------------
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  el.style.display = 'block';
}

window.onload = function() {
  showSection('chatbot');
  displayChat();
  displayDiary();
};

// -------------------- Chat (with Gemini backend) --------------------
let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");

// Send text to your Node backend which calls Gemini
async function chatbotResponse(userMessage) {
  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    // backend returns { reply: "..." } or error message
    return data.reply || "I'm here for you.";
  } catch (err) {
    console.error("Backend Error:", err);
    return "Something went wrong connecting to the server.";
  }
}

function displayChat() {
  const chatDiv = document.getElementById("chat-history");
  if (!chatDiv) return;
  chatDiv.innerHTML = "";
  chatHistory.forEach((msg, idx) => {
    chatDiv.innerHTML += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <span style="flex:1"><b>${escapeHtml(msg.from)}:</b> ${escapeHtml(msg.text)}</span>
      <button class="delete-btn-chat" onclick="deleteMsg(${idx})" title="Delete this message">🗑️</button>
    </div>`;
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// helper to escape user text (basic)
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function deleteMsg(idx) {
  chatHistory.splice(idx, 1);
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  displayChat();
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  // push user message
  chatHistory.push({ from: "You", text });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  displayChat();
  input.value = "";

  // show typing placeholder
  chatHistory.push({ from: "SoulSync AI", text: "Typing..." });
  displayChat();

  // get AI response
  const aiResponse = await chatbotResponse(text);

  // replace typing...
  chatHistory.pop();
  chatHistory.push({ from: "SoulSync AI", text: aiResponse });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  displayChat();
}

// allow pressing Enter to send from text input
document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (!active) return;
  if ((active.id === 'chat-input' || active.id === 'diaryEntry') && e.key === 'Enter') {
    if (active.id === 'chat-input') {
      e.preventDefault();
      sendMessage();
    } else if (active.id === 'diaryEntry') {
      e.preventDefault();
      saveDiary();
    }
  }
});

// -------------------- Stress Relief Music --------------------
function playMusic() {
  const p = document.getElementById("musicPlayer");
  if (!p) return;
  p.play();
}
function pauseMusic() {
  const p = document.getElementById("musicPlayer");
  if (!p) return;
  p.pause();
}

// -------------------- Diary --------------------
let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

function saveDiary() {
  const el = document.getElementById("diaryEntry");
  if (!el) return;
  const entry = el.value.trim();
  if (!entry) return;
  const date = new Date().toLocaleString();
  diaryEntries.push({ date, entry });
  localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  el.value = "";
  displayDiary();
}

function displayDiary() {
  const diaryDiv = document.getElementById("diaryHistory");
  if (!diaryDiv) return;
  diaryDiv.innerHTML = "";
  if (diaryEntries.length === 0) {
    diaryDiv.innerHTML = "<i>No entries yet.</i>";
    return;
  }
  diaryEntries.slice().reverse().forEach(item => {
    diaryDiv.innerHTML += `<div style="margin-bottom:8px;"><b>${escapeHtml(item.date)}:</b> ${escapeHtml(item.entry)}</div>`;
  });
}

// -------------------- Games --------------------
function showGame(game) {
  const gameArea = document.getElementById("gameArea");
  if (!gameArea) return;
  gameArea.innerHTML = "";
  if (game === "sudoku") {
    gameArea.innerHTML = `<iframe src="https://sudoku.com" width="430" height="410" style="border-radius:12px;border:none;"></iframe>`;
  } else if (game === "zipLine") {
    gameArea.innerHTML = `<iframe src="https://www.puzzle-bridges.com/" width="430" height="410" style="border-radius:12px;border:none;"></iframe>`;
  } else if (game === "ticTacToe") {
    gameArea.innerHTML = `<div id="ticTacToeBoard"></div>`;
    setupTicTacToe();
  }
}

// -------------------- Tic Tac Toe --------------------
let tttBoard = ["", "", "", "", "", "", "", "", ""];
let tttPlayer = "X";
let tttActive = false;

function setupTicTacToe() {
  tttBoard = ["", "", "", "", "", "", "", "", ""];
  tttPlayer = "X";
  tttActive = true;
  renderTicTacToe();
}

function renderTicTacToe() {
  const container = document.getElementById("ticTacToeBoard");
  if (!container) return;
  let html = "<table class='tictac' style='margin:0 auto;'>";
  for (let i = 0; i < 3; i++) {
    html += "<tr>";
    for (let j = 0; j < 3; j++) {
      const idx = i * 3 + j;
      html += `<td onclick="makeMove(${idx})" style="width:80px;height:80px;text-align:center;vertical-align:middle;border:1px solid #ccc;font-size:28px;cursor:pointer;">${tttBoard[idx] || ''}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  html += `<div style="margin-top:10px;text-align:center;font-weight:bold;">Player: ${tttPlayer}</div>`;
  container.innerHTML = html;
}

window.makeMove = function(idx) {
  if (!tttActive || tttBoard[idx] !== "") return;
  tttBoard[idx] = tttPlayer;
  if (checkWinner(tttBoard, tttPlayer)) {
    tttActive = false;
    document.getElementById('ticTacToeBoard').innerHTML += `<div style="margin-top:10px;font-weight:bold;color:#764ba2;">Player ${tttPlayer} wins!</div>`;
    return;
  } else if (!tttBoard.includes("")) {
    tttActive = false;
    document.getElementById('ticTacToeBoard').innerHTML += `<div style="margin-top:10px;font-weight:bold;color:#764ba2;">It's a draw!</div>`;
    return;
  }
  tttPlayer = tttPlayer === "X" ? "O" : "X";
  renderTicTacToe();
};

function checkWinner(board, player) {
  const winStates = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winStates.some(indices => indices.every(i => board[i] === player));
}

// -------------------- Utility: clear storage (optional) --------------------
function clearChatHistory() {
  chatHistory = [];
  localStorage.removeItem("chatHistory");
  displayChat();
}
function clearDiary() {
  diaryEntries = [];
  localStorage.removeItem("diaryEntries");
  displayDiary();
}

// -------------------- Expose sendMessage to buttons --------------------
// If your HTML buttons call sendMessage() directly they will work.
// If not, attach click handlers here (uncomment if you want):
// document.getElementById("sendBtn").addEventListener("click", sendMessage);

// -------------------- End of script --------------------

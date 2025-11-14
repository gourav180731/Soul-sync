// --------- Navigation ----------
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    document.getElementById(id).classList.add('active');
    document.getElementById(id).style.display = 'block';
}
window.onload = function() {
    showSection('chatbot');
    displayChat();
    displayDiary();
};

// --------- Chatbot with Delete Feature & Smart Responses ----------
let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");

function displayChat() {
    const chatDiv = document.getElementById("chat-history");
    chatDiv.innerHTML = "";
    chatHistory.forEach((msg, idx) => {
        chatDiv.innerHTML += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span><b>${msg.from}:</b> ${msg.text}</span>
            <button class="delete-btn-chat" onclick="deleteMsg(${idx})" title="Delete this message">🗑️</button>
        </div>`;
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Delete single message
function deleteMsg(idx) {
    chatHistory.splice(idx, 1);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    displayChat();
}

// Chatbot with situation/context answers
function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    chatHistory.push({ from: "You", text });
    let response = chatbotResponse(text);
    chatHistory.push({ from: "SoulSync AI", text: response });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    input.value = "";
    displayChat();
}

// Contextual response logic
function chatbotResponse(val) {
    let lower = val.toLowerCase();
    if (lower.match(/(sad|depressed|down|upset|lost)/)) {
        return "I'm sorry you're feeling that way. Remember, tough times don't last. Want to talk more or listen to some relaxing music?";
    }
    if (lower.match(/(lonely|alone|isolated)/)) {
        return "Loneliness can be hard. Would you like to play a game, write in your diary, or chat more with me?";
    }
    if (lower.match(/(happy|excited|joy|achieve|success|won|promotion)/)) {
        return "That's awesome! I'm happy for you. Want to celebrate with a fun game or share more?";
    }
    if (lower.match(/(anxious|nervous|panic|worried|exam|test|interview)/)) {
        return "It's normal to feel anxious. Breathe deep, and maybe try stress relief music or diary to calm down. Want tips for stress?";
    }
    if (lower.match(/(help|suggest|recommend|advice|what should i do)/)) {
        return "I'm here to help! Please tell me more about your situation, and I'll do my best to suggest something useful.";
    }
    if (lower.match(/(hello|hi|hey|hola|namaste)/)) {
        return "Hello! How are you feeling today? You can share anything with me.";
    }
    if (lower.match(/(bored|nothing to do|not fun)/)) {
        return "Let's beat boredom! Want to play Sudoku, ZipLine, or Tic Tac Toe?";
    }
    if (lower.match(/(love|relationship|breakup|crush|heart)/)) {
        return "Relationships can be complicated. I'm always here to listen or give advice if you need it.";
    }
    if (lower.match(/(thank|thanks|appreciate|grateful)/)) {
        return "You're most welcome! Remember, I'm always here for you.";
    }
    if (lower.match(/(your name|who are you)/)) {
        return "I'm SoulSync, your friendly AI assistant for emotions, fun, and support!";
    }
    if (lower.match(/(what can you do|features|how can you help)/)) {
        return "I can chat, track your feelings, save your diary notes, play games, and even play stress relief music.";
    }
    // Default fallback
    return "I'm here for you, no matter what. Tell me more, or ask anything. If you need suggestions or emotional support, just type about your feelings.";
}

// -------- Stress Relief --------
function playMusic() {
    document.getElementById("musicPlayer").play();
}
function pauseMusic() {
    document.getElementById("musicPlayer").pause();
}

// ---------- Diary -----------
let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");
function saveDiary() {
    const entry = document.getElementById("diaryEntry").value.trim();
    if (!entry) return;
    const date = new Date().toLocaleString();
    diaryEntries.push({ date, entry });
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
    document.getElementById("diaryEntry").value = "";
    displayDiary();
}
function displayDiary() {
    const diaryDiv = document.getElementById("diaryHistory");
    diaryDiv.innerHTML = "";
    if (diaryEntries.length === 0) {
        diaryDiv.innerHTML = "<i>No entries yet.</i>";
        return;
    }
    diaryEntries.slice().reverse().forEach(item => {
        diaryDiv.innerHTML += `<div><b>${item.date}:</b> ${item.entry}</div>`;
    });
}

// ---------- Games ----------
function showGame(game) {
    const gameArea = document.getElementById("gameArea");
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

// --- Tic Tac Toe ---------
let tttBoard, tttPlayer, tttActive;
function setupTicTacToe() {
    tttBoard = ["", "", "", "", "", "", "", "", ""];
    tttPlayer = "X";
    tttActive = true;
    renderTicTacToe();
}
function renderTicTacToe() {
    let html = "<table class='tictac'>";
    for (let i = 0; i < 3; i++) {
        html += "<tr>";
        for (let j = 0; j < 3; j++) {
            const idx = i * 3 + j;
            html += `<td onclick="makeMove(${idx})">${tttBoard[idx]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += `<div style="margin-top:10px;text-align:center;font-weight:bold;">Player: ${tttPlayer}</div>`;
    document.getElementById('ticTacToeBoard').innerHTML = html;
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



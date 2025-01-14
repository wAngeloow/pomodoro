let minutes = 25;
let seconds = 0;
let timerInterval;
let isRunning = false;

const startButton = document.querySelectorAll('#start-btn, #indicador');
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const audio = new Audio('audio/audio.mp3');
const resetButton = document.querySelector(".fa-arrows-rotate");
const btnPomodoro = document.getElementById("btn-pomodoro");
const btnBreak = document.getElementById("btn-break");
const btnLongBreak = document.getElementById("btn-long-break");
const title = document.querySelector('title');

// Pega os valores dos inputs para os tempos
const pomodoroTimeInput = document.getElementById('pomodoro-time');
const breakTimeInput = document.getElementById('break-time');
const longBreakTimeInput = document.getElementById('long-break-time');

// Pega o modal e os botões
const settingsModal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById("settings-btn");
const closeModal = document.getElementById("close-modal");
const saveSettingsBtn = document.getElementById("save-settings");

let originalPomodoroTime = 25;
let originalBreakTime = 5;
let originalLongBreakTime = 15;

title.textContent = "Pomodoro";

// Atualiza o cronômetro na interface
function updateTime() {
    minutesElement.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsElement.textContent = seconds < 10 ? "0" + seconds : seconds;
    if (isRunning) {
        title.textContent = `${minutesElement.textContent}:${secondsElement.textContent} - ${getCurrentMode()}`;
    }
}

// Retorna o modo atual (Pomodoro, Pausa Curta ou Pausa Longa)
function getCurrentMode() {
    if (btnPomodoro.classList.contains("active")) {
        return 'Pomodoro';
    } else if (btnBreak.classList.contains("active")) {
        return 'Pausa Curta';
    } else if (btnLongBreak.classList.contains("active")) {
        return 'Pausa Longa';
    }
    return 'Pomodoro';
}

// Variáveis para controle de tempo
let lastTime = performance.now();
let elapsedTime = 0;  // Será acumulado somente quando o cronômetro estiver em execução

// Inicia o cronômetro
function startTimer() {
    // Reseta o tempo acumulado se o cronômetro foi pausado e depois reiniciado
    lastTime = performance.now(); // Inicia a contagem a partir do momento atual
    isRunning = true;

    timerInterval = setInterval(function() {
        let currentTime = performance.now();
        let deltaTime = currentTime - lastTime;  // Tempo decorrido desde a última execução
        lastTime = currentTime;

        // Acumula o tempo decorrido enquanto o cronômetro estiver rodando
        elapsedTime += deltaTime;

        // Verifica se passou 1 segundo (1000 ms)
        if (elapsedTime >= 1000) {
            let secondsToUpdate = Math.floor(elapsedTime / 1000);  // Quantos segundos devemos avançar
            elapsedTime -= secondsToUpdate * 1000;  // Subtrai os segundos avançados

            // Avança o cronômetro o número de segundos necessários
            seconds -= secondsToUpdate;

            while (seconds < 0) {
                seconds += 60;
                minutes--;
            }

            // Se minutos chegar a zero, interrompe o cronômetro
            if (minutes < 0) {
                minutes = 0;
                seconds = 0;
                clearInterval(timerInterval);
                audio.play();
                setIconToPlay();
                isRunning = false;
            }

            updateTime();
        }
    }, 50);  // Verifica a cada 50ms, mas só atualiza quando passar 1 segundo
}

// Pausa o cronômetro
function pauseTimer() {
    clearInterval(timerInterval);
    setIconToPlay();
    isRunning = false;
}

// Reseta o cronômetro
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0; // Reseta o tempo acumulado
    // Verifica qual o tempo atual antes de resetar
    if (btnPomodoro.classList.contains("active")) {
        minutes = parseInt(pomodoroTimeInput.value) || originalPomodoroTime;
    } else if (btnBreak.classList.contains("active")) {
        minutes = parseInt(breakTimeInput.value) || originalBreakTime;
    } else if (btnLongBreak.classList.contains("active")) {
        minutes = parseInt(longBreakTimeInput.value) || originalLongBreakTime;
    }
    seconds = 0;
    updateTime();
    setIconToPlay();
    isRunning = false;
}

// Define o ícone para play
function setIconToPlay() {
    startButton.forEach(button => {
        button.innerHTML = '<i class="fa-solid fa-play" title="Play"></i>';
    });
}

// Define o ícone para pause
function setIconToPause() {
    startButton.forEach(button => {
        button.innerHTML = '<i class="fa-solid fa-pause" title="Pause"></i>';
    });
}

// Alterna entre play e pause
function togglePlayPause() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
        setIconToPause();
        isRunning = true;
    }
}

// Ouvinte de evento para o ícone de play/pause
startButton.forEach(button => {
    button.addEventListener("click", togglePlayPause);
});

// Ouvinte de evento para o ícone de reset
resetButton.addEventListener("click", resetTimer);

// Define o tempo do cronômetro
function setTimer(newMinutes) {
    minutes = newMinutes;
    seconds = 0;
    updateTime();
    resetTimer();
}

// Alterna entre os modos Pomodoro, Pausa Curta e Pausa Longa
function switchMode(newMode) {
    if (isRunning) {
        pauseTimer();
    }

    btnPomodoro.classList.remove("active");
    btnBreak.classList.remove("active");
    btnLongBreak.classList.remove("active");

    if (newMode === 'pomodoro') {
        minutes = parseInt(pomodoroTimeInput.value) || originalPomodoroTime;
        setTimer(minutes);
        btnPomodoro.classList.add("active");
    } else if (newMode === 'break') {
        minutes = parseInt(breakTimeInput.value) || originalBreakTime;
        setTimer(minutes);
        btnBreak.classList.add("active");
    } else if (newMode === 'longBreak') {
        minutes = parseInt(longBreakTimeInput.value) || originalLongBreakTime;
        setTimer(minutes);
        btnLongBreak.classList.add("active");
    }

    title.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds} - ${getCurrentMode()}`;

    setIconToPlay();
    isRunning = false;
}

// Ouvinte de evento para os botões de modo (Pomodoro, Pausa Curta, Pausa Longa)
btnPomodoro.addEventListener("click", function() {
    switchMode('pomodoro');
});

btnBreak.addEventListener("click", function() {
    switchMode('break');
});

btnLongBreak.addEventListener("click", function() {
    switchMode('longBreak');
});

// Modal de configurações
settingsBtn.addEventListener("click", function() {
    settingsModal.style.display = "block";
    pomodoroTimeInput.value = originalPomodoroTime;
    breakTimeInput.value = originalBreakTime;
    longBreakTimeInput.value = originalLongBreakTime;
});

closeModal.addEventListener("click", function() {
    settingsModal.style.display = "none";
});

saveSettingsBtn.addEventListener("click", function() {
    // Salva as novas configurações e atualiza as variáveis
    originalPomodoroTime = parseInt(pomodoroTimeInput.value);
    originalBreakTime = parseInt(breakTimeInput.value);
    originalLongBreakTime = parseInt(longBreakTimeInput.value);

    // Atualiza os valores no cronômetro e reinicia com o modo ativo
    if (btnPomodoro.classList.contains("active")) {
        minutes = originalPomodoroTime;
    } else if (btnBreak.classList.contains("active")) {
        minutes = originalBreakTime;
    } else if (btnLongBreak.classList.contains("active")) {
        minutes = originalLongBreakTime;
    }

    seconds = 0;
    updateTime();

    // Fecha o modal
    settingsModal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});

updateTime();

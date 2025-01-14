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

// Inicia o cronômetro
function startTimer() {
    timerInterval = setInterval(function() {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                audio.play();
                setIconToPlay();
                isRunning = false;
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateTime();
    }, 1000);
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
    if (btnPomodoro.classList.contains("active")) {
        minutes = 25;
    } else if (btnBreak.classList.contains("active")) {
        minutes = 5;
    } else if (btnLongBreak.classList.contains("active")) {
        minutes = 15;
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
        setTimer(25);
        btnPomodoro.classList.add("active");
    } else if (newMode === 'break') {
        setTimer(5);
        btnBreak.classList.add("active");
    } else if (newMode === 'longBreak') {
        setTimer(15);
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

updateTime();
// Game State
let points = 0;
let clickPower = 1;
let autoClickerLevel = 0;
let clickBoostLevel = 0;
let playtimeSeconds = 0;
let highScore = 0;

// Upgrade Costs
let autoClickerCost = 100;
let clickBoostCost = 50;

// Auto Clicker Interval
let autoClickInterval = null;

// DOM Elements
const pointsElement = document.getElementById('points');
const clickPowerElement = document.getElementById('click-power');
const coreElement = document.getElementById('core');
const playtimeElement = document.getElementById('playtime');
const highscoreElement = document.getElementById('highscore');

// Initialize game
function initGame() {
    loadProgress();
    updateUI();
    startPlaytimeTimer();
    setupAutoClicker();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    coreElement.addEventListener('click', () => {
        incrementPoints(clickPower);
        animateClick();
    });
}

// Core Game Functions
function incrementPoints(amount) {
    points += amount;
    if (points > highScore) {
        highScore = points;
        localStorage.setItem('highScore', highScore);
        highscoreElement.textContent = highScore;
    }
    updateUI();
    saveProgress();
}

function animateClick() {
    coreElement.classList.add('scale-90');
    setTimeout(() => {
        coreElement.classList.remove('scale-90');
    }, 100);
}

// Upgrade Functions
function buyUpgrade(upgradeType) {
    switch(upgradeType) {
        case 'autoClicker':
            if (points >= autoClickerCost) {
                points -= autoClickerCost;
                autoClickerLevel++;
                autoClickerCost = Math.floor(autoClickerCost * 1.5);
                updateUI();
                saveProgress();
                setupAutoClicker();
            }
            break;
        case 'clickBoost':
            if (points >= clickBoostCost) {
                points -= clickBoostCost;
                clickBoostLevel++;
                clickPower = 1 + clickBoostLevel;
                clickBoostCost = Math.floor(clickBoostCost * 1.5);
                updateUI();
                saveProgress();
            }
            break;
    }
}

function setupAutoClicker() {
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
    }
    
    if (autoClickerLevel > 0) {
        autoClickInterval = setInterval(() => {
            incrementPoints(autoClickerLevel);
        }, 1000);
    }
}

// UI Updates
function updateUI() {
    pointsElement.textContent = points;
    clickPowerElement.textContent = clickPower;
    document.getElementById('autoClicker-level').textContent = autoClickerLevel;
    document.getElementById('autoClicker-cost').textContent = autoClickerCost;
    document.getElementById('clickBoost-level').textContent = clickBoostLevel;
    document.getElementById('clickBoost-cost').textContent = clickBoostCost;
}

// Playtime Timer
function startPlaytimeTimer() {
    setInterval(() => {
        playtimeSeconds++;
        const hours = Math.floor(playtimeSeconds / 3600);
        const minutes = Math.floor((playtimeSeconds % 3600) / 60);
        const seconds = playtimeSeconds % 60;
        playtimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Save/Load Progress
function saveProgress() {
    const gameData = {
        points,
        clickPower,
        autoClickerLevel,
        clickBoostLevel,
        autoClickerCost,
        clickBoostCost,
        playtimeSeconds,
        highScore
    };
    localStorage.setItem('clickerManiaSave', JSON.stringify(gameData));
}

function loadProgress() {
    const savedData = localStorage.getItem('clickerManiaSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        points = gameData.points || 0;
        clickPower = gameData.clickPower || 1;
        autoClickerLevel = gameData.autoClickerLevel || 0;
        clickBoostLevel = gameData.clickBoostLevel || 0;
        autoClickerCost = gameData.autoClickerCost || 100;
        clickBoostCost = gameData.clickBoostCost || 50;
        playtimeSeconds = gameData.playtimeSeconds || 0;
        highScore = gameData.highScore || 0;
    }
    
    // Load high score separately
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
    }
}

// Initialize the game when the page loads
window.onload = initGame;
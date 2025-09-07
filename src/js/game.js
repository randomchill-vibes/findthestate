// Game state variables
let gameState = {
    currentState: null,
    score: 0,
    attempts: 0,
    totalAttempts: 0,
    remainingStates: [],
    completedStates: [],
    isGameActive: false,
    currentStateFirstTry: true,
    timerEnabled: false,
    keepHighlighted: true,
    pointsPerState: 1,
    startTime: null,
    endTime: null,
    timerInterval: null
};

// DOM elements
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const currentStateElement = document.getElementById('current-state');
const attemptsElement = document.getElementById('attempts');
const feedbackElement = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const gameOverModal = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const totalAttemptsElement = document.getElementById('total-attempts');
const playAgainBtn = document.getElementById('play-again-btn');
const mapContainer = document.getElementById('map-container');
const timerToggle = document.getElementById('timer-toggle');
const timerDisplay = document.getElementById('timer-display');
const timerElement = document.getElementById('timer');
const finalTimeDisplay = document.getElementById('final-time-display');
const finalTimeElement = document.getElementById('final-time');
const timerToggleContainer = document.getElementById('game-options-container');
const homeBtn = document.getElementById('home-btn');
const modalHomeBtn = document.getElementById('modal-home-btn');
const highlightToggle = document.getElementById('highlight-toggle');

// Initialize game
function initGame() {
    // Stop any running timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Reset game state
    gameState = {
        currentState: null,
        score: 0,
        attempts: 0,
        totalAttempts: 0,
        remainingStates: Object.keys(statesData),
        completedStates: [],
        isGameActive: false,
        currentStateFirstTry: true,
        timerEnabled: false,
        keepHighlighted: true,
        pointsPerState: 1,
        startTime: null,
        endTime: null,
        timerInterval: null
    };
    
    // Hide game header initially
    const gameHeader = document.getElementById('game-header');
    if (gameHeader) {
        gameHeader.style.display = 'none';
    }
    
    // Ensure timer is hidden initially
    if (timerDisplay) {
        timerDisplay.classList.add('timer-hidden');
    }
    
    // Show game options
    if (timerToggleContainer) {
        timerToggleContainer.style.display = 'flex';
    }
    
    // Update UI
    updateUI();
    feedbackElement.textContent = '';
    gameOverModal.style.display = 'none';
    
    // Load the map
    loadUSAMap();
}

// Update UI elements
function updateUI() {
    scoreElement.textContent = gameState.score;
    const maxScore = Object.keys(statesData).length * gameState.pointsPerState;
    totalElement.textContent = maxScore;
    attemptsElement.textContent = gameState.attempts;
    
    if (gameState.currentState) {
        currentStateElement.textContent = statesData[gameState.currentState];
        // Update floating state display
        const floatingState = document.getElementById('floating-state');
        if (floatingState) {
            floatingState.textContent = statesData[gameState.currentState];
        }
    } else {
        currentStateElement.textContent = 'Click Start to Begin';
        // Clear floating state display
        const floatingState = document.getElementById('floating-state');
        if (floatingState) {
            floatingState.textContent = '';
        }
    }
}

// Format time in MM:SS format
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimer() {
    if (gameState.timerEnabled && gameState.startTime) {
        const elapsed = Date.now() - gameState.startTime;
        timerElement.textContent = formatTime(elapsed);
    }
}

// Start the game
function startGame() {
    gameState.isGameActive = true;
    gameState.timerEnabled = timerToggle.checked;
    gameState.keepHighlighted = highlightToggle.checked;
    gameState.pointsPerState = gameState.keepHighlighted ? 1 : 2;
    
    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    homeBtn.style.display = 'inline-block';
    
    // Hide game options once game starts
    if (timerToggleContainer) {
        timerToggleContainer.style.display = 'none';
    }
    
    // Show game header when game starts
    const gameHeader = document.getElementById('game-header');
    if (gameHeader) {
        gameHeader.style.display = 'flex';
    }
    
    // Start timer if enabled
    if (gameState.timerEnabled) {
        gameState.startTime = Date.now();
        if (timerDisplay) {
            timerDisplay.classList.remove('timer-hidden');
        }
        gameState.timerInterval = setInterval(updateTimer, 100);
    } else {
        if (timerDisplay) {
            timerDisplay.classList.add('timer-hidden');
        }
    }
    
    selectNextState();
}

// Select next random state
function selectNextState() {
    if (gameState.remainingStates.length === 0) {
        endGame();
        return;
    }
    
    // Clear previous feedback
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    
    // Reset current state first try flag
    gameState.currentStateFirstTry = true;
    
    // Clear any previous highlighting
    const allStates = document.querySelectorAll('.state');
    allStates.forEach(state => {
        if (!gameState.completedStates.includes(state.dataset.stateCode)) {
            state.classList.remove('correct', 'incorrect');
        }
    });
    
    // Select random state from remaining
    const randomIndex = Math.floor(Math.random() * gameState.remainingStates.length);
    gameState.currentState = gameState.remainingStates[randomIndex];
    
    updateUI();
}

// Handle state click
function handleStateClick(stateCode) {
    if (!gameState.isGameActive || !gameState.currentState) {
        return;
    }
    
    gameState.attempts++;
    gameState.totalAttempts++;
    
    const clickedElement = document.querySelector(`[data-state-code="${stateCode}"]`);
    
    if (stateCode === gameState.currentState) {
        // Correct answer
        clickedElement.classList.add('correct');
        
        if (gameState.currentStateFirstTry) {
            gameState.score += gameState.pointsPerState;
        }
        
        // Clear feedback to keep interface clean
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        
        // Don't add completed class immediately - will be added after animation if needed
        
        // Remove from remaining and add to completed
        gameState.remainingStates = gameState.remainingStates.filter(s => s !== stateCode);
        gameState.completedStates.push(stateCode);
        
        updateUI();
        
        // Show next state immediately for faster gameplay
        setTimeout(() => {
            selectNextState();
        }, 100); // Very short delay to see the green flash
        
        // Apply final highlighting state after animation
        if (gameState.keepHighlighted) {
            // Replace correct class with completed class for permanent highlighting
            setTimeout(() => {
                clickedElement.classList.remove('correct');
                clickedElement.classList.add('completed');
            }, 500); // Wait for green animation to complete
        } else {
            // Remove highlighting after animation
            setTimeout(() => {
                clickedElement.classList.remove('correct');
            }, 500); // Wait for green animation to complete
        }
        
    } else {
        // Incorrect answer
        clickedElement.classList.add('incorrect');
        gameState.currentStateFirstTry = false;
        
        feedbackElement.textContent = `That's ${statesData[stateCode]}, try again!`;
        feedbackElement.className = 'feedback incorrect';
        
        // Remove incorrect highlight after short delay
        setTimeout(() => {
            clickedElement.classList.remove('incorrect');
        }, 1000);
        
        updateUI();
    }
}

// End the game
function endGame() {
    gameState.isGameActive = false;
    
    // Stop timer if enabled
    if (gameState.timerEnabled) {
        gameState.endTime = Date.now();
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Show final time
        const totalTime = gameState.endTime - gameState.startTime;
        finalTimeElement.textContent = formatTime(totalTime);
        finalTimeDisplay.style.display = 'block';
    } else {
        finalTimeDisplay.style.display = 'none';
    }
    
    const maxScore = Object.keys(statesData).length * gameState.pointsPerState;
    finalScoreElement.textContent = `${gameState.score} / ${maxScore}`;
    totalAttemptsElement.textContent = gameState.totalAttempts;
    gameOverModal.style.display = 'flex';
}

// Go back to home screen
function goHome() {
    // Stop any running timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Reset to initial state
    initGame();
    
    // Show start button, hide others
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    homeBtn.style.display = 'none';
}

// Reset the game
function resetGame() {
    initGame();
    startGame();
}

// Event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
homeBtn.addEventListener('click', goHome);
modalHomeBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    goHome();
});
playAgainBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    resetGame();
});

// Floating state with zoom compensation
let floatingStateEnabled = false;
let zoomCompensationInterval = null;

function getZoomLevel() {
    // Detect browser zoom level
    const ratio = window.devicePixelRatio || 1;
    const screen = window.screen;
    const viewport = window.visualViewport;
    
    if (viewport) {
        // Use Visual Viewport API if available (most accurate)
        return window.innerWidth / viewport.width;
    } else {
        // Fallback method
        return window.outerWidth / window.innerWidth;
    }
}

function updateZoomCompensation() {
    const floatingState = document.getElementById('floating-state');
    if (!floatingState || !floatingStateEnabled) return;
    
    const zoomLevel = getZoomLevel();
    const inverseScale = 1 / Math.max(zoomLevel, 0.5); // Prevent division by very small numbers
    
    // Apply inverse scaling to maintain constant visual size
    floatingState.style.transform = `translateX(-50%) translateZ(0) scale(${inverseScale})`;
}

function toggleFloatingState(enabled) {
    floatingStateEnabled = enabled;
    const floatingState = document.getElementById('floating-state');
    
    if (enabled) {
        floatingState.classList.add('enabled');
        // Start zoom compensation
        updateZoomCompensation();
        zoomCompensationInterval = setInterval(updateZoomCompensation, 200);
        
        // Listen to resize events for zoom changes
        window.addEventListener('resize', updateZoomCompensation);
    } else {
        floatingState.classList.remove('enabled');
        // Stop zoom compensation
        if (zoomCompensationInterval) {
            clearInterval(zoomCompensationInterval);
            zoomCompensationInterval = null;
        }
        
        // Remove event listener
        window.removeEventListener('resize', updateZoomCompensation);
        
        // Reset transform
        floatingState.style.transform = 'translateX(-50%) translateZ(0)';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Floating state toggle
    const floatingStateToggle = document.getElementById('floating-state-toggle');
    if (floatingStateToggle) {
        floatingStateToggle.addEventListener('change', (e) => {
            toggleFloatingState(e.target.checked);
        });
    }
});
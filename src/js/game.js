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
        // Update floating state text if it's visible
        const floatingState = document.getElementById('floating-state');
        if (floatingState && floatingState.classList.contains('enabled')) {
            floatingState.textContent = statesData[gameState.currentState];
        }
    } else {
        currentStateElement.textContent = 'Click Start to Begin';
        // Clear floating state text
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
    
    // Update floating state visibility when game starts
    updateFloatingStateVisibility();
    
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
    
    // Update floating state visibility when game ends
    updateFloatingStateVisibility();
    
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
    
    // Update floating state visibility when going home
    updateFloatingStateVisibility();
    
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
let floatingStateToggleEnabled = false; // User's toggle preference
let zoomCompensationInterval = null;

function getZoomLevel() {
    // Multiple methods to detect zoom level, with fallbacks
    
    // Method 1: Visual Viewport API (most reliable for modern browsers)
    if (window.visualViewport) {
        const zoom = window.visualViewport.scale;
        if (zoom && zoom > 0) {
            return zoom;
        }
    }
    
    // Method 2: Compare outerWidth to innerWidth ratio with devicePixelRatio
    // This works well on desktop browsers
    if (window.outerWidth > 0 && window.innerWidth > 0) {
        const ratioZoom = (window.outerWidth - 8) / window.innerWidth;
        // Adjust for device pixel ratio
        const adjustedZoom = ratioZoom * window.devicePixelRatio;
        
        // Only use if reasonable value (between 0.25 and 5)
        if (adjustedZoom > 0.25 && adjustedZoom < 5) {
            return adjustedZoom;
        }
    }
    
    // Method 3: Document width vs window width
    const docWidth = document.documentElement.clientWidth;
    const winWidth = window.innerWidth;
    if (docWidth && winWidth && docWidth !== winWidth) {
        return winWidth / docWidth;
    }
    
    // Method 4: Device pixel ratio (basic fallback)
    // This isn't perfect but gives us something to work with
    if (window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    
    // Default fallback
    return 1;
}

// Check if floating state should be visible (both toggle AND game active)
function updateFloatingStateVisibility() {
    const floatingState = document.getElementById('floating-state');
    if (!floatingState) return;
    
    const shouldBeVisible = floatingStateToggleEnabled && gameState.isGameActive;
    
    // Debug logging
    console.log(`Floating State Debug:`, {
        toggleEnabled: floatingStateToggleEnabled,
        gameActive: gameState.isGameActive,
        shouldBeVisible: shouldBeVisible,
        currentClassList: floatingState.className
    });
    
    if (shouldBeVisible) {
        floatingState.classList.add('enabled');
        // Start zoom compensation if not already running
        if (!zoomCompensationInterval) {
            updateZoomCompensation();
            // More frequent updates to ensure floating box stays positioned correctly
            zoomCompensationInterval = setInterval(updateZoomCompensation, 100);
            
            // Listen for various events - use passive listeners for better performance
            window.addEventListener('resize', updateZoomCompensation);
            window.addEventListener('wheel', handleWheelZoom);
            
            // Aggressive scroll tracking to ensure element stays at top
            window.addEventListener('scroll', updateZoomCompensation, { passive: true });
            document.addEventListener('scroll', updateZoomCompensation, { passive: true });
            
            // Visual Viewport API events (most reliable for zoom/scroll detection)
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', updateZoomCompensation);
                window.visualViewport.addEventListener('scroll', updateZoomCompensation);
            }
        }
    } else {
        floatingState.classList.remove('enabled');
        floatingState.textContent = '';
        // Stop zoom compensation
        if (zoomCompensationInterval) {
            clearInterval(zoomCompensationInterval);
            zoomCompensationInterval = null;
            
            // Remove all event listeners
            window.removeEventListener('resize', updateZoomCompensation);
            window.removeEventListener('wheel', handleWheelZoom);
            window.removeEventListener('scroll', updateZoomCompensation);
            document.removeEventListener('scroll', updateZoomCompensation);
            
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateZoomCompensation);
                window.visualViewport.removeEventListener('scroll', updateZoomCompensation);
            }
            
            floatingState.style.transform = '';
            floatingState.style.left = '';
            floatingState.style.top = '';
        }
    }
    
    // Confirm final state
    console.log(`After update - classList:`, floatingState.className);
}

function updateZoomCompensation() {
    const floatingState = document.getElementById('floating-state');
    if (!floatingState || !floatingState.classList.contains('enabled')) return;
    
    const zoomLevel = getZoomLevel();
    
    // Apply inverse scaling to compensate for zoom
    // When zoomed in (zoom > 1), scale down the element
    // When zoomed out (zoom < 1), scale up the element
    const scale = 1 / zoomLevel;
    
    // Calculate position relative to visual viewport
    let topPosition = 20; // Base offset from top
    let leftPosition = 50; // Base percentage from left
    
    // Use Visual Viewport API for accurate positioning when zoomed
    if (window.visualViewport) {
        // CRITICAL FIX: The offsetTop represents how far down the visual viewport is scrolled
        // We want to position the element at the VISUAL TOP (what user sees)
        // This should be offsetTop + small margin for the element's top edge
        const offsetTop = window.visualViewport.offsetTop || 0;
        const offsetLeft = window.visualViewport.offsetLeft || 0;
        
        // Position element at the TOP of what the user can actually see
        // offsetTop is how far down we've scrolled, so this is the visual top
        topPosition = offsetTop + 10;
        
        // For horizontal centering, calculate center of visual viewport in layout coordinates
        const visualViewportCenter = offsetLeft + (window.visualViewport.width / 2);
        const layoutViewportWidth = document.documentElement.clientWidth;
        leftPosition = (visualViewportCenter / layoutViewportWidth) * 100;
        
        // Apply positioning
        floatingState.style.left = `${leftPosition}%`;
        floatingState.style.top = `${topPosition}px`;
        floatingState.style.transform = `translateX(-50%) scale(${scale})`;
        
        // Debug logging
        console.log(`Visual Viewport - ScrollTop: ${offsetTop}, ScrollLeft: ${offsetLeft}, ElementTop: ${topPosition}px, Center: ${leftPosition.toFixed(1)}%`);
        console.log(`Viewport dimensions: ${window.visualViewport.width}x${window.visualViewport.height}`);
        console.log(`Page scroll: ${window.pageYOffset}, Document scroll: ${document.documentElement.scrollTop}`);
    } else {
        // Fallback for browsers without Visual Viewport API
        floatingState.style.left = `${leftPosition}%`;
        floatingState.style.top = `${topPosition}px`;
        floatingState.style.transform = `translateX(-50%) scale(${scale})`;
    }
    
    // Debug logging (can be removed in production)
    console.log(`Zoom: ${zoomLevel.toFixed(2)}, Scale: ${scale.toFixed(2)}, Final Top: ${topPosition}px`);
}

// Handle Ctrl+Wheel zoom events
function handleWheelZoom(event) {
    // Only update if Ctrl key is pressed (zoom gesture)
    if (event.ctrlKey || event.metaKey) {
        // Small delay to let the zoom take effect
        setTimeout(updateZoomCompensation, 10);
    }
}

function toggleFloatingState(enabled) {
    floatingStateToggleEnabled = enabled;
    console.log(`Toggle called with: ${enabled}`);
    updateFloatingStateVisibility();
}

// Force hide floating state (for debugging)
function forceHideFloatingState() {
    const floatingState = document.getElementById('floating-state');
    if (floatingState) {
        floatingState.classList.remove('enabled');
        floatingState.style.display = ''; // Remove inline display style
        floatingState.textContent = '';
        console.log('Force hidden floating state');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Force hide floating state on load
    forceHideFloatingState();
    
    // Initialize floating state visibility
    updateFloatingStateVisibility();
    
    // Floating state toggle
    const floatingStateToggle = document.getElementById('floating-state-toggle');
    if (floatingStateToggle) {
        floatingStateToggle.addEventListener('change', (e) => {
            toggleFloatingState(e.target.checked);
        });
    }
});
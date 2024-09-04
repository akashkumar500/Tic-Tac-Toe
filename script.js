let currentPlayer = 'X';
let userPlayer = 'X';
let computerPlayer = 'O';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAiMode = true;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

// Function to select game mode
function selectMode(mode) {
    isAiMode = mode === 'computer';
    document.getElementById('name-selection').classList.remove('hidden');
    if (isAiMode) {
        document.getElementById('player2').classList.add('hidden');
        document.getElementById('player2').value = 'Computer';
    } else {
        document.getElementById('player2').classList.remove('hidden');
    }
}

// Function to start the game
function startGame() {
    player1Name = document.getElementById('player1').value || 'Player 1';
    player2Name = document.getElementById('player2').value || (isAiMode ? 'Computer' : 'Player 2');

    userPlayer = document.querySelector('input[name="playerSymbol"]:checked').value;
    computerPlayer = userPlayer === 'X' ? 'O' : 'X';
    currentPlayer = 'X';

    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    document.getElementById('currentPlayer').innerText = currentPlayer;
    document.getElementById('gameMode').innerText = isAiMode ? `You are playing with computer.` : `You are playing multiplayer.`;

    if (isAiMode && currentPlayer === computerPlayer) {
        setTimeout(() => {
            makeAiMove();
        }, 500);
    }
    resetGame();
}

// Function to handle player moves
function handleMove(cellIndex) {
    if (gameActive && board[cellIndex] === '') {
        board[cellIndex] = currentPlayer;
        const cell = document.getElementsByClassName('cell')[cellIndex];
        cell.innerText = currentPlayer;
        if (checkWin()) {
            document.getElementById('message').innerText = `${currentPlayer === userPlayer ? player1Name : player2Name} wins!`;
            gameActive = false;
            const winningCombo = getWinningCombo();
            markWinningCells(winningCombo);
        } else if (checkDraw()) {
            document.getElementById('message').innerText = `It's a draw!`;
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('currentPlayer').innerText = currentPlayer;
            if (isAiMode && currentPlayer === computerPlayer) {
                setTimeout(() => {
                    makeAiMove();
                }, 500);
            }
        }
    }
}

// Function to check for a win
function checkWin() {
    const winningCombos = getWinningCombos();

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Function to get all winning combinations
function getWinningCombos() {
    return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
}

// Function to get the winning combination
function getWinningCombo() {
    const winningCombos = getWinningCombos();

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combo;
        }
    }
    return null;
}

// Function to mark the winning cells
function markWinningCells(winningCombo) {
    const cells = document.getElementsByClassName('cell');
    for (let index of winningCombo) {
        cells[index].classList.add('winner');
    }
}

function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('currentPlayer').innerText = currentPlayer;
    document.getElementById('message').innerText = '';
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
        cell.classList.remove('winner');
    }

    // If it's AI mode and it's the computer's turn, make the AI move
    if (isAiMode && currentPlayer === computerPlayer) {
        setTimeout(() => {
            makeAiMove();
        }, 500);
    }
}

// Function for AI move
function makeAiMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computerPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    setTimeout(() => {
        handleMove(bestMove);
    }, 500); // Delay AI move by 500 milliseconds
}

// Minimax algorithm for AI decision making
function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -10 + depth : 10 - depth;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = userPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to go back
function goBack() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreBoard = document.getElementById('scoreBoard');
const finalScoreEl = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const statusIndicator = document.getElementById('statusIndicator');

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let frames = 0;
let score = 0;
let gameSpeed = 3; 
let isGameOver = false;
let isPlaying = false;
let isGravityInverted = false;



function loop() {
    if (!isPlaying) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update(); bird.draw(); pipes.update(); pipes.draw(); powerUp.spawn(); powerUp.update(); powerUp.draw();
    frames++; requestAnimationFrame(loop);
}

window.addEventListener('keydown', function(e) { if (e.code === 'Space') { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); } });
canvas.addEventListener('click', function() { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); });
restartBtn.addEventListener('click', resetGame);

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


const bird = {
    x: 50, y: 150, width: 30, height: 30, velocity: 0, gravity: 0.25, jumpStrength: 5.5, color: '#0ff',
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10; ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    },
    update: function() {
        let currentGravity = isGravityInverted ? -this.gravity : this.gravity;
        this.velocity += currentGravity;
        this.y += this.velocity;
        if (this.y + this.height >= canvas.height || this.y <= 0) gameOver();
    },
    flap: function() {
        let currentJump = isGravityInverted ? -this.jumpStrength : this.jumpStrength;
        this.velocity = -currentJump; 
    }
};



function loop() {
    if (!isPlaying) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update(); bird.draw(); pipes.update(); pipes.draw(); powerUp.spawn(); powerUp.update(); powerUp.draw();
    frames++; requestAnimationFrame(loop);
}

window.addEventListener('keydown', function(e) { if (e.code === 'Space') { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); } });
canvas.addEventListener('click', function() { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); });
restartBtn.addEventListener('click', resetGame);


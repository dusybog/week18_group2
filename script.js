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


const pipes = {
    position: [], width: 50, gap: 150, dx: 3,
    draw: function() {
        ctx.fillStyle = '#ff0055';
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            ctx.fillRect(p.x, 0, this.width, p.y);
            ctx.fillRect(p.x, p.y + this.gap, this.width, canvas.height - (p.y + this.gap));
        }
    },
    update: function() {
        if (frames % 120 === 0) {
            let maxY = canvas.height - this.gap - 50;
            let randomY = Math.floor(Math.random() * (maxY - 50) + 50);
            this.position.push({ x: canvas.width, y: randomY, passed: false });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= (this.dx * (gameSpeed / 3)); 
            if (p.x + this.width <= 0) { this.position.shift(); i--; continue; }
            
            if (bird.x + bird.width > p.x && bird.x < p.x + this.width) {
                if (bird.y < p.y || bird.y + bird.height > p.y + this.gap) gameOver();
            }
            if (p.x + this.width < bird.x && !p.passed) {
                score++; p.passed = true; scoreBoard.innerText = score;
                if (score > 0 && score % 10 === 0) activateSlowMotion();
            }
        }
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



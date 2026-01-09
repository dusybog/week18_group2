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


const powerUp = {
    x: -100, y: 0, width: 20, height: 20, active: false,
    spawn: function() {
        if (!this.active && Math.random() < 0.005) {
            this.active = true; this.x = canvas.width; this.y = Math.random() * (canvas.height - 100) + 50;
        }
    },
    draw: function() {
        if (!this.active) return;
        ctx.fillStyle = '#a020f0'; ctx.beginPath(); ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.fillText('?', this.x + 7, this.y + 15);
    },
    update: function() {
        if (!this.active) return;
        this.x -= (3 * (gameSpeed / 3)); 
        if (bird.x < this.x + this.width && bird.x + bird.width > this.x && bird.y < this.y + this.height && bird.y + bird.height > this.y) {
            toggleGravityInvert();
            score += 5; 
            scoreBoard.innerText = score;
            showFloatingText("+5", this.x, this.y);
            if (score > 0 && score % 10 === 0) activateSlowMotion();
            this.active = false; this.x = -100;
        }
        if (this.x + this.width < 0) this.active = false;
    }
};


function showFloatingText(text, x, y) {
    const el = document.createElement('div');
    el.innerText = text; el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.color = '#fff'; el.style.fontSize = '24px'; el.style.fontWeight = 'bold'; el.style.pointerEvents = 'none';
    el.style.transition = 'all 1s ease-out'; el.style.zIndex = '100';
    document.querySelector('.game-container').appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateY(-50px)'; el.style.opacity = '0'; });
    setTimeout(() => el.remove(), 1000);
}

function activateSlowMotion() {
    gameSpeed = 1.5; document.body.style.filter = "hue-rotate(90deg)";
    setTimeout(() => { gameSpeed = 3; document.body.style.filter = "none"; }, 3000);
}

function toggleGravityInvert() {
    isGravityInverted = !isGravityInverted; bird.velocity = 0;
    if(isGravityInverted) { statusIndicator.classList.remove('hidden'); bird.color = '#f0f'; } 
    else { statusIndicator.classList.add('hidden'); bird.color = '#0ff'; }
}

function resetGame() {
    bird.y = 150; bird.velocity = 0; pipes.position = []; score = 0; frames = 0; gameSpeed = 3;
    isGravityInverted = false; bird.color = '#0ff'; statusIndicator.classList.add('hidden'); scoreBoard.innerText = score;
    isGameOver = false; isPlaying = true;
    startScreen.classList.add('hidden'); gameOverScreen.classList.add('hidden');
    loop();
}

function gameOver() { isGameOver = true; isPlaying = false; finalScoreEl.innerText = score; gameOverScreen.classList.remove('hidden'); }

function loop() {
    if (!isPlaying) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update(); bird.draw(); pipes.update(); pipes.draw(); powerUp.spawn(); powerUp.update(); powerUp.draw();
    frames++; requestAnimationFrame(loop);
}

window.addEventListener('keydown', function(e) { if (e.code === 'Space') { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); } });
canvas.addEventListener('click', function() { if (!isPlaying && !isGameOver) resetGame(); else if (isPlaying) bird.flap(); });
restartBtn.addEventListener('click', resetGame);






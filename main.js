// listeners
document.addEventListener('keydown', keyPush)
document.querySelectorAll('input[type="radio"]').forEach(input =>
    input.addEventListener('change', gameOptions)
) 

let touchStartX = 0;
let touchStartY = 0;
document.querySelector('canvas').addEventListener("touchstart", (event) => {
    event.preventDefault();
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: false });

document.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    swipePush(touchStartX, touchStartY, touchEndX, touchEndY);
}, false);

const restartButton = document.querySelector('canvas');
const tryReset = () => {
  if (!gameIsRunning) resetGame();
};

restartButton.addEventListener('click', tryReset);
restartButton.addEventListener('touchend', tryReset);

        
//canvas
const canvas = document.querySelector('canvas');
const actualScore = document.querySelector('h1.score');
const ctx = canvas.getContext('2d');

//game 

let gameIsRunning = true;
let gameSpeedMode = "slow";
let gameboardMode = "infinite";

let fps = 10;
let gameInterval;

const tailSize = 50;
const tileCountX = canvas.width / tailSize;
const tileCountY = canvas.height / tailSize;

let score = 0;

//player
let snakeSpeed = tailSize;
let snakePosX = 0;
let snakePosY = canvas.height/2;


let velocityX = 0;
let velocityY = 0;

let tail = [];
let snakeLength = 2;

let foodPosX = 0;
let foodPosY = 0;

//game over
let showGameOverText = true;
let blinkCount = 0;
let blinkInterval;

//// ---------- /////

//loop
function gameLoop() {
    drawStuff();
    if (gameIsRunning) {
        moveStuff(); 
    }
};

resetFood();
startGame(); 

//// ---------- /////

//toto je hlavný cyklus
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000/fps)
}

function gameOver() {
    actualScore.innerHTML = `<strong>☠ ${score} ☠</strong>`
    gameIsRunning = false;

    showGameOverText = true;
    blinkCount = 0;

    blinkInterval = setInterval(() => {
        showGameOverText = !showGameOverText;
        blinkCount++;

        if (blinkCount >= 6) { 
            clearInterval(blinkInterval);
            showGameOverText = true; 
        }
    }, 300);
        
}

function resetGame() {
    snakePosX = 0;
    snakePosY = canvas.height / 2;

    velocityX = 0;
    velocityY = 0;

    fps = 10;

    tail = [];
    snakeLength = 2;
    score = 0;
    actualScore.textContent = score;

    gameIsRunning = true;
    resetFood();
    startGame();
}

function gameOptions(event){
    document.activeElement.blur();

    const velocitySelection = document.querySelector('.velocityStyle input[type="radio"]:checked');
    const gameboardSelection = document.querySelector('.gameboardStyle input[type="radio"]:checked');

    const velocityStyle = velocitySelection.value; // slow or fast
        fps = 10;
        gameSpeedMode = velocityStyle;

    const gameboardStyle = gameboardSelection.value; //infinite or square
        gameboardMode = gameboardStyle;

    startGame();
}


//tu sa hýbeme

function moveStuff(){            
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    //wall collision
    if (snakePosX > (canvas.width - tailSize)) {
        if (gameboardMode === "square") {gameOver();}
        else {snakePosX = 0}
    }
    if (snakePosX < 0) {
        if (gameboardMode === "square") {gameOver();}
        else {snakePosX = canvas.width}
    }
    if (snakePosY > (canvas.height - tailSize)) {
        if (gameboardMode === "square") {gameOver();}
        else {snakePosY = 0}
    }
    if (snakePosY < 0) {
        if (gameboardMode === "square") {gameOver();}
        else {snakePosY = canvas.height}
    }

    if (velocityX !== 0 || velocityY !== 0) {
        tail.forEach(snakePart => {
            if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
                gameOver();
            }
        });
    }

    tail.push({ x: snakePosX, y: snakePosY })
    tail = tail.slice (-1*snakeLength)

    //food collision
    
    if (snakePosX === foodPosX && snakePosY === foodPosY){
        actualScore.textContent = ++score;
        snakeLength++;
        resetFood();

        if (gameSpeedMode === "fast") {
            fps+=1;
            startGame();
        }
    }   
}

function resetFood() {
    if (snakeLength === tileCountX*tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tailSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tailSize;

    if (foodPosX ===snakePosX && foodPosY === snakePosY ) {
        resetFood();
    };

    if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetFood();
    };
}


// tu kreslíme
function drawStuff(){
    rectangle('#123456', 0, 0, canvas.width, canvas.height);

    drawGrid();

    if (gameIsRunning) {
        rectangle('yellow', foodPosX, foodPosY, tailSize, tailSize);

        tail.forEach(snakePart =>
            rectangle('#555555', snakePart.x, snakePart.y, tailSize, tailSize)
        );

        rectangle('black', snakePosX, snakePosY, tailSize, tailSize);
    }
    if (!gameIsRunning && showGameOverText) {
        ctx.fillStyle = "black";
        ctx.font = "bold 150px 'Avenir Next', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("GAME", canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText("OVER", canvas.width / 2, canvas.height / 2 + 60);

        ctx.font = "bold 40px 'Avenir Next', sans-serif";
        ctx.fillText("Tap to restart", canvas.width / 2, canvas.height / 2 + 200);
    }
}

function rectangle(color, x, y, width, height){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGrid(){
        for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
        rectangle('#ffffff', tailSize * i, tailSize * j, tailSize -1, tailSize-1)
        }
    } 
}

// tu nastavujeme game controls
function keyPush(event){
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
    }

    switch(event.key) {
        case 'ArrowUp':
            if (velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
            }
            break;        
        case 'ArrowRight':
            if (velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
            }
            break;

        case ' ':
            if (!gameIsRunning) {
            resetGame()
            }
            break;

        default: 
            break;
    }
}

function swipePush(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // vodorovný pohyb
        if (diffX > 30 && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (diffX < -30 && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        // zvislý pohyb
        if (diffY > 30 && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (diffY < -30 && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }
}

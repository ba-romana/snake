// listeners
document.addEventListener('keydown', keyPush)
document.querySelectorAll('input[type="radio"]').forEach(input =>
    input.addEventListener('change', gameOptions)
)        
        
//canvas
const canvas = document.querySelector('canvas');
const title = document.querySelector('h1');
const ctx = canvas.getContext('2d');

//game 

let gameIsRunning = true;
let gameSpeedMode = "slow";

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

//// ---------- /////

//loop
function gameLoop() {
    if (gameIsRunning) {
        drawStuff();
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
    title.innerHTML = `<strong>☠ ${score} ☠</strong>`
    gameIsRunning = false;
}

function gameOptions(event){
    const velocitySelection = document.querySelector('.velocityStyle input[type="radio"]:checked');
    const gameboardSelection = document.querySelector('.gameboardStyle input[type="radio"]:checked');

    const velocityStyle = velocitySelection.value; // slow or fast
        fps = 10;
        gameSpeedMode = velocityStyle;

    const gameboardStyle = gameboardSelection.value; //infinite or square

    startGame();
}


//tu sa hýbeme

function moveStuff(){            
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    //wall collision
    if (snakePosX > (canvas.width - tailSize)) {
        snakePosX = 0
    }
    if (snakePosX < 0) {
        snakePosX = canvas.width
    }
    if (snakePosY > (canvas.height - tailSize)) {
        snakePosY = 0
    }
    if (snakePosY < 0) {
        snakePosY = canvas.height
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
        title.textContent = ++score;
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

    rectangle('yellow', foodPosX, foodPosY, tailSize, tailSize);

    tail.forEach ( snakePart => 
        rectangle('#555555', snakePart.x, snakePart.y, tailSize, tailSize)
    )

    rectangle('black', snakePosX, snakePosY, tailSize, tailSize);
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

        default: 
            if (! gameIsRunning ) location.reload();
            break;
    }
}
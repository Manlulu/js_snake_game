var canvas = document.getElementById('game_board');
var context = canvas.getContext("2d");

var gridSize = {cols: 15, rows: 15};
var boxSize = {width: Math.ceil(canvas.width / gridSize.cols), height: Math.ceil(canvas.height / gridSize.rows)};
var snake = [];
var fruit = {}; // Skal inneholde en json med x og y.

var score = 0;
var highScore = 0;
var lastHighScore = 0;
var gameStop = true;

var MoveDirection = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
};
var movingDirection = MoveDirection.RIGHT;

init();

function init(){
    startNewGame();
}

function startNewGame(){
    drawNewGame();
    lastHighScore = localStorage.getItem("score") || 0;

    snake = [];
    score = 0;
    snake.push({x: 5, y: 5});
    snake.push({x: snake[0].x, y: 5});
    movingDirection = MoveDirection.RIGHT;
    if(!gameStop){
        fruit = drawFruit();
        gameLoop();
    } else {
        setTimeout(init, 1000 / 5);
    }
}

function checkHighScore(){
    if(score > highScore){
        highScore = score;
        localStorage.setItem("score", highScore);
    }
}

function gameLoop(){
    if(gameStop == false){
        update();
        draw();
        setTimeout(gameLoop, 1000 / 5); // 5 fps
    }
}

function update(){

    moveSnake();
    nextHead();
    checkIfhitSelf();
    checkIfHitWall();
    checkIfEatFruit();
}

function moveSnake(){
    for(var i = snake.length - 1; i > 0; i--){
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
}

function checkIfhitSelf(){
    for(var i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            gameStop = true;
            startNewGame();
        }
    }
}

function checkIfEatFruit(){
    if(snake[0].x == fruit.x && snake[0].y == fruit.y){
        do {
            fruit = drawFruit();
        }while(fruitIsOnSnake());

        snake.push({x: snake[0].x, y: snake[0].y});
        score++;
        checkHighScore();
    }
}

function fruitIsOnSnake(){
    for(var i = 0; i < snake.length; i++){
        if(snake[i].x == fruit.x && snake[i].y == fruit.y){
            return true;
        }
    }
    return false;
}

function checkIfHitWall(){
    if(snake[0].x < 0 || snake[0].x >= gridSize.cols || snake[0].y < 0 || snake[0].y >= gridSize.rows){
        gameStop = true;
        startNewGame();
    }
}

function draw(){
    // reset canvas
    context.fillStyle = "#001";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw fruit
    context.fillStyle = "#f45";
    context.fillRect(fruit.x * boxSize.width, fruit.y * boxSize.height, boxSize.width, boxSize.height);

    // draw snake
    for(var i in snake){
        if(i == 0){ // color head
            context.fillStyle = "#080";
        } else {
            context.fillStyle = "#0f0";
        }
        context.fillRect(snake[i].x * boxSize.width, snake[i].y * boxSize.height, boxSize.width, boxSize.height )
    }

    // draw score text
    context.fillStyle = "#fff";
    context.font = "30px Verdana";
    context.fillText("HighScore: " + lastHighScore + ". Score: " + score, canvas.width / 3, canvas.height / 4);
}

function drawNewGame(){
    // reset canvas
    context.fillStyle = "#001";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.font = "30px Verdana";

    context.fillText("Press 'n' for new game", canvas.width / 3, canvas.height / 4);
}

function drawFruit(){
    var x = Math.floor(Math.random() * gridSize.cols);
    var y = Math.floor(Math.random() * gridSize.rows);
    return {x: x, y: y}
}

function nextHead(){
    if(movingDirection == MoveDirection.LEFT){
        snake[0].x--;
    } else if(movingDirection == MoveDirection.UP) {
        snake[0].y--;
    } else if(movingDirection == MoveDirection.RIGHT){
        snake[0].x++;
    } else if(movingDirection == MoveDirection.DOWN){
        snake[0].y++;
    }
    lastDirection = movingDirection;
}
var lastDirection = movingDirection;
document.addEventListener('keydown', function(event){


    switch (event.keyCode) {
        case 37:
            if(lastDirection != MoveDirection.RIGHT){
                movingDirection = MoveDirection.LEFT;
            }
            break;
        case 38:
            if(lastDirection != MoveDirection.DOWN){
                movingDirection = MoveDirection.UP;
            }
            break;
        case 39:
            if(lastDirection != MoveDirection.LEFT){
                movingDirection = MoveDirection.RIGHT;
            }
            break;
        case 40:
            if(lastDirection != MoveDirection.UP){
                movingDirection = MoveDirection.DOWN;
            }
            break;
        case 78:
            gameStop = false;
            break;
    }
})

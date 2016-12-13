var canvas = document.getElementById('game_board');
var context = canvas.getContext("2d");

var gridSize = {cols: 15, rows: 15};
var boxSize = {width: Math.ceil(canvas.width / gridSize.cols), height: Math.ceil(canvas.height / gridSize.rows)};
var snake = [];
var fruit = {}; // Skal inneholde en json med x og y.
var movingDirection = "right";
var score = 0;
var highScore = 0;
var newGame = true;

/* Notat

- Når du er 1 lang, så kan du ikke gå frem og tilbake.
- Du skal ikke kunne gå tilbake, og kræsje i deg selv, og dø.

*/

init();

function init(){
    startNewGame();
    console.log("Før gameloop")

}

function startNewGame(){
    drawNewGame();
    checkHighScore();
    highScore = localStorage.getItem("score") || 0;

    snake = [];
    score = 0;
    snake.push({x: 5, y: 5});
    snake.push({x: snake[0].x, y: 5});
    movingDirection = "right";
    if(!newGame){
        fruit = drawFruit();
        gameLoop();
    } else {
        setTimeout(init, 1000 / 5);
    }
    console.log("Etter if else")
}

function checkHighScore(){
    if(score > highScore){
        highScore = score;
        localStorage.setItem("score", highScore);
    }
}

function gameLoop(){
    if(newGame == false){
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
            newGame = true;
            startNewGame();
        }
    }
}

function checkIfEatFruit(){
    if(snake[0].x == fruit.x && snake[0].y == fruit.y){
        fruit = drawFruit();
        snake.push({x:snake[0].x, y:snake[0].y});
        score++;
    }
}

function checkIfHitWall(){
    if(snake[0].x < 0 || snake[0].x >= gridSize.cols || snake[0].y < 0 || snake[0].y >= gridSize.rows){
        newGame = true;
        startNewGame();
    }
}

function draw(){
    // reset canvas
    context.fillStyle = "#001";
    context.fillRect(0, 0, canvas.width, canvas.height);

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

    context.fillStyle = "#fff";
    context.font = "30px Verdana";

    context.fillText("HighScore: " + highScore + ". Score: " + score, canvas.width / 3, canvas.height / 4);
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
    if(movingDirection == "left"){
        snake[0].x--;
    } else if(movingDirection == "up") {
        snake[0].y--;
    } else if(movingDirection == "right"){
        snake[0].x++;
    } else if(movingDirection == "down"){
        snake[0].y++;
    }
}

document.addEventListener('keydown', function(event){
    switch (event.keyCode) {
        case 37:
            movingDirection = "left";
            break;
        case 38:
            movingDirection = "up";
            break;
        case 39:
            movingDirection = "right";
            break;
        case 40:
            movingDirection = "down";
            break;
        case 78:
            console.log("Pressed n")
            newGame = false;
            break;
    }
})

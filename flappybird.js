//board
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {     //bird obj
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight

}
//pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
//physics
let velocityX=-2;
let velocityY=0;
let gravity=0.5;
let inc=0.5;

let gameOver=false;
let score=0;
let passed;

//audio
let hit=new Audio('hit.ogg')
hit.volume=0.2;
let fly=new Audio('fly.ogg')
fly.volume=0.2;



window.onload = function () 
{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    //context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }


    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";
  
    requestAnimationFrame(update);
    setInterval(placePipe,1500);
    document.addEventListener("keydown",moveBird);
    document.addEventListener("touchstart",moveBirdInPhone);


}
function update()
{
    requestAnimationFrame(update);
    if(gameOver )
       return;
    context.clearRect(0,0,boardWidth,boardHeight);

    velocityY+=gravity;
    bird.y=Math.max(velocityY+bird.y,0);
    
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 
    fly.play();
    
      //drawing bird on the canvas

      
    if (bird.y > board.height) {
        gameOver = true;
    }
    for (let i = 0; i < pipeArray.length; i++) {      // drawing pipes
        let pipe = pipeArray[i];
          pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }
       

          //score
    context.fillStyle="white";
    context.font="35px san-serif";
    //let print=;
    context.fillText(`Score  ${score}`,5,45);

     //clear pipes
     while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    
       
        if(detectCollision(bird,pipe)){
           gameOver=true;

        }
 
        }
    if(gameOver){
        hit.play();
       
      context.fillText("GAME OVER",20,100);
      context.fillText("To Restart Tap Again",40,300);}

 
}
function placePipe(){
    if(gameOver)
       return;

    let randomPipeY=pipeY-pipeHeight/4- Math.random()*(pipeHeight/2);
    let openingSpace=boardHeight/4;

    let topPipe={
        img: topPipeImg,
        x: pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);

}
function moveBird(e)
{
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX")
      velocityY=-6;
    
      //to restart the game
      if(gameOver)
      {
        gameOver=false;
        pipeArray=[];
        score=0;
        bird.y=birdY;
      }
}

function moveBirdInPhone(e)
{
    velocityY=-6;
    
      //to restart the game
      if(gameOver)
      {
        gameOver=false;
        pipeArray=[];
        score=0;
        bird.y=birdY;
      }
}
function detectCollision(bird,pipe)
{
   return  bird.x<pipe.x+pipe.width &&
           bird.x+bird.width>pipe.x&&
           bird.y<pipe.y+pipe.height&&
           bird.y+bird.height>pipe.y;
}

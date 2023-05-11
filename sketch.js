var PLAY = 1;
var END = 0;
var gameState = PLAY;

var women, women_running, women_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;
var gameOverImg,restartImg

var cloudImage;

function preload(){
  women_running = loadAnimation("women_1.png","women_2.png","women_3.png","women_4.png");
  women_collided = loadAnimation("tired.png");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("hurdle.png");
  obstacle2 = loadImage("more_hurdle.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  women = createSprite(50,160,20,50);
  women.addAnimation("running", women_running);
  women.addAnimation("collided", women_collided);
  console.log(women)

 women.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  women.setCollider("rectangle",0,0,women.width,women.height);
  women.debug = false
  
  score = 0;
  
}

function draw() {
  
  background("skyblue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")) {
        women.velocityY = -12;
    }
    
    //add gravity
    women.velocityY = women.velocityY + 0.8
  
    //spawn the clouds
    //spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(women)){
        //trex.velocityY = -12;
        gameState = END;
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      women.changeAnimation("collided", women_collided);
    
     
     
      ground.velocityX = 0;
      women.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);   
   }
  
 
  //stop trex from falling down
  women.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false

  obstaclesGroup.destroyEach();

  women.changeAnimation("running", women_running)
  score = 0
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(3 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(50,100));
    //cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = women.depth;
    women.depth = women.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
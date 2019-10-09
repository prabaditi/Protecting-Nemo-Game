let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let speedOfEvil=10; // speed of evil fish
let bgCycle =0; // for background image
let sourcex = 0; // for background image
let sourceend =600; // for background image


let score = 0; // score count
let counter=1; // counter for enemies
let interval;


let h1 = 15; // shoot square height
let h2 = 40; // enemy square height
let count=1; // counter for enemies
let count2=0;//count to call evil fish for the first time.
let speed= 8;// variable to put the speed of the evil fish.

let xFish=0;//x axis for the fish.
let yFish=0;// y axis for the fish.
let xEvil=0;//x axis for evil fish.
let yEvil=0;//y axis for evil fish.
let xShoot; // x- axis point of shoot
let yShoot; // y- axis point of shoot
let arrayOfEvil=[]; // array for enemies
let arrayOfShoot =[];//array for shoot.

let bgWidth =600; //background width
let bgHeight =600; // background height

let bg = new Image(); 
bg.src ="images/background.jpg"; // background image
let fishImage = new Image();
fishImage.src ="images/nemo.png";// fish image
let evilFishImage = new Image();
evilFishImage.src ="images/evilFish.png";//evil fish image

let shootingSound = new Audio("sounds/shoot.wav"); // shoot sound
let bgSound = new Audio("sounds/background.mp3") // background sound
let hittingSound = new Audio("sounds/hit.wav") // hit sound
let gameOverSound = new Audio("sounds/drop.wav") // game over sound


function onload() //on load function
{
    ctx.drawImage(bg,0,0);
    ctx.font='30px arial,serif';
    ctx.fillStyle="Red";
    ctx.fillText("Press \" ENTER \" To Start The Game",60,200);
}

let key; //keycode
//adding event listeners
addEventListener("keydown",function(event)
{
    key=event.keyCode;
    switch(key)
    {
        case 32:
            xShoot=xFish;
            yShoot=yFish;
            arrayOfShoot.push(new shoot(xShoot,yShoot));
            shootingSound.play();
        break;
        case 40:
            if(yFish<bgHeight-50)
                yFish =yFish+10;
        break;
        case 37:
            if(xFish>=0)
                xFish=xFish-10;
        break;
        case 39:
            if(xFish<=bgWidth)
                xFish=xFish+10;
            else
                xFish=0;
        break;
        case 38:
            if(yFish>0)
                yFish=yFish-10;
        break;
        case 13:
            playGame();
        break;
        case 17:
            if(count2==0)
            {
                xEvil=580;
                yEvil=Math.random()*400;
                arrayOfEvil.push(new enemy(xEvil,yEvil));
                count2++;
            }
        break;
    }
});

//function for shooting.
function shoot(xShoot,yShoot)
 {
   this.xShoot=xShoot;
   this.yShoot=yShoot;
   this.draw=function() 
   {
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.fillRect(this.xShoot+20,this.yShoot+20,15,15);
        ctx.fill();
   }
   this.move=function()
   {
        if(this.xShoot+10<bgWidth+20)
        {
            this.xShoot+=40;
            return true;
        }
   }

}

//function for creating evil fishes.
function enemy(xEvil,yEvil)
{
    this.xEvil=xEvil;
    this.yEvil=yEvil;
    
    this.drawEvil=function()
    {
        ctx.beginPath();
        ctx.drawImage(evilFishImage,this.xEvil,this.yEvil);
        ctx.fill();
    }
    this.moveEvil=function()
    {
        if(this.xEvil-speed>0)
        {
            this.xEvil-=speed;
            return true;
        }
        else
        {
            this.yEvil= Math.random()*400;
            this.xEvil= 580;
        }
    }
}

//function that checks if there is a collision between shoot and the evil fish and adds on the score of the user.
function scoreByCollision()
{    
    for(let i=0; i<arrayOfShoot.length; i++)
    {
        for(let fi=0;fi<arrayOfEvil.length;fi++)
        {

            if((arrayOfShoot[i].yShoot+25+h1>arrayOfEvil[fi].yEvil)&&(arrayOfShoot[i].yShoot+25<arrayOfEvil[fi].yEvil+h2)&&(arrayOfShoot[i].xShoot+20+h1>arrayOfEvil[fi].xEvil)&&(arrayOfShoot[i].xShoot+20<arrayOfEvil[fi].xEvil+h2))
            {
                arrayOfEvil[fi].xEvil=600;
                arrayOfEvil[fi].yEvil= Math.random()*400;
                arrayOfShoot[i].xShoot=610;
                hittingSound.play();
                score++;
            }
        }
    }
}

// function that clears the screen and prints the result after stopping the game.
function stopGame()
{
    clearInterval(interval);
    ctx.drawImage(bg,0,0);
    ctx.font='50px Arial';
    ctx.fillText("GAME OVER",150,200);
    ctx.fillText("Your Score is" +" "+ score,150,300);
    score=0;

}

//function that plays the game including the loop for background image.
function playGame()
{
    interval =  setInterval(function()
    { 
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        ctx.drawImage(bg,sourcex,0, sourceend,bgHeight,0,0,sourceend,bgHeight);
        ctx.drawImage(bg,0,0,bgWidth,bgHeight,sourceend,0,bgWidth,bgHeight);
        ctx.drawImage(fishImage,xFish,yFish);

        bgCycle = (bgCycle+1)%2;

        sourcex=(sourcex+1)%600;
        if(sourceend < 2)
            sourceend = 600;
        else
            sourceend-=1;

        for(let y=0;y<arrayOfShoot.length;y++)
        {
            if(arrayOfShoot[y].move())
                arrayOfShoot[y].draw();
            else
                arrayOfShoot.splice(y,y+1);
        }
        
        for(let j=0;j<arrayOfEvil.length;j++)
        {
            if(arrayOfEvil[j].moveEvil()) 
                arrayOfEvil[j] .drawEvil();
        }
        
        scoreByCollision();
        bgSound.play();
        if((score%7==0)&&(arrayOfEvil.length < score/7+1)&&(score!=0))
        {
            xEvil=580;
            yEvil=Math.random()*400;
            arrayOfEvil.push(new enemy(xEvil,yEvil))
            count++;
        }
        
        for(let i = 0; i<arrayOfEvil.length;i++)
        {
            if((yFish+h1+50>arrayOfEvil[i].yEvil)&&(yFish<arrayOfEvil[i].yEvil+h2)&&(xFish+40+h1>arrayOfEvil[i].xEvil)&&(xFish+40<arrayOfEvil[i].xEvil+h2))
            {
                arrayOfEvil[i].xEvil=600;
                arrayOfEvil[i].yEvil= Math.random()*400;
                stopGame();
                gameOverSound.play();
               
            }
        }
    },60);
}

var canvas1 = document.getElementById("myCanvas1");
var ctx1 = canvas1.getContext("2d");
ctx1.font = "30px Comic Sans MS"; //font style and size
ctx1.fillStyle = "black"; //font color
ctx1.textAlign = "right"; 
ctx1.fillText("INSTRUCTIONS",430,30); //coordinates for the text
ctx1.font = "20px Comic Sans MS";//font style and size
ctx1.fillText("=> Press Enter for game to begin.",320,60); //coordinates for the text
ctx1.fillText("=> Press Ctrl for evil fish to enter in to the game.",470,90); //coordinates for the text
ctx1.fillText("=> Press Space key Nemo to shoot.",330,120); //coordinates for the text
ctx1.fillText("=> Press Arrow up key to move up.",320,150); //coordinates for the text
ctx1.fillText("=> Press Arrow down key to move down.",370,180); //coordinates for the text
ctx1.fillText("=> Press left Arrow key to move backwards.",410,210); //coordinates for the text
ctx1.fillText("=> Press right Arrow key to move forward.",400,240); //coordinates for the text

ctx1.font = "22px Comic Sans MS"; //font style and size
ctx1.fillText("*SAVE NEMO AND KILL AS MANY EVIL FISHES POSSIBLE*",680,300); //coordinates for the text


ctx1.font = "35px Comic Sans MS"; //font style and size
ctx1.fillText("GOOD LUCK!!!",425,380); //coordinates for the text

ctx1.font = "20px Comic Sans MS"; //font style and size
ctx1.fillStyle = "RED"; //font color
ctx1.fillText("*Protecting Nemo - A game by Aditi Prabhakar and Vasu Vaid",610,580); //coordinates for the text


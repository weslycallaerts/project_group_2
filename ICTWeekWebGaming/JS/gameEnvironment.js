const POSTFLOOR = 490;
const HEIGHTMAINCARAC  = 32;
var monsterImg;
var floorImg;
var mainCaracImg;
var myObstacle;

function startGame() {
    monsterImg = new component(30, 480, "red", 5, 10);
    floorImg = new component(896, 96, "green", 0, POSTFLOOR);
    mainCaracImg = new component(HEIGHTMAINCARAC, HEIGHTMAINCARAC, "blue", 100, 250);
    myObstacle  = new component(10, 200, "green", 300, 120);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 896;
        this.canvas.height = 576;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function updateGameArea() {
    if (mainCaracImg.crashWith(monsterImg)) {
        myGameArea.stop();
    } else {
        myGameArea.clear();
        myObstacle.update();
        myObstacle.x -= 1;
        monsterImg.update();
        mainCaracImg.x -= 1;
        mainCaracImg.speedX = 0;
        mainCaracImg.speedY = 0;
        if (myGameArea.key && myGameArea.key == keyNum.LEFT) {
            mainCaracImg.speedX = -1;
        }
        if (myGameArea.key && myGameArea.key == keyNum.RIGHT) {
            mainCaracImg.speedX = 2;
        }
        mainCaracImg.newPos();
        mainCaracImg.update();
        floorImg.update();
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var floor = POSTFLOOR - HEIGHTMAINCARAC ; //myGameArea.canvas.height - (96 + 32);
        if (this.y > floor) {
            this.y = floor;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
const POSTFLOOR = 490;
const HEIGHTMAINCARAC  = 32;
const ACELLERATECONST  = 0.3;
var monsterImg;
var floorImg;
var mainCaracImg;
var myObstacles = [];
var floor = POSTFLOOR - HEIGHTMAINCARAC ;
var ceil;

function startGame() {
    monsterImg = new component(30, 480, "red", 5, 10);
    floorImg = new component(896, 96, "green", 0, POSTFLOOR);
    mainCaracImg = new component(HEIGHTMAINCARAC, HEIGHTMAINCARAC, "blue", 100, 250);
    myGameArea.start();
}

/**
 * Creation of the games area
 * @type {{canvas: HTMLCanvasElement, start: myGameArea.start, clear: myGameArea.clear, stop: myGameArea.stop}}
 *
 */

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 896;
        this.canvas.height = 576;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

/**
 * Update the game area to make it dynamique
 */
function updateGameArea() {
    if (mainCaracImg.crashWith(monsterImg)) {
        myGameArea.stop();
    } else {
        var x, y;
        var collision = false;
        for (i = 0; i < myObstacles.length; i += 1) {
            if(mainCaracImg.collideWith(myObstacles[i])){
                floor = mainCaracImg.y;
                collision = true;
            }
            else if (!collision){
                floor = POSTFLOOR - HEIGHTMAINCARAC;
            }
        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        monsterImg.update();
        mainCaracImg.x -= 1;
        mainCaracImg.speedX = 0;
        mainCaracImg.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
            mainCaracImg.speedX = -1;
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            mainCaracImg.speedX = 2;
        }
        if (myGameArea.keys && myGameArea.keys[32] && mainCaracImg.y == floor) {
            ceil = floor - 100;
            mainCaracImg.gravitySpeed = 0;
            accelerate(-ACELLERATECONST);
        }
        mainCaracImg.newPos();
        mainCaracImg.update();
        floorImg.update();
    }
}

/**
 * Creation of the component thing to change with the image
 * @param width
 * @param height
 * @param color
 * @param x
 * @param y
 */
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
        this.hitCeiling();
    }
    this.hitBottom = function() {
        if (this.y > floor) {
            this.y = floor;
        }
    }
    this.hitCeiling = function() {
        if (this.y < ceil) {
            accelerate(ACELLERATECONST);
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
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.collideWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var collide = true;
        if ((mybottom < othertop) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            collide = false;
        }
        return collide;
    }
}
function accelerate(n) {
    mainCaracImg.gravity = n;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

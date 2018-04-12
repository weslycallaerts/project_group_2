const POSTFLOOR = 490;
const HEIGHTMAINCARAC  = 32;
const ACELLERATECONST  = 0.3;
var monsterImg;
var floorImg;
var mainCaracImg;
var myObstacles = [];
var myBackground;
var floor = POSTFLOOR - HEIGHTMAINCARAC ;
var ceil;
var speedGames = 20 ;

function startGame() {
    monsterImg = new component(200, 480, "images/scary ghost.gif", 0, 0, "image");
    floorImg = new component(896, 96, "green", 0, POSTFLOOR);
    mainCaracImg = new component(HEIGHTMAINCARAC, HEIGHTMAINCARAC, "images/Ghosty ghost.gif", 250, 250, "image");
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
        this.interval = setInterval(updateGameArea, speedGames);
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
 * Creation of the component thing to change with the image
 * @param width
 * @param height
 * @param color
 * @param x
 * @param y
 */
function component(width, height, color, x, y, type = "none") {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
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
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            collide = false;
        }
        return collide;
    }
    this.sideCollision = function(otherobj) {
        var myright = this.x + (this.width);
        var otherleft = otherobj.x;
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var sidecollision = false;
        if (myright == otherleft && mytop < othertop && mytop > otherbottom && mybottom < othertop && mybottom > otherbottom){
                sidecollision = true;
        }
        else
        {
            sidecollision = false;
        }
        return sidecollision;
    }
}

function background(width, height, color, x, y, type = "none") {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function accelerate(n) {
    mainCaracImg.gravity = n;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
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
        var sidecollision = false;
        myGameArea.clear();
        myBackground.newPos();
        myBackground.update();
        for (i = 0; i < myObstacles.length; i += 1) {
            if(mainCaracImg.sideCollision(myObstacles[i])){
                sidecollision = true;
            }
            if(mainCaracImg.collideWith(myObstacles[i])){
                floor = mainCaracImg.y;
                collision = true;
            }
            else if (!collision){
                floor = POSTFLOOR - HEIGHTMAINCARAC;
            }
        }
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 50;
            maxGap = 200;
            minWidth = 40;
            maxWidth = 150;
            width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myObstacles.push(new component(width, 50, "images/block.png", x, height + gap, "image"));
        }
        if(everyinterval(2000)){// TODO
            speedGames--;
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        monsterImg.update();
        mainCaracImg.x -= 1;
        floorImg.x -= 0.5;
        mainCaracImg.speedX = 0;
        mainCaracImg.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
            mainCaracImg.speedX = -1;
            mainCaracImg.image.src = "images/ghosty_ghost2_left_resized.png";
        }
        if (myGameArea.keys && myGameArea.keys[39] && sidecollision == false) {
            mainCaracImg.speedX = 2;
            mainCaracImg.image.src = "images/ghosty_ghost2_resized.png";
        }
        if (myGameArea.keys && myGameArea.keys[32] && mainCaracImg.y == floor) {
            mainCaracImg.image.src = "images/ghosty_ghost2_resized.png";
            ceil = floor - 100;
            mainCaracImg.gravitySpeed = 0;
            accelerate(-ACELLERATECONST);
        }
        mainCaracImg.newPos();
        mainCaracImg.update();
        floorImg.update();
    }
}

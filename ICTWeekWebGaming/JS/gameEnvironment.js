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
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    monsterImg.update();
    mainCaracImg.speedX = 0;
    mainCaracImg.speedY = 0;
    if (myGameArea.key && myGameArea.key == keyNum.LEFT) {mainCaracImg.speedX = -1; }
    if (myGameArea.key && myGameArea.key == keyNum.RIGHT) {mainCaracImg.speedX = 1; }
    mainCaracImg.newPos();
    mainCaracImg.update();
    floorImg.update();

}

window.onkeypress = function(event) {
    // On récupère le code de la touche
    var e = event || window.event;
    var key = e.which || e.keyCode;

    switch(key) {
        case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
        mainCaracImg.speedY -= 1;
        break;
        case 40 : case 115 : case 83 : // Flèche bas, s, S
        mainCaracImg.speedY += 1;
        break;
        case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
        mainCaracImg.speedX -= 1;
        break;
        case 39 : case 100 : case 68 : // Flèche droite, d, D
        mainCaracImg.speedX += 1;
        break;
        default :
            //alert(key);
            // Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
            return true;
    }
    return false;
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
}
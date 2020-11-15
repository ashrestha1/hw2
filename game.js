// The point and size class used in this program
function Point(x, y) {
    this.x = (x) ? parseFloat(x) : 0.0;
    this.y = (y) ? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w) ? parseFloat(w) : 0.0;
    this.h = (h) ? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
        pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function () {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);


        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));




        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
            ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
            (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function (position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        var pos = new Point(x, y);
        var size = new Size(w, h);



        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function (position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS = new Point(0, 0);   // The initial position of the player
var MONSTER_ADDED = 4;
var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed
var countdownTimer;
var GAME_INTERVAL = 25;                     // The time interval of running the game
var cheatModePressed = false;
var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
//  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var fridgeCoord = new Point(540, 500);
var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var SNOWFLAKE_SIZE = new Size(40, 40);
var MONSTER_SPEED = 1;
var monsterCanShoot = true;
var score = 0;
var portal_1_coord = new Point(560, 100);
var portal_2_coord = new Point(105, 500);
var canTeleport = true;
var bulletCanTeleport = true;
var timeLeft = 60;

var MAX_NUMBER_OF_BULLETS = 8;
var platform_up = true;
//
// Variables in the game
//
var motionType = { NONE: 0, LEFT: 1, RIGHT: 2 }; // Motion enum

var player = null;                          // The player object
var gameInterval = null;                    // The interval
var lastLeft = false;                       // Last movement was left
var playerName = "anonymous";
var level = 1;
//
// The load function
//
function load() {
 playerName = prompt("Please enter your name", "");
document.getElementById("startScreen").style.visibility = "hidden";
    countdown();
    document.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    // Attach keyboard events
    document.documentElement.addEventListener("keydown", keydown, false);
    document.documentElement.addEventListener("keyup", keyup, false);

    // Create the player
    player = new Player();

    // Create the monsters
    var i;
    for (i = 0; i < 1; i++) {
        var yCoord = Math.floor(Math.random() * 521);    //0 to 560 
        var xCoord = Math.floor(Math.random() * 561);    //0 to 600

        if (xCoord < 200 && yCoord < 300) {
            i--;
            continue;
        }

        createMonster(xCoord, yCoord);

    }

    var j;
    for (j = 0; j < 8; j++) {


        var yCoordSnowflake = Math.floor(Math.random() * 521);    //0 to 560 
        var xCoordSnowflake = Math.floor(Math.random() * 561);    //0 to 600
        var snowflakePos = new Point(xCoordSnowflake, yCoordSnowflake);
        var platforms = document.getElementById("platforms");

        for (var k = 0; k < platforms.childNodes.length; k++) {
            var node = platforms.childNodes.item(k);
            if (node.nodeName != "rect") continue;

            var platformX = parseFloat(node.getAttribute("x"));
            var platformY = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            var pos = new Point(platformX, platformY);
            var size = new Size(w, h);



            if (intersect(pos, size, snowflakePos, SNOWFLAKE_SIZE)) {
                j--;
                break;
            }


        }
        if (intersect(pos, size, snowflakePos, SNOWFLAKE_SIZE))

            continue;


        if (xCoordSnowflake < 200 && yCoordSnowflake < 300) {
            j--;
            continue;
        }



        createSnowflake(xCoordSnowflake, yCoordSnowflake);



    }

    createPortal(560, 100);
    createPortal(105, 500);

    createFridge(540, 500);



    var platforms = document.getElementById("platforms");

    // Create a new line element
    var newPlatform_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    // Set the various attributes of the line
    //    <rect style="fill:black" width="60" height="20" x="100" y="100" />
    newPlatform_1.setAttribute("height", 20);
    newPlatform_1.setAttribute("x", 100);
    newPlatform_1.setAttribute("y", 100);
    newPlatform_1.setAttribute("width", 60);
    newPlatform_1.setAttribute("type", "disappearing");
    newPlatform_1.style.setProperty("opacity", 1, null);
    newPlatform_1.style.setProperty("fill", "black", null);
    var newPlatform_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    //<rect style="fill:black" width="60" height="20" x="20" y="220" />
    newPlatform_2.setAttribute("height", 20);
    newPlatform_2.setAttribute("x", 20);
    newPlatform_2.setAttribute("y", 220);
    newPlatform_2.setAttribute("width", 60);
    newPlatform_2.setAttribute("type", "disappearing");
    newPlatform_2.style.setProperty("opacity", 1, null);
    newPlatform_2.style.setProperty("fill", "black", null);

    var newPlatform_3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    //<rect style="fill:blue" width="80" height="20" x="520" y="480" />
    newPlatform_3.setAttribute("height", 20);
    newPlatform_3.setAttribute("x", 520);
    newPlatform_3.setAttribute("y", 480);
    newPlatform_3.setAttribute("width", 80);
    newPlatform_3.setAttribute("type", "disappearing");
    newPlatform_3.style.setProperty("opacity", 1, null);
    newPlatform_3.style.setProperty("fill", "black", null);


    // Add the new platform to the end of the group
    platforms.appendChild(newPlatform_1);
    platforms.appendChild(newPlatform_2);
    platforms.appendChild(newPlatform_3);


    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}


//
// This function creates the monsters in the game
//
function createMonster(x, y) {
    var monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    monster.setAttribute("x", x);
    monster.setAttribute("y", y);
    monster.setAttribute("next_x", Math.floor(Math.random() * 561));
    monster.setAttribute("next_y", Math.floor(Math.random() * 521));
    monster.setAttribute("monsterLastLeft", false);
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    document.getElementById("monsters").appendChild(monster);
}

//
// This function creates snowflakes
//
function createSnowflake(x, y) {

    var snowflake = document.createElementNS("http://www.w3.org/2000/svg", "use");
    snowflake.setAttribute("x", x);
    snowflake.setAttribute("y", y);
    snowflake.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#snowflake");
    document.getElementById("snowflakes").appendChild(snowflake);

}

//
// This function creates Portal
//
function createPortal(x, y) {

    var portal = document.createElementNS("http://www.w3.org/2000/svg", "use");
    portal.setAttribute("x", x);
    portal.setAttribute("y", y);
    portal.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#portal");
    document.getElementById("portals").appendChild(portal);

}

function createFridge(x, y) {

    var fridge = document.createElementNS("http://www.w3.org/2000/svg", "use");
    fridge.setAttribute("x", x);
    fridge.setAttribute("y", y);
    fridge.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#fridge");
    document.getElementById("fridges").appendChild(fridge);

}

//
// This function  will allow monsters to move around
// 
function moveMonster() {

    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);

        var x = parseInt(monster.getAttribute("x"));
        var next_x = parseInt(monster.getAttribute("next_x"));
        var y = parseInt(monster.getAttribute("y"));
        var next_y = parseInt(monster.getAttribute("next_y"));




        if (x == next_x) {
            var xCoord = Math.floor(Math.random() * 561);
            monster.setAttribute("next_x", xCoord);
        }

        if (y == next_y) {
            var yCoord = Math.floor(Math.random() * 521);
            monster.setAttribute("next_y", yCoord);
        }

        if (x < next_x) {
            monster.setAttribute("x", x + MONSTER_SPEED);
            monster.setAttribute("transform", "translate(" + 0 + "), scale(1,1)");
            monster.setAttribute("monsterLastLeft", false);
        }
        else {
            monster.setAttribute("x", x - MONSTER_SPEED);
            monster.setAttribute("transform", "translate(" + 2 * monster.getAttribute("x") + "), translate(" + 40 + "),scale(-1,1)");
            monster.setAttribute("monsterLastLeft", true);
        }


        if (y < next_y)
            monster.setAttribute("y", y + MONSTER_SPEED);
        else
            monster.setAttribute("y", y - MONSTER_SPEED);

    }


}









//
// This function shoots a bullet from the player
//
function shootBullet() {
    if (MAX_NUMBER_OF_BULLETS < 1 && (cheatModePressed!=true))
        return;

    // Disable shooting for a short period of time
    canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);

    // Create the bullet using the use node
    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    if (lastLeft == false) {
        bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
        bullet.setAttribute("bulletLeft", false);
    }
    else {
        bullet.setAttribute("x", player.position.x - PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
        bullet.setAttribute("bulletLeft", true);
    }
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);

    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    document.getElementById("bullets").appendChild(bullet);


    if(cheatModePressed!=true)
    MAX_NUMBER_OF_BULLETS--;


}

//
// This function shoots a bullet from the monster
//
function monsterShootBullet() {
    // Disable shooting for a short period of time
    var monsters = document.getElementById("monsters");
    var specialMonster = monsters.childNodes.item(0);


    if (monsterCanShoot == true) {    // Create the bullet using the use node
        var monsterBullet = document.createElementNS("http://www.w3.org/2000/svg", "use");

        if (specialMonster.getAttribute("monsterLastLeft") == "false") {
            monsterBullet.setAttribute("x", parseInt(specialMonster.getAttribute("x")) + MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
            monsterBullet.setAttribute("monsterBulletLeft", false);
        }
        else {
            monsterBullet.setAttribute("x", parseInt(specialMonster.getAttribute("x")) - MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
            monsterBullet.setAttribute("monsterBulletLeft", true);
        }


        monsterBullet.setAttribute("y", parseInt(specialMonster.getAttribute("y")) + MONSTER_SIZE.h / 2 - BULLET_SIZE.h / 2);
        monsterBullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monsterBullet");
        document.getElementById("monsterBullets").appendChild(monsterBullet);
        monsterCanShoot = false;
    }


    // Go through all bullets
    var monsterBullets = document.getElementById("monsterBullets");
    var node = monsterBullets.childNodes.item(0);

    // Update the position of the bullet
    if (node != null) {
        var x = parseInt(node.getAttribute("x"));
        if (node.getAttribute("monsterBulletLeft") == "false")
            node.setAttribute("x", x + BULLET_SPEED);
        else
            node.setAttribute("x", x - BULLET_SPEED);
    }

    // If the bullet is not inside the screen delete it from the group
    if (x > SCREEN_SIZE.w || x < 0) {
        monsterBullets.removeChild(node);
        monsterCanShoot = true;
    }


}

function enterPortal_1() {

    if (canTeleport == false)
        return;

    player.position.x = 105;
    player.position.y = 500;

    canTeleport = false;
    setTimeout("canTeleport = true", 2000);


}

function enterPortal_2() {

    if (canTeleport == false)
        return;

    player.position.x = 560;
    player.position.y = 100;

    canTeleport = false;
    setTimeout("canTeleport = true", 2000);


}



//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode) ? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.motion = motionType.LEFT;


            break;

        case "D".charCodeAt(0):
            player.motion = motionType.RIGHT;

            break;


        // Add your code here


        case "W".charCodeAt(0):
            if (player.isOnPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;
            case "C".charCodeAt(0):
                cheatMode();
                break;
                case "V".charCodeAt(0):
                    notCheatMode();
                    break;
    
        case "H".charCodeAt(0): // spacebar = shoot
            if (canShoot) shootBullet();
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode) ? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;

            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;

            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    var monsters = document.getElementById("monsters");

    var monsterBullets = document.getElementById("monsterBullets");
    var node = monsterBullets.childNodes.item(0);

    // Update the position of the bullet
    if (node != null) {
        var monsterBulletX = parseInt(node.getAttribute("x"));
        var monsterBulletY = parseInt(node.getAttribute("y"));
        if (intersect(new Point(monsterBulletX, monsterBulletY), BULLET_SIZE, player.position, PLAYER_SIZE) && (cheatModePressed!=true)) {
            // Clear the game interval
            clearInterval(gameInterval);
            clearTimeout(countdownTimer);
            // Get the high score table from cookies
            var highScoreTable = getHighScoreTable();

            // // Create the new score record
          
            var record = new ScoreRecord(playerName, score);

            // // Insert the new score record
            var position = 0;
            while (position < highScoreTable.length) {
                var curPositionScore = highScoreTable[position].score;
                if (curPositionScore < score)
                    break;

                position++;
            }
            if (position < 10)
                highScoreTable.splice(position, 0, record);

            // Store the new high score table
            setHighScoreTable(highScoreTable);

            // Show the high score table
            showHighScoreTable(highScoreTable);

            return;
        }




    }


    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

        if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE) && (cheatModePressed!=true)) {
            // Clear the game interval
            clearInterval(gameInterval);
            clearTimeout(countdownTimer);
            // Get the high score table from cookies
            var highScoreTable = getHighScoreTable();

            // // Create the new score record
           
            var record = new ScoreRecord(playerName, score);

            // // Insert the new score record
            var position = 0;
            while (position < highScoreTable.length) {
                var curPositionScore = highScoreTable[position].score;
                if (curPositionScore < score)
                    break;

                position++;
            }
            if (position < 10)
                highScoreTable.splice(position, 0, record);

            // Store the new high score table
            setHighScoreTable(highScoreTable);

            // Show the high score table
            showHighScoreTable(highScoreTable);

            return;
        }
    }

    // Check whether a bullet hits a monster
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
if(monster == null)
continue;

            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {

                if (monster == monsters.childNodes.item(0)) {
                    var monsterBullet = document.getElementById("monsterBullets");
                    monsterBullet.removeChild(monsterBullet.childNodes.item(0));
                }
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;



                //write some code to update the score
                score += 10;
                document.getElementById("score").firstChild.data = score;
            }
        }
    }
    // Check whether a snowflake collected
    var snowflakes = document.getElementById("snowflakes");
    for (var i = 0; i < snowflakes.childNodes.length; i++) {
        var snowflake = snowflakes.childNodes.item(i);
        var x = parseInt(snowflake.getAttribute("x"));
        var y = parseInt(snowflake.getAttribute("y"));

        if (intersect(new Point(x, y), SNOWFLAKE_SIZE, player.position, PLAYER_SIZE)) {


            snowflakes.removeChild(snowflake);
            i--;



            //write some code to update the score
            score += 10;
            document.getElementById("score").firstChild.data = score;
        }



    }
}


//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));



        if (node.getAttribute("bulletLeft") == "false")
            node.setAttribute("x", x + BULLET_SPEED);

        else
            node.setAttribute("x", x - BULLET_SPEED);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions
    collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();

    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT) {
        displacement.x = -MOVE_DISPLACEMENT;
        lastLeft = true;
    }
    if (player.motion == motionType.RIGHT) {
        displacement.x = MOVE_DISPLACEMENT;
        lastLeft = false;
    }

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    var platforms = document.getElementById("platforms");

    for (var i = 0; i < platforms.childNodes.length; i++) {
        var platform = platforms.childNodes.item(i);

        if (platform.nodeName != "rect") continue;

        if (platform == null)
            continue;

        if (platform.style.getPropertyValue("fill") == "pink") {

            var x = parseFloat(platform.getAttribute("x"));
            var y = parseFloat(platform.getAttribute("y"));
            var w = parseFloat(platform.getAttribute("width"));
            var h = parseFloat(platform.getAttribute("height"));


            // <rect style="fill:orange" width="60" height="20" x="0" y="60" />

            if (((player.position.x + PLAYER_SIZE.w > x && player.position.x < x + w) ||
                ((player.position.x + PLAYER_SIZE.w) == x && player.motion == motionType.RIGHT) ||
                (player.position.x == (x + w) && player.motion == motionType.LEFT)) &&
                player.position.y + PLAYER_SIZE.h == y) {

                if (platform_up)
                    player.position.y -= 1;
                else
                    player.position.y += 1;

            }



            if (y == 480)
                platform_up = true;

            if (y == 360)
                platform_up = false;

            if (platform_up)
                platform.setAttribute("y", y -= 1);

            else
                platform.setAttribute("y", y += 1);





        }

        if (platform.getAttribute("type") == "disappearing") {

            var x = parseFloat(platform.getAttribute("x"));
            var y = parseFloat(platform.getAttribute("y"));
            var w = parseFloat(platform.getAttribute("width"));
            var h = parseFloat(platform.getAttribute("height"));


            // <rect style="fill:orange" width="60" height="20" x="0" y="60" />

            if (((player.position.x + PLAYER_SIZE.w > x && player.position.x < x + w) ||
                ((player.position.x + PLAYER_SIZE.w) == x && player.motion == motionType.RIGHT) ||
                (player.position.x == (x + w) && player.motion == motionType.LEFT)) &&
                player.position.y + PLAYER_SIZE.h == y) {
                var platformOpacity = parseFloat(platform.style.getPropertyValue("opacity"));
                platformOpacity -= 0.1;
                platform.style.setProperty("opacity", platformOpacity, null);

                if (platformOpacity == 0)
                    platforms.removeChild(platform);
            }






        }
    }

    if (intersect(player.position, PLAYER_SIZE, portal_1_coord, MONSTER_SIZE)) {
        enterPortal_1();
    }



    if (intersect(player.position, PLAYER_SIZE, portal_2_coord, MONSTER_SIZE)) {
        enterPortal_2();
    }

    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        var y = parseInt(node.getAttribute("y"));

        var bulletPos = new Point(x, y);

        if (intersect(bulletPos, BULLET_SIZE, portal_1_coord, MONSTER_SIZE)) {


            node.setAttribute("x", 140);

            node.setAttribute("y", 500);



        }

        if (intersect(bulletPos, BULLET_SIZE, portal_2_coord, MONSTER_SIZE)) {



            node.setAttribute("x", 560);

            node.setAttribute("y", 100);




        }


    }



    if (intersect(player.position, PLAYER_SIZE, fridgeCoord, MONSTER_SIZE)) {


        enterFridge();




    }







    // Move the bullets
    moveBullets();
    moveMonster();
    monsterShootBullet();
    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player

    if (player.motion == motionType.LEFT || lastLeft == true)
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + "), translate(" + 40 + ", 0), scale(-1,1)");



    else if (player.motion == motionType.RIGHT || lastLeft == false)
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");

player_name.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");

console.log(playerName)
text_name.innerHTML = playerName;

    // Calculate the scaling and translation factors	

    // Add your code here

}

function countdown() {




    timeLeft--;


    document.getElementById("timeLeft").firstChild.data = timeLeft;

    if (timeLeft == 0) {
        // Clear the game interval

        document.getElementById("timeLeft").firstChild.data = timeLeft;
        clearInterval(gameInterval);
        clearTimeout(countdownTimer);
        // Get the high score table from cookies
        var highScoreTable = getHighScoreTable();

        // // Create the new score record
       
        
        var record = new ScoreRecord(playerName, score);

        // // Insert the new score record
        var position = 0;
        while (position < highScoreTable.length) {
            var curPositionScore = highScoreTable[position].score;
            if (curPositionScore < score)
                break;

            position++;
        }
        if (position < 10)
            highScoreTable.splice(position, 0, record);

        // Store the new high score table
        setHighScoreTable(highScoreTable);

        // Show the high score table
        showHighScoreTable(highScoreTable);

        return;

    }

    countdownTimer = setTimeout("countdown()", 1000);


}

function enterFridge() {
    var snowflakes = document.getElementById("snowflakes");



    if (snowflakes.childNodes.length != 0)
        return;

    level++;
    document.getElementById("level").firstChild.data = level;
    document.getElementById("score").firstChild.data = score + timeLeft + 100;
    restart();


}

function restart() {
    player.position = PLAYER_INIT_POS;

    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);

        if (monster != null)
            monsters.removeChild(monster);





    }
   var  platform1Needed = true;
   var  platform2Needed = true;
   var  platform3Needed = true;

    var platforms = document.getElementById("platforms");



    for (var i = 0; i < platforms.childNodes.length; i++) {
        var platform = platforms.childNodes.item(i);

        if (platform.nodeName != "rect") continue;

        if (platform == null)
            continue;
        if (platform.getAttribute("x") == 100 && platform.getAttribute("y") == 100 && platform.getAttribute("width") == 60) {
            platform1Needed = false;

        } if (platform.getAttribute("x") == 20 && platform.getAttribute("y") == 220 && platform.getAttribute("width") == 60) {
            platform2Needed = false;

        }
        if (platform.getAttribute("x") == 520 && platform.getAttribute("y") == 480 && platform.getAttribute("width") == 80) {
            platform3Needed = false;

        }


    }



    if (platform1Needed) {
        var newPlatform_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        newPlatform_1.setAttribute("height", 20);
        newPlatform_1.setAttribute("x", 100);
        newPlatform_1.setAttribute("y", 100);
        newPlatform_1.setAttribute("width", 60);
        newPlatform_1.setAttribute("type", "disappearing");
        newPlatform_1.style.setProperty("opacity", 1, null);
        newPlatform_1.style.setProperty("fill", "black", null);
        platforms.appendChild(newPlatform_1);
    }
    if (platform2Needed) {
        var newPlatform_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        newPlatform_2.setAttribute("height", 20);
        newPlatform_2.setAttribute("x", 20);
        newPlatform_2.setAttribute("y", 220);
        newPlatform_2.setAttribute("width", 60);
        newPlatform_2.setAttribute("type", "disappearing");
        newPlatform_2.style.setProperty("opacity", 1, null);
        newPlatform_2.style.setProperty("fill", "black", null);
        platforms.appendChild(newPlatform_2);
    }
    if (platform3Needed) {
        var newPlatform_3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        newPlatform_3.setAttribute("height", 20);
        newPlatform_3.setAttribute("x", 520);
        newPlatform_3.setAttribute("y", 480);
        newPlatform_3.setAttribute("width", 80);
        newPlatform_3.setAttribute("type", "disappearing");
        newPlatform_3.style.setProperty("opacity", 1, null);
        newPlatform_3.style.setProperty("fill", "black", null);
        platforms.appendChild(newPlatform_3);
    }

platform1Needed = false;
platform2Needed = false;
platform3Needed = false;


    for (i = 0; i < (6 + MONSTER_ADDED); i++) {
        var yCoord = Math.floor(Math.random() * 521);    //0 to 560 
        var xCoord = Math.floor(Math.random() * 561);    //0 to 600

        if (xCoord < 200 && yCoord < 300) {
            i--;
            continue;
        }

        createMonster(xCoord, yCoord);

    }
    MONSTER_ADDED += 4;

    MAX_NUMBER_OF_BULLETS = 8;

    var j;
    for (j = 0; j < 8; j++) {


        var yCoordSnowflake = Math.floor(Math.random() * 521);    //0 to 560 
        var xCoordSnowflake = Math.floor(Math.random() * 561);    //0 to 600
        var snowflakePos = new Point(xCoordSnowflake, yCoordSnowflake);
        var platforms = document.getElementById("platforms");

        for (var k = 0; k < platforms.childNodes.length; k++) {
            var node = platforms.childNodes.item(k);
            if (node.nodeName != "rect") continue;

            var platformX = parseFloat(node.getAttribute("x"));
            var platformY = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            var pos = new Point(platformX, platformY);
            var size = new Size(w, h);



            if (intersect(pos, size, snowflakePos, SNOWFLAKE_SIZE)) {
                j--;
                break;
            }


        }
        if (intersect(pos, size, snowflakePos, SNOWFLAKE_SIZE))

            continue;


        if (xCoordSnowflake < 200 && yCoordSnowflake < 300) {
            j--;
            continue;
        }



        createSnowflake(xCoordSnowflake, yCoordSnowflake);



    }

}
function cheatMode(){

cheatModePressed = true;

}

function notCheatMode(){

    cheatModePressed = false;
    
    }

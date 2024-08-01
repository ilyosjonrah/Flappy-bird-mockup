

// Get canvas
let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')





// Load images
const background = new Image()
let bird = new Image()
const floor = new Image()
const upperPipe = new Image()
const lowerPipe = new Image()
const scoreboard = new Image()
const gameoverBoard = new Image()
const messageReady = new Image()

// Load Audio
const SFX_die = new Audio()
const SFX_hit = new Audio()
const SFX_point = new Audio()
const SFX_swoosh = new Audio()
const SFX_wing = new Audio()



const birdImages = [
    './images/bird1.png',
    './images/bird2.png',
    './images/bird3.png',
    './images/bird2.png',
]

// images
background.src = "./images/bg.png"
//bird.src = "./images/bird.png"
upperPipe.src = "./images/toppipe.png"
lowerPipe.src = "./images/bottompipe.png"
floor.src = "./images/fg.png"
scoreboard.src = "./images/scoreboard.png"
gameoverBoard.src = './images/gameOver.png'
messageReady.src = "./images/message.png"

//audi
SFX_die.src = "./assets/sfx/die.wav"
SFX_hit.src = "./assets/sfx/hit.wav"
SFX_point.src = "./assets/sfx/point.wav"
SFX_swoosh.src = "./assets/sfx/swoosh.wav"
SFX_wing.src = "./assets/sfx/wing.wav"



// Variables
bird.src = birdImages[0]
let birdDimensionX = 40
let birdDimensionY = 30
bird.width = birdDimensionX
bird.height = birdDimensionY
let bX = 100
let bY = canvas.height / 2
let width
const pipeDimensionX = 60
const pipeDimensionY = 200


const gap = 130
const maxJump = 30
let velocity = 1
const gravity = 0.1
let jumpPerFrame = 0
const hole = upperPipe.height + gap
let gameOver = true
let pipe = []
pipe[0] = {
    x: canvas.width,
    y: 0
}
let score = 0


let isKeyPressed = false


// Load Fonts
// From ChatGPT
const loadFont = new FontFace('FlappybirdFont', 'url(./assets/flappy-bird-font.ttf)');
loadFont.load().then(function (font) {
    document.fonts.add(font)

}).catch(function (error) {
    console.error('Font loading failed:', error);
});


const rotateImage = (context, img, x, y, width, height, angle) => {
    let testX = x + birdDimensionX / 2
    let testY = y + birdDimensionY / 2
    context.save(); // Save the current context state
    context.translate(testX, testY); // Translate to the center of the image
    context.rotate(angle); // Rotate the context by the specified angle
    context.translate(-testX, -testY)
    context.drawImage(img, x, y, width, height); // Draw the image centered on the origin
    context.restore(); // Restore the context to its original state
};

// Move up
const moveUp = () => {
    //bY -= jump

    if (!gameOver) {
        gameOver = true
        draw()
    }
    /* for (let index = 0; index < jump; index++) {
        bY -= 2
    }
    isKeyPressed = false */
}

let gameState = 2 // 0 Over, 1 Play, 2 Idle
const eventFunction = () => {
    /* jumpAccel = 0 */
    isKeyPressed = true
    jumpPerFrame = 5
    
    if (gameState === 2) {
        bY = canvas.height / 2
        gameState = 1
    }
    else if (gameState === 0) { // Gameover
        gameState = 2           // Return to Idle state
        //location.reload();
        SFX_swoosh.play()
        // Reset
        context.clearRect(0, 0, canvas.width, canvas.height);
        bX = 100
        bY = canvas.height / 2
        pipe = []
        pipe[0] = {
            x: canvas.width,
            y: 0
        }
        score = 0
        draw()
    }
}
document.addEventListener('keydown', eventFunction)

let jumpAccel = 0
let rotate = 0
let frames = 0  // Frames for bird animation wing flap
let birdJumpFrame = 0   // How many frames after input for bird to rotate down when falling
let birdIndex = 0
let idleInterval
let floorPosition = 0
window.onload = draw = () => {

    context.drawImage(background, 0, 0, canvas.width, canvas.height)

    // Change bird image every 50 frames
    if (frames % 50 == 0) {
        birdIndex += 1
        if (birdIndex === birdImages.length) {
            birdIndex = 0
        }
    }
    frames++

    if (gameState === 1) {
        clearInterval(idleInterval);
        playGame();
    } else if (gameState === 2) {
        /* if (!idleInterval) {
            idleInterval = setInterval(idleState, 10);
        } */
        idleState()
    }
    // Move and draw the floor
    floorPosition -= velocity; // Adjust speed as needed
    if (floorPosition <= -canvas.width) {
        floorPosition = 0;
    }

    // Draw the floor multiple times for looping effect
    context.drawImage(floor, floorPosition, canvas.height - floor.height, canvas.width, floor.height);
    context.drawImage(floor, floorPosition + canvas.width, canvas.height - floor.height, canvas.width, floor.height);


    //context.drawImage(floor, 0, canvas.height - floor.height, canvas.width, floor.height)

    if (gameState === 0) {
        displayScoreboard()
        return
    }
    else {
        requestAnimationFrame(draw)
    }

}

let idleFly = 0
let idleFlyDirection = 'up'
const idleState = () => {

    context.drawImage(messageReady, 145, 140, messageReady.width * 1.1, messageReady.height * 1.1)


    if (frames % 65 == 0) {
        birdIndex += 1
        if (birdIndex === birdImages.length) {
            birdIndex = 0
        }
    }
    frames++
    if (idleFly === 20) {
        idleFlyDirection = 'down';
    }

    if (idleFly === -20) {
        idleFlyDirection = 'up';
    }

    if (idleFlyDirection === 'up') {
        bY += 0.5
        //rotate = 75 * Math.pi/180
        idleFly = idleFly + 0.5
    } else if (idleFlyDirection === 'down') {
        bY -= 0.5
        idleFly = idleFly - 0.5
        // rotate = 75 * Math.pi/180
    }

    bird.src = birdImages[birdIndex]
    rotate = 75 * Math.pi / 180
    rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
}

const playGame = () => {
    if (!isKeyPressed) {
        // As it falls down, speed accelerates
        jumpPerFrame += gravity
        bY += jumpPerFrame
        // Have it still face upwards
        if (birdJumpFrame <= 39 && birdJumpFrame != 0) {
            rotate = -35 * Math.PI / 180
        }
        // As it falls down rotate bid to face downwards
        else if (birdJumpFrame >= 40) {
            rotate = 75 * Math.PI / 180
        }
        birdJumpFrame++
        bird.src = birdImages[birdIndex]
        rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
    }
    // Move up
    else {
        // As it jump, have a higher acceleration and then decelerate until no more jump
        bY -= jumpPerFrame
        jumpPerFrame -= .17
        rotate = -35 * Math.PI / 180
        bird.src = birdImages[birdIndex]
        SFX_wing.play()
        rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
        // If no more jump, reset values
        if (jumpPerFrame <= 0) {
            isKeyPressed = false
            jumpPerFrame = 0
            rotate = 0
            birdJumpFrame = 1
            //rotateImage(context, bird, bX, bY, birdDimension, birdDimension, rotate)
        }
    }

    createPipes()
}


const createPipes = () => {
    // Generate pipes
    for (var i = 0; i < pipe.length; i++) {

        constant = pipeDimensionY + gap;
        context.drawImage(upperPipe, pipe[i].x, pipe[i].y, pipeDimensionX, pipeDimensionY);
        context.drawImage(lowerPipe, pipe[i].x, pipe[i].y + constant, pipeDimensionX, pipeDimensionY * 2);

        pipe[i].x -= velocity;

        // Make new pipe
        if (pipe[i].x == Math.floor(canvas.width - 250)) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeDimensionY) - pipeDimensionY
            });
        }

        // Remove pipes
        if (pipe[i].x === 0 - pipeDimensionX) {
            pipe.shift()
        }

        // Collision
        // CodeExplainedRepo Github
        if (bX + bird.width >= pipe[i].x &&     // If bird X position and width is greater or equal to pipe X dimensions
            bX <= pipe[i].x + pipeDimensionX &&  // if bird X position is lesser than pipe X position + height
            (bY <= pipe[i].y + pipeDimensionY || // If bird is lower than pipe Y and its height
                bY + bird.height >= pipe[i].y + constant) /* || // OR if bird is greater than pipe + constnat
            bY + bird.height >= canvas.height - floor.height */) {         // If floor


            SFX_hit.play()
            gameOver = false
            gameState = 0
            //displayScoreboard()
            //location.reload(); // reload the page

        }
        else if (bY + bird.height >= canvas.height - floor.height) {
            SFX_die.play()
            gameOver = false
            gameState = 0
        }
        else if (bX + bird.width === pipe[i].x) {
            score += 1
            SFX_point.play()
        }

        //score
        context.font = "45px FlappybirdFont";
        context.strokeStyle = "black";
        context.fillStyle = 'white'
        context.lineWidth = '2'
        if (gameState != 0) {
            context.fillText(score, canvas.width / 2, canvas.height / 4);
            context.strokeText(score, canvas.width / 2, canvas.height / 4);
        }
        else {
            context.fillText('', canvas.width / 2, canvas.height / 4);
            context.strokeText('', canvas.width / 2, canvas.height / 4);
        }

    }
}

const updateHighscore = (score) => {
    let currentHighscore = localStorage.getItem('highscore');

    if (currentHighscore === 'undefined') {
        // If no highscore, create
        localStorage.setItem('highscore', JSON.stringify(score));
        return score
    }

    // Parse score
    currentHighscore = JSON.parse(currentHighscore);

    // If score is higher than highscore, update highscore
    if (currentHighscore <= score) {
        localStorage.setItem('highscore', JSON.stringify(score))
        return score
    }
    else {
        return currentHighscore
    }

}

const displayScoreboard = () => {
    disableInput()
    context.drawImage(scoreboard, canvas.width / 4, canvas.height / 3, scoreboard.width, scoreboard.height)
    context.font = "28px FlappybirdFont";
    context.strokeStyle = "black";
    context.fillStyle = 'white'
    context.lineWidth = '1'

    //GameOver
    context.drawImage(gameoverBoard, (canvas.width / 2) / 2, 150, gameoverBoard.width * 1.2, gameoverBoard.height * 1.2)

    // Current Score
    context.fillText(score, canvas.width / 2 + 75, canvas.height / 2 - 50)
    context.strokeText(score, canvas.width / 2 + 75, canvas.height / 2 - 50)

    // High score
    const highscore = updateHighscore(score)
    context.fillText(highscore, canvas.width / 2 + 75, canvas.height / 2)
    context.strokeText(highscore, canvas.width / 2 + 75, canvas.height / 2)
}


// Disable inputs for x seconds
const disableInput = () => {
    document.removeEventListener('keydown', eventFunction)

    setTimeout(() => {
        document.addEventListener('keydown', eventFunction)
    }, 500);
}

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')


const background = new Image()
let bird = new Image()
const floor = new Image()
const upperPipe = new Image()
const lowerPipe = new Image()
const scoreboard = new Image()
const gameoverBoard = new Image()
const messageReady = new Image()


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


background.src = "./images/bg.png"

upperPipe.src = "./images/toppipe.png"
lowerPipe.src = "./images/bottompipe.png"
floor.src = "./images/fg.png"
scoreboard.src = "./images/scoreboard.png"
gameoverBoard.src = './images/gameOver.png'
messageReady.src = "./images/message.png"


SFX_die.src = "./assets/sfx/die.wav"
SFX_hit.src = "./assets/sfx/hit.wav"
SFX_point.src = "./assets/sfx/point.wav"
SFX_swoosh.src = "./assets/sfx/swoosh.wav"
SFX_wing.src = "./assets/sfx/wing.wav"



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
let pipe = []
pipe[0] = {
    x: canvas.width,
    y: 0
}


const gap = 130
const maxJump = 30
let velocity = 1
const gravity = 0.1
let jumpPerFrame = 0
const hole = upperPipe.height + gap

let score = 0
let isKeyPressed = false



const rotateImage = (context, img, x, y, width, height, angle) => {
    let translateX = x + birdDimensionX / 2
    let translateY = y + birdDimensionY / 2
    context.save()
    context.translate(translateX, translateY)
    context.rotate(angle)
    context.translate(-translateX, -translateY)
    context.drawImage(img, x, y, width, height)
    context.restore()
}


let gameState = 2 
const eventFunction = () => {
    isKeyPressed = true
    jumpPerFrame = 5

    if (gameState === 2) {
        bY = canvas.height / 2
        gameState = 1
    }
    else if (gameState === 0) { // Gameover
        gameState = 2           // Return to Idle state
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

const checkKey = (e) => {
    if (e.keyCode == 38 || e.keyCode == 32) {
        e.preventDefault() 
        eventFunction()
    }
}

document.addEventListener('keydown', checkKey)
document.addEventListener('click', eventFunction)
document.addEventListener('touchstart', eventFunction)

let jumpAccel = 0
let rotate = 0
let frames = 0  
let birdJumpFrame = 0   
let birdIndex = 0
let idleInterval
let floorPosition = 0
let bgPosition = 0
window.onload = draw = () => {

    bgPosition -= 0.02
    if (bgPosition <= -canvas.width) {
        bgPosition = 0
    }
    context.drawImage(background, bgPosition, 0, canvas.width, canvas.height)
    context.drawImage(background, bgPosition + canvas.width, 0, canvas.width, canvas.height)

  
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
        idleState()
    }
 
    floorPosition -= velocity
    if (floorPosition <= -canvas.width) {
        floorPosition = 0
    }


    context.drawImage(floor, floorPosition, canvas.height - floor.height, canvas.width, floor.height)
    context.drawImage(floor, floorPosition + canvas.width, canvas.height - floor.height, canvas.width, floor.height)

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
        idleFly = idleFly + 0.5
    } else if (idleFlyDirection === 'down') {
        bY -= 0.5
        idleFly = idleFly - 0.5
    }
 
    bird.src = birdImages[birdIndex]
    rotate = 0
    rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
}

const playGame = () => {
    if (!isKeyPressed) {
  
        jumpPerFrame += gravity
        bY += jumpPerFrame
        if (birdJumpFrame <= 39 && birdJumpFrame != 0) {
            rotate = -35 * Math.PI / 180
        }
 
        else if (birdJumpFrame >= 40) {
            rotate = 75 * Math.PI / 180
        }
        birdJumpFrame++
        bird.src = birdImages[birdIndex]
        rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
    }
 
    else {
  
        bY -= jumpPerFrame
        jumpPerFrame -= .17
        rotate = -35 * Math.PI / 180
        bird.src = birdImages[birdIndex]
        SFX_wing.play()
        rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);

        if (jumpPerFrame <= 0) {
            isKeyPressed = false
            jumpPerFrame = 0
            rotate = 0
            birdJumpFrame = 1
        }
    }

    createPipes()
}


const createPipes = () => {
 
    for (var i = 0; i < pipe.length; i++) {

        constant = pipeDimensionY + gap;
        context.drawImage(upperPipe, pipe[i].x, pipe[i].y, pipeDimensionX, pipeDimensionY);
        context.drawImage(lowerPipe, pipe[i].x, pipe[i].y + constant, pipeDimensionX, pipeDimensionY * 2);

        pipe[i].x -= velocity;


        if (pipe[i].x == Math.floor(canvas.width - 250)) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeDimensionY) - pipeDimensionY
            });
        }

   
        if (pipe[i].x === 0 - pipeDimensionX) {
            pipe.shift()
        }


        if (bX + bird.width >= pipe[i].x &&     
            bX <= pipe[i].x + pipeDimensionX &&  
            (bY <= pipe[i].y + pipeDimensionY || 
                bY + bird.height >= pipe[i].y + constant) 
            ) {

            SFX_hit.play()
            gameState = 0
        } 
        else if (bY + bird.height >= canvas.height - floor.height) {
            SFX_die.play()
            gameState = 0
        }
        else if (bX + bird.width === pipe[i].x) {
            score += 1
            SFX_point.play()
        }

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

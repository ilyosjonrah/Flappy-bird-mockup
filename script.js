

// Get canvas
let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')





// Load images
const background = new Image()
let bird = new Image()
const floor = new Image()
const upperPipe = new Image()
const lowerPipe = new Image()

const birdImages = [
    './images/bird1.png',
    './images/bird2.png',
    './images/bird3.png',
    './images/bird2.png',
]

background.src = "./images/bg.png"
//bird.src = "./images/bird.png"
upperPipe.src = "./images/toppipe.png"
lowerPipe.src = "./images/bottompipe.png"
floor.src = "./images/fg.png"




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

let score = 0
let pipe = []
pipe[0] = {
    x: canvas.width,
    y: 0
}

let isKeyPressed = false


const moveBird = () => {

}

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

// Example usage after the image has loaded
/* rotateImage(context, img, 100, 100, 200, 200, Math.PI / 4); // Rotate by 45 degrees (Math.PI / 4 radians) */


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
document.addEventListener('keydown', () => {
    /* jumpAccel = 0 */
    isKeyPressed = true
    jumpPerFrame = 5
    if (!gameOver) {
        gameOver = true
        draw()
    }
    /* draw() */
    if (gameState === 2) {
        bY = canvas.height / 2
        gameState = 1
    }
    else if (gameState === 0) { // Gameover
        gameState = 2           // Return to Idle state
        location.reload(); // reload the page
    }
})

let jumpAccel = 0
let rotate = 0
let frames = 0  // Frames for bird animation wing flap
let birdJumpFrame = 0   // How many frames after input for bird to rotate down when falling
let birdIndex = 0
let idleInterval
window.onload = draw = () => {

    context.drawImage(background, 0, 0, canvas.width, canvas.height)


    if (frames % 50 == 0) {
        birdIndex += 1
        if (birdIndex === birdImages.length) {
            birdIndex = 0
        }
    }
    frames++

    console.log(gameState)
    if (gameState === 1) {
        clearInterval(idleInterval);
        playGame();
    } else if (gameState === 2) {
        /* if (!idleInterval) {
            idleInterval = setInterval(idleState, 10);
        } */
        idleState()
    }
    context.drawImage(floor, 0, canvas.height - floor.height, canvas.width, floor.height)


    console.log(gameState)
    if (gameState === 0) {
        return
    }
    else requestAnimationFrame(draw)

}

let idleFly = 0
let idleFlyDirection = 'up'
const idleState = () => {

    /* // Clear the entire canvas before redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the background and other static elements
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.drawImage(floor, 0, canvas.height - floor.height, canvas.width, floor.height); */
    console.log("Idle state called")
    if (frames % 20 == 0) {
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
        bY += 1;
        idleFly++;
    } else if (idleFlyDirection === 'down') {
        bY -= 1;
        idleFly--;
    }

    bird.src = birdImages[birdIndex]
    rotateImage(context, bird, bX, bY, birdDimensionX, birdDimensionY, rotate);
    /* draw() */
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

        // Collision
        // CodeExplainedRepo Github
        if (bX + bird.width >= pipe[i].x &&     // If bird X position and width is greater or equal to pipe X dimensions
            bX <= pipe[i].x + pipeDimensionX &&  // if bird X position is lesser than pipe X position + height
            (bY <= pipe[i].y + pipeDimensionY || // If bird is lower than pipe Y and its height
                bY + bird.height >= pipe[i].y + constant) || // OR if bird is greater than pipe + constnat
            bY + bird.height >= canvas.height - floor.height) {         // If floor


           /*  gameOver = false */
            console.log(gameState)
            gameState = 0
            //location.reload(); // reload the page

        }
        else if (bX + bird.width === pipe[i].x) {
            score += 1
        }
        // Remove pipes
        if (pipe[i].x === 0 - pipeDimensionX) {
            pipe.shift()
            console.log(pipe)
        }
        //score
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);


    }
}
const keys = {};
const canvas = document.querySelector("#gl-canvas");

//Priors for pausing and resuming
let priorX = 0;
let priorY = 0;

//Mouse click and drag / whether to animate while music is playing
let isMouseDown = false;
let isPlayingMusic = false;

//Rotations
let cubeRotation = 0.0;
let deltaTime = 0;
let XRotation = 0;
let YRotation = 0;
let ZRotation = 0;

//Translation (up down left right in out)
let cameraX = 0;
let cameraZ = 0;
let cameraY = 0;

let moveSpeed = 1;

canvas.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if(e.code === "Escape") { canvas.blur(); }
    if(e.code === "Space" || e.code === "ControlLeft") {e.preventDefault();}

    if(e.code === "KeyR")
    {
        cubeRotation = 0.0;
        XRotation = 0;
        YRotation = 0;
        ZRotation = 0;
        priorX = 0;
        priorY = 0;
        cameraX = 0;
        cameraY = 0;
        cameraZ = 0;
    }
});

canvas.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function updateCamera()
{
    if (keys["KeyW"]) {
        cameraX += Math.sin(YRotation) * moveSpeed;
        cameraZ -= Math.cos(YRotation) * moveSpeed;
    }

    if (keys["KeyS"]) {
        cameraX -= Math.sin(YRotation) * moveSpeed;
        cameraZ += Math.cos(YRotation) * moveSpeed;
    }

    if (keys["KeyA"]) {
        cameraX -= Math.cos(YRotation) * moveSpeed;
        cameraZ -= Math.sin(YRotation) * moveSpeed;
    }

    if (keys["KeyD"]) {
        cameraX += Math.cos(YRotation) * moveSpeed;
        cameraZ += Math.sin(YRotation) * moveSpeed;
    }

    if (keys["Space"]) {
        cameraY += moveSpeed;
    }

    if (keys["ControlLeft"]) {
        cameraY -= moveSpeed;
    }
}
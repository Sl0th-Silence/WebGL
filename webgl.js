import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

// = = = = = = = = = V A R I A B L E S = = = = = = = = = //
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

let moveSpeed = .2;
// = = = = = = = = = E N D   V A R I A B L E S = = = = = = = = = //
// = = = = = = = = = I N P U T S  &  A C T I O N S = = = = = = = = = //
// WASD inputs loop check //
canvas.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if(e.code === "Escape") { canvas.blur(); }
    if(e.code === "Space" || e.code === "ControlLeft") {e.preventDefault();}

    if(e.code === "KeyR")
    {
        canvas.blur();
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
// END WASD inputs loop check //


//On play, pause music and restart from HTML
window.onPlayMusic = function () 
{
    isPlayingMusic = true;
}
window.onPauseMusic = function () 
{
    isPlayingMusic = false;
}
//Also resets cube location to 0,0,0
window.onRestartMusic = function ()
{
    isPlayingMusic = true;

    cubeRotation = 0.0;

    XRotation = 0;
    YRotation = 0;
    ZRotation = 0;

    priorX = 0;
    priorY = 0;

    cameraY = 0;
}

//Zoom in and out
window.zoomIn = function ()
{
    cameraY++;
}

window.zoomOut = function () 
{
    cameraY--;
}
// = = = = = = = = = E N D  I N P U T S  &  A C T I O N S = = = = = = = = = //





main();





// = = = = = = = = = M A I N = = = = = = = = = //
function main()
{
    updateCamera();
    const canvas = document.querySelector("#gl-canvas");
    //Init gl context
    const gl = canvas.getContext("webgl");

    //Validate
    if (gl == null)
    {
        alert(
            "Unable to init WebGL."
        );
        return;
    }

    //Event Listeners
    canvas.addEventListener("pointermove", mouseMove, false);
    canvas.addEventListener("pointerdown", mouseDown, false);
    canvas.addEventListener("pointerup", mouseUp, false);

    //Mouse click
    function mouseDown(event)
    {
        canvas.focus();
        isMouseDown = true;
        priorX = event.clientX;
        priorY = event.clientY;
    }

    function mouseUp()
    {
        isMouseDown = false;
    }

    //x and y is a little bass awkwards
    function mouseMove(event)
    {
        if(document.activeElement !== canvas)
        {
            return;
        }
        const deltaX = event.clientX - priorX;
        const deltaY = event.clientY - priorY;

        XRotation -= deltaY * 0.01;
        YRotation += deltaX * 0.01;

        priorX = event.clientX;
        priorY = event.clientY;
    }

    //Vertex Shader 
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;

            //Lighting

            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `;

    //Fragment Shader
    const fsSource = `
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform sampler2D uSampler;

        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
    `;

    //Initialize shader prog
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //grab info needed for shader prog
    //look up which attribute our shader prog is using
    //for aVertexPosition and look up uniform locations
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram,
                "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram,
                "aVertexNormal"),
            textureCoord: gl.getAttribLocation(shaderProgram,
                "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram,
            "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram,
            "uModelViewMatrix"),
        normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
        },
    };

    //Set color black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //clear buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    const buffers = initBuffers(gl);

    //Texture loading
    const texture = loadTexture(gl, "companionCube.png");

    let then = 0;


    //draw repeatedly
    //THIS IS THE MAIN GAME LOOP//
    function render(now)
    {   
        updateCamera();
        now *= 0.001; //convert to seconds 
        then = now;

        drawScene(
            gl, 
            programInfo, 
            buffers, 
            texture, 
            XRotation,          //Current rotation on X
            YRotation,          //Current rotation on Y
            ZRotation,          //Current rotation on Z
            cameraY,            //Move in out
            cameraX,            //Move left right
            cameraZ,            //Move up down
        );

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}    

//Initialize a shader program
function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //Shader prog
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

  // validate
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}


//Create shader of given type, uploads and compiles
function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);

    //Send source to shader
    gl.shaderSource(shader, source);

    //compile
    gl.compileShader(shader);

    //Validate
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
        {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
        }

  return shader;
}

//Initialize a texture and load an image
function loadTexture(gl, url)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //when using online textures, assign a pixel while we wait for image
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); //blue

    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );

        //Check for power of 2 in both dimensions for WEBGL1
        if(isPowerOf2(image.width) && isPowerOf2(image.height)) 
        {
            //Generate mips
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else 
        {
            //turn off mips and set wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };

    image.src = url;

    return texture;
}

function isPowerOf2(value)
{
    return(value & (value - 1)) === 0;
}
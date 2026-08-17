main();

function main()
{
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

    //Vertext Shader 
    const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
            gl_position = uProjectionMatrix * uModelViewMatrix *
                aVertexPosition;
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
        },
        uniformLocations: {
            projectMatrix: gl.getUniformLocation(shaderProgram,
            "uProjectionMatrix"),
         modelViewMatrix: gl.getUniformLocation(shaderProgram,
            "uModelViewMatrix"),
        },
    };

    //Fragment Shader
    const fsSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    //Set color black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //clear buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
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
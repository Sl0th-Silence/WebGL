
function initBuffers(gl)
{
    const positionBuffer = initPositionBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);
    const textureBuffer = initTextureBuffer(gl);
    const normalBuffer = initNormalBuffer(gl);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        indices: indexBuffer,
        texture: textureBuffer,
    };
}

function initPositionBuffer(gl)
{
    //Create buffer for square pos
    const positionBuffer = gl.createBuffer();

    //Select buffer as one to apply
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Array of positions for the floor
    //Counter clockwise starting at bottom left (perspective can alter this)
    const positions = 
    [// Front face
    -10.0, -1.0, 1.0, 10.0, -1.0, 1.0, 10.0, 1.0, 1.0, -10.0, 1.0, 1.0,

    // Back face
    -10.0, -1.0, -80.0, -10.0, 1.0, -80.0, 10.0, 1.0, -80.0, 10.0, -1.0, -80.0,

    // Top face
    -10.0, 1.0, -80.0, -10.0, 1.0, 1.0, 10.0, 1.0, 1.0, 10.0, 1.0, -80.0,

    // Bottom face
    -10.0, -1.0, -80.0, -10.0, -1.0, 1.0, 10.0, -1.0, 1.0, 10.0, -1.0, -80.0,

    // Right face
    10.0, -1.0, -80.0, 10.0, 1.0, -80.0, 10.0, 1.0, 1.0, 10.0, -1.0, 1.0,

    // Left face
    -10.0, -1.0, -80.0, -10.0, 1.0, -80.0, -10.0, 1.0, 1.0, -10.0, -1.0, 1.0,
    ];

    //pass list to WebGL to build shape
    //Create float32array from the array and use to fill buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
        gl.STATIC_DRAW);

    return positionBuffer;

}

function initTextureBuffer(gl) {
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW,
  );

  return textureCoordBuffer;
}

function initIndexBuffer(gl)
{
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // array defines each face at 2 triangles, using the indices into the vertex array
    // to specify each triangles position

    const indices = [
     0,  1,  2,      0,  2,  3,    // front
     4,  5,  6,      4,  6,  7,    // back
     8,  9,  10,     8,  10, 11,   // top
     12, 13, 14,     12, 14, 15,   // bottom
     16, 17, 18,     16, 18, 19,   // right
     20, 21, 22,     20, 22, 23,   // left
    ];

    //Send to GL
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}

function initNormalBuffer(gl)
{
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const vertexNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW,
  );

  return normalBuffer;
}

export {initBuffers};
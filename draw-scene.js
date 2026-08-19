function drawScene(gl, programInfo, buffers, texture, cubeRotation, XRotation, YRotation, ZRotation, distanceFromCamera)
{
    //Clear to black with alpha of 1
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    //Clear everything, enable depth testing and near obscures far
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //Clear before drawing

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * (Math.PI / 180); //45 degrees in radians. The formula is ' Radians = degrees * (Math.PI / 180) '
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glMatrix always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    //Set drawing pos to the identity point, (center of screen)
    const modelViewMatrix = mat4.create();

    //move drawing pos a bit to where we start drawing square
    mat4.translate(
        modelViewMatrix, //Destination
        modelViewMatrix, //matrix to be translated
        [-0.0, 0.0, distanceFromCamera], //Amount to translate
    );

    //Rotate the cube!
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1],
        ); // axis to rotate around (Z)

    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        YRotation, // amount to rotate in radians
        [0, 1, 0],
        ); // axis to rotate around (Y)

    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        XRotation, // amount to rotate in radians
        [1, 0, 0],
        ); // axis to rotate around (X)

        //update code that builds uniform matrices to generate and give the shader a normal matrix
        //which is used to transform the normals appropriately to the orientation to the light souce
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);
    //Use colors!
    //setColorAttribute(gl, buffers, programInfo);
    //Texures
    setTextureAttribute(gl, buffers, programInfo);

    //Tell which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    //Setnormals
    setNormalAttribute(gl, buffers, programInfo);
    //Tell webGL to use our prog when drawing
    gl.useProgram(programInfo.program);

    //Set shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix,
    );
    
    //Tell webgl we want to affect tex unit 0
    gl.activeTexture(gl.TEXTURE0);
    //bind tex to tex0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //Tell shader what we did
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo)
{
    const numComponents = 3; //pull out 2 values per iteration
    const type = gl.FLOAT; //the data in the buffer is 32bit floats
    const normalize = false; 
    const stride = 0; //how many bytes to get from one set of values to the next. 0 = use type and numComponents above
    const offset = 0; // how many bytes inside buffer to start from

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo)
{
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setTextureAttribute(gl, buffers, programInfo)
{
    const num = 2; //coords
    const type = gl.FLOAT; //data is 32-bit float
    const normalize = false; 
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

//How to pull out the normals from the buffer into the vertexNormal attribute
function setNormalAttribute(gl, buffers, programInfo)
{
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
export {drawScene};
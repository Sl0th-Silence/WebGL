function initBuffers(gl)
{

    return {
        position: positionBuffer,
    };
}

function initPositionBuffer(gl)
{
    //Create buffer for square pos
    const positionBuffer = gl.createBuffer();

    //Select buffer as one to apply
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Array of positions for square
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    //pass list to WebGL to build shape
    //Create float32array from the array and use to fill buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
        gl.STATIC_DRAW);
    
    return positionBuffer;

}

export {initBuffers};
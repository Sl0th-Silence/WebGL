import { useEffect, useRef } from "react";

export default function WebGLCanvas()
{
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
        {
            return;
        }

        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (!gl)
        {
            console.error("WebGL didn't work. ");
            return;
        }
    })

    return <canvas ref={canvasRef} width={600} height={400} />
}
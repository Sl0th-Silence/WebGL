import { useEffect, useRef } from "react";
import { initWebGL } from "../../WebGL/webgl";

export default function WebGLCanvas({header})
{
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
        {
            return;
        }

        console.log(canvas)
        const gl = initWebGL(canvas);
        if (!gl)
        {
            console.error("WebGL didn't work. ");
            return;
        }

        return () => {
            gl?.destroy?.();
        };
    }, []);

    return <div id="main_page">
        {header}
        <canvas
        ref={canvasRef} 
        width={1000} 
        height={600}
        style={{borderRadius: "20px", border: "3px solid grey"}}
        />
        <ul id="webgl-about-list">
        <li>Click screen above to focus and allow input.</li>
        <li>Press Esc to exit focus.</li>
        <br />
        <li>WASD to move around and Mouse to look.</li>
        <li>Space bar to go up and Left Ctrl to go down.</li>
        </ul>
    </div>
}
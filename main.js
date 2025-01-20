/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#view");
const gl = canvas.getContext("webgl2");
if (gl === null) {
    throw new Error("WebGL2 is not supported by this browser.");
}

const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

const vs = compile_shader(vsSource, gl.VERTEX_SHADER);
const fs = compile_shader(fsSource, gl.FRAGMENT_SHADER);

gl.clearColor(...hex_to_rgbaf("#181818FF"));
gl.clear(gl.COLOR_BUFFER_BIT);

function compile_shader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("Failed to compile shader.");
    }
    return shader;
}

/**
* Convers HEX color to RGBA float[] (0.0 to 1.0)
* @param {string} hex 
*/
function hex_to_rgbaf(hex) {
    if (hex.indexOf("#") == 0){
        hex = hex.substring(1, 9);
    }
    return [
        +Math.max(0, Math.min(1, parseInt(hex.substring(0, 2), 16) / 255)).toFixed(1),
        +Math.max(0, Math.min(1, parseInt(hex.substring(2, 4), 16) / 255)).toFixed(1),
        +Math.max(0, Math.min(1, parseInt(hex.substring(4, 6), 16) / 255)).toFixed(1),
        +Math.max(0, Math.min(1, parseInt(hex.substring(6, 8), 16) / 255)).toFixed(1),
    ];
}

/**
* Convers HEX color to RGBA number[] (0 to 255).
* @param {string} hex 
*/
function hex_to_rgbai(hex) {
    if (hex.indexOf("#") == 0){
        hex = hex.substring(1, 9);
    }
    return [
        Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(6, 8), 16))),
    ];
}

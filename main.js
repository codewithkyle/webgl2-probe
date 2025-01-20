import { compile_shader, hex_to_rgbaf, link_program, make_array_buffer } from "./utils.js";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#view");
const gl = canvas.getContext("webgl2");
if (gl === null) {
    throw new Error("WebGL2 is not supported by this browser.");
}

const vsSource = `
    attribute vec4 aVertexPosition;

    void main() {
        gl_Position = aVertexPosition;
    }
`;

const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

const vs = compile_shader(gl, vsSource, gl.VERTEX_SHADER);
const fs = compile_shader(gl, fsSource, gl.FRAGMENT_SHADER);
const program = link_program(gl, vs, fs);
const buffer = make_array_buffer(gl, gl.STATIC_DRAW, new Float32Array([
    -0.5, 0.5,
    0.5, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
]));

/**
* @param {WebGLProgram} program 
* @param {WebGLBuffer} buffer 
*/
function draw_scene(program, buffer) {
    gl.clearColor(...hex_to_rgbaf("#00FF00FF"));
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    {
        const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get form one set of values to the next. 0 = use type and numComponents
        const offset = 0; // how many bytes to offset from buffer start
        gl.vertexAttribPointer(
            vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        gl.enableVertexAttribArray(program, vertexPosition);
    }

    gl.useProgram(program);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}
draw_scene(program, buffer);

import { Program } from "./program.js";
import { compile_shader, hex_to_rgbaf, make_array_buffer } from "./utils.js";

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
    precision highp float;

    #define BACKGROUND_COLOR vec4(0.0, 0.0, 0.0, 1.0)
    #define FOREGROUND_COLOR vec4(1.0, 1.0, 0.0, 1.0)

    uniform vec2 size;
    uniform vec2 pos;
    uniform float blur;

    bool rect_contains_point(vec2 point, vec2 pos, vec2 size)
    {
        return pos.x <= point.x && point.x < pos.x + size.x 
            && pos.y <= point.y && point.y < pos.y + size.y;
    }

    void main() {
        vec2 point = gl_FragCoord.xy;

        if (rect_contains_point(point, pos, size))
        {
            gl_FragColor = FOREGROUND_COLOR;
        }
        else
        {
            float edge = blur;

            if (pos.x <= point.x && point.x < pos.x + size.x) {
                edge = min(abs(point.y - pos.y),
                            abs(point.y - (pos.y + size.y)));
            } else if (pos.y <= point.y && point.y < pos.y + size.y) {
                edge = min(abs(point.x - pos.x),
                            abs(point.x - (pos.x + size.x)));
            } else {
                edge = min(edge, length(point - (pos + size * vec2(0.0, 0.0))));
                edge = min(edge, length(point - (pos + size * vec2(1.0, 0.0))));
                edge = min(edge, length(point - (pos + size * vec2(0.0, 1.0))));
                edge = min(edge, length(point - (pos + size * vec2(1.0, 1.0))));
            }

            if (edge < blur) {
                gl_FragColor = mix(
                    FOREGROUND_COLOR,
                    BACKGROUND_COLOR,
                    smoothstep(0.0, blur, edge)
                );
            } else {
                gl_FragColor = BACKGROUND_COLOR;
            }
        }
    }
`;

const vs = compile_shader(gl, vsSource, gl.VERTEX_SHADER);
const fs = compile_shader(gl, fsSource, gl.FRAGMENT_SHADER);
const main = new Program(gl, vs, fs, ["size", "pos", "blur"]);
const buffer = make_array_buffer(gl, gl.STATIC_DRAW, new Float32Array([
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
]));

let pos = {
    x: 10.0,
    y: 10.0,
};
let velocity = {
    x: -200.0,
    y: -200.0,
};
const width = 100.0;
const height = 100.0;
let blur = 0;

let prevTimestamp = undefined;
function next_frame(timestamp) {
    const dt = (timestamp - prevTimestamp) * 0.001;
    prevTimestamp = timestamp;

    pos.x -= velocity.x * dt;
    pos.y -= velocity.y * dt;
    blur = Math.max(0.0, blur - (200 * dt));

    if (pos.x < 0) {
        velocity.x = -velocity.x;
        blur += 50;
        pos.x = 0;
    }
    else if (pos.x + width > 800.0) {
        pos.x = 800 - width;
        blur += 50;
        velocity.x = -velocity.x;
    }
    if (pos.y < 0) {
        velocity.y = -velocity.y;
        blur += 50;
        pos.y = 0;
    } else if (pos.y + height > 600.0) {
        velocity.y = -velocity.y;
        blur += 50;
        pos.y = 600 - height;
    }

    draw_scene(main, buffer);

    window.requestAnimationFrame(next_frame);
}
function first_frame(timestamp) {
    prevTimestamp = timestamp;
    window.requestAnimationFrame(next_frame);
}
window.requestAnimationFrame(first_frame);

/**
* @param {Program} program 
* @param {WebGLBuffer} buffer 
*/
function draw_scene(program, buffer) {
    gl.clearColor(...hex_to_rgbaf("#FF0000FF"));
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    {
        const vertexPosition = gl.getAttribLocation(program.program, 'aVertexPosition');
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
        gl.enableVertexAttribArray(program.program, vertexPosition);
    }

    gl.useProgram(program.program);
    gl.uniform2f(program.uniforms['size'], width, height);
    gl.uniform2f(program.uniforms['pos'], pos.x, pos.y);
    gl.uniform1f(program.uniforms['blur'], blur);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

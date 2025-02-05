/**
* @param {WebGL2RenderingContext} gl
* @param {WebGLShader} type 
*/
export function shader_type_to_string(gl, type) {
    switch(type) {
        case gl.FRAGMENT_SHADER:
            return "FRAGMENT_SHADER";
        case gl.VERTEX_SHADER:
            return "VERTEX_SHADER";
        default:
            return "UNKNOWN";
    }
}

/**
* @param {WebGL2RenderingContext} gl
* @param {WebGL2RenderingContextBase} usage 
* @param {Float32Array} positions 
* @returns {WebGLBuffer}
* @example make_array_buffer(gl, gl.STATIC_DRAW, new Float32Array([
*   -1.0,  1.0,
*   1.0,  1.0,
*   -1.0, -1.0,
*   1.0,  -1.0,
*]));
*/
export function make_array_buffer(gl, usage, positions){
    const result = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, result);
    gl.bufferData(gl.ARRAY_BUFFER, positions, usage);
    return result;
}

/**
* @param {WebGL2RenderingContext} gl
* @param {WebGLShader} vsShader 
* @param {WebGLShader} fsShader 
* @returns {WebGLProgram}
* @throws Error
*/
export function link_program(gl, vsShader, fsShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vsShader);
    gl.attachShader(program, fsShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        throw new Error("Linking program has failed");
    }
    return program;
}

/**
* @param {WebGL2RenderingContext} gl
* @param {string} source
* @param {number} type
* @example compile_shader(src, gl.VERTEX_SHADER);
* @throws Error
*/
export function compile_shader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        const shaderType = shader_type_to_string(shader);
        gl.deleteShader(shader);
        throw new Error(`Failed to compile ${shaderType} shader.`);
    }
    return shader;
}

/**
* Convers HEX color to RGBA float[] (0.0 to 1.0)
* @param {string} hex 
* @throws Error
*/
export function hex_to_rgbaf(hex) {
    if (hex.indexOf("#") == 0){
        hex = hex.substring(1, 9);
    }
    if (hex.length < 8) {
        throw new Error("Malformed HEX color provided.");
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
* @throws Error
*/
export function hex_to_rgbai(hex) {
    if (hex.indexOf("#") == 0){
        hex = hex.substring(1, 9);
    }
    if (hex.length < 8) {
        throw new Error("Malformed HEX color provided.");
    }
    return [
        Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16))),
        Math.max(0, Math.min(255, parseInt(hex.substring(6, 8), 16))),
    ];
}

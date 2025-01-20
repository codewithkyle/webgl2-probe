/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#view");
const gl = canvas.getContext("webgl2");
if (gl === null) {
    throw new Error("WebGL2 is not supported by this browser.");
}

gl.clearColor(...hex_to_rgbaf("#181818FF"));
gl.clear(gl.COLOR_BUFFER_BIT);

/**
* Convers HEX color to RGBA array of floats 0.0 to 1.0
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
* Convers HEX color to RGBA array of ints.
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

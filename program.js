import { link_program } from "./utils.js";

export class Program {
    /**
    * @param {WebGLRenderingContext} gl 
    * @param {WebGLShader} vs 
    * @param {WebGLShader} fs
    * @param {string[]} uniforms 
    */
    constructor(gl, vs, fs, uniforms){
        this.gl = gl;
        this.program = link_program(this.gl, vs, fs);
        this.uniforms = {};
        uniforms.forEach(name => {
            this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
        });
    }
}

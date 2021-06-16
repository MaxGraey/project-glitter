import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { Object3D } from "./Object3D";
import { ShaderMaterial } from "./ShaderMaterial";
import { float32ArrayFromArray, float32ArrayToStatic32Array } from "./Utilities";

const vertexShaderCode: string = `
    precision highp float;
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vColor;

    void  main() {
        vColor = color;
        gl_Position = vec4( position, 0.0, 1.0 );
    }
`;

const fragmentShaderCode: string = `
    precision highp float;
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

export class TestTriangle extends Object3D {
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        const pos = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
        const positions = float32ArrayFromArray(pos);

        const clrs = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
        const colors = float32ArrayFromArray(clrs);

        this._geometry = new BufferGeometry(this.gl);
        this._geometry.setAttribute("position", new BufferAttribute(positions, 2, false));
        this._geometry.setAttribute("color", new BufferAttribute(colors, 3, false));
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        this._todo_TurnThisIntoMeshRender();
    }

    private _todo_TurnThisIntoMeshRender(): void {
        const gl = this.gl;
        const geometry = this._geometry;
        const material = this._shaderMaterial;
        const attributes = geometry.attributes;

        for (let i = 0; i < attributes.length; i++) {
            const attribName = attributes[i];
            const attribute = geometry.getAttribute(attribName);
            if (!attribute) return;

            const buffer = geometry.getBuffer(attribName);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            const itemSize = attribute.itemSize;
            const normalized = attribute.normalized;
            const stride = 0;
            const offset = 0;
            const loc = material.getAttributeLocation(attribName);

            gl.vertexAttribPointer(loc, itemSize, gl.FLOAT, +normalized, stride, offset);
            gl.enableVertexAttribArray(loc);
        }

        this._shaderMaterial.activate();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }
}

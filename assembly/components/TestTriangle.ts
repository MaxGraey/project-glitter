import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { Mesh } from "./Mesh";
import { ShaderMaterial } from "./ShaderMaterial";
import { Texture } from "./Texture";
import { float32ArrayFromArray } from "./Utilities";

const vertexShaderCode: string = `
    precision highp float;

    attribute vec2 position;
    attribute vec2 texCoord;
    attribute vec3 color;

    varying vec3 vColor;
    varying highp vec2 vTexCoord;

    void  main() {
        vColor = color;
        vTexCoord = texCoord;
        gl_Position = vec4( position, 0.0, 1.0 );
    }
`;

const fragmentShaderCode: string = `
    precision highp float;

    uniform float uAlpha;
    uniform sampler2D uSampler;

    varying vec3 vColor;
    varying highp vec2 vTexCoord;

    void main() {
        vec4 color = texture2D(uSampler, vTexCoord);
        gl_FragColor = color; // vec4(color.xyz * vColor, color.a * uAlpha);
    }
`;

export class TestTriangle {
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;
    private readonly _texture: Texture;
    private readonly _triangleMesh: Mesh;

    constructor(gl: WebGLRenderingContext) {
        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        this._shaderMaterial.activate();
        this._shaderMaterial.setUniform1f("uAlpha", 0.98);
        this._shaderMaterial.setUniform1i("uSampler", 0);

        this._texture = new Texture(gl);
        this._texture.load("test.png");

        const d = 0.5;
        const pos = [-d, d, -d, -d, d, d, d, d, -d, -d, d, -d];
        const positions = float32ArrayFromArray(pos);

        const texCoord = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
        const texCoords = float32ArrayFromArray(texCoord);

        const clrs = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        const colors = float32ArrayFromArray(clrs);

        this._geometry = new BufferGeometry(gl);
        this._geometry.setAttribute("position", new BufferAttribute(positions, 2, false));
        this._geometry.setAttribute("texCoord", new BufferAttribute(texCoords, 2, false));
        this._geometry.setAttribute("color", new BufferAttribute(colors, 3, false));

        this._triangleMesh = new Mesh(gl, this._geometry, this._shaderMaterial);
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        if (this._triangleMesh) {
            this._texture.activate(0);
            this._shaderMaterial.activate();
            this._shaderMaterial.setUniform1i("uSampler", 0);

            this._triangleMesh.render();
        }
    }
}

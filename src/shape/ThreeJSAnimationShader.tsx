import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import useThemeContext from "@theme/hooks/useThemeContext";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

// const CAMERA_FACTOR = 60;
const CAMERA_FACTOR = 180;
const TIME_DILATION = 1 / 3;
const BRIGHT = true;
const DISPLACEMENT_RADIO = 1.0 / 9.0;
const SPHERE_RADIUS = 15;

type SceneState = {
    renderer: THREE.WebGLRenderer,
    camera: THREE.OrthographicCamera,
    scene: THREE.Scene,
    geometry: THREE.BufferGeometry,
    material: THREE.MeshStandardMaterial,
    mesh: THREE.Mesh,
}

type AnimationProps = {
}

export function ThreeJSAnimationShader({  }: AnimationProps) {

    const [scroll, setScroll] = useState(typeof window !== "undefined"
        ? window?.pageYOffset
        : 0);

    useEffect(() => {
        const listener = () => {
            if (typeof window !== "undefined")
                setScroll(window?.pageYOffset ?? 0);
        };
        if (typeof window !== "undefined")
            window.addEventListener("scroll", listener);
        return () => {
            if (typeof window !== "undefined")
                window.removeEventListener("scroll", listener);
        };
    }, []);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sceneStateRef = useRef<SceneState | null>(null);
    const clockRef = useRef<THREE.Clock>(new THREE.Clock());
    const requestRef = useRef<number>(-1);

    const { isDarkTheme } = useThemeContext();
    const wireframe = isDarkTheme;

    // useEffect(() => {
    //     yDisplacement.current = getDisplacement();
    // }, [scroll, size.height]);

    useEffect(() => {
        if (sceneStateRef.current)
            sceneStateRef.current.material.wireframe = wireframe;
    }, [wireframe]);

    function buildDayGeometry() {

        const geometry = new THREE.SphereBufferGeometry(SPHERE_RADIUS,
            25,
            60,
            Math.PI / 4 - .5,
            Math.PI,
            Math.PI / 2 + .2,
            Math.PI
        );
        return geometry;
    }

    function buildNightGeometry() {

        const vertices: { pos: number[], norm: number[], uv: number[] }[] = [];

        const dodecahedron = new THREE.DodecahedronGeometry(SPHERE_RADIUS, 16);

        console.log("dodecahedron vertices count", dodecahedron.attributes.position.array.length);

        for (let i = 0; i < dodecahedron.attributes.position.count; i++) {
            const x = dodecahedron.attributes.position.array[i * 3];
            const y = dodecahedron.attributes.position.array[i * 3 + 1];
            const z = dodecahedron.attributes.position.array[i * 3 + 2];
            // if (i < 1000) {
            //     console.log(y);
            //
            // }
            // if (y < 0) {
            const pos = [
                x,
                y,
                z
            ];
            const norm = [
                dodecahedron.attributes.normal.array[i * 3],
                dodecahedron.attributes.normal.array[i * 3 + 1],
                dodecahedron.attributes.normal.array[i * 3 + 2]
            ];
            const uv = [
                dodecahedron.attributes.uv.array[i * 2],
                dodecahedron.attributes.uv.array[i * 2 + 1]
            ];
            vertices.push({ pos, norm, uv });

            // }
        }

        const positions: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        // geometry.setAttribute(
        //     "normal",
        //     new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        // geometry.setAttribute(
        //     "uv",
        //     new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

        // geometry.computeVertexNormals();

        console.log("geometry vertices count", geometry.attributes.position.array.length);
        const merged = BufferGeometryUtils.mergeVertices(geometry);
        merged.computeVertexNormals();
        console.log("merged vertices count", merged.attributes.position.array.length);

        return merged;
    }


    function initScene(ref: HTMLCanvasElement, width: number, height: number): SceneState {

        console.log("initScene");
        const renderer = new THREE.WebGLRenderer({
            // antialias: true,
            alpha: true,
            canvas: ref
        });

        // renderer.setClearColor(0xffffff);
        renderer.setSize(width, height);
        if (typeof window !== "undefined")
            renderer.setPixelRatio(window?.devicePixelRatio > 1 ? 1.5 : 1);

        const scene = new THREE.Scene();
        // const geometry = isDarkTheme ? buildNightGeometry() : buildDayGeometry();
        const geometry = buildNightGeometry();

        const red = new THREE.Color(1.0, .0, .0);
        const magenta = new THREE.Color(.97, .34, .45);
        const cyan = new THREE.Color(.53, .96, 1.);
        const blue = new THREE.Color(.46, .32, .87);
        const yellow = new THREE.Color(1., .69, .0);
        const black = new THREE.Color(.0, .0, .0);
        const white = new THREE.Color(1.0, 1.0, 1.0);

        const layers: any[] = [];
        layers.push({
            is_active: 1,
            color: cyan,
            sin: new THREE.Vector3(1, 0, 0),
            cos: new THREE.Vector3(0, 0, 0),
            time_dilation: new THREE.Vector3(.8, .7, .7),
            coef: new THREE.Vector3(1, 0, 0),
            constant: new THREE.Vector3(0, -1, 1)
        });
        layers.push({
            is_active: 1,
            color: yellow,
            sin: new THREE.Vector3(1, 0, 0),
            cos: new THREE.Vector3(0, 0, 0),
            time_dilation: new THREE.Vector3(1, 1, 1),
            coef: new THREE.Vector3(1, 0, 0),
            constant: new THREE.Vector3(0, -.9, 0)
        });

        layers.push({
            is_active: 1,
            color: cyan,
            sin: new THREE.Vector3(1, 0, 0),
            cos: new THREE.Vector3(0, 0, 0),
            time_dilation: new THREE.Vector3(.9, 1, 1),
            coef: new THREE.Vector3(-1, 0, 0),
            constant: new THREE.Vector3(0, -1, .2)
        });
        layers.push({
            is_active: 1,
            color: blue,
            sin: new THREE.Vector3(1, 0, 0),
            cos: new THREE.Vector3(0, 0, 0),
            time_dilation: new THREE.Vector3(1.1, 1, 1),
            coef: new THREE.Vector3(1, 0, 0),
            constant: new THREE.Vector3(0, -1, -.2)
        });
        layers.push({
            is_active: 1,
            color: blue,
            sin: new THREE.Vector3(1, 0, 0),
            cos: new THREE.Vector3(0, 0, 0),
            time_dilation: new THREE.Vector3(.7, 1, 1),
            coef: new THREE.Vector3(.3, 0, .3),
            constant: new THREE.Vector3(0, -.8, .2)
        });


        layers.push({
            is_active: 1,
            color: magenta,
            sin: new THREE.Vector3(0, 1, 0),
            cos: new THREE.Vector3(1, 0, 0),
            time_dilation: new THREE.Vector3(.3, .8, 1),
            coef: new THREE.Vector3(.3, 1, -.3),
            constant: new THREE.Vector3(0, -.7, .5)
        });

        layers.push({
            is_active: 1,
            color: blue,
            sin: new THREE.Vector3(1, 1, 0),
            cos: new THREE.Vector3(0, 0, 1),
            time_dilation: new THREE.Vector3(.7, .6, 1),
            coef: new THREE.Vector3(.3, .3, .7),
            constant: new THREE.Vector3(0, -.8, -.3)
        });

        layers.push({
            is_active: 1,
            color: blue,
            sin: new THREE.Vector3(1, 1, 0),
            cos: new THREE.Vector3(0, 0, 1),
            time_dilation: new THREE.Vector3(.7, .6, 1),
            coef: new THREE.Vector3(-.4, .8, .5),
            constant: new THREE.Vector3(0, -.8, 0)
        });

        layers.push({
            is_active: 1,
            color: blue,
            sin: new THREE.Vector3(0, 0, 1),
            cos: new THREE.Vector3(0, 1, 1),
            time_dilation: new THREE.Vector3(.7, .4, .5),
            coef: new THREE.Vector3(.3, -.5, 1),
            constant: new THREE.Vector3(0, -.4, .5)
        });

        layers.push({
            is_active: 1,
            color: yellow,
            sin: new THREE.Vector3(0, 1, 1),
            cos: new THREE.Vector3(1, 0, 0),
            time_dilation: new THREE.Vector3(.8, .6, .8),
            coef: new THREE.Vector3(-.5, .8, .3),
            constant: new THREE.Vector3(-.1, -.5, .7)
        });

        layers.push({
            is_active: 1,
            color: magenta,
            sin: new THREE.Vector3(0, 1, 0),
            cos: new THREE.Vector3(1, 0, 1),
            time_dilation: new THREE.Vector3(.4, .6, 1.1),
            coef: new THREE.Vector3(.1, .8, .5),
            constant: new THREE.Vector3(0, -.5, .7)
        });

        const uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(width, height) },
            bright: { value: BRIGHT },
            u_sphere_radius: { value: SPHERE_RADIUS },
            u_displacement_ratio: { value: DISPLACEMENT_RADIO },
            u_base_color: { value: red },
            u_layers: { value: layers },
            u_layers_count: { value: layers.length }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: buildVertexShader(),
            fragmentShader: buildFragmentShader()
        });

        material.wireframe = wireframe;

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = .2;
        mesh.position.y = 14;

        // mesh.rotation.y = 3.14 / 2;
        scene.add(mesh);

        // BG plane
        const planeGeometry = new THREE.PlaneGeometry(100, 50);
        // const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.position.z = -50;
        // scene.add(plane);

        const left = width / -CAMERA_FACTOR;
        const right = width / CAMERA_FACTOR;
        const top = height / CAMERA_FACTOR;
        const bottom = height / -CAMERA_FACTOR;
        const near = 1;
        const far = 100;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.position.z = 50;

        return {
            renderer,
            camera,
            scene,
            geometry,
            material,
            mesh
        };
    }

    function updateSceneSize(state: SceneState, width: number, height: number) {
        state.renderer.setSize(width, height);
        state.camera.left = width / -CAMERA_FACTOR;
        state.camera.right = width / CAMERA_FACTOR;
        state.camera.top = height / CAMERA_FACTOR;
        state.camera.bottom = height / -CAMERA_FACTOR;
        state.camera.updateProjectionMatrix();
    }

    useEffect(() => {

        if (!canvasRef.current)
            return;

        const width = canvasRef.current.offsetWidth,
            height = canvasRef.current.offsetHeight;

        sceneStateRef.current = initScene(canvasRef.current, width, height);

        const {
            renderer,
            camera,
            scene,
            material
        } = sceneStateRef.current;

        //RENDER LOOP
        render();

        function render() {
            material.uniforms.u_time.value = clockRef.current.getElapsedTime() * TIME_DILATION;
            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(render);
        }

        return () => cancelAnimationFrame(requestRef.current);

    }, [canvasRef.current, wireframe]);

    useEffect(() => {
        function handleResize() {
            if (sceneStateRef.current && canvasRef.current) {
                const width = window.innerWidth,
                    height = window.innerHeight;
                canvasRef.current.width = width;
                updateSceneSize(sceneStateRef.current, width, height);
            }
        }
        handleResize();

        if (typeof window !== "undefined")
            window.addEventListener("resize", handleResize);
        return () => {
            if (typeof window !== "undefined")
                window.removeEventListener("resize", handleResize);
        };

    }, [window]);

    return <canvas
        style={{
            height: "100vh",
            maxHeight: "600px",
            width: "100vw",
            position: "fixed",
            top: `-${scroll / 2}px`,
            transform: `translateY(60px)`,
            zIndex: -10
        }}
        ref={canvasRef}
    />;

}

function buildVertexShader() {
    return `
    precision highp float;
    struct Layer {
        float is_active;
        vec3 color;
        vec3 sin;
        vec3 cos;
        vec3 time_dilation;
        vec3 coef;
        vec3 constant;
    };
    uniform float u_time;
    uniform int u_layers_count;
    uniform Layer u_layers[11];
    uniform vec2 u_resolution;
    uniform vec3 u_base_color;
    uniform float u_sphere_radius;
    uniform float u_displacement_ratio;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 v_position;
    varying vec3 v_color;
    varying float v_displacement_amount;
    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
    }
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
    float snoise(vec3 v)
    {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
      vec4 gx0 = ixy0 * (1.0 / 7.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
      vec4 gx1 = ixy1 * (1.0 / 7.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }
    // YUV to RGB matrix
    mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                        1.0, -0.39465, -0.58060,
                        1.0, 2.03211, 0.0);
    // RGB to YUV matrix
    mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
                        -0.09991, -0.33609, 0.43600,
                        0.615, -0.5586, -0.05639);
    vec3 blendNormal(vec3 base, vec3 blend) {
        return blend;
    }
    vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
        return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
    }
    vec3 getColor(){
        // vec3 black = vec3(.0,.0,.0);
        // vec3 white = vec3(1.0,1.0,1.0);
        float value1 = sin(u_time);
        vec3 st = v_position / u_sphere_radius * v_displacement_amount;
        vec3 color;
        vec3 color_0 = u_layers[0].color;
        color = u_base_color;
        color -= (1.0-st.z) / 3.0;
        for (int i = 0; i < 11; i++) {
            // if(u_layers[i].is_active == 1.0){
                vec3 nColor = u_layers[i].color;
                vec3 constant = u_layers[i].constant;
                float x = 0.0;
                if(u_layers[i].sin.x == 1.){
                    x = sin(u_time * u_layers[i].time_dilation.x);
                }
                if(u_layers[i].cos.x == 1.){
                    x = cos(u_time * u_layers[i].time_dilation.x);
                }
                x *= u_layers[i].coef.x;
                x += u_layers[i].constant.x;
                float y = 0.0;
                if(u_layers[i].sin.y == 1.){
                    y = sin(u_time * u_layers[i].time_dilation.y);
                }
                if(u_layers[i].cos.y == 1.){
                    y = cos(u_time * u_layers[i].time_dilation.y);
                }
                y *= u_layers[i].coef.y;
                y += u_layers[i].constant.y;
                float z = 0.0;
                if(u_layers[i].sin.z == 1.){
                    z = sin(u_time * u_layers[i].time_dilation.z);
                }
                if(u_layers[i].cos.z == 1.){
                    z = cos(u_time * u_layers[i].time_dilation.z);
                }
                z *= u_layers[i].coef.z;
                z += u_layers[i].constant.z;
                float amount =
                    pow(
                        smoothstep( 0.0, 1.0,
                            1.05 -
                            distance(st, normalize(vec3(x, y, z) ) ) )
                    , 5.0);
                color = blendNormal(color, nColor, amount);
            // }
        }
        return color;
    }
    void main() {
        vUv = uv;
        float s = 2.45;
        float r = u_time * 0.25;
        vNormal = normal;
        v_position = position;
        v_displacement_amount = cnoise(s * normal + r) * u_displacement_ratio + 1.0;
        // float s2 = 1.35;
        // float r2 = u_time * 0.15;
        // v_displacement_amount = snoise(s2 * normal + r2) * u_displacement_ratio + 1.0;
        vec3 newPosition = position * v_displacement_amount ;
        v_color = getColor();
        // v_color = czm_saturation(v_color, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }
`;
}

function buildFragmentShader() {
    return `
precision highp float;
uniform float u_time;
varying float v_displacement_amount;
varying vec3 v_position;
varying vec3 v_color;
vec3 czm_saturation(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
void main(){
    vec3 color = v_color;
    color.gb -=  (sin(v_position.z + v_displacement_amount) + sin(u_time)) * 0.05;
    color = czm_saturation(color, 1.2);
    gl_FragColor = vec4(color,1.0);
}
`;
}
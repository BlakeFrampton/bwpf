import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js"

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

initialiseLights();

//remove from here to...
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add( gridHelper);s
//...here for release versions. These are debugging tools

const controls = new OrbitControls(camera, renderer.domElement);


function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff})
    const star = new THREE.Mesh(geometry, material);

    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x,y,z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('Assets/Space Background 2.jpg');
spaceTexture.generateMipmaps = false;
spaceTexture.minFilter = THREE.LinearFilter;
spaceTexture.magFilter = THREE.LinearFilter;
spaceTexture.needsUpdate = true;

scene.background = spaceTexture;

const saturnParts = createSaturn();

const jsTexture = new THREE.TextureLoader().load('Assets/JavaScript.png');

const languageCube = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map:jsTexture})
);

scene.add(languageCube);

languageCube.position.z = 30;
languageCube.position.x = -10;

moveCamera();
animate();
document.body.onscroll = moveCamera;

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    languageCube.rotation.x += 0.02;
    languageCube.rotation.y += 0.01;
    languageCube.rotation.z += 0.02;

    saturnParts[0].rotation.y = t * 0.01;

    camera.position.z = 30 + t * -0.01;
    camera.position.x = t * 0.002;
    camera.position.y = t * -0.002;
}


function animate(){
    requestAnimationFrame(animate);

    saturnParts[0].rotation.y += 0.0003;

    controls.update();

    renderer.render(scene, camera);
}

function initialiseLights(){
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5 ,5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    pointLight.position.set(5, 5 ,5);
    scene.add(pointLight, ambientLight);

    //const lightHelper = new THREE.PointLightHelper(pointLight);//to be removed in release
    //scene.add(lightHelper);                                    //debugging tool
}



function createSaturn(){
    const saturnTexture = new THREE.TextureLoader().load('Assets/Saturn.jpg');
    const saturnNormal = new THREE.TextureLoader().load('Assets/Saturn Normal Map.jpg');
    
    const saturn = new THREE.Mesh(
        new THREE.SphereGeometry(3,32,32),
        new THREE.MeshStandardMaterial({
            map: saturnTexture,
            normalMap: saturnNormal
        })
    )

    const saturnRingTexture = new THREE.TextureLoader().load('Assets/Saturn Rings.png');
    const saturnRingTransparency = new THREE.TextureLoader().load('Assets/Saturn Ring Transparency.jpg');

    const geometry = new THREE.RingGeometry(5, 10, 32);
    const material = new THREE.ShaderMaterial({
    uniforms: {
        texture: {value: saturnRingTexture},
        alphaMap: {value: saturnRingTransparency},
        innerRadius: {value: 5},
        outerRadius: {value: 10}
    },
    vertexShader: `
    varying vec3 vPos;
    
    void main() {
      vPos = position;
      vec3 viewPosition = (modelViewMatrix * vec4(position, 1.)).xyz;
      gl_Position = projectionMatrix * vec4(viewPosition, 1.);
    }
  `,
  fragmentShader: `
    uniform sampler2D texture;
    uniform float innerRadius;
    uniform float outerRadius;

    varying vec3 vPos;

    vec4 color() {
        vec2 uv = vec2(0);
        uv.x = (length(vPos) - innerRadius) / (outerRadius - innerRadius);
        if (uv.x < 0.0 || uv.x > 1.0) {
            discard;
        }
    
        vec4 pixel = texture2D(texture, uv);
        return pixel;
    }

    void main() {
        gl_FragColor = color();
    }
    `,
    transparent: true
    });

const saturnRingsSide1 = new THREE.Mesh(geometry, material);
const saturnRingsSide2 = new THREE.Mesh(geometry, material);
saturnRingsSide1.rotation.x -= 2 * Math.PI / 3.6;
saturnRingsSide2.rotation.x -= 2 * Math.PI / 3.6;
saturn.rotation.x -= (2 * Math.PI / 3.6) - Math.PI / 2;
saturnRingsSide1.rotation.y += Math.PI / 8;
saturnRingsSide2.rotation.y += Math.PI / 8;
saturn.rotation.z -= Math.PI / 8

saturnRingsSide2.rotation.y += Math.PI; //side 2 should mirror side 1



scene.add(saturn, saturnRingsSide1, saturnRingsSide2);

return [saturn, saturnRingsSide1, saturnRingsSide2];
}
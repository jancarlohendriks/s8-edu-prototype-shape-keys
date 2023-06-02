import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import model from "@/assets/models/3.gltf?url";

let camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  5000
);
camera.position.set(900, 1200, 800);
camera.lookAt(new THREE.Vector3(0, 0, 0));

let scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

let createLights = () => {
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
  const light = new THREE.SpotLight("#fff7df", 3.5);
  light.position.set(960, 1740, 1250);
  light.castShadow = true;
  light.target.position.set(0, 0, 0);
  light.distance = 3000;
  light.shadow.mapSize.width = 2024;
  light.shadow.mapSize.height = 2024;
  light.shadow.camera.near = 2000;
  light.shadow.camera.far = 2000;
  scene.add(light, ambientLight);
};
createLights();

let animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

let loader = new GLTFLoader();
let object;
let gui = new dat.GUI();
let options = {
  Lenght: 0,
  Height: 0,
  Width: 0,
};

loader.load(model, (gltf) => {
  object = gltf.scenes[0].children[0];
  scene.add(object);
  console.log(object);

  let morphChange = () => {
    object.morphTargetInfluences[0] = options.Lenght;
    object.morphTargetInfluences[1] = options.Height;
    object.morphTargetInfluences[2] = options.Width;
  };

  gui.add(options, "Height", 0, 1).onChange(morphChange);
  gui.add(options, "Lenght", 0, 1).onChange(morphChange);
  gui.add(options, "Width", 0, 1).onChange(morphChange);
});

animate();

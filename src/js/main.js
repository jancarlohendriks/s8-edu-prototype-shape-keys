import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

import model from "@/assets/models/Humans-3.gltf?url";
import { ambientLight, spotLight } from "./lib/lights.js";
import createCamera from "./lib/camera.js";
import { createRenderer } from "./lib/renderer";

// Initialize variables
let camera, renderer, scene, controls, mixer, clock;
const guiControls = {
  speed: 1.0,
  "human_short_small-base": 0,
  "human_short_large-base": 0,
};

// Create the camera
camera = createCamera();

// Create the renderer
renderer = createRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the scene
scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");
scene.add(ambientLight, spotLight);

// Create the controls
controls = new OrbitControls(camera, renderer.domElement);

// Animate function
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer.update(delta * guiControls.speed);
  renderer.render(scene, camera);
}

// Load the GLTF file
const loader = new GLTFLoader();
loader.load(model, function (gltf) {
  const object = gltf.scene;
  const animations = gltf.animations;
  scene.add(object);

  // Create an animation mixer
  mixer = new THREE.AnimationMixer(object);
  animations.forEach((animation) => {
    const action = mixer.clipAction(animation);
    action.play();
  });

  // Create the clock
  clock = new THREE.Clock();

  // Find the human_regular object
  const human_regular = gltf.scene.children[0].children.find(
    (obj) => obj.name === "human_short_regular-base"
  );

  // Create the GUI
  createGUI(human_regular);

  // Start the animation
  animate();
});

// Create the GUI
function createGUI(obj) {
  const gui = new dat.GUI();

  const morphChange = () => {
    obj.morphTargetInfluences[0] = guiControls["human_short_small-base"];
    obj.morphTargetInfluences[1] = guiControls["human_short_large-base"];
  };

  gui.add(guiControls, "speed", 0.1, 2).step(0.1).name("Playback Speed");

  const weightFolder = gui.addFolder("Weight");
  weightFolder.open();
  weightFolder
    .add(guiControls, "human_short_small-base", 0, 1)
    .name("Thin")
    .onChange(morphChange);
  weightFolder
    .add(guiControls, "human_short_large-base", 0, 1)
    .name("Big")
    .onChange(morphChange);
}

// Update on window resize
window.addEventListener("resize", onWindowResize, false);
window.addEventListener("load", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import model from "@/assets/models/Humans-3.gltf?url";

let camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);
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
let gui = new dat.GUI();
let guiControls = {
  speed: 1.0,
  "human_short_small-base": 0,
  "human_short_large-base": 0,
};

// Load the GLTF file
loader.load(model, function (gltf) {
  const object = gltf.scene;
  const animations = gltf.animations;
  scene.add(object);

  // Create an animation mixer array
  const mixers = [];

  // Play all animations
  animations.forEach((animation) => {
    const mixer = new THREE.AnimationMixer(object);
    mixers.push(mixer);
    const action = mixer.clipAction(animation);
    action.play();
  });

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta * guiControls.speed);
    });

    renderer.render(scene, camera);
  }

  const clock = new THREE.Clock();

  let human_regular = gltf.scene.children[0].children.find(
    (obj) => obj.name == "human_short_regular-base"
  );

  let morphChange = () => {
    human_regular.morphTargetInfluences[0] =
      guiControls["human_short_small-base"];
    human_regular.morphTargetInfluences[1] =
      guiControls["human_short_large-base"];
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

  animate();
});

// UPDATE ON RESIZE
window.addEventListener("resize", onWindowResize, false);
window.addEventListener("load", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

import * as THREE from "three";

const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
const spotLight = new THREE.SpotLight("#fff7df", 3.5);
spotLight.position.set(960, 1740, 1250);
spotLight.castShadow = true;
spotLight.target.position.set(0, 0, 0);
spotLight.distance = 3000;
spotLight.shadow.mapSize.width = 2024;
spotLight.shadow.mapSize.height = 2024;
spotLight.shadow.camera.near = 2000;
spotLight.shadow.camera.far = 2000;

const lights = {
  ambientLight,
  spotLight,
};

export default lights;

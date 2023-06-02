import * as THREE from "three";

// Create and export the camera setup
export default function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
}

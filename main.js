import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

const scene = new three.Scene();

const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new three.WebGLRenderer({
  canvas: document.getElementById("bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const geometry = new three.TorusGeometry(10, 3, 16, 100);
const material = new three.MeshStandardMaterial({
  color: 0xff6347,
});

// Mesh = geometry + material
const torus = new three.Mesh(geometry, material);
scene.add(torus);

const pointLight = new three.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new three.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//// Add helpers
// const lightHelper = new three.PointLightHelper(pointLight);
// const gridHelper = new three.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);

// Listen to DOM events on the mouse and update camera position
const controls = new OrbitControls(camera, renderer.domElement);

const addStar = () => {
  const geometry = new three.SphereGeometry(0.25, 24, 24);
  const material = new three.MeshStandardMaterial({ color: 0xffffff });
  const star = new three.Mesh(geometry, material);

  // randomly generate position of star
  const [x, y, z] = Array(3)
    .fill()
    .map(() => three.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
};

Array(400).fill().forEach(addStar);

// Photo on Unsplash by Mohammad Alizade on https://unsplash.com/s/photos/gradient?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
const spaceTexture = new three.TextureLoader().load("./images/bg.jpg");
scene.background = spaceTexture;

// Avatar
const myTexture = new three.TextureLoader().load("./images/profile.jpg");

const me = new three.Mesh(
  new three.BoxGeometry(3, 3, 3),
  new three.MeshBasicMaterial({ map: myTexture })
);

scene.add(me);
me.rotation.y += 15;
me.rotation.z += 120;

// Planet

// Photo on Unsplash by Nick Iliasov on https://unsplash.com/s/photos/texture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
const planetTexture = new three.TextureLoader().load("./images/black.jpg");

// Photo on Unsplash by Brian Patrick Tagalog on https://unsplash.com/@briantagalog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
const normalTexture = new three.TextureLoader().load("./images/texture.jpg");
const planet = new three.Mesh(
  new three.SphereGeometry(3, 32, 32),
  new three.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture,
  })
);

scene.add(planet);

// Both ways can be used to set position along the specified axis
planet.position.z = 20;
planet.position.setX(-10);

const moveCamera = () => {
  // check how far user scrolled from the top
  const t = document.body.getBoundingClientRect().top;
  planet.rotation.x += 0.005;
  planet.rotation.y += 0.025;
  planet.rotation.z += 0.005;

  // me.rotation.y += 0.005;
  // me.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
};

document.body.onscroll = moveCamera;

const animate = () => {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  planet.rotation.y += 0.01;

  // reflect DOM event changes in the UI
  controls.update();

  renderer.render(scene, camera);
};

animate();

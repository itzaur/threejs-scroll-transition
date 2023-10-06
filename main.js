import { Exception } from 'sass';
import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './public/shaders/vertexShader.glsl';
import fragmentShader from './public/shaders/fragmentShader.glsl';

export default class Experience {
  constructor(container) {
    this.container = document.querySelector(container);

    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Parameters
    this.parameters = {
      fov: 75,
      near: 0.1,
      far: 100,
    };

    this.resize = () => this.onResize();
    this.dblclick = () => this.onDblclick();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createMesh();
    this.createControls();

    this.addListeners();

    this.renderer.setAnimationLoop(() => {
      this.render();
      this.update();
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.parameters.fov,
      this.width / this.height,
      this.parameters.near,
      this.parameters.far
    );

    this.camera.position.set(0, 0, 1);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 50, 50);
    this.material = new THREE.ShaderMaterial({
      side: 2,
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
  }

  onResize() {
    // Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onDblclick() {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.container.webkitRequestFullscreen) {
        this.container.webkitFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  addListeners() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('dblclick', this.dblclick);
  }
}

const experience = new Experience('#app');
experience.init();

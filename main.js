import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './src/shaders/vertexShader.glsl';
import fragmentShader from './src/shaders/fragmentShader.glsl';

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
      speed: 0,
      position: 0,
    };

    this.resize = () => this.onResize();
    this.dblclick = () => this.onDblclick();
    this.scroll = (e) => this.onScroll(e);
  }

  init() {
    this.createScene();
    this.createCamera();
    this.addTextureLoader();
    this.createRenderer();
    this.createMesh();
    this.createControls();
    this.createClock();

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

  addTextureLoader() {
    this.textureLoader = new THREE.TextureLoader();
    this.texture1 = this.textureLoader.load('./src/images/1.jpg');
    this.texture2 = this.textureLoader.load('./src/images/2.jpg');
    this.texture3 = this.textureLoader.load('./src/images/3.jpg');
    this.texture4 = this.textureLoader.load('./src/images/4.jpg');
    this.texture5 = this.textureLoader.load('./src/images/5.jpg');

    this.gallery = [
      this.texture1,
      this.texture2,
      this.texture3,
      this.texture4,
      this.texture5,
    ];
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      side: 2,
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture1: { value: this.texture1 },
        uTexture2: { value: this.texture2 },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPoints: { value: new THREE.Vector2(this.width, this.height) },
        uScale: { value: new THREE.Vector2(1, 1) },
        uAcceleration: { value: new THREE.Vector2(0.5, 2) },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enabled = false;
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.material.uniforms.uProgress.value = this.parameters.position;

    this.parameters.speed *= 0.7;
    this.parameters.position += this.parameters.speed;

    let theta = Math.round(this.parameters.position);
    let delta = theta - this.parameters.position;
    this.parameters.position += delta * 0.035;

    if (Math.abs(theta - this.parameters.position) < 0.001) {
      this.parameters.position = theta;
    }

    if (this.parameters.position > this.gallery.length) {
      this.parameters.position = 0;
    }

    if (this.parameters.position < 0) {
      this.parameters.position = theta;
    }

    let currentSlide = Math.floor(this.parameters.position);
    let nextSlide =
      (Math.floor(this.parameters.position) + 1) % this.gallery.length;

    this.material.uniforms.uTexture1.value = this.gallery[currentSlide];
    this.material.uniforms.uTexture2.value = this.gallery[nextSlide];
  }

  update() {
    this.controls.update();

    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
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

    let dist = this.camera.position.z - this.mesh.position.z;

    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * dist));

    this.mesh.scale.x = this.width / this.height;

    this.material.uniforms.uScale.value.y = this.height / this.width;

    this.addFullscreen();
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

  onScroll(e) {
    this.parameters.speed += e.deltaY * 0.0003;
  }

  addListeners() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('dblclick', this.dblclick);
    document.addEventListener('wheel', this.scroll);
    this.renderer.domElement.addEventListener('webglcontextlost', () => {
      location.reload();
    });
  }
}

const experience = new Experience('#app');
experience.init();

import * as THREE from "three";
//import { Camera } from "three/src/cameras/Camera";

export class Viewer {
  public camera: THREE.Camera;
  public renderer: THREE.WebGLRenderer;
  public sideSize: number;
  public scene: THREE.Scene | null = null;

  constructor(settings: any) {
    this.addRenderer(settings.renderer);

    this.addScene(null);

    this.addCamera(settings.camera || {});

    this.setDefaultCameraPosition();
  }
  addScene(scene: any) {
    // Создать новую сцену или заменить имеющуюся

    this.scene = scene || new THREE.Scene();
  }
  //RENDERER
  addRenderer(settings: any) {
    // Создать рендер

    if (this.renderer) {
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(
          this.renderer.domElement
        );
      }

      this.renderer.dispose();
    }

    this.renderer = new THREE.WebGLRenderer(settings);

    (settings.parentElement || document.body).appendChild(
      this.renderer.domElement
    );

    this.renderer.setClearColor(settings.clearColor || "black");

    this.renderer.setPixelRatio(settings.pixelRatio || devicePixelRatio);

    return;
  }
  resizeRender() {
    // Изменить размер окна рендера

    const dom = this.renderer.domElement.parentNode;
    if (dom) {
      this.renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    }
  }
  render() {
    // Отрисовать сцену из камеры
    this.renderer.render(this.scene, this.camera);
  }
  //CAMERA
  addCamera(settings: any) {
    // Создать камеру на основе параметров или заменить существующую settings - параметры иди новая камера

    if (settings.isCamera) {
      this.camera = settings;
      return;
    }

    settings.type = settings.type || "PerspectiveCamera";

    if (settings.type === "PerspectiveCamera") {
      const canvas = this.renderer.domElement;

      this.camera = new THREE.PerspectiveCamera(
        settings.fov || 45,
        canvas.width / canvas.height || 1,
        settings.near || 1,
        settings.far || 100
      );
    } else if (settings.type === "OrtographicCamera") {
      this.camera = new THREE.OrthographicCamera(
        settings.left || -1,
        settings.right || 1,
        settings.top || 1,
        settings.bottom || -1,
        settings.near || 1,
        settings.far || 100
      );

      //this.sideSize = settins.sideSize || 1;
      this.sideSize = settings.sideSize || 1;
    }
  }

  setDefaultCameraPosition() {
    // положение  камеры по умолчанию.

    this.camera.position.set(5, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  resizeCamera() {
    // Изменить отношение сторон камеры
    if ((this.camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      (this.camera as THREE.PerspectiveCamera).aspect =
        this.renderer.domElement.width / this.renderer.domElement.height;

      (this.camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    } else if ((this.camera as THREE.OrthographicCamera).isOrthographicCamera) {
      const aspect =
        this.renderer.domElement.width / this.renderer.domElement.height;

      (this.camera as THREE.OrthographicCamera).left = -this.sideSize * aspect;

      (this.camera as THREE.OrthographicCamera).right = this.sideSize * aspect;

      (this.camera as THREE.OrthographicCamera).top = this.sideSize;

      (this.camera as THREE.OrthographicCamera).bottom = -this.sideSize;

      (this.camera as THREE.OrthographicCamera).updateProjectionMatrix();
    }
  }
}

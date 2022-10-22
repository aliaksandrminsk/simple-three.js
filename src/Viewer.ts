import {
  WebGLRendererParameters,
  Scene,
  WebGLRenderer,
  Camera,
  PerspectiveCamera,
  OrthographicCamera,
} from "three";

interface IRendererSettings extends WebGLRendererParameters {
  parentElement: ChildNode;
  clearColor: string;
  pixelRatio: number;
}

interface IPerspectiveCameraSettings {
  type: "PerspectiveCamera";
  fov?: number;
  width?: number;
  near?: number;
  far?: number;
}

interface IOrtographicCameraSettings {
  type: "OrthographicCamera";
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  near?: number;
  far?: number;
  sideSize?: number;
}

interface ISettings {
  renderer: IRendererSettings;
  camera: {
    defaultCamera: "PerspectiveCamera" | "OrthographicCamera";
    PerspectiveCamera: IPerspectiveCameraSettings;
    OrthographicCamera: IOrtographicCameraSettings;
  };
}

export class Viewer {
  public camera: Camera;
  public renderer: WebGLRenderer;
  public sideSize: number;
  public scene: Scene | null = null;

  constructor(settings: ISettings) {
    this.addRenderer(settings.renderer);

    this.addScene(null);

    this.addCamera(settings.camera[settings.camera.defaultCamera]);

    this.setDefaultCameraPosition();
  }
  //** Create scene.
  addScene(scene: Scene) {
    this.scene = scene || new Scene();
  }

  addRenderer(settings: IRendererSettings) {
    if (this.renderer) {
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(
          this.renderer.domElement
        );
      }

      this.renderer.dispose();
    }

    this.renderer = new WebGLRenderer(settings);

    (settings.parentElement || document.body).appendChild(
      this.renderer.domElement
    );

    this.renderer.setClearColor(settings.clearColor || "black");
    this.renderer.setPixelRatio(settings.pixelRatio || devicePixelRatio);
  }

  resizeRender() {
    const dom = this.renderer.domElement.parentNode as HTMLElement | null;
    if (dom != null) {
      this.renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    }
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  //** Add camera.
  addCamera(settings: IPerspectiveCameraSettings | IOrtographicCameraSettings) {
    if (settings.type === "PerspectiveCamera") {
      const canvas = this.renderer.domElement;

      this.camera = new PerspectiveCamera(
        settings.fov || 45,
        canvas.width / canvas.height || 1,
        settings.near || 1,
        settings.far || 100
      );
    } else if (settings.type === "OrthographicCamera") {
      this.camera = new OrthographicCamera(
        settings.left || -1,
        settings.right || 1,
        settings.top || 1,
        settings.bottom || -1,
        settings.near || 1,
        settings.far || 100
      );

      this.sideSize = settings.sideSize || 1;
    }
  }

  //** Set default size.
  setDefaultCameraPosition() {
    this.camera.position.set(5, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  resizeCamera() {
    if ((this.camera as PerspectiveCamera).isPerspectiveCamera) {
      (this.camera as PerspectiveCamera).aspect =
        this.renderer.domElement.width / this.renderer.domElement.height;

      (this.camera as PerspectiveCamera).updateProjectionMatrix();
    } else if ((this.camera as OrthographicCamera).isOrthographicCamera) {
      const aspect =
        this.renderer.domElement.width / this.renderer.domElement.height;

      (this.camera as OrthographicCamera).left = -this.sideSize * aspect;

      (this.camera as OrthographicCamera).right = this.sideSize * aspect;

      (this.camera as OrthographicCamera).top = this.sideSize;

      (this.camera as OrthographicCamera).bottom = -this.sideSize;

      (this.camera as OrthographicCamera).updateProjectionMatrix();
    }
  }
}

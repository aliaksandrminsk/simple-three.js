import Gum from "./Gum";
import {
  Vector3,
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  ConeGeometry,
  TextureLoader,
  ShaderMaterial,
  SphereGeometry,
  PlaneGeometry,
} from "three";
import BasicShader from "./basic_shader";
import { settings } from "./Settings";

export class App {
  protected g: Gum;
  protected cameraOrigin: Vector3;
  protected box: Mesh;

  constructor() {
    this.g = new Gum(settings);

    this.createBox();

    this.createGrid();

    this.createLights();

    this.cameraOrigin = this.g.view.camera.position.clone();

    this.creatSelectBox(
      [
        { name: "Perspective Camera", data: "PerspectiveCamera" },
        { name: "Orthographic Camera", data: "OrthographicCamera" },
      ],
      settings.camera.defaultCamera,
      (event) => {
        let cameraSettings;
        if (event.target.value === "PerspectiveCamera") {
          cameraSettings = settings.camera.perspectiveCamera;
        } else if (event.target.value === "OrthographicCamera") {
          cameraSettings = settings.camera.orthographicCamera;
        }

        this.g.view.addCamera(cameraSettings);
        this.g.view.setDefaultCameraPosition();
        this.g.view.resizeCamera();
      }
    );

    this.creatBtn("Move (+y)", () => {
      this.moveBoxToTheSide("x", 5);
    });

    this.creatBtn("Move (-y)", () => {
      this.moveBoxToTheSide("x", -5);
    });

    this.creatBtn("Move (+z)", () => {
      this.moveBoxToTheSide("z", 5);
    });

    this.creatBtn("Move (-z)", () => {
      this.moveBoxToTheSide("z", -5);
    });

    this.creatBtn("Stop the movement", () => {
      this.stopMoving();
    });

    this.creatBtn("Zoom camera", () => {
      this.moveCameraToBox();
    });

    this.creatBtn("Reset camera", () => {
      this.moveCameraFromBox();
    });
  }

  creatBtn(text: string, callback: () => void) {
    const btn = document.createElement("div");

    btn.innerText = text;
    btn.className = "btn";
    btn.onclick = callback;

    const menu = document.getElementById("menu");
    if (menu) {
      menu.appendChild(btn);
    }
  }

  creatSelectBox(
    values: Array<{ name: string; data: string }>,
    defaultValue: string,
    callback: (e: any) => void
  ) {
    const selectList = document.createElement("select");
    selectList.className = "select";

    const menu = document.getElementById("menu");
    if (menu) {
      menu.appendChild(selectList);
    }

    for (let i = 0; i < values.length; i++) {
      const option = document.createElement("option");
      option.id = values[i].data;
      option.value = values[i].data;
      option.text = values[i].name;
      selectList.appendChild(option);
    }

    //** Set default value.
    if (defaultValue) {
      selectList.options.namedItem(defaultValue).selected = true;
    }
    selectList.addEventListener("change", callback);
  }

  createLights() {
    const light1: DirectionalLight = new DirectionalLight(0xffffff, 0.5);
    light1.position.set(2, 3, 4);
    light1.castShadow = true; //Added shadow.
    if (this.g.view.scene) this.g.view.scene.add(light1);

    const light2: AmbientLight = new AmbientLight(0xffffff, 0.5);
    if (this.g.view.scene) this.g.view.scene.add(light2);
  }

  createBox() {
    const tree_background = new TextureLoader().load("./tree_background.jpg");
    const photo_background = new TextureLoader().load("./photo_background.jpg");

    this.box = new Mesh(
      new BoxGeometry(1, 1, 1),
      new ShaderMaterial({
        uniforms: BasicShader.uniforms,
        vertexShader: BasicShader.vertexShader,
        fragmentShader: BasicShader.fragmentShader,
      })
    );
    this.box.material["uniforms"].map.value = photo_background;
    this.box.castShadow = true;
    this.box.position.y = 0.5;
    if (this.g.view.scene) this.g.view.scene.add(this.box);

    const cone = new Mesh(
      new ConeGeometry(0.5, 1, 8),
      new MeshStandardMaterial({ map: tree_background })
    );
    cone.position.y = 0.5;
    cone.rotation.y = Math.PI / 2;
    cone.scale.set(1, 0.6, 1);
    cone.name = "cone1";
    cone.castShadow = true;
    this.box.add(cone);

    const cone2 = cone.clone();
    cone2.rotation.z = Math.PI;
    cone2.position.y = 0.8;
    cone2.name = "cone2";
    this.box.add(cone2);

    const sphere = new Mesh(
      new SphereGeometry(0.9, 8, 8),
      new MeshStandardMaterial({ map: tree_background })
    );
    sphere.position.y = 1.3;
    sphere.rotation.y = Math.PI / 2;
    sphere.scale.set(1, 0.6, 1);
    sphere.name = "sphere";
    sphere.castShadow = true;
    this.box.add(sphere);

    const plane = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({ color: "gray" })
    );
    if (this.g.view.scene) this.g.view.scene.add(plane);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
  }

  createGrid() {
    if (this.g.view.scene) this.g.view.scene.add(new GridHelper(10, 10));
  }

  moveBoxToTheSide(coordinate: "z" | "x", value: number) {
    const startX = this.box.position[coordinate];

    this.g.updater.addLimit(
      "move_box",
      (prgs: number) => {
        prgs = this.g.updater.smoothEnd(prgs);

        this.box.position[coordinate] = this.g.updater.lerp(
          startX,
          value,
          prgs
        );
      },
      "1sec"
    );
  }

  stopMoving() {
    this.g.updater.removeLimit("move_box");
  }

  //** Zoom in
  moveCameraToBox() {
    const startCamera = this.g.view.camera.position.clone();

    const deltaPosition = new Vector3();

    const cameraDirection = this.g.view.camera.getWorldDirection(new Vector3());

    const startTarget = startCamera.clone().add(cameraDirection);

    const deltaTarget = new Vector3();

    const zero = new Vector3();

    const offset = new Vector3(0, 3, 3);

    this.g.updater.addLimit(
      "move_camera",
      (prgs: number, frame: number) => {
        if (frame < 60) {
          const p = this.g.updater.step(0, 60, frame);

          this.g.view.camera.position.lerpVectors(
            startCamera,
            this.cameraOrigin,
            p
          );

          deltaTarget.lerpVectors(startTarget, zero, p);

          this.g.view.camera.lookAt(deltaTarget);
        } else {
          const p = this.g.updater.step(61, 120, frame);

          deltaPosition.copy(this.box.position);

          deltaPosition.add(offset);

          this.g.view.camera.position.lerpVectors(
            this.cameraOrigin,
            deltaPosition,
            p
          );

          deltaTarget.lerpVectors(zero, this.box.position, p);

          this.g.view.camera.lookAt(deltaTarget);
        }
      },
      120
    );
  }

  //** Zoom Out
  moveCameraFromBox() {
    const startCamera = this.g.view.camera.position.clone();

    const cameraDirection = this.g.view.camera.getWorldDirection(new Vector3());

    const startTarget = startCamera.clone().add(cameraDirection);

    const deltaTarget = new Vector3();

    const zero = new Vector3();

    this.g.updater.addLimit(
      "move_camera",
      (prgs: number, frame: number) => {
        if (frame < 60) {
          const p = this.g.updater.step(0, 60, frame);

          this.g.view.camera.position.lerpVectors(
            startCamera,
            this.cameraOrigin,
            p
          );

          deltaTarget.lerpVectors(startTarget, zero, p);

          this.g.view.camera.lookAt(deltaTarget);
        }
      },
      60
    );
  }
}

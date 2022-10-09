import GUM from "./gum";
import * as THREE from "three";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three";

export class App {
  protected g: GUM;
  protected cameraOrigin: Vector3;
  protected box: Mesh;

  constructor() {
    this.g = new GUM({
      renderer: { parent: document.body, clearColor: "gray" },
    });

    this.createBox();

    this.createGrid();

    this.createLights();

    this.cameraOrigin = this.g.v.camera.position.clone();

    //const that = this;

    this.creatBtn("Переместить вправо", () => {
      this.moveBoxToTheSide(5);
    });

    this.creatBtn("Переместить влево", () => {
      this.moveBoxToTheSide(-5);
    });

    this.creatBtn("Приблизить камеру", () => {
      this.moveCameraToBox();
    });
  }

  creatBtn(text: string, callback: any) {
    const btn = document.createElement("div");

    btn.innerText = text;

    btn.className = "btn";

    btn.onclick = callback;

    const menu = document.getElementById("menu");
    if (menu) {
      menu.appendChild(btn);
    }
  }

  createLights() {
    const light1: THREE.DirectionalLight = new this.g.t.DirectionalLight(
      0xffffff,
      0.5
    );
    light1.position.set(2, 3, 4);
    if (this.g.v.scene) this.g.v.scene.add(light1);

    const light2: THREE.AmbientLight = new this.g.t.AmbientLight(0xffffff, 0.5);
    if (this.g.v.scene) this.g.v.scene.add(light2);
  }

  createBox() {
    const box = new this.g.t.Mesh(
      new this.g.t.BoxGeometry(1, 1, 1),
      new this.g.t.MeshStandardMaterial({ color: 0xdddddd })
    );
    if (this.g.v.scene) this.g.v.scene.add(box);
    this.box = box;
  }

  createGrid() {
    if (this.g.v.scene) this.g.v.scene.add(new this.g.t.GridHelper(10, 10));
  }

  moveBoxToTheSide(X: number) {
    //const that = this;

    const startX = this.box.position.x;

    this.g.u.addLimit(
      "move_box",
      (prgs: number) => {
        prgs = this.g.u.smoothEnd(prgs);

        this.box.position.x = this.g.u.lerp(startX, X, prgs);
      },
      "1sec"
    );
  }
  moveCameraToBox() {
    //const that = this;

    const startCamera = this.g.v.camera.position.clone();

    const deltaPosition = new this.g.t.Vector3();

    const cameraDirection = this.g.v.camera.getWorldDirection(
      new this.g.t.Vector3()
    );

    const startTarget = startCamera.clone().add(cameraDirection);

    const deltaTarget = new this.g.t.Vector3();

    const zero = new this.g.t.Vector3();

    const offset = new this.g.t.Vector3(0, 3, 3);

    this.g.u.addLimit(
      "move_camera",
      (prgs: any, frame: any) => {
        if (frame < 60) {
          const p = this.g.u.step(0, 60, frame);

          this.g.v.camera.position.lerpVectors(
            startCamera,
            this.cameraOrigin,
            p
          );

          deltaTarget.lerpVectors(startTarget, zero, p);

          this.g.v.camera.lookAt(deltaTarget);
        } else {
          const p = this.g.u.step(61, 120, frame);

          deltaPosition.copy(this.box.position);

          deltaPosition.add(offset);

          this.g.v.camera.position.lerpVectors(
            this.cameraOrigin,
            deltaPosition,
            p
          );

          deltaTarget.lerpVectors(zero, this.box.position, p);

          this.g.v.camera.lookAt(deltaTarget);
        }
      },
      120
    );
  }
}

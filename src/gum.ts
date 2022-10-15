import { Viewer } from "./Viewer";
import { Updater } from "./Updater";
import { Resizer } from "./Resizer";

export default class GUM {
  public v: Viewer;
  public u: Updater;
  public r: Resizer;

  constructor(settings: any) {
    this.v = new Viewer(settings);
    this.u = new Updater();
    this.r = new Resizer();

    this.start();
  }

  start() {
    this.u.addLoop("render", () => {
      this.v.render();
    });

    this.r.add("resize_viewer", () => {
      this.v.resizeRender();
      this.v.resizeCamera();
    });
    this.r.resizes["resize_viewer"]();
  }
}

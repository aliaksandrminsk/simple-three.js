import { Viewer } from "./Viewer";
import { Updater } from "./Updater";
import { Resizer } from "./Resizer";

export default class GUM {
  public view: Viewer;
  public updater: Updater;
  public resizer: Resizer;

  constructor(settings: any) {
    this.view = new Viewer(settings);
    this.updater = new Updater();
    this.resizer = new Resizer();

    this.start();
  }

  start() {
    this.updater.addLoop("render", () => {
      this.view.render();
    });

    this.resizer.add("resize_viewer", () => {
      this.view.resizeRender();
      this.view.resizeCamera();
    });
    this.resizer.resizes["resize_viewer"]();
  }
}

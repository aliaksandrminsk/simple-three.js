import * as THREE from "three";
import { Viewer } from "./Viewer";
import { Loader } from "./Loader";
import { Updater } from "./Updater";
import { Resizer } from "./Resizer";

export default class GUM {
  public v: Viewer;
  public l: Loader;
  public u: Updater;
  public r: Resizer;

  public t: any;

  // public Viewer: Viewer;
  // public Loader: Loader;
  // public Updater: Updater;
  // public Resizer: Resizer;

  constructor(settings: any) {
    // this.v = this.V = this.Viewer = new Viewer(settings);// Создание и хранение рендера, камеры, сцены
    // this.l = this.L = this.Loader = new Loader(settings);// Загрузка ресурсов, текстуры, модели
    // this.u = this.U = this.Updater = new Updater(settings);// Процесс обновления с возможностью добавлять постоянные и конечные анимации
    // this.r = this.R = this.Resizer = new Resizer(settings);// Прослушиватель ресайза окна браузера

    this.v = new Viewer(settings); // Создание и хранение рендера, камеры, сцены
    //this.l = new Loader(settings); // Загрузка ресурсов, текстуры, модели
    this.u = new Updater(); // Процесс обновления с возможностью добавлять постоянные и конечные анимации
    this.r = new Resizer(); // Прослушиватель ресайза окна браузера

    //this.t = this.T = this.THREE = THREE; // Библиотека для работы с трехмерной графикой
    this.t = THREE; // Библиотека для работы с трехмерной графикой

    //let that = this;

    this.start();
  }

  start() {
    // Запуск рендера и ресайза для стандартной сцены.

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

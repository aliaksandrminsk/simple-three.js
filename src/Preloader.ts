export class Preloader {
  protected parent: HTMLElement;
  protected background: HTMLElement;
  protected progress: HTMLElement;

  constructor(data) {
    this.parent = data.parent;
    this.start();
  }

  protected start() {
    this.background = this.createElement("preloader_background", this.parent);

    const bar = this.createElement("preloader_bar", this.background);

    this.progress = this.createElement("preloader_progress", bar);
  }
  protected createElement(className, parent) {
    const element = document.createElement("div");

    element.className = className;

    parent.appendChild(element);

    return element;
  }
  setProgress(p) {
    this.progress.style.width = Math.round(p * 100) + "%";
  }
  finish() {
    this.parent.removeChild(this.background);
  }
}

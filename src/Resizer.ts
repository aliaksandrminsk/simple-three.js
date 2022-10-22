type CallBackType = () => void;

interface IResizer {
  [name: string]: CallBackType;
}

export class Resizer {
  public resizes: IResizer = {};

  constructor() {
    window.addEventListener("resize", () => {
      this.resizeAll();
    });
  }

  add(name: string, func: CallBackType) {
    this.resizes[name] = func;
  }

  remove(name: string): void {
    delete this.resizes[name];
  }

  resizeAll() {
    for (const name in this.resizes) this.resizes[name]();
  }
}

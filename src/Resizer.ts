export class Resizer {
  public resizes: any = {};

  constructor() {
    window.addEventListener("resize", () => {
      this.resizeAll();
    });
  }

  add(name: string, func: () => void) {
    this.resizes[name] = func;
  }

  remove(name: string): void {
    delete this.resizes[name];
  }

  resizeAll() {
    for (const name in this.resizes) this.resizes[name]();
  }
}

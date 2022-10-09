export class Resizer {
  public resizes: any = {};

  constructor() {
    //let that = this;
    window.addEventListener("resize", () => {
      that.resizeAll();
    });
  }

  add(name: string, func: any) {
    // Добавить реакцию на изменение окна браузера (name - название реакции, func - функция реакции)
    this.resizes[name] = func;
  }

  remove(name: string): void {
    // Удалить реакцию на изменение окна браузера
    delete this.resizes[name];
  }

  resizeAll() {
    for (const name in this.resizes) this.resizes[name]();
  }
}

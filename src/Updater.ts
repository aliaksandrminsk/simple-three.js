export class Updater {
  public loops: any = {};
  public limits: any = {};
  public time = 0;
  public lastTime = 0;
  public delta = 0;
  public fps = 75;

  constructor() {
    this.start();
  }

  addLoop(name: string, func: any) {
    // Добавить бесконечную анимацию (name - Уникальное имя анимации, func - функция, которая будет выполняться каждый кадр)

    this.loops[name] = { func: func, pause: false };
  }

  removeLoop(name: string) {
    delete this.loops[name];
  } // Удалить бесконечную анимацию

  addLimit(name: string, func: any, duration: any) {
    // Добавить конечную анимацию (name - Уникальное имя анимации, func - функция, которая будет выполняться каждый кадр, duration - продолжительность в кадрах, если указать число, или в секундах, если указать в виде строки - "5sec")

    //let duration = duration;

    let type = 0;

    if (typeof duration === "string") {
      duration = parseFloat(duration);

      //let type = 1;
      type = 1;
    }

    if (!name) name = "limit_" + Math.random().toString(36).substr(2, 9);

    this.limits[name] = {
      func: func,
      current: 0,
      duration: duration,
      type: type,
    };

    return name;
  }

  removeLimit(name: string) {
    delete this.limits[name];
  } // Удалить конечную анимацию

  setFps(fps: any) {
    this.fps = fps;
  }

  start() {
    this.lastTime = Date.now();

    this.update();
  }
  update() {
    //const that = this;

    requestAnimationFrame(() => {
      this.update();
    });

    this.delta = (Date.now() - this.lastTime) / 1000;

    this.lastTime = Date.now();

    if (this.pause) return;

    if (this.delta < 1 / this.fps) return;

    for (const l in this.loops) if (!this.loops[l].pause) this.loops[l].func();

    for (const l in this.limits) {
      if (this.limits[l].current >= this.limits[l].duration) {
        this.removeLimit(l);
        continue;
      } else if (this.limits[l].type === 0) {
        this.limits[l].current++;

        this.limits[l].func(
          this.limits[l].current / this.limits[l].duration,
          this.limits[l].current
        );
      } else if (this.limits[l].type === 1) {
        this.limits[l].current += this.delta;

        let prgs = this.limits[l].current / this.limits[l].duration;

        if (prgs > 1) prgs = 1;

        this.limits[l].func(prgs, this.limits[l].current);
      }
    }
  }

  lerp(start: number, end: number, p: number) {
    // Линейная интерполяция.Равномерное изменение числа от start до end в зависимости от p, его значение от 0 до 1. Примеры: lerp(0,500,0.5) === 250; lerp(100,1000,0.1) === 190; lerp(5,18,0.7) === 9.1;

    return start + p * (end - start);
  }

  step(start: number, end: number, frame: number) {
    // Метод обратный lerp, определяет прогресс (значение от 0 до 1) на основе начала конца и промежуточного значения

    return (frame - start) / (end - start);
  }

  smooth(number: number, p1: number, p2: number) {
    //Кривая Безье (Кубическая). Интерполяция с плавным началом и плавным завершением. number (от 0 до 1) - значение которое нужно сгладить. p1 - направляющая 1,p2 -  - направляющая 2

    return (
      Math.pow(1 - number, 3) * 0 +
      3 * number * Math.pow(1 - number, 2) * p1 +
      3 * number * number * (1 - number) * p2 +
      Math.pow(number, 3) * 1
    );
  }

  smoothStart(x: number) {
    // Интерполяция с плавным Началом

    return 1 - Math.cos((x * Math.PI) / 2);
  }

  smoothEnd(x: number) {
    // Интерполяция с плавным завершением

    return Math.sin((x * Math.PI) / 2);
  }
}

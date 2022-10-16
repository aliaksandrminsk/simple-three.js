type CallBackType = (a?: number, b?: number) => void;

interface ILoops {
  [key: string]: {
    func: CallBackType;
    pause: boolean;
  };
}

interface ILimits {
  [key: string]: {
    func: CallBackType;
    current: number;
    duration: number;
    type: number;
  };
}

export class Updater {
  public loops: ILoops = {};
  public limits: ILimits = {};
  //public time = 0;
  public lastTime = 0;
  public delta = 0;
  public fps = 75;

  constructor() {
    this.start();
  }

  //** Add infinite animation (name - unique animation name, func - function executed every frame)
  addLoop(name: string, func: CallBackType) {
    this.loops[name] = { func: func, pause: false };
  }

  //** Remove infinite animation
  removeLoop(name: string) {
    delete this.loops[name];
  }

  //** Add final animation (name - unique animation name, func -  function executed every frame, duration - duration in frames if specified as a number, or in seconds if specified as a string - "5sec")
  addLimit(
    name: string,
    func: CallBackType,
    duration: number | string
  ): string {
    let type = 0;
    let numberDuration;

    if (typeof duration === "string") {
      numberDuration = parseFloat(duration);
      type = 1;
    } else {
      numberDuration = duration;
    }

    if (!name) name = "limit_" + Math.random().toString(36).substring(2, 11);

    this.limits[name] = {
      func: func,
      current: 0,
      duration: numberDuration,
      type: type,
    };

    return name;
  }

  //** Remove final animation
  removeLimit(name: string) {
    delete this.limits[name];
  }

  setFps(fps: number) {
    this.fps = fps;
  }

  start() {
    this.lastTime = Date.now();

    this.update();
  }
  update() {
    requestAnimationFrame(() => {
      this.update();
    });

    this.delta = (Date.now() - this.lastTime) / 1000;

    this.lastTime = Date.now();

    //if (this.pause) return;

    if (this.delta < 1 / this.fps) return;

    const loopKeys = Object.keys(this.loops);
    for (const l of loopKeys) {
      if (!this.loops[l].pause) this.loops[l].func();
    }

    const limitKeys = Object.keys(this.limits);
    for (const l of limitKeys) {
      if (this.limits[l].current >= this.limits[l].duration) {
        this.removeLimit(l);
        //continue;
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

  //** Linear interpolation. Uniform change of number from start to end depending on p, its value is from 0 to 1. Examples: lerp(0,500,0.5) === 250; lerp(100,1000,0.1) === 190; lerp(5,18,0.7) === 9.1;
  lerp(start: number, end: number, p: number) {
    return start + p * (end - start);
  }

  //** Reverse lerp method, determines the progress (value from 0 to 1) based on the beginning of the end and the intermediate value
  step(start: number, end: number, frame: number) {
    return (frame - start) / (end - start);
  }

  //** Bezier Curve (Cubic). Interpolation with smooth start and smooth end. number (from 0 to 1) - the value to smooth. p1 - track 1, p2 - track 2.
  smooth(value: number, p1: number, p2: number) {
    return (
      Math.pow(1 - value, 3) * 0 +
      3 * value * Math.pow(1 - value, 2) * p1 +
      3 * value * value * (1 - value) * p2 +
      Math.pow(value, 3) * 1
    );
  }

  smoothStart(x: number) {
    return 1 - Math.cos((x * Math.PI) / 2);
  }

  smoothEnd(x: number) {
    return Math.sin((x * Math.PI) / 2);
  }
}

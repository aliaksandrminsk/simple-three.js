import { Object3D, ObjectLoader, Texture, TextureLoader } from "three";

interface IResourses {
  meshes: {
    [name: string]: Object3D;
  };
  textures: {
    [name: string]: Texture;
  };
}

export class Loader {
  resourses: IResourses = { meshes: {}, textures: {} };
  srcs = [];
  loadCallBack: () => void | null = null;
  progressCallBack: (progress) => void | null = null;

  //** Loading of resources (array of file's paths, callback of the end of loading, progress callback).
  load(srcs, loadCb, prgsCb) {
    if (prgsCb) this.setProgressCallBack(prgsCb);

    if (loadCb) this.setLoadCallBack(loadCb);

    for (const s of srcs)
      this.loadOne(s, () => {
        this.checkProgress();
      });
  }

  //** Call progressCallBack after each file is loaded.
  setProgressCallBack(cb) {
    if (!cb) return;
    this.progressCallBack = cb;
  }

  //** Call loadCallBack after loading the last file.
  setLoadCallBack(cb) {
    if (!cb) return;
    this.loadCallBack = cb;
  }

  protected checkProgress() {
    let count = 0;
    for (const r in this.resourses) {
      count += Object.keys(this.resourses[r]).length;
    }

    if (count > 0) this.progressCallBack(count / Object.keys(this.srcs).length);
    if (Object.keys(this.srcs).length === count) this.loadCallBack();
  }

  loadOne(src, callback) {
    const array = src.replace(/^.*[\\\/]/, "").split("."); // eslint-disable-line
    const name = array[0];
    const extension = array[1];

    this.srcs.push(src);

    if (extension === "json") {
      new ObjectLoader().load(src, (object3D) => {
        if (object3D.children.length === 1)
          this.resourses.meshes[name] = object3D.children[0];
        else this.resourses.meshes[name] = object3D;
        if (callback) callback();
      });
    } else if (extension === "fbx") {
      console.log("ToDo loading of fbx");
    } else if (
      extension === "jpeg" ||
      extension === "jpg" ||
      extension === "png"
    ) {
      new TextureLoader().load(src, (texture) => {
        this.resourses.textures[name] = texture;
        if (callback) callback();
      });
    }
  }
}

import { WebGLRendererParameters } from "three";

export interface ISettings {
  renderer: IRendererSettings;
  camera: {
    defaultCamera: "PerspectiveCamera" | "OrthographicCamera";
    perspectiveCamera: IPerspectiveCameraSettings;
    orthographicCamera: IOrtographicCameraSettings;
  };
}

export interface IRendererSettings extends WebGLRendererParameters {
  parentElement: ChildNode;
  clearColor: string;
  pixelRatio: number;
}

export interface IPerspectiveCameraSettings {
  type: "PerspectiveCamera";
  fov?: number;
  width?: number;
  near?: number;
  far?: number;
}

export interface IOrtographicCameraSettings {
  type: "OrthographicCamera";
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  near?: number;
  far?: number;
  sideSize?: number;
}

export const settings: ISettings = {
  renderer: {
    parentElement: document.body,
    clearColor: "green",
    pixelRatio: 1,
  },
  camera: {
    defaultCamera: "PerspectiveCamera",
    perspectiveCamera: {
      type: "PerspectiveCamera",
    },
    orthographicCamera: {
      type: "OrthographicCamera",
      sideSize: 5,
    },
  },
};

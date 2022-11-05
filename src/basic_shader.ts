import { Texture } from "three";

export default {
  uniforms: {
    map: { value: new Texture() },
    colors: { value: [0, 0, 0.4, 1] },
  },
  vertexShader: `	
			varying vec2 vUv;
			void main() {
				
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				vUv = uv;
			}
		`,
  fragmentShader: `	
			uniform sampler2D map;

			varying vec2 vUv;
			
			uniform float colors[4];

			void main() {
				if(vUv.y>0.05 && vUv.x>0.05 && vUv.x<0.95 && vUv.y<0.95) {
					gl_FragColor = texture2D(map, vUv);
				} else {
					gl_FragColor = vec4(colors[0], colors[1], colors[2], colors[3]);					
				}
			}
		`,
};

import GUM from "./gum.js";
let g;
export default class {
	constructor(){
		g = new GUM(
			{
				renderer:{parent:document.body,clearColor:"gray"}
			}
		);
		
		this.createBox();
		
		this.createGrid();
		
		this.createLights();
		
		this.cameraOrigin = g.v.camera.position.clone();
		
		var that = this;
		
		this.creatBtn("Переместить вправо",()=>{that.moveBoxToTheSide(5)});
		
		this.creatBtn("Переместить влево",()=>{that.moveBoxToTheSide(-5)});
		
		this.creatBtn("Приблизить камеру",()=>{that.moveCameraToBox()});
	}
	
	creatBtn(text,callback){

		var btn = document.createElement("div");
		
		btn.innerText = text;
		
		btn.className = "btn";
		
		btn.onclick = callback;
		
		document.getElementById("menu").appendChild(btn);
	}
	createLights(){
		this.light1 = new g.t.DirectionalLight(0xffffff,.5);
		this.light1.position.set(2,3,4);
		g.v.scene.add(this.light1);
		
		this.light2 = new g.t.AmbientLight(0xffffff,.5);
		g.v.scene.add(this.light2);
		
	}
	createBox(){
		this.box = new g.t.Mesh(new g.t.BoxGeometry(1,1,1), new g.t.MeshStandardMaterial({color:0xdddddd}));
		g.v.scene.add(this.box);
	}
	createGrid(){
		g.v.scene.add(new g.t.GridHelper(10,10));
	}
	moveBoxToTheSide(X){
		
		var that = this;
		
		var startX = this.box.position.x;
		
		g.u.addLimit("move_box",(prgs)=>{
			
			prgs = g.u.smoothEnd(prgs);
			
			that.box.position.x = g.u.lerp(startX,X,prgs);
			
		},"1sec");
		
	}
	moveCameraToBox(){
		var that = this;
		
		var startCamera = g.v.camera.position.clone();
		
		var deltaPosition = new g.t.Vector3();
		
		var cameraDirection = g.v.camera.getWorldDirection(new g.t.Vector3());
		
		var startTarget = startCamera.clone().add(cameraDirection);
		
		var deltaTarget = new g.t.Vector3();

		
		var zero = new g.t.Vector3();
		
		var offset = new g.t.Vector3(0,3,3);
		

		
		g.u.addLimit("move_camera",(prgs,frame)=>{
			
			if(frame < 60){
				
				var p = g.u.step(0,60,frame);
				
				g.v.camera.position.lerpVectors(startCamera,that.cameraOrigin,p);
				

				deltaTarget.lerpVectors(startTarget,zero,p);
				
				g.v.camera.lookAt(deltaTarget);
				
			}
			else{
				
				var p = g.u.step(61,120,frame);
				
				deltaPosition.copy(that.box.position);
				
				deltaPosition.add(offset);
				
				g.v.camera.position.lerpVectors(that.cameraOrigin,deltaPosition,p);
				
				deltaTarget.lerpVectors(zero,that.box.position,p);
				
				g.v.camera.lookAt(deltaTarget);
			}

			
		},120);
	}
	
	
}
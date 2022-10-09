//import * as THREE from "../three.module.js";
import * as THREE from "three";

export default class {
	
	constructor(settings){
		
		this.v = this.V = this.Viewer = new Viewer(settings);// Создание и хранение рендера, камеры, сцены
		this.l = this.L = this.Loader = new Loader(settings);// Загрузка ресурсов, текстуры, модели
		this.u = this.U = this.Updater = new Updater(settings);// Процесс обновления с возможностью добавлять постоянные и конечные анимации
		this.r = this.R = this.Resizer = new Resizer(settings);// Прослушиватель ресайза окна браузера
		
		this.t = this.T = this.THREE = THREE; // Библиотека для работы с трехмерной графикой
		
		var that = this;
		
		start();
		
		function start(){// Запуск рендера и ресайза для стандартной сцены.
			
			
			that.u.addLoop("render",()=>{that.v.render();});
			
			that.r.add("resize_viewer",()=>{that.v.resizeRender();that.v.resizeCamera();});
			that.r.resizes["resize_viewer"]();
		}
	}

}
let Loader = class{
	
	resourses = {json:{},textures:{}};

	load(srcs,loadCb,prgsCb){//Загрузка ресурсов (массив с путями до файлов, коллбек по окончанию загрузки, коллбэк прогресса)
		
		if(prgsCb)this.setProgressCallBack(prgsCb);
		
		if(loadCb)this.setLoadCallBack(loadCb);
		
		for(var s of srcs)this.loadOne(s,()=>{that._checkProgress()});
	}
	
	progressCallBack(progress){}// Функция вызываемая после загрузки каждого файла progress - получаемое значение от 0 до 1
	
	setProgressCallBack(cb){
		if(!cb)return;
		this.progressCallBack = cb;
	}
	
	loadCallBack(){}// Функция вызываемая после загрузки последнего файла
	
	setLoadCallBack(cb){
		
		if(!cb)return;
		this.loadCallBack = cb;
	}
	_checkProgress(){
		
		var count = 0;
		
		for(var r in this.resourses)for(var d in this.resourses[r])count++;
		
		if(count > 0)this.progressCallBack(count/Object.keys(this.srcs).length);
		
		
		if(Object.keys(this.srcs).length === count)this.loadCallBack();
	}
	srcs = [];
	loadOne(src,callback){
		
		var that = this;
		
		var array = src.replace(/^.*[\\\/]/, '').split(".");
		
		var name = array[0];
		
		var extention = array[1];
		
		this.srcs.push(src);
		
		if(extention === "json"){
			
			new THREE.ObjectLoader().load(d.path,function(object3D){
				
				that.resourses.json[d.name] = object3D;
				
				if(callback)callback();
				
			});
		}
		else if(extention === "jpeg" || extention === "jpg" || extention === "png"){
			
			new THREE.TextureLoader().load(d.path,function(texture){
				
				that.resourses.textures[d.name] = texture;
				
				if(callback)callback();
				
			});
		}
	}
}
let Resizer = class{
	
	constructor(){
		var that = this;
		window.addEventListener("resize",()=>{that.resizeAll();})
	}
	
	add(name,func){// Добавить реакцию на изменение окна браузера (name - название реакции, func - функция реакции)
		
		this.resizes[name] = func;
		
	}
	
	remove(){// Удалить реакцию на изменение окна браузера 
		
		delete this.resizes[name];
		
	}
	
	resizes = {};
	
	resizeAll(){
		
		for(var name in this.resizes)this.resizes[name]();
	}
}
let Updater = class{
	
	constructor(){
		
		this.start();	
		
	}
	
	loops = {};
	
	addLoop(name,func){// Добавить бесконечную анимацию (name - Уникальное имя анимации, func - функция, которая будет выполняться каждый кадр)
		
		this.loops[name] = {func:func,pause:false};
	}
	
	removeLoop(name){delete this.loops[name];}// Удалить бесконечную анимацию
	
	limits = {};
	
	addLimit(name,func,duration){// Добавить конечную анимацию (name - Уникальное имя анимации, func - функция, которая будет выполняться каждый кадр, duration - продолжительность в кадрах, если указать число, или в секундах, если указать в виде строки - "5sec")
		
		var duration = duration;
		
		var type = 0;
		
		if(typeof duration === "string"){
			
			duration = parseFloat(duration);
			
			var type = 1;
		}
		
		if(!name)name = "limit_"+Math.random().toString(36).substr(2, 9);
		
		this.limits[name] = {
			func: func,
			current: 0,
			duration: duration,
			type: type,
		}
		
		return name;
	}
	
	removeLimit(name){delete this.limits[name];}// Удалить конечную анимацию
	
	setFps(fps){this.fps = fps}
		
	time = 0;
	lastTime = 0;
	delta = 0;
	fps = 75;
	
	start(){
		
		this.lastTime = Date.now();
		
		this.update();
	}
	update(){
		
		var that = this;
		
		requestAnimationFrame(()=>{that.update();})
		
		this.delta = (Date.now() - this.lastTime)/1000;
		
		this.lastTime = Date.now();
		
		if(this.pause)return;	

		if(this.delta < 1/this.fps)return;
		
		for(var l in this.loops)if(!this.loops[l].pause)this.loops[l].func();
		
		for(var l in this.limits){
			
			if(this.limits[l].current >= this.limits[l].duration){
				
				this.removeLimit(l);
				
				continue;
			}
			else if(this.limits[l].type === 0){
				
				this.limits[l].current++;
				
				this.limits[l].func(this.limits[l].current/this.limits[l].duration,this.limits[l].current);
				
			}
			else if(this.limits[l].type === 1){

				this.limits[l].current += this.delta;
				
				var prgs = this.limits[l].current/this.limits[l].duration;
				
				if(prgs > 1)prgs = 1;
				
				this.limits[l].func(prgs,this.limits[l].current);
				
			}
		}
		
		
	}
	
	lerp(start,end,p){ // Линейная интерполяция.Равномерное изменение числа от start до end в зависимости от p, его значение от 0 до 1. Примеры: lerp(0,500,0.5) === 250; lerp(100,1000,0.1) === 190; lerp(5,18,0.7) === 9.1; 
		
		return start + p*(end-start);
	}
	
	step(start,end,frame){// Метод обратный lerp, определяет прогресс (значение от 0 до 1) на основе начала конца и промежуточного значения
		
		return (frame-start)/(end-start);
	}
	
	smooth(number,p1,p2){ //Кривая Безье (Кубическая). Интерполяция с плавным началом и плавным завершением. number (от 0 до 1) - значение которое нужно сгладить. p1 - направляющая 1,p2 -  - направляющая 2
			
			return Math.pow(1-number,3)*0 + 3*number*Math.pow(1-number,2)*p1 + 3*number*number*(1-number)*p2 + Math.pow(number,3)*1;
	}
	
	smoothStart(x){  // Интерполяция с плавным Началом
		
	  return 1 - Math.cos((x * Math.PI) / 2);
	}
	
	smoothEnd(x){ // Интерполяция с плавным завершением 
		
	  return Math.sin((x * Math.PI) / 2);
	}
	
	


}
let Viewer = class {
	
	constructor(settings){
		
		this.addRenderer(settings.renderer);
		
		this.addScene();
		
		this.addCamera(settings.camera || {});
		
		this.setDefaultCameraPosition();

	}
	addScene(scene){// Создать новую сцену или заменить имеющуюся
		
		this.scene = scene || new THREE.Scene();
	}
	//RENDERER
	addRenderer(settings){// Создать рендер
		
		if(this.renderer){ this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);this.renderer.dispose();}

		this.renderer = new THREE.WebGLRenderer(settings);
		
		(settings.parentElement || document.body).appendChild(this.renderer.domElement);
		
		this.renderer.setClearColor(settings.clearColor || "black");
		
		this.renderer.setPixelRatio(settings.pixelRatio || devicePixelRatio);
		
		return 
	}
	resizeRender(){// Изменить размер окна рендера
		
		var dom = this.renderer.domElement.parentNode;
		
		this.renderer.setSize(dom.offsetWidth,dom.offsetHeight);
		
	}
	render(){// Отрисовать сцену из камеры
		this.renderer.render(this.scene,this.camera);
	}
	//CAMERA
	addCamera(settings){// Создать камеру на основе параметров или заменить существующую settings - параметры иди новая камера
		
		if(settings.isCamera){this.camera = settings; return;}
		
		settings.type = settings.type || "PerspectiveCamera";
		
		if(settings.type === "PerspectiveCamera"){
			
			var canvas = this.renderer.domElement;
		
			this.camera = new THREE.PerspectiveCamera(
				settings.fov || 45,
				canvas.width/canvas.height || 1,
				settings.near || 1,
				settings.far || 100
			)
			
		}
		else if(settings.type === "OrtographicCamera"){
			
			this.camera = new THREE.OrthographicCamera(
				settings.left || -1,
				settings.right || 1,
				settings.top || 1,
				settings.bottom || -1,
				settings.near || 1,
				settings.far || 100
			);
			
			this.sideSize = settins.sideSize || 1;
		}
	}
	
	setDefaultCameraPosition(){// положение  камеры по умолчанию.
		
		this.camera.position.set(5,5,10);
		
		this.camera.lookAt(0,0,0);
	}
	
	resizeCamera(){// Изменить отношение сторон камеры
		if(this.camera.isPerspectiveCamera){
			
			this.camera.aspect = this.renderer.domElement.width/this.renderer.domElement.height;
		
			this.camera.updateProjectionMatrix();
			
		}
		else if(this.camera.isOrthographicCamera){
			
			var aspect = this.renderer.domElement.width/this.renderer.domElement.height;
			
			this.camera.left = -this.sideSize*aspect;
			
			this.camera.right = this.sideSize*aspect;
		
			this.camera.top = this.sideSize;
			
			this.camera.bottom = -this.sideSize;
			
			this.camera.updateProjectionMatrix();
		}
	}
}


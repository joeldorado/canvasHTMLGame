//Objetos importantes de canvas.
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
//crear el objeto de la nave
var nave = {x:100,y:canvas.height -90,width:50,height:50,contador:0};
var teclado ={};
//audio
var startGame,soundShoot,soundInvaderShoot,soundDeadSpaceInvader,soundEndGame;
//Array disparos
var disparos =[];
//disparos Enemigos
var disparosEnemigos = [];
//Array Enemigos
var enemgios = [];
//Definir varibales para las imagenes
var fondo,imgNave,imgEnemigo,imgDisparo,imgDisparoEnemigo;
//Estado del juego
var juego ={
	estado:'iniciando'
};
var textoRespuesta = {
	contador:-1,
	titulo:'',
	subtitulo:''
}
var imagenes = ['monster.png','spaceShip.png','enemyLaser.png','laser.png','bg.JPG'];
var preloader;
 
function cargar(){
	while(imagenes.length > 0){
		var imagen = imagenes.shift(); 
		preloader.loadFile(imagen);
	}
} 
function progresoCarga(){
	console.log(parseInt(preloader.progress * 100)+"%");
	if(preloader.progress == 0){ 
		var intervalo = window.setInterval(frameLoop,100/5);
			fondo = new Image();
			fondo.src ='bg2.png';
			imgNave = new Image();
			imgNave.src ='spaceShip.png';	
			imgEnemigo = new Image();
			imgEnemigo.src='monster.png';	
			imgDisparo = new Image();    
			imgDisparo.src='laser.png';
			imgDisparoEnemigo = new Image();
			imgDisparoEnemigo.src='enemyLaser.png';		
			soundShoot = document.createElement('audio');
			document.body.appendChild(soundShoot);
			soundShoot.setAttribute('src','shoot.wav');
		 
			soundInvaderShoot = document.createElement('audio');
			document.body.appendChild(soundInvaderShoot);
			soundInvaderShoot.setAttribute('src','EnemyShoot.flac');
			
			soundEndGame = document.createElement('audio');
			document.body.appendChild(soundEndGame);
			soundEndGame.setAttribute('src','11 -  Fanfare.mp3');
		
			startGame = document.createElement('audio');
			document.body.appendChild(startGame);
			startGame.setAttribute('src','20 - Still more Fighting.mp3');
	}  
 
}
//Definicion de funciones
function loadMedia(){ 
	preloader = new createjs.LoadQueue();    
	preloader.onProgress = progresoCarga();
	cargar();
}  
function drawEnemigos(){
	for(var i in enemgios){
		var enemigo = enemgios[i];
		ctx.save();
		if(enemigo.estado == 'vivo'){ctx.fillStyle='green';}
		if(enemigo.estado == 'muerto'){ctx.fillStyle='rgba(248, 248, 248, 0)';}
		ctx.drawImage(imgEnemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		
	}   
} 
function drawBackground(){  
		ctx.drawImage(fondo,0,0);  
		
		
	}
function drawDisparosEnemigos(){ 
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		ctx.save();
		ctx.fillStyle='orange';
		ctx.drawImage(imgDisparoEnemigo,disparo.x,disparo.y,disparo.width,disparo.height); 
		ctx.restore();
	} 

}
function moverDisparosEnemigos(){
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		disparo.y +=3;
	}
	disparosEnemigos = disparosEnemigos.filter(function(disparo){
		return disparo.y < canvas.height;
	 
	});
}

function drawNave(){  
		ctx.save();
		ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
	}
function agregarEventosTeclado(){
	agregarEventos(document,"keydown",function(e){
		//ponemos en true tecla presionada
		teclado[e.keyCode] = true;
	
	});
	agregarEventos(document,"keyup",function(e){
		//ponemos en true falso soltada
		teclado[e.keyCode] = false;
	
	}); 
	function agregarEventos(elemento,nombreEvento,funcion){
		if(elemento.addEventListener){
			//Navegadores mayoria  
			elemento.addEventListener(nombreEvento,funcion,false);
		}else if(elemento.attachEvent){
			//Internet Explorer
			elemento.attachEvent(nombreEvento,funcion);
		}
	}
}
function moverNave(){
//movimineto a la izquierda
	if(teclado[37]){
	
		nave.x -= 10;
		
		if(nave.x < 0){nave.x =0;}
		
	}
	//movimiento a la derecha
	if(teclado[39]){
	var limite = canvas.width - nave.width;
	
		nave.x += 10;
		
		if(nave.x > limite){nave.x =limite;}
		
	} 
	if(teclado[32]){
	//disparos
		if(!teclado.fire){
			fire();
			teclado.fire = true
			}
		
	}else {teclado.fire = false;}
	if(nave.estado == 'golpe'){
		nave.contador++;
		if(nave.contador >= 20){
			soundEndGame.play();
			nave.contador = 0;
			nave.estado = 'muerto';  
			juego.estado = 'perdido';
			textoRespuesta.titulo ='Game Over';
			textoRespuesta.subtitulo ='Preciona R para continuar';
			textoRespuesta.contador =0;
			startGame.pause();
			startGame.currentTime = 0;
		}
	}
}
function actualizaEnemigos(){
	function agregarDisparosEnemigo(enemigo){
		return{
			x: enemigo.x,
			y: enemigo.y,
			width: 10,
			height:33,
			contador:0
		}
	}  
	if(juego.estado == 'iniciando'){
		for(var i = 0; i<10; i++){
			enemgios.push({
				x:10 + (i*50),
				y:10,
				height:40,
				width:40,
				estado:'vivo',
				contador:0
			}); 
			
		}  
		juego.estado = 'jugando';
	}  
		for(var i in enemgios){
			var enemigo = enemgios[i];
			if(!enemigo){continue;}
			if(enemigo && enemigo.estado == 'vivo'){
				enemigo.contador++; 
				enemigo.x += Math.sin(enemigo.contador * Math.PI/90)*5;
				if(aleatorio(0,enemgios.length * 10) == 4){
					disparosEnemigos.push(agregarDisparosEnemigo(enemigo));
				}
			}  
			if(enemigo && enemigo.estado == 'golpe'){
				enemigo.contador++;
				if(enemigo.contador >= 20){
					 enemigo.estado = 'muerto'; 
					 enemigo.contador = 0;
				}
			}	 
		}  
	  enemgios = enemgios.filter(function(enemigo){
		if(enemigo && enemigo.estado != 'muerto'){return true;}else{return false;}
	}); 
}  
function moveDisparos(){
	for(var i in disparos){ 
		var disparo = disparos[i];
		disparo.y -= 2;	
	}
	disparos = disparos.filter(function(disparo){
			return disparo.y > 0;
		 
		});
}
function fire(){ 
		soundShoot.pause();
		soundShoot.currentTime = 0;
		soundShoot.play();
	disparos.push({ 
		x: nave.x + 20,
		y: nave.y - 10,
		width:10, 
		height:30
	});      
}
function dibujarDisparos(){
	ctx.save();
	ctx.fillStyle= 'white';   
	for(var i in disparos){
		var disparo = disparos[i];
		ctx.drawImage(imgDisparo,disparo.x,disparo.y,disparo.width,disparo.height); 
	} 
	ctx.restore(); 
}  
function golpe(a,b){
	var golpe= false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width){
		if(b.y +b.height >= a.y && b.y  < a.y + a.height){
		golpe =true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x +a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			golpe =  true;
		}
	}  
	if(a.x <= b.x && a.x + a.width >= b.x +b.width){
		if(a.y <= b.y && a.y + a.height >= b.y + b.height){
			golpe =  true;
		}
	}
	return golpe;
}
function verificarContacto(){
	for(var i in disparos){
		var disparo = disparos[i];
		for(j in enemgios){
			var enemigo = enemgios[j];
			if(golpe(disparo,enemigo)){
				enemigo.estado ='golpe';
				enemigo.contador = 0;
				
			}
		}  
	} 
	if(nave.estado == 'golpe' || nave.estado == 'muerto'){return;}
	for(var i in disparosEnemigos){
		var disparo =  disparosEnemigos[i];
		if(golpe(disparo,nave)){
			nave.estado = 'golpe';
		}
	}
}

function aleatorio(inferior,superior){
	var posibilidades = superior - inferior;
	var a = Math.random() * posibilidades;
	a = Math.floor(a); 
	return parseInt(inferior) + a;
} 
function dibujaTexto(){
	if(textoRespuesta.contador == -1){return;}else{
		var alpha = textoRespuesta.contador/50.0;
		if(alpha > 1){
			for(var i in enemgios){
				delete enemgios[i];
			}
		}
		ctx.save();
		ctx.globalAlpha = alpha;
		if(juego.estado == 'perdido'){
			ctx.fillStyle = 'white';
			ctx.font = 'Bold 40pt Arial';
			ctx.fillText(textoRespuesta.titulo,140,200);
			ctx.font = '14pt Arial';
			ctx.fillText(textoRespuesta.subtitulo,190,250);
			
		}
		if(juego.estado == 'victoria'){
			ctx.fillStyle = 'white';
			ctx.font = 'Bold 40pt Arial';
			ctx.fillText(textoRespuesta.titulo,120,200);
			ctx.font = '14pt Arial';
			ctx.fillText(textoRespuesta.subtitulo,190,250);
		
		}
	} 
}
function actualizarEstadoJuego(){
	if(juego.estado == 'jugando' && enemgios.length == 0){
		juego.estado ='victoria';

		textoRespuesta.titulo ='Derrotaste a los enemigos';
		textoRespuesta.subtitulo ='R para reiniciar'; 
		textoRespuesta.contador =0;
		startGame.pause();
	}
	if(textoRespuesta.contador >= 0){
		textoRespuesta.contador++;
	}   
	if((juego.estado == 'perdido' || juego.estado == 'victoria') && teclado[82]){
		soundEndGame.pause();
		soundEndGame.currentTime = 0; 
		startGame.play(); 
		juego.estado = 'iniciando';
		nave.estado = 'vivo';
		textoRespuesta.contador = -1;
	} 
}  
function frameLoop(){
		actualizarEstadoJuego();
		moverNave();
		actualizaEnemigos();
		moverDisparosEnemigos();
		moveDisparos();
		drawBackground();
		drawDisparosEnemigos();
		verificarContacto();
		drawEnemigos();  
		dibujarDisparos();
		dibujaTexto(); 
		drawNave(); 
	}

//ejecucion de funciones
window.addEventListener('load',init);
	function init(){
		agregarEventosTeclado();
		loadMedia(); 
		startGame.play();  
		
	
	}



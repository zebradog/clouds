var CAMERA_YAW = 0;
var CAMERA_ROLL = 0;
var CAMERA_ZOOM = 0;
var CAMERA_X = 0;
var CAMERA_Y = 0;
var SENSITIVITY = 0.1;

(function() {

	   var gui = new dat.GUI();
	   gui.remember(window);
	   gui.add(window,"CAMERA_YAW",-180,180).onChange(function(value) {
			updateCamera();
		});
	   gui.add(window,"CAMERA_ROLL",-180,180).onChange(function(value) {
			updateCamera();
		});
		gui.add(window,"CAMERA_ZOOM",-500,500).onChange(function(value) {
			updateCamera();
		});
		gui.add(window,"CAMERA_X",-500,500).listen().onChange(function(value) {
			updateCamera();
		});
		gui.add(window,"CAMERA_Y",-500,500).listen().onChange(function(value) {
			updateCamera();
		});
		gui.add(window,"SENSITIVITY",0,1);
		cloudGUI = gui.addFolder('Clouds');

		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+
			  'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}())

	var layers = [],
		objects = [],
		cloudGUI,
		world = document.getElementById( 'world' ),
		viewport = document.getElementById( 'viewport' ),
		
		d = 0,
		p = 400,
		worldXAngle = 0,
		worldYAngle = 0;
	
	viewport.style.webkitPerspective = p;
	viewport.style.MozPerspective = p;
	viewport.style.oPerspective = p;
	
	generate();
	
	function createCloud() {
	
		var div = document.createElement( 'div'  );
		div.className = 'cloudBase';
		var x = 256 - ( Math.random() * 512 );
		var y = 256 - ( Math.random() * 512 );
		var z =  180 +  ( Math.random() * 20 );
		div.data = { 
				x: x,
				y: y,
				z: z
		};		
		var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
		div.style.webkitTransform = t;
		div.style.MozTransform = t;
		div.style.oTransform = t;
		
		var cloudController = cloudGUI.addFolder("Cloud "+objects.length);
		cloudController.add(div.data,"x",-512,512).onChange(function(value) {
		  updateCloud(div);
		});
		cloudController.add(div.data,"y",-512,512).onChange(function(value) {
		   updateCloud(div);
		});
		cloudController.add(div.data,"z",-512,512).onChange(function(value) {
		   updateClouds(div);
		});
		
		world.appendChild( div );
		
		for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
			var cloud = document.createElement( 'img' );
			cloud.style.opacity = 0;
			var r = Math.random();
			var src = 'cloud.png';
			( function( img ) { img.addEventListener( 'load', function() {
				img.style.opacity = .8;
			} ) } )( cloud );
			cloud.setAttribute( 'src', src );
			cloud.className = 'cloudLayer';
			
			var x = 256 - ( Math.random() * 512 );
			var y = 256 - ( Math.random() * 512 );
			var z = -50 + ( Math.random() * 180 );
			var a = Math.random() * 360;
			var s = .25 + Math.random();
			x *= .2; y *= .2;
			cloud.data = { 
				x: x,
				y: y,
				z: z,
				a: a,
				s: s,
				speed: .1 * Math.random()
			};
			var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
			
			cloud.style.webkitTransform = t;
			cloud.style.MozTransform = t;
			cloud.style.oTransform = t;
			
			div.appendChild( cloud );
			layers.push( cloud );
		}
		return div;
	}
	
	
	function generate() {
		objects = [];
		if ( world.hasChildNodes() ) {
			while ( world.childNodes.length >= 1 ) {
				world.removeChild( world.firstChild );       
			} 
		}
		for( var j = 0; j < 5; j++ ) {
			objects.push( createCloud() );
		}
	}
	
	function updateCamera() {
		worldYAngle = CAMERA_YAW;
		worldXAngle = CAMERA_ROLL;
		d = CAMERA_ZOOM;
		var t = 'translateY( ' + CAMERA_Y + 'px ) translateX( ' + CAMERA_X + 'px ) translateZ( ' + d + 'px ) rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
		world.style.webkitTransform = t;
		world.style.MozTransform = t;
		world.style.oTransform = t;
	}

	function updateClouds() {
		for(var i = 0; i < objects.length; i++) updateCloud(objects[i]);
	}
	
	function updateCloud(c){
		var t = 'translateX( ' + c.data.x + 'px ) translateY( ' + c.data.y + 'px ) translateZ( ' + c.data.z + 'px )';
		c.style.webkitTransform = t;
		c.style.MozTransform = t;
		c.style.oTransform = t;
	}
	
	function update (){
		
		for( var j = 0; j < layers.length; j++ ) {
			var layer = layers[ j ];
			layer.data.a += layer.data.speed;
			var t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + ( - worldYAngle ) + 'deg ) rotateX( ' + ( - worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
			layer.style.webkitTransform = t;
			layer.style.MozTransform = t;
			layer.style.oTransform = t;
		}
		
		requestAnimationFrame( update );
	}

	window.addEventListener( 'mousemove', function( e ) {
		CAMERA_X = (e.clientX - window.innerWidth / 2) * SENSITIVITY;
		CAMERA_Y = (e.clientY - window.innerHeight / 2) * SENSITIVITY;
		updateCamera();
	} );
	
	update();

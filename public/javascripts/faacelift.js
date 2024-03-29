if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;

var mesh, group1, light;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1800;

  scene = new THREE.Scene();

  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  light.position.normalize();
  scene.add( light );

  var shadowMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/shadow.png' ) } );
  var shadowGeo = new THREE.PlaneGeometry( 300, 300, 1, 1 );

  mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
  mesh.position.y = - 250;
  scene.add( mesh );

  var faceIndices = [ 'a', 'b', 'c', 'd' ];

  var color, f, p, n, vertexIndex,
    sphereRadius = 1,
    sphereDiameter = 2 * Math.PI * sphereRadius,
    geometry = new THREE.SphereGeometry( sphereRadius, 30, 15 );

  var photoData = Faacelift.photos[1],
    photoTex = THREE.ImageUtils.loadTexture( '/proxy?src=' + photoData.url )
    photoScale = 1; //100 / photoData.tags[0].height;

  photoTex.repeat.x = photoScale;
  photoTex.repeat.y = photoScale;
  
  photoTex.offset.x = 0; // -1 * ((photoData.tags[0].nose.x / 100) - 0.5);
  photoTex.offset.y = (photoData.tags[0].nose.y / 100) - 0.5;

  var materials = [
    new THREE.MeshLambertMaterial( { ambient: 0xffffff, map: photoTex } ),
    new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )
  ];

  group1 = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
  group1.position.x = 0;
  group1.rotation.x = 0;
  group1.scale.set( 200, 200, 200 );
  scene.add( group1 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}
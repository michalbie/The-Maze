import Camera from "./components/Camera.js";

window.addEventListener("load", function () {
	var scene = new THREE.Scene();
	var axes = new THREE.AxesHelper(1000);
	var geometry = new THREE.BoxGeometry(100, 100, 100);
	var material = new THREE.MeshBasicMaterial({
		color: 0x8888ff,
		side: THREE.DoubleSide,
		wireframe: false,
		transparent: true,
		opacity: 0.5,
	});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	scene.add(axes);

	//this.camera = new Camera();

	var camera = new THREE.PerspectiveCamera(
		45, // kąt patrzenia kamery (FOV - field of view)
		16 / 9, // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
		0.1, // minimalna renderowana odległość
		10000 // maksymalna renderowana odległość od kamery
	);

	var renderer = new THREE.WebGLRenderer();

	// kolor tła sceny - uwaga na prefix 0x a nie #
	renderer.setClearColor(0xffffff);

	// ustal rozmiary renderowanego okna w px (szer, wys)
	renderer.setSize(window.innerWidth, window.innerHeight);

	// dodanie renderera do diva, który istnieje na scenie

	$("#root").append(renderer.domElement);

	// lub
	camera.position.set(100, 100, 100);

	// nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)
	camera.lookAt(scene.position);

	// kluczowy element - animacja
	function render() {
		//w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
		//np zmieniająca się wartość rotacji obiektu

		cube.rotation.y += 0.01;
		camera.fov = 100;
		camera.updateProjectionMatrix();

		//wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

		requestAnimationFrame(render);

		// potwierdzenie w konsoli, że render się wykonuje

		console.log("render leci");

		//ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

		renderer.render(scene, camera);
	}

	// na koniec jednokrotne wykonanie powyższej funkcji
	render();
});

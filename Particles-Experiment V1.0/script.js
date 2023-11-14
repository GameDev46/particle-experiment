import { piCollide } from "/piCollide.js";

// Setup scene

piCollide.setupScene("#131313");

let gravitationalConstant = 0.1

let attractions = [[-0.5, -0.7, 3, 0, 0], [0, -0.2, 10, 0, 0], [0, 0, -0.2, 0, 0], [0, 0, 0, -0.2, 10], [0, 0, 0, 0, -0.2]];

let masses = [60, 60, 60, 60, 60];

// Listeners

let particleTypeToAttract = -1

document.getElementById("attractionSelector").addEventListener("change", e => {

	particleTypeToAttract = Number(document.getElementById("attractionSelector").value)

})

document.getElementById("graviConst").addEventListener("change", e => {

	gravitationalConstant = Number(document.getElementById("graviConst").value)

})

document.getElementById("drag").addEventListener("change", e => {

	piCollide.drag = Number(document.getElementById("drag").value)

})

document.getElementById("gravity").addEventListener("change", e => {

	piCollide.gravity = Number(document.getElementById("gravity").value)

})

document.getElementById("openMatrix").addEventListener("click", e => {

	if (document.getElementById("matrix").style.transform == "scale(1)") {

		document.getElementById("matrix").style.transform = "scale(0)";
		document.getElementById("openMatrix").innerText = "Open Matrix";

	} else {

		document.getElementById("matrix").style.transform = "scale(1)";
		document.getElementById("openMatrix").innerText = "Close Matrix";

	}

})

// Particle matrix

let attractMatrixItems = document.querySelectorAll(".attractMatItem")

for (let i = 0; i < attractMatrixItems.length; i++) {

	// Set default values

	let secClass = attractMatrixItems[i].classList[1]
	secClass = secClass.split("-")

	attractMatrixItems[i].value = attractions[Number(secClass[0])][Number(secClass[1])]

	// Setup listeners

	attractMatrixItems[i].addEventListener("change", e => {

		let val = Number(attractMatrixItems[i].value)

		let secClass = attractMatrixItems[i].classList[1]
		secClass = secClass.split("-")

		attractions[Number(secClass[0])][Number(secClass[1])] = val

	});

}

let massMatrixItems = document.querySelectorAll(".massMatItem")

for (let i = 0; i < massMatrixItems.length; i++) {

	// Set default values

	let secClass = massMatrixItems[i].classList[1]
	massMatrixItems[i].value = masses[Number(secClass[0])]

	// Setup listeners

	massMatrixItems[i].addEventListener("change", e => {

		let val = Number(massMatrixItems[i].value)

		let secClass = massMatrixItems[i].classList[1]
		masses[Number(secClass[0])] = val

		updateMasses()

	});

}

function updateMasses() {

	for (let x = 0; x < piCollide.objects.length; x++) {

		piCollide.objects[x].mass = masses[piCollide.objects[x].particleType];
		piCollide.objects[x].radius = masses[piCollide.objects[x].particleType] / 30;

	}

}

// Movement

function processMovement(delta) {
	let speed = 1000;

	if (piCollide.keyboard["W"]) piCollide.camera.position.y -= speed * delta;
	if (piCollide.keyboard["S"]) piCollide.camera.position.y += speed * delta;

	if (piCollide.keyboard["A"]) piCollide.camera.position.x -= speed * delta;
	if (piCollide.keyboard["D"]) piCollide.camera.position.x += speed * delta;
}

function effectCircles(delta) {

	if (piCollide.mouse.isDown[0]) {

		for (let x = 0; x < piCollide.objects.length; x++) {

			if (piCollide.objects[x].particleType == particleTypeToAttract || particleTypeToAttract == -1) {

				worldCenter.position.set(piCollide.mouse.position.x, piCollide.mouse.position.y);
				piCollide.attract(worldCenter, piCollide.objects[x], 500, delta * 100);

			}

		}

	}

	if (piCollide.mouse.isDown[2]) {

		for (let x = 0; x < piCollide.objects.length; x++) {

			if (piCollide.objects[x].particleType == particleTypeToAttract || particleTypeToAttract == -1) {

				worldCenter.position.set(piCollide.mouse.position.x, piCollide.mouse.position.y);
				piCollide.attract(worldCenter, piCollide.objects[x], -1, delta * 100);

			}

		}

	}

}

function loadScene() {

	piCollide.camera.position.set(0, 0);

	// Planet formation simulation

	piCollide.gravity = 0;
	piCollide.drag = 1;

	piCollide.colourBasedOnPressure = false;
	piCollide.colourBasedOnVelocity = false;

	let size = 22;
	let maxVel = 60;
	let spacing = 50

	let centerPos = {
		x: piCollide.canvas.width / 2,
		y: piCollide.canvas.height / 2
	}


	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {

			let r = 2

			let circleObject = piCollide.circleGeometry({
				radius: r,
				mass: r * 30,
				colour: piCollide.rgba(255, 255, 255, 1),
				bounce: 1,
				effects: {
					bloom: {
						strength: 0.2,
						diffuse: 2
					}
				}
			});

			circleObject.position.set((x * spacing) + centerPos.x - (size * spacing * 0.5), (y * spacing) + centerPos.y - (size * spacing * 0.5));
			circleObject.velocity.set((Math.random() * maxVel * 2) - maxVel, (Math.random() * maxVel * 2) - maxVel);

			circleObject.minDistance = 3;

			//let randomChance = Math.random()

			let randomChance = x / size

			if (randomChance > 0.8) {

				circleObject.particleType = 0
				circleObject.colour = piCollide.rgba(190, 0, 0, 1)

			} else if (randomChance > 0.6) {

				circleObject.particleType = 1
				circleObject.colour = piCollide.rgba(0, 0, 190, 1)

			} else if (randomChance > 0.4) {

				circleObject.particleType = 2
				circleObject.colour = piCollide.rgba(190, 0, 190, 1)

			} else if (randomChance > 0.2) {

				circleObject.particleType = 3
				circleObject.colour = piCollide.rgba(190, 190, 0, 1)

			} else {

				circleObject.particleType = 4
				circleObject.colour = piCollide.rgba(0, 190, 0, 1)

			}

			// Add a bounding box

			circleObject.boundingBox = {
				active: true,
				center: {
					x: 0,
					y: 0
				},
				scale: {
					x: piCollide.canvas.width,
					y: piCollide.canvas.height
				}
			}

			piCollide.addObject(circleObject);

		}

	}

}

function scenePhysics(delta) {

	for (let x = 0; x < piCollide.objects.length; x++) {

		for (let y = 0; y < piCollide.objects.length; y++) {

			let type0 = piCollide.objects[x].particleType == 0
			let type1 = piCollide.objects[x].particleType == 1
			let type2 = piCollide.objects[x].particleType == 2
			let type3 = piCollide.objects[x].particleType == 3
			let type4 = piCollide.objects[x].particleType == 4

			let type0ToType0 = type0 && piCollide.objects[y].particleType == 0

			let type1ToType1 = type1 && piCollide.objects[y].particleType == 1

			let type2ToType2 = type2 && piCollide.objects[y].particleType == 2

			let type3ToType3 = type3 && piCollide.objects[y].particleType == 3

			let type4ToType4 = type4 && piCollide.objects[y].particleType == 4

			// Different type collisions

			let type0ToType1 = type0 && piCollide.objects[y].particleType == 1

			let type0ToType2 = type0 && piCollide.objects[y].particleType == 2

			let type0ToType3 = type0 && piCollide.objects[y].particleType == 3

			let type0ToType4 = type0 && piCollide.objects[y].particleType == 4


			let type1ToType2 = type1 && piCollide.objects[y].particleType == 2

			let type1ToType3 = type1 && piCollide.objects[y].particleType == 3

			let type1ToType4 = type1 && piCollide.objects[y].particleType == 4


			let type2ToType3 = type2 && piCollide.objects[y].particleType == 3

			let type2ToType4 = type2 && piCollide.objects[y].particleType == 4


			let type3ToType4 = type3 && piCollide.objects[y].particleType == 4

			// Type 0 rules - red to red

			if (type0ToType0) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[0][0], delta);
			}

			// Type 1 rules - blue to blue

			if (type1ToType1) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[1][1], delta);
			}

			// Type 2 rules - purple to purple

			if (type2ToType2) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[2][2], delta);
			}

			// Type 3 rules - yellow to yellow

			if (type3ToType3) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[3][3], delta);
			}

			// Type 4 rules - green to green

			if (type4ToType4) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[4][4], delta);
			}

			// Mixed rules

			// Blue To Red

			if (type0ToType1) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[0][1], delta);
			}


			// Red to purple

			if (type0ToType2) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[0][2], delta);
			}

			// Blue to purple

			if (type1ToType2) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[1][2], delta);
			}

			// Red to yellow

			if (type0ToType3) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[0][3], delta);
			}

			// Blue to yellow

			if (type1ToType3) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[1][3], delta);
			}

			// Purple to yellow

			if (type2ToType3) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[2][3], delta);
			}

			// Red to Green

			if (type0ToType4) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[0][4], delta);
			}

			// Yellow to Green

			if (type3ToType4) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[3][4], delta);
			}

			// Purple to Green

			if (type2ToType4) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[2][4], delta);
			}

			// Blue to Green

			if (type1ToType4) {
				piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant * attractions[1][4], delta);
			}

		}

	}

}

// Game loop

loadScene()

let worldCenter = piCollide.emptyObject();

worldCenter.position.set(300, 300);
worldCenter.minDistance = 5;
worldCenter.mass = 100;

let physicsSubSteps = 2;

function worldUpdate() {

	let delta = piCollide.calculateDelta();

	delta = delta / physicsSubSteps;

	processMovement(delta)

	effectCircles(delta);

	for (let i = 0; i < physicsSubSteps; i++) {

		scenePhysics(delta);

		piCollide.updatePhysics(delta);
		piCollide.updatePositions(delta);

	}

	piCollide.renderScene();

	requestAnimationFrame(worldUpdate);
}

requestAnimationFrame(worldUpdate);


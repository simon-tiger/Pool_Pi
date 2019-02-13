/*
    Inspired by a video by 3blue1brown
    initial processing implementation: Simon Tiger
    fixed p5 implementation: Matei Adriel
*/

type Vector2 = [number,number] | Array<number>;

let inputs:Array<any> = [];

let masses: Vector2,
    lastNumberOfmirrors: number;

let positions: Vector2,
    initialPositions: Vector2,
    velocities: Vector2,
    initialVelocities: Vector2;

let collisions = 0;

const wallX = 0, h = 400, blockSize = 40;

function setup() {
    createCanvas(400, h);
    background(100, 200, 40);

    //setting up default values
    //i use the spread operator because i dont want 
    //to have a reference to the original array
    initialPositions = [100,300];
    positions = [...initialPositions];

    initialVelocities = [0,-5];
    velocities = [...initialVelocities];

    masses = [1, 1];

    //setup inputs
    createDiv("Mass of the second body");
    inputs[0] = createInput("1");
    inputs[0].input(function(){
        masses[1] = parseFloat(this.value());
        // console.log("yay");
        restart();
    });
    createDiv("Initial speed of the second body");
    inputs[1] = createInput("-5");
    inputs[1].input(function(){
        initialVelocities[1] = parseFloat(this.value());
        restart();
    });
}

function restart(){
    collisions = 0;
    positions = [...initialPositions];
    velocities = [...initialVelocities];
}

function draw() {
    clear();
    background(100, 200, 40);

    //i keep looping till i get a frame without collisions,
    //because drawing stuff during a collision may look weird
    while (true) {

        //move bodies
        positions[0] += velocities[0];
        positions[1] += velocities[1];

        //check for collision with wall
        const collidedWithWall = (positions[0] <= wallX);

        //check for collision with walls or between blocks
        if (collidedWithWall || positions[0] + blockSize > positions[1]) {
            //solve collision by moving bodies back
            positions[0] -= velocities[0];
            positions[1] -= velocities[1];

            //if collided with wall, just reverse the direction
            if (collidedWithWall) {
                velocities[0] *= -1;
            }
            else {
                //using the conservation of momentum
                const momentum = masses[0] * velocities[0] + masses[1] * velocities[1];
                const v1 = (momentum - masses[1] * (velocities[0] - velocities[1]))
                    / (masses[0] + masses[1]);
                const v2 = (momentum - masses[0] * v1) / masses[1];

                velocities = [v1, v2];
            }

            //increase collision count
            collisions++;
        }
        else break; //if we dont have any collisions, we can draw the stuff on the screen
    }

    //display rects
    rect(positions[0], h / 2 - blockSize / 2, blockSize, blockSize);
    rect(positions[1], h / 2 - blockSize / 2, blockSize, blockSize);

    //display number of collisions
    text(`Collision count: ${collisions}`, 30, 30);
}
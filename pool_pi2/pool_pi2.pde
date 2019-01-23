Block block1;
Block block2;

void setup() {
  size(640, 360);
  
  block1 = new Block(100);
  block1.initPosition(width/2, height/2);
  block1.initVelocity(-0.5, 0);
  
  block2 = new Block(1);
  block2.initPosition(width/4, height/2);
  block2.initVelocity(0, 0);
}

void draw() {
  background(255);
  
  block2.checkCollision(block1);
  block1.checkCollision(block2);
  
  block1.draw();
  block2.draw();
  
  fill(0);
  text("Collisions: " + counter, 10, 20);
}

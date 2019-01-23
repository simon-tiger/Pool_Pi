import shiffman.box2d.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;

Box2DProcessing box2d;

Block block1;
Block block2;
Block wall;

void setup() {
  size(640, 360);
  
  box2d = new Box2DProcessing(this);  
  box2d.createWorld();
  box2d.setGravity(0, 0);
  
  block1 = new Block(width/4, height/2, 72, 72, BodyType.DYNAMIC);
  block2 = new Block(width/2, height/2, 72, 72, BodyType.DYNAMIC);
  wall = new Block(10, height/2, 20, height, BodyType.STATIC);
}

void draw() {
  background(255);
  block1.draw();
  block2.draw();
  wall.draw();
}

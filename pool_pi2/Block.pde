int counter;

class Block {
  PVector pos;
  PVector vel;
  PVector acc;
  float mass;
  
  Block(float m) {
    mass = m;
    acc = new PVector();
  }
  
  void initPosition(float x, float y) {
    pos = new PVector(x, y);
  }
  
  void initVelocity(float dx, float dy) {
    vel = new PVector(dx, dy);
  }
  
  void update() {
    vel.add(acc);
    pos.add(vel);
    acc.set(0, 0);
    
    if (pos.x <= 36) {
      pos.x = 36;
      vel.x *= -1;
      counter++;
    }
  }

  void checkCollision(Block other) {

    // Get distances between the balls components
    PVector distanceVect = PVector.sub(other.pos, pos);

    // Calculate magnitude of the vector separating the balls
    float distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    float minDistance = 72;

    if (distanceVectMag < minDistance) {
      float distanceCorrection = (minDistance-distanceVectMag)/2.0;
      PVector d = distanceVect.copy();
      PVector correctionVector = d.normalize().mult(distanceCorrection);
      other.pos.add(correctionVector);
      pos.sub(correctionVector);

      // get angle of distanceVect
      float theta  = distanceVect.heading();
      // precalculate trig values
      float sine = sin(theta);
      float cosine = cos(theta);

      /* bTemp will hold rotated ball positions. You 
       just need to worry about bTemp[1] position*/
      PVector[] bTemp = {
        new PVector(), new PVector()
      };

      /* this ball's position is relative to the other
       so you can use the vector between them (bVect) as the 
       reference point in the rotation expressions.
       bTemp[0].position.x and bTemp[0].position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
      bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
      bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;

      // rotate Temporary velocities
      PVector[] vTemp = {
        new PVector(), new PVector()
      };

      vTemp[0].x  = cosine * vel.x + sine * vel.y;
      vTemp[0].y  = cosine * vel.y - sine * vel.x;
      vTemp[1].x  = cosine * other.vel.x + sine * other.vel.y;
      vTemp[1].y  = cosine * other.vel.y - sine * other.vel.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final velocity along the x-axis. */
      PVector[] vFinal = {  
        new PVector(), new PVector()
      };

      // final rotated velocity for b[0]
      vFinal[0].x = ((mass - other.mass) * vTemp[0].x + 2 * other.mass * vTemp[1].x) / (mass + other.mass);
      vFinal[0].y = vTemp[0].y;

      // final rotated velocity for b[0]
      vFinal[1].x = ((other.mass - mass) * vTemp[1].x + 2 * mass * vTemp[0].x) / (mass + other.mass);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate ball positions and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
      // rotate balls
      PVector[] bFinal = { 
        new PVector(), new PVector()
      };

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update balls to screen position
      other.pos.x = pos.x + bFinal[1].x;
      other.pos.y = pos.y + bFinal[1].y;

      pos.add(bFinal[0]);

      // update velocities
      vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
      vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
      other.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
      other.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
      counter++;
    }
  }
  
  void applyForce(float ddx, float ddy) {
    PVector w = new PVector(ddx, ddy);
    w.div(mass);
    acc.add(w);
  }
  
  void draw() {
    update();
    
    stroke(0);
    strokeWeight(2);
    fill(127);
    
    ellipse(pos.x, pos.y, 72, 72);
  }
}

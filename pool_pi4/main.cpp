#include <iostream>
using namespace std;

class Block {
  public:
    float speed;
    float mass;
    float position;

    Block(float _speed, float _mass, float _position)
      : speed(_speed)
      , mass(_mass)
      , position(_position)
    { }

    void update() {
      position += speed;
    }

    void deUpdate() {
      position -= speed;
    }

    void invertSpeed() {
      speed = -speed;
    }
};

int main() {
  // Block(<speed>, <mass>, <positionX>)
  Block b1 = Block(0, 1, 1);
  Block b2 = Block(-1, 10000, 3);
  
  int collisions = 0;
  
  while (true) {
    b1.update();
    b2.update();

    // Using redundant code to prevent multiple if-statements
    if (b1.position <= 0) {
      b1.deUpdate();
      b2.deUpdate();
      collisions++;

      b1.invertSpeed();
    } else if (b1.position + 1 >= b2.position) {
      b1.deUpdate();
      b2.deUpdate();
      collisions++;

      float momentum = b1.mass * b1.speed + b2.mass * b2.speed;
      b1.speed = (momentum - b2.mass * (b1.speed - b2.speed)) / (b1.mass + b2.mass);
      b2.speed = (momentum - b1.mass * b1.speed) / b2.mass;
    }

    // cout << "x1: " << b1.position << "  v1: " << b1.speed << endl;
    // cout << "x2: " << b2.position << "  v2: " << b2.speed << endl;

    cout << "Collisions: " << collisions << endl;
  }

  return 0;
}

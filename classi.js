//=====================PLAYER======================
class Player {
  // creo una classe player
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.direction = {
      x: 0,
      y: 0,
    };
  }
  draw() {
    c.save();
    c.beginPath();
    c.shadowBlur = 5;
    c.shadowColor = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //x, y, raggio, da 0 a 360 gradi, non in senso antiorario
    c.fillStyle = this.color; // imposto un colore
    c.fill(); // disegno
    c.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.direction.x;
    this.y = this.y + this.direction.y;
  }
}

//=====================PROJECTILE======================
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.save();
    c.beginPath();
    c.shadowBlur = 5;
    c.shadowColor = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
//======================ONDA=================================
const friction = 0.99;
class Onda {
  constructor(x, y, radius, color, velocity, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.angle = angle;
  }
  draw() {
    c.save();
    c.beginPath();
    c.globalAlpha = this.alpha;
    c.arc(
      this.x,
      this.y,
      this.radius,
      this.angle - Math.PI / 2,
      this.angle + Math.PI / 2,
      false
    );
    c.strokeStyle = this.color;
    c.lineWidth = 5;
    c.stroke();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.radius += 5;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.02;
  }
}
//======================ENEMY=================================
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.originalColor = color;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.save();
    c.beginPath();
    c.shadowBlur = 5;
    c.shadowColor = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
//======================PARTICLE=================================
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
//======================PUNTI=================================
class Punti {
  constructor(x, y, text, color, velocity) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.font = "30px Arial";
    c.fillStyle = this.color;
    c.fillText(this.text, this.x, this.y);
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.02;
  }
}
//======================SFERE SFONDO=================================
class BgParticle {
  constructor(x, y, color, bright) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.color = color;
    this.bright = bright;
  }
  draw() {
    c.fillStyle = "hsl(" + this.color + ", 100%, " + this.bright + "%)";
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.closePath();
    c.fill();
  }
}

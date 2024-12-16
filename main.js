const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // il gioco è 2d

canvas.width = innerWidth; // assegno al canvas la larghezza della finestra (non c'è bisogno di specificare window.innerWidth)
canvas.height = innerHeight;

const score = document.querySelector("#score");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const finalScoreEl = document.querySelector("#finalScoreEl");

//======================GIOCO=================================
// il giocatore inizia sempre al centro dello schermo
let x = canvas.width / 2;
let y = canvas.height / 2;

let mouseX;
let mouseY;
window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// creo il giocatore
let player = new Player(x, y, 20, "#fff");
player.draw();

let projectiles = [];
let onde = [];
let enemies = [];
let particles = [];
let punti = [];
let punteggio = 0;
let particleDistance = 25;
let color = 0;
let bright = 0;

function init() {
  player.radius = 20;
  projectiles = [];
  onde = [];
  enemies = [];
  particles = [];
  punteggio = 0;
  score.innerHTML = 0;
  finalScoreEl.innerHTML = 0;
  punti = [];
  bg_particles = [];
  color = Math.random() * 360;
  bright = 10;
  for (let y = 0; y < canvas.height; y += particleDistance) {
    for (let x = 0; x < canvas.width; x += particleDistance) {
      bg_particles.push(new BgParticle(x, y, color, bright));
    }
  }
}
//===========SFERE SFONDO======================
/*function drawScene() {
  for (let i = 0; i < bg_particles.length; i++) {
    bg_particles[i].draw();
  }
}
setInterval(() => {
  color = Math.random() * 360;
  console.log("cambio");
}, 3000);*/
//===========MOVIMENTO GIOCATORE======================
function movement() {
  addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        player.direction.y = -3;
        player.direction.x = 0;
        break;
      case "s":
        player.direction.y = 3;
        player.direction.x = 0;
        break;
      case "a":
        player.direction.x = -3;
        player.direction.y = 0;
        break;
      case "d":
        player.direction.x = 3;
        player.direction.y = 0;
        break;
    }
  });

  addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        player.direction.y = 0;
        break;
      case "s":
        player.direction.y = 0;
        break;
      case "a":
        player.direction.x = 0;
        break;
      case "d":
        player.direction.x = 0;
        break;
    }
  });
}

//===========ANIMAZIONE======================
let animationId;

function animate() {
  animationId = requestAnimationFrame(animate); // mando in loop il metodo

  c.fillStyle = "rgba(0, 0, 0, 0.09)"; // imposto colore sfondo l'alpha aggiunge l'effetto scia
  c.fillRect(0, 0, canvas.width, canvas.height); // pulisco le schermo per evitare una scia di proiettili (clearRect)
  //drawScene();
  movement();
  player.update(); // pulendo lo schermo devo ridisegnare il player

  bg_particles.forEach((particle) => {
    particle.bright = 10;
    particle.color = color;
    let distPlayer = Math.hypot(particle.x - player.x, particle.y - player.y);
    if (distPlayer - player.radius - particle.radius <= 50) {
      particle.bright = 50;
    }
    /*enemies.forEach((enemy) => {
      let distEnemy = Math.hypot(particle.x - enemy.x, particle.y - enemy.y);
      if (distEnemy - enemy.radius - particle.radius <= 50) {
        particle.bright = 0;
      }
    });*/
  });

  onde.forEach((onda, index) => {
    // aggiorno le onde
    if (onda.alpha <= 0) {
      onde.splice(index, 1);
    } else {
      onda.update();
    }
  });

  particles.forEach((particle, index) => {
    // aggiorno le particelle
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  punti.forEach((punto, index) => {
    // aggiorno i punti sullo schermo
    if (punto.alpha <= 0) {
      punti.splice(index, 1);
    } else {
      punto.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update(); // aggiorno ogni proiettile creato

    if (
      projectile.x + projectile.radius < 0 || // elimino il proiettile quando esce dallo schermo
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    let angle = Math.atan2(
      player.y - enemy.y, // calcolo la direzione(destinazione, partenza)
      player.x - enemy.x
    );
    if (enemy.color == `hsl(281, 50%, 50%)`) {
      enemy.velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
      };
    } else if (enemy.color == `hsl(120, 50%, 50%)`) {
      enemy.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    } else if (enemy.color == `hsl(0, 50%, 50%)`) {
      enemy.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    }
    enemy.update(); // aggiorno ogni nemico creato

    let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y); // collisione player/nemico
    if (dist - player.radius - enemy.radius < 1) {
      console.log("game over");
      // blocco il gioco
      animationId = cancelAnimationFrame(animationId);
      // schermata finale con punteggio
      finalScoreEl.innerHTML = punteggio;
      modalEl.style.display = "flex";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      // collisione proiettile/nemico
      // Math.hypot esegue la readice quadrata della somma dei quadrati dei due numeri inseriti
      // la formula per calcolare la distanza fra due punti è: radice (x1 - x2)^2 + (y1 - y2)^2
      let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y); //calcola la distanza dei due punti
      if (dist - projectile.radius - enemy.radius < 1) {
        // tengo conto dei raggi
        //====================EXPLOSIVE ENEMY===========================
        // creo le particelle
        for (var i = 0; i < enemy.radius; i++) {
          // in base alla dimensione del nemico
          if (enemy.color == `hsl(0, 50%, 50%)`) {
            let angle = Math.random() * Math.PI * 2;
            let x = enemy.x + Math.cos(angle) * (enemy.radius + 5 + 2);
            let y = enemy.y + Math.sin(angle) * (enemy.radius + 5 + 2);
            particles.push(
              new Particle(x, y, 5, enemy.color, {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
              })
            );
          } else {
            particles.push(
              new Particle(
                projectile.x,
                projectile.y,
                Math.random() * 3,
                enemy.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 4),
                  y: (Math.random() - 0.5) * (Math.random() * 4),
                }
              )
            );
          }
        }
        if (enemy.radius - 10 > 5) {
          // diminuisco il raggio del nemico colpito
          gsap.to(enemy, {
            // uso gsap per rendere graduale il rimpicciolimento
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            // elimino il proiettile
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            // inserisco un time out per evitare lo sfarfallio dei nemici
            punti.push(
              new Punti(enemy.x, enemy.y, "+100", "#fff", {
                x: 0,
                y: -0.5,
              })
            );
            enemies.splice(enemyIndex, 1); // elimino il nemico
            projectiles.splice(projectileIndex, 1); // elimino il proiettile
            //aumento punteggio
            punteggio += 100;
            score.innerHTML = punteggio;
          }, 0);
        }
      }
    });
    particles.forEach((particle, particleIndex) => {
      if (particle.color == `hsl(0, 50%, 50%)`) {
        let dist = Math.hypot(particle.x - enemy.x, particle.y - enemy.y); //calcola la distanza dei due punti
        if (dist - particle.radius - enemy.radius < 1) {
          // tengo conto dei raggi

          // creo le particelle
          for (var i = 0; i < enemy.radius; i++) {
            // in base alla dimensione del nemico
            if (enemy.color == `hsl(0, 50%, 50%)`) {
              let angle = Math.random() * Math.PI * 2;
              let x = enemy.x + Math.cos(angle) * (enemy.radius + 5 + 2);
              let y = enemy.y + Math.sin(angle) * (enemy.radius + 5 + 2);
              particles.push(
                new Particle(x, y, 5, enemy.color, {
                  x: Math.cos(angle) * 5,
                  y: Math.sin(angle) * 5,
                })
              );
            } else {
              particles.push(
                new Particle(
                  particle.x,
                  particle.y,
                  Math.random() * 3,
                  enemy.color,
                  {
                    x: (Math.random() - 0.5) * (Math.random() * 4),
                    y: (Math.random() - 0.5) * (Math.random() * 4),
                  }
                )
              );
            }
          }
          if (enemy.radius - 10 > 5) {
            // diminuisco il raggio del nemico colpito
            punti.push(
              new Punti(enemy.x, enemy.y, "+25", "#fff", {
                x: 0.5,
                y: -0.5,
              })
            );
            gsap.to(enemy, {
              // uso gsap per rendere graduale il rimpicciolimento
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              // elimino il proiettile
              particles.splice(particleIndex, 1);
              punteggio += 25;
              score.innerHTML = punteggio;
            }, 0);
          } else {
            setTimeout(() => {
              // inserisco un time out per evitare lo sfarfallio dei nemici
              punti.push(
                new Punti(enemy.x, enemy.y, "+100", "#fff", {
                  x: 0.5,
                  y: -0.5,
                })
              );
              enemies.splice(enemyIndex, 1); // elimino il nemico
              particles.splice(particleIndex, 1); // elimino il proiettile
              //aumento punteggio
              punteggio += 100;
              score.innerHTML = punteggio;
            }, 0);
          }
        }
      }
    });
    onde.forEach((onda) => {
      let dist = Math.hypot(onda.x - enemy.x, onda.y - enemy.y);
      if (dist - enemy.radius - onda.radius <= 0) {
        enemy.color = `hsl(180, 100%, 50%)`;
      }
    });
    if (enemy.color == `hsl(180, 100%, 50%)`) {
      let angle = Math.atan2(
        player.y - enemy.y, // calcolo la direzione(destinazione, partenza)
        player.x - enemy.x
      );

      enemy.velocity = {
        x: -Math.cos(angle),
        y: -Math.sin(angle),
      };
      setTimeout(() => {
        enemy.color = enemy.originalColor;
        let angle = Math.atan2(
          player.y - enemy.y, // calcolo la direzione(destinazione, partenza)
          player.x - enemy.x
        );

        enemy.velocity = {
          x: Math.cos(angle),
          y: Math.sin(angle),
        };
      }, 2000);
    }
  });
}

//===========ANIMAZIONE PROIETTILE======================
setInterval(() => {
  const angle = Math.atan2(
    mouseY - player.y, // calcolo la direzione(destinazione, partenza)
    mouseX - player.x
  );

  const velocity = {
    // imposto velocità
    x: Math.cos(angle) * 8,
    y: Math.sin(angle) * 8,
  };

  projectiles.push(new Projectile(player.x, player.y, 5, "#fff", velocity)); // creo un nuovo proiettile
}, 400);

//===========ANIMAZIONE ONDA======================
addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    if (player.radius == 20) {
      gsap.to(player, {
        // uso gsap per rendere graduale il rimpicciolimento
        radius: player.radius - 5,
      });
      const angle = Math.atan2(
        mouseY - player.y, // calcolo la direzione(destinazione, partenza)
        mouseX - player.x
      );

      const velocity = {
        // imposto velocità
        x: Math.cos(angle) * 8,
        y: Math.sin(angle) * 8,
      };
      onde.push(
        new Onda(player.x, player.y, player.radius, "#fff", velocity, angle)
      );
    }
    setTimeout(() => {
      if (player.radius == 15) {
        gsap.to(player, {
          // uso gsap per rendere graduale il rimpicciolimento
          radius: player.radius + 5,
        });
      }
    }, 5000);
  }
});
//=====================SPAWN ENEMY========================================
function spawnEnemies(enemies) {
  setInterval(() => {
    let radius;
    let x, y;
    let color;
    let angle;
    let velocity;

    let random = Math.random() * 100;

    if (random < 10) {
      radius = 10; // dimensione nemico random

      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;

      color = `hsl(0, 50%, 50%)`;

      angle = Math.atan2(
        player.y - y, // calcolo la direzione(destinazione, partenza)
        player.x - x
      );

      velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    } else if (random < 20) {
      radius = 15; // dimensione nemico random

      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;

      color = `hsl(281, 50%, 50%)`;

      angle = Math.atan2(
        player.y - y, // calcolo la direzione(destinazione, partenza)
        player.x - x
      );

      velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
      };
    } else {
      radius = Math.random() * (30 - 10) + 10; // dimensione nemico random

      // posizione random nemico
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;

      color = `hsl(120, 50%, 50%)`;

      angle = Math.atan2(
        player.y - y, // calcolo la direzione(destinazione, partenza)
        player.x - x
      );

      velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    }

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000); // in millisecondi
}

//=============================================================
startGameBtn.addEventListener("click", () => {
  modalEl.style.display = "none";
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.direction = {
    x: 0,
    y: 0,
  };
  init();
  animate();
  spawnEnemies(enemies);
});

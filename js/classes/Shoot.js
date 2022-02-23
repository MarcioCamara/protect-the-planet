class Shoot {
    constructor() {
        this.object = undefined;
    }

    static playSound() {
        let sound = document.getElementById('laserShootSound');
        sound.play();

        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, 163);
    }

    static controller() {
        game.shoots = document.querySelectorAll('.player-shoot');

        for (let i = 0; i < game.shoots.length; i++) {
            const shoot = game.shoots[i];

            if (shoot) {
                shoot.style.top = `${shoot.offsetTop - game.shootSpeed}px`;

                Shoot.checkEnemyCollide(shoot);
                if (shoot.offsetTop < 0) {
                    shoot.remove();
                }
            }
        }
    }

    static draw() {
        this.object = document.createElement('div');
        this.object.className = 'player-shoot';
        this.object.style = `top: ${player.yPosition}px; left: ${player.xPosition + (player.object.offsetWidth / 2)}px;`;

        document.body.appendChild(this.object);
    }

    static checkEnemyCollide(shoot) {
        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i];

            if (
                (
                    (shoot.offsetTop <= (enemy.offsetTop + enemy.offsetHeight))
                    &&
                    ((shoot.offsetTop + shoot.offsetHeight) >= enemy.offsetTop)
                )
                &&
                (
                    (shoot.offsetLeft <= (enemy.offsetLeft + enemy.offsetWidth))
                    &&
                    ((shoot.offsetLeft + shoot.offsetWidth) >= enemy.offsetLeft)
                )
                &&
                !enemy.explode
            ) {
                enemy.takenShoots++;

                if (enemy.classList.contains('little-enemy')) {
                    if (enemy.takenShoots >= 2) {
                        player.score += 100;
                        document.getElementById('score').innerHTML = player.score;

                        Enemy.explosion(enemy);
                    }
                } else if (enemy.classList.contains('medium-enemy')) {
                    if (enemy.takenShoots >= 4) {
                        player.score += 100;
                        document.getElementById('score').innerHTML = player.score;

                        Enemy.explosion(enemy);
                    }
                } else if (enemy.classList.contains('big-enemy')) {
                    if (enemy.takenShoots >= 6) {
                        player.score += 100;
                        document.getElementById('score').innerHTML = player.score;

                        Enemy.explosion(enemy);
                    }
                }

                shoot.remove();
            }
        }
    }
}
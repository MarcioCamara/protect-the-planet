class Enemy {
    static types = ['big-enemy', 'medium-enemy', 'little-enemy'];

    constructor() {
        this.object = undefined;
    }

    static controller() {
        game.enemies = document.querySelectorAll('.enemy');

        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i];

            Enemy.checkPlayerCollide();

            if (enemy) {
                enemy.style.top = enemy.explode ? enemy.offsetTop : `${enemy.offsetTop + game.enemySpeed}px`;

                if (enemy.offsetTop > (screen.yEnd - 60)) {
                    Enemy.explosion(enemy, true);
                }
            }
        }
    }

    static checkPlayerCollide() {
        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i];

            if (
                (
                    (player.object.offsetTop <= (enemy.offsetTop + enemy.offsetHeight))
                    &&
                    ((player.object.offsetTop + player.object.offsetHeight) >= enemy.offsetTop)
                )
                &&
                (
                    (player.object.offsetLeft <= (enemy.offsetLeft + enemy.offsetWidth))
                    &&
                    ((player.object.offsetLeft + player.object.offsetWidth) >= enemy.offsetLeft)
                )
                &&
                !enemy.explode
            ) {
                player.object.style.backgroundImage = 'url(images/explosion.gif)';
                player.object.style.width = '16px';
                player.object.style.height = '16px';
                player.object.explode = true;

                setTimeout(() => {
                    player.object.style.display = 'none';
                }, 750);

                player.playExplosionSound();
                game.stop();
            }
        }
    }

    static draw() {
        if (game.isRunning && game.generatedEnemies > 0) {
            let position = {
                x: getRandomValue(screen.xStart + player.object.offsetWidth, screen.xEnd - player.object.offsetWidth),
                y: 0,
            }

            this.object = document.createElement('div');
            this.object.className = `${Enemy.types[getRandomValue(-1, 3)]} enemy`;
            this.object.style = `top: ${position.y}px; left: ${position.x}px;`;
            this.object.takenShoots = 0;

            document.body.appendChild(this.object);

            game.generatedEnemies--;
        }
    }

    static playExplosionSound() {
        let sound = document.getElementById('enemyExplosionSound');
        sound.play();

        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, 391);
    }

    static explosion(enemy, collideWithPlanet = false) {
        enemy.style.backgroundImage = 'url(images/explosion.gif)';
        enemy.style.width = '16px';
        enemy.style.height = '16px';

        if (!enemy.explode) {
            enemy.explode = true;
            game.enemiesCounter--;
            game.enemiesCounterObject.innerHTML = game.enemiesCounter;

            setTimeout(() => {
                enemy.remove();
            }, 750);

            if (collideWithPlanet) {
                enemy.explode = true;
                Planet.health -= 12;
                Planet.healthBarObject.style.width = `${Planet.health}px`;
            }
        }

        Enemy.playExplosionSound();

        if (Planet.health <= 0) {
            game.stop();
        }

        if (game.enemiesCounter === 0) {
            game.stop(true);
        }
    }
}
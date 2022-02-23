class Player {
    constructor() {
        this.object = document.getElementById('player');
        this.speed = 5;
        this.xDirection = 0;
        this.yDirection = 0;
        this.xPosition = (screen.width / 2 - (this.object.offsetWidth / 2)) + screen.xStart;
        this.yPosition = (screen.height * .85 - (this.object.offsetHeight / 2)) + screen.yStart;
        this.object.style.left = `${this.xPosition}px`;
        this.object.style.top = `${this.yPosition}px`;
        this.explosionSound = document.getElementById('playerExplosionSound');
        this.shootCooldown = 150;
        this.preventShoot = false;
        this.destroyedMessage = document.getElementById('playerDestroyed');
        this.name = 'HANS';
        this.city = undefined;
        this.country = undefined;
        this.continent = undefined;
        this.score = 0;
    }

    reset() {
        this.object.style.backgroundImage = 'url(images/player.gif)';
        this.object.style.width = '16px';
        this.object.style.height = '24px';
        this.xPosition = (screen.object.offsetWidth / 2 - (this.object.offsetWidth / 2)) + screen.object.offsetLeft;
        this.yPosition = (screen.object.offsetHeight * .85 - (this.object.offsetHeight / 2)) + screen.object.offsetTop;
        this.shootCooldown = 150;
        this.preventShoot = false;
        this.destroyedMessage = document.getElementById('playerDestroyed');
        this.score = 0;
        document.getElementById('score').innerHTML = player.score;
    }

    playExplosionSound() {
        this.explosionSound.play();
        setTimeout(() => {
            this.explosionSound.pause();
            this.explosionSound.currentTime = 0;
        }, 4247);
    }

    // @todo: ver de ajustar movimentação para que não trave quando trocar de direção
    move(key) {
        if (key === 37 || key === 65) {
            this.xDirection = -1;
        } else if (key === 39 || key === 68) {
            this.xDirection = 1;
        } else if (key === 38 || key === 87) {
            this.yDirection = -1;
        } else if (key === 40 || key === 83) {
            this.yDirection = 1;
        }
    }

    // @todo: remover tiro sequencial, colocar cooldown
    shoot() {
        if (!this.preventShoot) {
            this.preventShoot = true;

            if (game.isRunning) {
                Shoot.draw();
                Shoot.playSound();
            }

            setTimeout(this.preventShoot = false, this.shootCooldown);
        } else {
            return false;
        }
    }

    controller() {
        if (this.xPosition <= screen.object.offsetLeft) {
            this.xPosition = screen.object.offsetLeft + 3;
            return;
        } else if (this.xPosition > (screen.object.offsetLeft + screen.object.offsetWidth) - this.object.offsetWidth) {
            this.xPosition = (screen.object.offsetLeft + screen.object.offsetWidth) - this.object.offsetWidth - 3;
            return;
        } else if (this.yPosition <= screen.yStart) {
            this.yPosition = screen.yStart + 3;
            return;
        } else if (this.yPosition > screen.yEnd - this.object.offsetHeight) {
            this.yPosition = screen.yEnd - this.object.offsetHeight - 3;
            return;
        }

        this.yPosition += this.yDirection * this.speed;
        this.xPosition += this.xDirection * this.speed;
        this.object.style.left = `${this.xPosition}px`;
        this.object.style.top = `${this.yPosition}px`;
    }
}
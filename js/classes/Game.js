class Game {
    constructor() {
        this.isRunning = false;
        this.attempt = 0;
        this.shootSpeed = 7.5;

        this.shoots = [];
        this.enemies = [];

        this.enemiesCounter = 25;
        this.enemiesCounterObject = document.getElementById('enemiesCounter');

        this.generatedEnemies = 25

        this.enemySpeed = 1;

        this.currentDialogue = 0;

        this.backgroundMusic = document.getElementById('backgroundMusic');
    }

    loop = () => {
        if (game.isRunning) {
            player.controller();
            Shoot.controller();
            Enemy.controller();
        }

        frames = requestAnimationFrame(this.loop);
    }

    start = () => {
        Planet.initialize();

        this.isRunning = true;

        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();

        player.reset();

        this.enemiesCounter = 25;
        this.generatedEnemies = 25;
        this.enemiesCounterObject.innerHTML = this.enemiesCounter;

        Planet.healthBarObject.style.width = `${Planet.health}px`;

        gui.style.display = 'flex';
        //exibir a nave
        player.object.style.display = 'block';
        Dialogue.dialogueElement.style.display = 'none';
        mobileControllers.style.display = isMobile ? 'flex' : 'none';
    }

    mountRanking = () => {
        const ranking = [
            {
                name: 'ROBSON',
                score: 2500,
            },
            {
                name: player.name,
                score: player.score,
            },
            {
                name: 'SOPHIE',
                score: 1000,
            },
            {
                name: 'FERNANDA',
                score: 1500,
            },
            {
                name: 'FELIPE',
                score: 1000,
            },
        ];

        ranking.sort((a, b) => (a.score < b.score) ? 1 : -1);

        let rankingBody = '';
        for (let i = 0; i < ranking.length; i++) {
            rankingBody += `
                <tr>
                    <td class="text-left">${ranking[i].name}</td>
                    <td class="text-center">${ranking[i].score}</td>
                </tr>`;
        }

        document.getElementById('rankingBody').innerHTML = rankingBody;
    }

    togglePause() {
        if (this.isRunning) {
            this.isRunning = false;
            document.getElementById('paused').style.display = 'flex';
        } else {
            this.isRunning = true;
            document.getElementById('paused').style.display = 'none';
        }
    }

    pause() {
        this.isRunning = false;
        document.getElementById('paused').style.display = 'flex';
    }

    stop = (win = false) => {
        this.isRunning = false;

        gui.style.display = 'none';
        player.object.style.display = 'none';

        this.mountRanking();

        document.getElementById('message').style.display = 'flex';
        document.getElementById('rankingContainer').style.display = 'flex';
        document.getElementById('hr').style.display = 'flex';
        document.getElementById('playButton').innerHTML = 'Play Again';

        if (win && Planet.health === 120) {
            perfectWinMessage.style.display = 'flex';
            winMessage.style.display = 'none';
            Planet.destroyedMessage.style.display = 'none';
            player.destroyedMessage.style.display = 'none';
        } else if (win && Planet.health !== 120) {
            winMessage.style.display = 'flex';
            Planet.destroyedMessage.style.display = 'none';
            player.destroyedMessage.style.display = 'none';
            perfectWinMessage.style.display = 'none';
        } else if (Planet.health === 0) {
            Planet.destroyedMessage.style.display = 'flex';
            player.destroyedMessage.style.display = 'none';
            winMessage.style.display = 'none';
            perfectWinMessage.style.display = 'none';
        } else {
            Planet.destroyedMessage.style.display = 'none';
            player.destroyedMessage.style.display = 'flex';
            winMessage.style.display = 'none';
            perfectWinMessage.style.display = 'none';
        }

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];

            enemy.remove();
        }

        for (let i = 0; i < this.shoots.length; i++) {
            const shoot = this.shoots[i];

            shoot.remove();
        }

        mobileControllers.style.display = 'none';
    }
}
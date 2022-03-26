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

        this.ranking = [];
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
        player.object.style.display = 'block';
        Dialogue.dialogueElement.style.display = 'none';
        mobileControllers.style.display = isMobile ? 'flex' : 'none';
    }

    saveScore = (currentPlayer) => {
        db.collection('ranking').add(currentPlayer)
            .then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
            });
    }

    mountRanking = () => {
        db.collection('ranking')
            .orderBy('score', 'desc')
            .limit(4)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.ranking.push(doc.data());
                });

                const currentPlayer = {
                    name: player.name,
                    score: player.score,
                    status: player.status,
                    city: player.city,
                    country: player.country,
                    continent: player.continent,
                };

                this.ranking.push(currentPlayer);

                this.ranking.sort((a, b) => (a.score < b.score) ? 1 : -1);

                let rankingBody = '';
                for (let i = 0; i < this.ranking.length; i++) {
                    if (this.ranking[i] === currentPlayer) {
                        rankingBody += `
                        <tr class="animate__animated animate__infinite animate__flash">
                            <td class="text-left">${this.ranking[i].name}</td>
                            <td class="text-center">${this.ranking[i].score}</td>
                        </tr>`;
                    } else {
                        rankingBody += `
                        <tr>
                            <td class="text-left">${this.ranking[i].name}</td>
                            <td class="text-center">${this.ranking[i].score}</td>
                        </tr>`;
                    }
                }

                document.getElementById('rankingBody').innerHTML = rankingBody;

                this.saveScore(currentPlayer);
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });
    }

    togglePause() {
        if (this.isRunning) {
            this.isRunning = false;
            document.getElementById('paused').style.display = 'flex';
            document.getElementById('resumeButton').style.display = 'flex';
            document.getElementById('pauseButton').style.display = 'none';
        } else {
            this.isRunning = true;
            document.getElementById('paused').style.display = 'none';
            document.getElementById('pauseButton').style.display = 'flex';
            document.getElementById('resumeButton').style.display = 'none';
        }
    }

    pause() {
        this.isRunning = false;
        document.getElementById('paused').style.display = 'flex';
        document.getElementById('resumeButton').style.display = 'flex';
        document.getElementById('pauseButton').style.display = 'none';
    }

    stop = (win = false) => {
        this.isRunning = false;

        gui.style.display = 'none';
        player.object.style.display = 'none';
        document.getElementById('paused').style.display = 'none';

        document.getElementById('message').style.display = 'flex';
        document.getElementById('rankingContainer').style.display = 'flex';
        document.getElementById('hr').style.display = 'flex';
        document.getElementById('playButton').innerHTML = 'Play Again';

        if (player.city && player.continent && player.country) {
            document.getElementById('rankingRadioContainer').style.display = 'flex';
        }

        if (win && Planet.health === 120) {
            player.status = 'perfect';
            perfectWinMessage.style.display = 'flex';
            winMessage.style.display = 'none';
            Planet.destroyedMessage.style.display = 'none';
            player.destroyedMessage.style.display = 'none';
        } else if (win && Planet.health !== 120) {
            player.status = 'win';
            winMessage.style.display = 'flex';
            Planet.destroyedMessage.style.display = 'none';
            player.destroyedMessage.style.display = 'none';
            perfectWinMessage.style.display = 'none';
        } else if (Planet.health === 0) {
            player.status = 'planet destroyed';
            Planet.destroyedMessage.style.display = 'flex';
            player.destroyedMessage.style.display = 'none';
            winMessage.style.display = 'none';
            perfectWinMessage.style.display = 'none';
        } else {
            player.status = 'player destroyed';
            player.destroyedMessage.style.display = 'flex';
            Planet.destroyedMessage.style.display = 'none';
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

        this.mountRanking();
    }
}
class Game {
    constructor() {
        this.state = 'stopped';
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

        this.elapsedTime;
    }

    loop = () => {
        if (game.state === 'running') {
            player.controller();
            Shoot.controller();
            Enemy.controller();
        }

        frames = requestAnimationFrame(this.loop);
    }

    start = () => {
        Planet.initialize();

        this.state = 'running';

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

        this.startElapsedTime();
    }

    startElapsedTime() {
        let time = 0, minutes, seconds;

        document.getElementById('elapsedTime').textContent = '00:00';

        this.elapsedTime = setInterval(() => {
            this.state === 'running' ? (time++) : (time = time);

            minutes = parseInt(time / 60, 10);
            seconds = parseInt(time % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById('elapsedTime').textContent = minutes + ":" + seconds;
            console.log(time);
        }, 1000);
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
        this.ranking = [];

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

    startResumeCounter() {
        document.getElementById('resumeCounter').textContent = '';

        let timeleft = 3;
        const downloadTimer = setInterval(function () {
            if (timeleft <= 1) {
                clearInterval(downloadTimer);
            }

            document.getElementById('resumeCounter').textContent = timeleft;
            timeleft -= 1;
        }, 1000);
    }

    togglePause() {
        if (this.state === 'running') {
            this.state = 'paused';
            document.getElementById('paused').style.display = 'flex';
            document.getElementById('resumeButton').style.display = 'flex';
            document.getElementById('pauseButton').style.display = 'none';
        } else if (this.state === 'paused') {
            document.getElementById('resumeCounter').style.display = 'flex';
            this.startResumeCounter();

            setTimeout(() => {
                this.state = 'running';
                document.getElementById('resumeCounter').style.display = 'none';
            }, 4000);

            document.getElementById('paused').style.display = 'none';
            document.getElementById('pauseButton').style.display = 'flex';
            document.getElementById('resumeButton').style.display = 'none';
        }
    }

    pause() {
        if (this.state === 'running') {
            this.state = 'paused';
            document.getElementById('paused').style.display = 'flex';
            document.getElementById('resumeButton').style.display = 'flex';
            document.getElementById('pauseButton').style.display = 'none';
        }
    }

    stop = (win = false) => {
        this.state = 'stopped';
        clearInterval(this.elapsedTime);

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
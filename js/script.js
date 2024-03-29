const firebaseConfig = {
  apiKey: "AIzaSyCNCRiPfgg8mgcZw_HA9MjJyzASw41BEWU",
  authDomain: "protect-the-planet-8911f.firebaseapp.com",
  projectId: "protect-the-planet-8911f",
  storageBucket: "protect-the-planet-8911f.appspot.com",
  messagingSenderId: "159933189608",
  appId: "1:159933189608:web:0651f8c2927c710c61685d",
  measurementId: "G-WCL0D4TBBB"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


// reorganizar pra que o controle de quantos tiros é preciso para matar uma nave, fique no objeto da nave e não na funcão
let game = new Game();
let planet = new Planet();
let screen = new Screen();
let player = new Player();

const movementKeys = [37, 65, 39, 68, 38, 87, 40, 83];
const pauseKey = 80;

let enemyCreationInterval = undefined;

let frames;

isMobile = false;

window.addEventListener('load', start());
document.addEventListener('keydown', event => keyDown(event));
document.addEventListener('keyup', event => keyUp(event));

document.getElementById('playButton').addEventListener('click', () => {
  game.attempt++;

  document.getElementById('message').style.display = 'none';
  document.getElementById('logoContainer').style.display = 'none';

  if (game.attempt <= 1) {
    Dialogue.initialize();
    player.reset();
  } else {
    game.start();
  }
});

document.getElementById('nextDialogue').addEventListener('click', Dialogue.changeDialogue);

let gui = document.getElementById('gui');
let winMessage = document.getElementById('winMessage');
let perfectWinMessage = document.getElementById('perfectWinMessage');
let mobileControllers = document.getElementById('mobileControllers');

const topButton = document.getElementById('topButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const bottomButton = document.getElementById('bottomButton');

window.mobileMovement = function (direction) {
  if (direction === 'left') {
    player.xDirection = -1;
  } else if (direction === 'right') {
    player.xDirection = 1;
  } else if (direction === 'top') {
    player.yDirection = -1;
  } else if (direction === 'bottom') {
    player.yDirection = 1;
  }
}

const moveTop = window.mobileMovement.bind(null, 'top');
topButton.addEventListener('touchstart', moveTop);
topButton.addEventListener('touchend', () => {
  player.yDirection = 0;
});

const moveLeft = window.mobileMovement.bind(null, 'left');
leftButton.addEventListener('touchstart', moveLeft);
leftButton.addEventListener('touchend', () => {
  player.xDirection = 0;
});

const moveRight = window.mobileMovement.bind(null, 'right');
rightButton.addEventListener('touchstart', moveRight);
rightButton.addEventListener('touchend', () => {
  player.xDirection = 0;
});

const moveBottom = window.mobileMovement.bind(null, 'bottom');
bottomButton.addEventListener('touchstart', moveBottom);
bottomButton.addEventListener('touchend', () => {
  player.yDirection = 0;
});

const shootButton = document.getElementById('mobileShoot');
const shootMobile = player.shoot.bind(player, player.xPosition, player.yPosition);
shootButton.addEventListener('touchstart', shootMobile);

function windowClick() {
  player.shoot();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') {
    game.pause();
  }
});

const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
resumeButton.addEventListener('click', () => game.togglePause());
pauseButton.addEventListener('click', () => game.togglePause());

const muteButton = document.getElementById('muteButton');
const unmuteButton = document.getElementById('unmuteButton');
muteButton.addEventListener('click', () => game.mute());
unmuteButton.addEventListener('click', () => game.unmute());

function keyDown(event) {
  let key = event.keyCode;

  if (movementKeys.includes(key)) {
    player.move(key);
  } else if (key === pauseKey) {
    game.togglePause();
  } else {
    player.shoot();
  }
}

function keyUp(event) {
  let key = event.keyCode;

  if ((key === 37 || key === 65) || (key === 39 || key === 68)) {
    player.xDirection = 0;
    player.object.style.backgroundImage = 'url(images/player.gif)';
  } else if ((key === 38 || key === 87) || (key === 40 || key === 83)) {
    player.yDirection = 0;
  }
}

function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

document.getElementById('rankingWorld').addEventListener('click', () => this.renderRanking(game.ranking));
document.getElementById('rankingCountry').addEventListener('click', () => this.renderRanking(game.ranking.filter(rankingItem => rankingItem.country === player.country)));
document.getElementById('rankingCity').addEventListener('click', () => this.renderRanking(game.ranking.filter(rankingItem => rankingItem.city === player.city)));

function renderRanking(filteredRanking) {
  let rankingBody = '';
  const currentPlayer = {
    name: player.name,
    score: player.score,
    status: player.status,
    city: player.city,
    country: player.country,
    continent: player.continent,
  };

  for (let i = 0; i < filteredRanking.length; i++) {
    rankingBody += `
        <tr>
            <td class="text-left">${filteredRanking[i].name}</td>
            <td class="text-center">${filteredRanking[i].score}</td>
        </tr>`;
  }

  document.getElementById('rankingBody').innerHTML = rankingBody;
}

function start() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
        .then(response => response.json())
        .then((result) => {
          player.city = result.city;
          player.country = result.countryName;
          player.continent = result.continent;
        });

    });
  }

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
  }

  if (isMobile) {
    document.getElementById('gameScreen').style.width = `${window.screen.width}px`;
    document.getElementById('message').style.width = `${window.screen.width}px`;
    document.getElementById('gui').style.width = `${window.screen.width}px`;
    document.getElementById('mobileControllers').style.width = `${window.screen.width}px`;
    document.getElementById('inputContainer').style.width = `${window.screen.width}px`;
    document.getElementById('rankingContainer').style.width = `${window.screen.width}px`;
  }

  clearInterval(enemyCreationInterval);
  enemyCreationInterval = setInterval(Enemy.draw, 1500);

  game.loop();
}
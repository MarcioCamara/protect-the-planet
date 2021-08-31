// reorganizar pra que o controle de quantos tiros é preciso para matar uma nave, fique no objeto da nave e não na funcão

let player = {
  object: undefined,
  speed: undefined,
  xDirection: undefined,
  yDirection: undefined,
  xPosition: undefined,
  yPosition: undefined,
}

let shootSpeed = undefined;

let screen = {
  object: undefined,
  width: undefined,
  height: undefined,
  xStart: undefined,
  yStart: undefined,
}

let enemies = [];
let enemyTypes = ['big-enemy', 'medium-enemy', 'little-enemy'];
let enemyCounter = undefined;
let generatedEnemies = undefined;
let enemySpeed = undefined;
let enemyCreationInterval = undefined;

let shoots = [];

let isGameRunning = false;
let frames;

let planetHealth = undefined;

let interactivityVariables = {
  playerName: 'BILLY',
}

let dialogues = [
  {
    id: 0,
    sentence: 'Hey, viajante! Graças a Glork, você acordou!',
    picture: 'images/happy-wolf.png',
  },
  {
    id: 1,
    sentence: 'Meu nome é <strong>Kieko</strong>. Qual é o seu nome?',
    picture: 'images/default-wolf.png',
    interactivity: {
      text: 'Qual é o seu nome?',
      variable: 'playerName',
    },
  },
  {
    id: 2,
    sentence:`Certo, <strong>${interactivityVariables.playerName}</strong>. O planeta está sendo atacado por uma tropa alienigena!`,
    picture: 'images/annoyed-wolf.png',
  },
  {
    id: 3,
    sentence: 'Precisamos fazer algo sobre isso. Entre na sua nave e vamos acabar com eles!',
    picture: 'images/angry-wolf.png',
  },
];

currentDialogue = undefined;
gameAttempt = undefined;

window.addEventListener('load', start());
document.addEventListener('keydown', event => keyDown(event));
document.addEventListener('click', () => windowClick());
document.addEventListener('keyup', event => keyUp(event));
document.getElementById('playButton').addEventListener('click', () => {
  gameAttempt++;
  
  document.getElementById('message').style.display = 'none';
  
  if(gameAttempt <= 1) {
    let dialogue = document.getElementById('dialogue');
    dialogue.style.display = 'flex';
  
    let dialoguePicture = document.getElementById('dialoguePicture');
    dialoguePicture.src = dialogues[currentDialogue].picture;
    
    let dialogueLabel = document.getElementById('dialogueLabel');
    dialogueLabel.innerHTML = dialogues[currentDialogue].sentence;
  } else {
    resetGame();
  }
});

document.getElementById('nextDialogue').addEventListener('click', changeDialogue);

isNextAInput = false;

function changeDialogue() {
  if(isNextAInput && dialogues[currentDialogue] && dialogues[currentDialogue].interactivity) {
    document.getElementById('inputLabel').innerHTML = dialogues[currentDialogue].interactivity.text;
    document.getElementById('inputContainer').style.display = 'flex';    
    
    document.getElementById('confirmInput').addEventListener('click', () => {
      document.getElementById('inputContainer').style.display = 'none';    
      interactivityVariables[dialogues[currentDialogue].interactivity.variable] = document.getElementById('input').value;
      dialogues[currentDialogue + 1].sentence = `Certo, <strong>${interactivityVariables.playerName}</strong>. O planeta está sendo atacado por uma tropa alienigena!`;
      isNextAInput = false;
      changeDialogue();
    });

    isNextAInput = false;
  } else {
    currentDialogue++;
  }
  
  if(dialogues[currentDialogue] && dialogues[currentDialogue].interactivity) {
    isNextAInput = true;    
  }

  if(!dialogues[currentDialogue]) {
    resetGame();
    return;
  }

  dialogueLabel.innerHTML = dialogues[currentDialogue].sentence;
  dialoguePicture.src = dialogues[currentDialogue].picture;
}

let enemiesCounterObject = document.getElementById('enemiesCounter');
let planetHealthBarObject = document.getElementById('planetHealthBar');
let planetHealthBarObjectSize = planetHealthBarObject.offsetWidth;
let enemyExplosionSound = document.getElementById('enemyExplosionSound');
let playerExplosionSound = document.getElementById('playerExplosionSound');
let laserShootSound = document.getElementById('laserShootSound');
let backgroundMusic = document.getElementById('backgroundMusic');
let gui = document.getElementById('gui');
let defeatMessage = document.getElementById('defeatMessage');

function resetGame() {
  isGameRunning = true;

  backgroundMusic.loop = true;
  backgroundMusic.play();
  player.object.style.display = 'block';
  player.object.style.backgroundImage = 'url(images/player.gif)';
  player.object.style.width = '16px';
  player.object.style.height = '24px';
  player.xPosition = (screen.width / 2 - (player.object.offsetWidth / 2)) + screen.xStart;
  player.yPosition = (screen.height * .85 - (player.object.offsetHeight / 2)) + screen.yStart;

  enemyCounter = 25;
  generatedEnemies = 25;
  enemiesCounterObject.innerHTML = enemyCounter;

  planetHealth = 120;

  planetHealthBarObject.style.width = `${planetHealth}px`;

  gui.style.display = 'flex';
  dialogue.style.display = 'none';
}

let shootPrevent = false,
prev = 0;
function keyDown(event) {
  let key = event.keyCode;
  
  if (key === 37 || key === 65) {
    player.xDirection = -1;
  } else if (key === 39 || key === 68) {
    player.xDirection = 1;
  } else if (key === 38 || key === 87) {
    player.yDirection = -1;
  } else if (key === 40 || key === 83) {
    player.yDirection = 1;
  } else if (key === 32) {
    if (!shootPrevent) {
      shootPrevent = true;
      
      shoot(player.xPosition, player.yPosition);
      
      setTimeout(function() {
        shootPrevent = false;
      }, 150)
    } else {
        return false;
    }    
  }
}

function windowClick() {
  if (!shootPrevent) {
    shootPrevent = true;
    
    shoot(player.xPosition, player.yPosition);
    
    setTimeout(function() {
      shootPrevent = false;
    }, 150)
  } else {
      return false;
  }
}

function keyUp(event) {
  let key = event.keyCode;
  
  if ((key === 37 || key === 65) || (key === 39 || key === 68) ){
    player.xDirection = 0;
  } else if ((key === 38 || key === 87) || (key === 40 || key === 83)) {
    player.yDirection = 0;
  }
}

function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateEnemies() {
  if(isGameRunning && generatedEnemies > 0) {
    let position = {
      x: getRandomValue(screen.xStart + player.object.offsetWidth, screen.xEnd - player.object.offsetWidth),
      y: 0,
    }    

    let enemyObject = document.createElement('div');
    enemyObject.className = `${enemyTypes[getRandomValue(-1, 3)]} enemy`;
    enemyObject.style = `top: ${position.y}px; left: ${position.x}px;`;
    enemyObject.takenShoots = 0;
    
    document.body.appendChild(enemyObject);

    generatedEnemies--;
  }
}

function enemyExplosion(enemy, collideWithPlanet = false) {
  enemy.style.backgroundImage = 'url(images/explosion.gif)';
  enemy.style.width = '16px';
  enemy.style.height = '16px';

  if(!enemy.explode) {
    enemy.explode = true;
    enemyCounter--;
    enemiesCounterObject.innerHTML = enemyCounter;

    setTimeout(() => {
      enemy.remove();
    }, 750);
    
    if(collideWithPlanet) {
      enemy.explode = true;
      planetHealth -= 12;
      planetHealthBarObject.style.width = `${planetHealth}px`;
    }
  }  
  
  playEnemyExplosionSound();
  if(planetHealth <= 0) {
    gameStop();
  }

  if(enemyCounter === 0) {
    gameStop(true);
  }
}

function playEnemyExplosionSound() {
  enemyExplosionSound.play();
  setTimeout(() => {
    enemyExplosionSound.pause();
    enemyExplosionSound.currentTime = 0;
  }, 391);
}

function playPlayerExplosionSound() {
  playerExplosionSound.play();
  setTimeout(() => {
    playerExplosionSound.pause();
    playerExplosionSound.currentTime = 0;
  }, 4247);
}

function playShootSound() {
  laserShootSound.play();
  setTimeout(() => {
    laserShootSound.pause();
    laserShootSound.currentTime = 0;
  }, 163);
}

function enemiesController() {
  enemies = document.querySelectorAll('.enemy');

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    
    checkPlayerEnemyCollide();

    if (enemy) {
      enemy.style.top = enemy.explode ? enemy.offsetTop : `${enemy.offsetTop + enemySpeed}px`;

      if (enemy.offsetTop > (screen.yEnd - 60)) {
        enemyExplosion(enemy, true);
      }
    }
  }
}

function shoot(x, y) {
  if(isGameRunning) {
    let shootObject = document.createElement('div');
    shootObject.className = 'player-shoot';
    shootObject.style = `top: ${y}px; left: ${x + (player.object.offsetWidth / 2)}px;`;

    document.body.appendChild(shootObject);
    playShootSound();
  }
}

function shootsController() {
  shoots = document.querySelectorAll('.player-shoot');
  
  for (let i = 0; i < shoots.length; i++) {
    const shoot = shoots[i];
    
    if(shoot) {
      shoot.style.top = `${shoot.offsetTop - shootSpeed}px`;

      checkShootEnemyCollide(shoot);
      if(shoot.offsetTop < 0) {
        shoot.remove();
      }
    }
  }
}

function checkShootEnemyCollide(shoot) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    if(
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

      if(enemy.classList.contains('little-enemy')) {
        if(enemy.takenShoots >= 2) {
          enemyExplosion(enemy);
        }
      } else if(enemy.classList.contains('medium-enemy')) {
        if(enemy.takenShoots >= 4) {
          enemyExplosion(enemy);
        }
      } else if(enemy.classList.contains('big-enemy')) {
        if(enemy.takenShoots >= 6) {
          enemyExplosion(enemy);
        }
      }

      shoot.remove();
    }
  }
}

function checkPlayerEnemyCollide() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    if(
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

      playPlayerExplosionSound();
      gameStop();
    }
  }
}

function playerController() {
  if (player.xPosition <= screen.xStart) {
    player.xPosition = screen.xStart;
  } else if (player.xPosition > screen.xEnd - player.object.offsetWidth) {
    player.xPosition = screen.xEnd - player.object.offsetWidth;
  } else if (player.yPosition <= screen.yStart) {
    player.yPosition = screen.yStart;
  } else if (player.yPosition > screen.yEnd - player.object.offsetHeight) {
    player.yPosition = screen.yEnd - player.object.offsetHeight;
  }

  player.yPosition += player.yDirection * player.speed;
  player.xPosition += player.xDirection * player.speed;
  player.object.style.left = `${player.xPosition}px`;
  player.object.style.top = `${player.yPosition}px`;
}

function gameLoop() {
  if(isGameRunning) {
    playerController();
    shootsController();
    enemiesController();
  }

  frames = requestAnimationFrame(gameLoop);
}

function gameStop(win = false) {
  isGameRunning = false;
  document.getElementById('message').style.display = 'flex';
  
  if(win) {
    winMessage.style.display = 'flex';
  } else {
    defeatMessage.style.display = 'flex';
  }

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    
    enemy.remove();
  }

  for (let i = 0; i < shoots.length; i++) {
    const shoot = shoots[i];
    
    shoot.remove();
  }
}

function start() {
  screen.object = document.getElementById('gameScreen');
  screen.width = screen.object.offsetWidth;
  screen.height = screen.object.offsetHeight;
  screen.xStart = screen.object.offsetLeft;
  screen.xEnd = screen.object.offsetLeft + screen.width;
  screen.yStart = screen.object.offsetTop;
  screen.yEnd = screen.object.offsetTop + screen.height;

  player.object = document.getElementById('player');
  player.speed = 5;
  player.xDirection = 0;
  player.yDirection = 0;
  player.xPosition = (screen.width / 2 - (player.object.offsetWidth / 2)) + screen.xStart;
  player.yPosition = (screen.height * .85 - (player.object.offsetHeight / 2)) + screen.yStart;

  player.object.style.left = `${player.xPosition}px`;
  player.object.style.top = `${player.yPosition}px`;

  shootSpeed = 7.5;

  enemyCounter = 25;
  generatedEnemies = 25;
  enemySpeed = 1;

  planetHealth = 120;

  currentDialogue = 0;
  gameAttempt = 0;

  clearInterval(enemyCreationInterval);
  enemyCreationInterval = setInterval(generateEnemies, 1500);

  gameLoop();
}
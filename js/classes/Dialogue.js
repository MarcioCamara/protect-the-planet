class Dialogue {
    constructor() {
        this.interactivityVariables = undefined;

        this.list = undefined;

        this.dialogueElement = undefined;
        this.dialoguePicture = undefined;
        this.dialogueLabel = undefined;
        this.isNextInput = false;
    }

    static initialize() {
        this.interactivityVariables = {
            playerName: 'BILLY',
        };

        this.list = [
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
                sentence: `Certo, <strong>${this.interactivityVariables.playerName}</strong>. O planeta está sendo atacado por uma tropa alienigena!`,
                picture: 'images/annoyed-wolf.png',
            },
            {
                id: 3,
                sentence: 'Precisamos fazer algo sobre isso. Entre na sua nave e vamos acabar com eles!',
                picture: 'images/angry-wolf.png',
            },
        ];

        this.dialogueElement = document.getElementById('dialogue');
        this.dialoguePicture = document.getElementById('dialoguePicture');
        this.dialogueLabel = document.getElementById('dialogueLabel');

        this.dialogueElement.style.display = 'flex';
        this.dialoguePicture.src = this.list[game.currentDialogue].picture;
        this.dialogueLabel.innerHTML = this.list[game.currentDialogue].sentence;
    }


    static changeDialogue() {
        if (this.isNextInput && Dialogue.list[game.currentDialogue] && Dialogue.list[game.currentDialogue].interactivity) {
            document.getElementById('inputLabel').innerHTML = Dialogue.list[game.currentDialogue].interactivity.text;
            document.getElementById('inputContainer').style.display = 'flex';

            document.getElementById('confirmInput').addEventListener('click', () => {
                document.getElementById('inputContainer').style.display = 'none';
                Dialogue.interactivityVariables[Dialogue.list[game.currentDialogue].interactivity.variable] = document.getElementById('input').value;
                Dialogue.list[game.currentDialogue + 1].sentence = `Certo, <strong>${Dialogue.interactivityVariables.playerName}</strong>. O planeta está sendo atacado por uma tropa alienigena!`;
                this.isNextInput = false;
                Dialogue.changeDialogue();
            });

            this.isNextInput = false;
        } else {
            game.currentDialogue++;
        }

        if (Dialogue.list[game.currentDialogue] && Dialogue.list[game.currentDialogue].interactivity) {
            this.isNextInput = true;
        }

        if (!Dialogue.list[game.currentDialogue]) {
            game.start();
            return;
        }

        Dialogue.dialogueLabel.innerHTML = Dialogue.list[game.currentDialogue].sentence;
        Dialogue.dialoguePicture.src = Dialogue.list[game.currentDialogue].picture;
    }
}
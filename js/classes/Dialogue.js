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
                sentence: 'Hey, traveler! Thanks to Glork, you woke up!',
                picture: 'images/happy-wolf.png',
            },
            {
                id: 1,
                sentence: 'I\'m <strong>KIEKO</strong>. What is your name?',
                picture: 'images/default-wolf.png',
                interactivity: {
                    text: 'What\'s your name?',
                    variable: 'playerName',
                },
            },
            {
                id: 2,
                sentence: '',
                picture: 'images/annoyed-wolf.png',
            },
            {
                id: 3,
                sentence: `But we talk more later. Our planet is being attacked by an alien troop!`,
                picture: 'images/annoyed-wolf.png',
            },
            {
                id: 4,
                sentence: 'We need to do something about it. Get in your ship and let\'s finish them off!',
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
                const inputValue = document.getElementById('input').value;

                if (!inputValue) {
                    return;
                }

                document.getElementById('inputContainer').style.display = 'none';
                Dialogue.interactivityVariables[Dialogue.list[game.currentDialogue].interactivity.variable] = inputValue.toUpperCase();
                player.name = inputValue.toUpperCase();

                if (player.city && player.continent) {
                    Dialogue.list[game.currentDialogue + 1].sentence = `Okay, <strong>${Dialogue.interactivityVariables.playerName}</strong>. From the data on your ship, I see that you're from <strong>${player.country}</strong>, <strong>${player.city}</strong>!`;
                } else {
                    Dialogue.list[game.currentDialogue + 1].sentence = `Okay, <strong>${Dialogue.interactivityVariables.playerName}</strong>. I can't read the data on your ship to know where are you from...`;
                }
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
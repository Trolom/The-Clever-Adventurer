export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize =30;
        this.fontFamily = "Helvetica";
        this.livesImage = document.getElementById('lives');

        
        this.questions1 = [
            ["What is the capital of France?", "Paris"],
            ["Who wrote the novel 'Pride and Prejudice'?", "Jane Austen"],
            ["What is the largest planet in our solar system?", "Jupiter"],
            ["Who painted the Mona Lisa?", "Leonardo da Vinci"],
            ["What is the square root of 144?", "12"]
          ];
          this.questions2 = [
            [
              'What is the capital of Australia?',
              'Canberra',
              'Sydney',
              'Melbourne',
              'Perth'
            ],
            [
              'Which planet is known as the Red Planet?',
              'Mars',
              'Venus',
              'Jupiter',
              'Mercury'
            ],
            [
              'Who is the author of "To Kill a Mockingbird"?',
              'Harper Lee',
              'J.K. Rowling',
              'Ernest Hemingway',
              'Charles Dickens'
            ],
            [
              'What is the largest ocean on Earth?',
              'Pacific Ocean',
              'Atlantic Ocean',
              'Indian Ocean',
              'Arctic Ocean'
            ],
            [
              'What is the chemical symbol for gold?',
              'Au',
              'Ag',
              'Cu',
              'Fe'
            ]
          ];
        this.image = document.getElementById('challenge');
        this.imageBackground = document.getElementById('pause');
        this.imageQs = document.getElementById('challengeImg');
        this.imageSkl =document.getElementById('imgskl');
        this.imageSpk =document.getElementById('imgspk');
        this.imageBat =document.getElementById('imgbat');
        this.fontSize = 30;
        this.fontFamily = "Helvetica";
        this.answer = null;
        this.correctAns = null;
        this.displayBar;
        this.submitButton;
        this.actualChallenge;
        this.container;
        this.option;
        this.challengesCompleted = 0;
        
    }
    draw(context, document) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;

        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score: ' + this.game.score, 20, 50);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        //lives
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }
        

        //game over messages
        if (this.game.gameOver) {
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score > this.game.winningScore || this.game.scrollOffSet > this.game.maxScrollOffSet) {
            context.fillText('You win', this.game.width * 0.5, this.game.height * 0.5 - 20);
            } else {
                context.fillText('Game over', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('Better luck next time', this.game.width * 0.5, this.game.height * 0.5 + 20)
            }
            context.fillText('Game will restart in 5 seconds', this.game.width * 0.5, this.game.height * 0.7 + 20)
        }
        if (this.game.pause) {
            context.drawImage(this.imageBackground, 0, 0, this.game.width, this.game.height);
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            context.fillText('Paused', this.game.width * 0.5, this.game.height * 0.2 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.drawImage(this.imageQs, this.game.width * 0.07, this.game.height * 0.135, 81, 107);
            context.fillText('This icon represents challenges scattered across the level', this.game.width * 0.43, this.game.height * 0.26);
            context.drawImage(this.imageSkl, this.game.width * 0.06, this.game.height * 0.35, 45, 90);
            context.drawImage(this.imageSpk, this.game.width * 0.1, this.game.height * 0.35, 70, 85);
            context.drawImage(this.imageBat, this.game.width * 0.06, this.game.height * 0.50, 60, 45);
            context.fillText('This icons represents the enemies you will encounter on your journey', this.game.width * 0.5, this.game.height * 0.5);
            context.fillText('Enemies killed: ' + this.game.player.enemiesKilled, this.game.width * 0.17, this.game.height * 0.68);
            context.fillText('Challenges completed: ' + this.challengesCompleted, this.game.width * 0.2, this.game.height * 0.73);
            context.fillText('Press wasd to resume game', this.game.width * 0.5, this.game.height * 0.8 + 20);
            }
        this.actualCh(context, document)
        context.restore();
    }

    actualCh(context, document) {
        this.game.challenges.forEach(challenge => {
            if(challenge.markedForDeletion) {
                this.actualChallenge = challenge;
                if (this.actualChallenge.type == 'writeAns')
                    this.challengeUI1(context, document);
                else if (this.actualChallenge.type = 'chooseOpt')
                    this.challengeUI2(context, document);
                this.game.challenges.splice(this.game.challenges.indexOf(challenge), 1);
            }
        });
    }



    challengeUI1(context, document) {
          
        context.drawImage(this.imageBackground, 0, 0, this.game.width, this.game.height);
        context.textAlign = 'center';
        context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
        context.fillText('Challenge', this.game.width * 0.5, this.game.height * 0.2 - 20);

        var randomIndex = Math.floor(Math.random() * this.questions1.length);
        var randomPair = this.questions1[randomIndex];
        context.font = this.fontSize * 1.2 + 'px ' + this.fontFamily;
        context.fillText(randomPair[0], this.game.width * 0.5, this.game.height * 0.3 - 20);

        this.displayBar = document.createElement('input');
        this.displayBar.type = 'text';
        this.displayBar.placeholder = 'Answer';
            
            document.body.appendChild(this.displayBar);
            
            // Create a submit button element
            this.submitButton = document.createElement('button');
            var spanElement = document.createElement('span');
            spanElement.textContent = 'Submit';
            this.submitButton.appendChild(spanElement);
            this.submitButton.classList = 'button';
            this.submitButton.style.position = 'absolute';
            this.submitButton.style.top = 48 + '% ';
            this.submitButton.style.left =46 + '% ';
            this.submitButton.style.width = 100 + 'px ';
            document.body.appendChild(this.submitButton);

            
            this.correctAns = randomPair[1];
            console.log(this.correctAns);
            this.submitButton.addEventListener('click', () => {
                this.answer = this.displayBar.value;
                console.log(this.answer);
                if (this.answer === this.correctAns) {
                    this.game.score += 7;
                    this.challengesCompleted++;
                }
                else {
                    this.game.score -= 5;
                }
                this.game.inChallenge = false;
                    document.body.removeChild(this.displayBar);
                    document.body.removeChild(this.submitButton);
                    
            });
    }



    challengeUI2(context, document) {
        context.drawImage(this.imageBackground, 0, 0, this.game.width, this.game.height);
        context.textAlign = 'center';
        context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
        context.fillText('Challenge', this.game.width * 0.5, this.game.height * 0.2 - 20);

    var randomIndex = Math.floor(Math.random() * this.questions2.length);
    var randomPair = this.questions2[randomIndex];
    var options = randomPair.slice(1);
    this.correctAns = options[0]; // Assuming the first option is the correct answer

    context.font = this.fontSize * 1.2 + 'px ' + this.fontFamily;
    context.fillText(randomPair[0], this.game.width * 0.5, this.game.height * 0.3 - 20);
    var q = randomPair.shift();

  // Create a container div element
  this.container = document.createElement('ul');
  this.container.style.position = 'absolute';
  this.container.style.top = '40%';
  this.container.style.left = '37%';
  document.body.appendChild(this.container);

  var optionElements = []; // Array to store the created option elements

  randomPair.forEach((optionText, index) => {
    var option = document.createElement('li');
    option.textContent = optionText;
    this.container.appendChild(option);
    optionElements.push(option); // Add the option element to the array

    option.addEventListener('click', () => {
      optionElements.forEach((otherOption, otherIndex) => {
        if (otherIndex !== index) {
          otherOption.classList.remove('selected');
        }
      });

      option.classList.toggle('selected');
    });
  });

  this.submitButton = document.createElement('button');
  var spanElement = document.createElement('span');
  spanElement.textContent = 'Submit';
  this.submitButton.appendChild(spanElement);
  this.submitButton.style.marginTop = '10px';
  this.submitButton.classList = 'button';
  this.container.appendChild(this.submitButton);

  this.submitButton.addEventListener('click', () => {
    var selectedOption = this.container.querySelector('.selected');
    if (selectedOption) {
      this.answer = selectedOption.textContent;
      console.log('Selected answer:', this.answer);

      if (this.answer === this.correctAns) {
        this.game.score += 5;
        this.challengesCompleted++;
      } else {
        this.game.score -= 5;
      }

      // Remove the question and options from the screen
      document.body.removeChild(this.container);
      this.game.inChallenge = false;
    } else {
      console.log('Please select an option before submitting.');
    }
  });
  randomPair.unshift(q);
}

}
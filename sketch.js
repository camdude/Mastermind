let colours = [
  "white",
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "pink",
];
let gameWon = false;
let hintMsg;
let answer;
let guesses = [];
let results = [];
let guessRound = 0;
let colourCursor = 0;
let debugging = false;

function setup() {
  ellipseMode(CORNER);
  createCanvas(windowWidth, 1600);

  hintMsg = new Message("Use number keys to choose a new colour", 50, 70);
  answer = new CodeGuess(30, generateCode(), true);
  guesses.push(new CodeGuess(30, [9, 9, 9, 9, 9], false));
}

function draw() {
  background("#cccccc");

  // debugging
  if (debugging) {
    fill(50);
    stroke(0);
    text(
      `guessRound: ${guessRound}        colourCursor: ${colourCursor}`,
      600,
      70
    );
    text("Answer:", 600, 95);
    answer.show(600, 100);
  }

  // game text
  fill(50);
  stroke(0);
  text("Welcome to Mastermind!", 20, 30);

  hintMsg.show();

  // guess area
  fill(50);
  stroke(0);
  for (let i = 0; i < guesses.length; i++) {
    fill(50);
    stroke(0);
    text(`Guess ${i + 1}:`, guesses[i].x, guesses[i].y - 5);
    guesses[i].show(50, 100 + 100 * i);
    if (i != 0) {
      results[i - 1].show(300, 100 * i);
    }
  }
  3;
}

function keyPressed() {
  if (!gameWon) {
    if (key >= 0 && parseInt(key) <= 7) {
      //Update colour
      guesses[guessRound].makeGuess(colourCursor, parseInt(key));
      hintMsg.updateMsg("Press enter to select colour");
    }
    if (keyCode === 13) {
      //Selection confirmed (Enter pressed)
      if (colourCursor === 4) {
        //Make full guess
        let result = compareCodes(answer.guess, guesses[guessRound].guess);
        results.push(new CodeResult(20, result));
        if (arrayEquals(result, [2, 2, 2, 2, 2])) {
          //Game won!
          console.log("Game won!");
          gameWon = true;
          hintMsg.updateMsg("Congratulations, you are a mastermind!");
        } else {
          //Cleanup for next round
          colourCursor = 0;
          guesses.push(new CodeGuess(30, [9, 9, 9, 9, 9], false));
          guessRound++;
        }
      } else {
        if (!(guesses[guessRound].guess[colourCursor] === "x")) {
          //Move to next colour
          colourCursor++;
          hintMsg.updateMsg("Use number keys to choose a new colour");
        } else {
          //Invalid selection
          hintMsg.updateMsg("You need to choose a colour first");
        }
      }
    }
  }
}

function generateCode() {
  let code = [];

  for (let i = 0; i < 5; i++) {
    let randOpt;
    do {
      randOpt = round(random(0, 7));
    } while (code.includes(randOpt));
    code[i] = randOpt;
  }
  console.log("Colour code:", colours);
  console.log("Answer:", code);
  return code;
}

function compareCodes(ans, guess) {
  let result = [];
  console.log(ans, guess);
  for (let i = 0; i < ans.length; i++) {
    if (ans[i] === guess[i]) {
      result[i] = 2; //correct position
    } else if (ans.includes(guess[i])) {
      result[i] = 1; //correct colour
    } else {
      result[i] = 0; //incorrect
    }
  }
  console.log(result);
  return result;
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

class CodeGuess {
  constructor(s, guess, locked) {
    this.x = 0;
    this.y = 0;
    this.size = s;
    this.padding = s / 2;
    this.guess = guess;
    this.locked = locked;
  }

  makeGuess(pos, guess) {
    this.guess[pos] = guess;
  }

  show(x, y) {
    this.x = x;
    this.y = y;

    fill(255);
    if (this.locked) {
      stroke("red");
    } else {
      stroke(0);
    }
    rect(
      this.x,
      this.y,
      this.padding + (this.padding + this.size) * 5,
      this.size + this.padding * 2
    );

    for (let i = 0; i < this.guess.length; i++) {
      stroke(0);
      if (this.guess[i] == 9) {
        stroke("#cccccc");
        fill("white");
      } else {
        fill(colours[this.guess[i]]);
      }

      ellipse(
        this.x + this.padding + (this.padding + this.size) * i,
        this.y + this.padding,
        this.size,
        this.size
      );
      if (debugging) {
        fill("#cccccc");
        text(
          this.guess[i],
          this.x +
            this.padding +
            (this.padding + this.size) * i +
            this.size / 2 -
            3,
          this.y + this.padding + this.size / 2 + 3
        );
      }
    }
  }
}

class CodeResult {
  constructor(s, guess) {
    this.x = 0;
    this.y = 0;
    this.size = s;
    this.padding = s / 2;
    this.guess = guess;
  }

  show(x, y) {
    this.x = x;
    this.y = y;

    fill(255);
    stroke(0);
    rect(
      this.x,
      this.y,
      this.padding + (this.padding + this.size) * 5,
      this.size + this.padding * 2
    );

    let sortedGuess = this.guess.sort().reverse();
    for (let i = 0; i < sortedGuess.length; i++) {
      stroke(0);

      switch (sortedGuess[i]) {
        case 1:
          fill(255);
          break;
        case 2:
          fill(0);
          break;
        default:
          stroke("#cccccc");
          fill(255);
          break;
      }

      ellipse(
        this.x + this.padding + (this.padding + this.size) * i,
        this.y + this.padding,
        this.size,
        this.size
      );
    }
  }
}

class Message {
  constructor(msg, x, y) {
    this.msg = msg;
    this.x = x;
    this.y = y;
  }

  updateMsg(newMsg) {
    this.msg = newMsg;
  }

  show() {
    stroke("red");
    text(this.msg, this.x, this.y);
  }
}

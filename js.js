"use strict";

const settings = {
  rowsCount: 21,
  colsCount: 21,
  speed: 2,
  winFoodCount: 50,
};

const config = {
  settings,

  init(userSettings) {
    Object.assign(this.settings, userSettings);
  },

  validate() {
    const result = {
      isValid: true,
      errors: [],
    };

    if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки. Значение rowsCount должно быть в диапазоне [10, 30]."
      );
    }

    if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки. Значение colsCount должно быть в диапазоне [10, 30]."
      );
    }

    if (this.settings.speed < 1 || this.settings.speed > 10) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки. Значение speed должно быть в диапазоне [1, 10]."
      );
    }

    if (this.settings.winFoodCount < 5 || this.settings.winFoodCount > 50) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки. Значение speed должно быть в диапазоне [5, 50]."
      );
    }

    return result;
  },

  getRowsCount() {
    return this.settings.rowsCount;
  },

  getColsCount() {
    return this.settings.colsCount;
  },

  getWinFoodCount() {
    return this.settings.winFoodCount;
  },

  getSpeed() {
    return this.settings.speed;
  },
};

const map = {
  cells: null,
  usedCells: null,

  init(rowsCount, colsCount) {
    const table = document.getElementById("game");
    table.innerHTML = "";

    this.cells = {};
    this.usedCells = [];

    for (let row = 0; row < rowsCount; row++) {
      const tr = document.createElement("tr");
      tr.classList.add("row");
      table.appendChild(tr);

      for (let col = 0; col < colsCount; col++) {
        const td = document.createElement("td");
        td.classList.add("cell");

        this.cells[`x${col}_y${row}`] = td;

        tr.appendChild(td);
      }
    }
  },

  render(snakePointsArray, foodPoint) {
    for (const cell of this.usedCells) {
      cell.className = "cell";
    }

    this.usedCells = [];

    snakePointsArray.forEach((point, idx) => {
      const snakeCell = this.cells[`x${point.x}_y${point.y}`];
      snakeCell.classList.add(idx === 0 ? "snakeHead" : "snakeBody");
      this.usedCells.push(snakeCell);
    });

    const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
    foodCell.classList.add("food");
    this.usedCells.push(foodCell);
  },
};

const snake = {
  body: null,
  direction: null,
  lastStepDirection: null,

  init(startBody, startDirection) {
    this.body = startBody;
    this.direction = startDirection;
    this.lastStepDirection = startDirection;
  },

  getLastStepDirection() {
    return this.lastStepDirection;
  },

  getBody() {
    return this.body;
  },

  getNextStepPoint() {
    const headPoint = this.body[0];

    switch (this.direction) {
      case "up":
        return { x: headPoint.x, y: headPoint.y - 1 };
      case "right":
        return { x: headPoint.x + 1, y: headPoint.y };
      case "left":
        return { x: headPoint.x - 1, y: headPoint.y };
      case "down":
        return { x: headPoint.x, y: headPoint.y + 1 };
    }
  },

  isOnPoint(point) {
    return this.body.some(
      (snakePoint) => snakePoint.x === point.x && snakePoint.y === point.y
    );
  },

  makeStep() {
    this.lastStepDirection = this.direction;
    this.body.unshift(this.getNextStepPoint());
    this.body.pop();
  },

  setDirection(direction) {
    this.direction = direction;
  },

  growUp() {
    const lastBodyIdx = this.body.length - 1;
    const lastBodyPoint = this.body[lastBodyIdx];
    const lastBodyPointClone = Object.assign({}, lastBodyPoint);
    this.body.push(lastBodyPointClone);
  },
};

const food = {
  x: null,
  y: null,

  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  },

  setCoordinates(point) {
    this.x = point.x;
    this.y = point.y;
  },

  isOnPoint(point) {
    return this.x === point.x && this.y === point.y;
  },
};

const gameStatus = {
  condition: null,

  setPlaying() {
    this.condition = "playing";
  },

  setStopped() {
    this.condition = "stopped";
  },

  setFinished() {
    this.condition = "finished";
  },

  isPlaying() {
    return this.condition === "playing";
  },

  isStopped() {
    return this.condition === "stopped";
  },
};

const game = {
  config,
  map,
  snake,
  food,
  gameStatus,
  tickInterval: null,

  init(userSettings) {
    this.config.init(userSettings);
    const validation = this.config.validate();
    if (validation.isValid === false) {
      for (const err of validation.errors) {
        console.error(err);
      }
      return;
    }
    this.map.init(this.config.getRowsCount(), this.config.getColsCount());
    this.setEventHandlers();
    this.reset();
  },

  setEventHandlers() {
    document
      .getElementById("playButton")
      .addEventListener("click", () => this.playClickHandler());
    document
      .getElementById("newGameButton")
      .addEventListener("click", () => this.newGameClickHandler());
    document.addEventListener("keydown", (event) => this.keyDownHandler(event));
  },

  reset() {
    this.stop();
    this.snake.init(this.getStartSnakeBody(), "up");
    this.food.setCoordinates(this.getRandomFreeCoordinates());
    this.render();
  },

  play() {
    this.gameStatus.setPlaying();
    this.tickInterval = setInterval(() => this.tickHandler(), 1000 / config.getSpeed());
    this.setPlayButton("Стоп");
  },

  stop() {
    this.gameStatus.setStopped();
    clearInterval(this.tickInterval);
    this.setPlayButton("Старт");
  },

  finish() {
    this.gameStatus.setFinished;
    clearInterval(this.tickInterval);
    this.setPlayButton("Игра закончена", true);
  },

  tickHandler() {
    if (!this.canMakeStep()) {
      return this.finish();
    }

    if (this.food.isOnPoint(this.snake.getNextStepPoint())) {
      this.snake.growUp();
      this.food.setCoordinates(this.getRandomFreeCoordinates());
      if (this.isGameWin()) {
        this.finish();
      }
    }

    this.snake.makeStep();
    this.render();
  },

  render() {
    this.map.render(this.snake.getBody(), this.food.getCoordinates());
  },

  setPlayButton(textContent, isDisabled = false) {
    const playButton = document.getElementById("playButton");
    playButton.textContent = textContent;
    isDisabled
      ? playButton.classList.add("disabled")
      : playButton.classList.remove("disabled");
  },

  playClickHandler() {
    if (this.gameStatus.isPlaying()) {
      this.stop();
    } else if (this.gameStatus.isStopped()) {
      this.play();
    }
  },

  newGameClickHandler() {
     config.init();
  },

  keyDownHandler(event) {
    if (!this.gameStatus.isPlaying()) {
      return;
    }

    const direction = this.getDirectionByCode(event.code);
    if (this.canSetDirection(direction)) {
      this.snake.setDirection(direction);
    }
  },

  getDirectionByCode(code) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        return "up";
      case "KeyD":
      case "ArrowRight":
        return "right";
      case "KeyA":
      case "ArrowLeft":
        return "left";
      case "KeyS":
      case "ArrowDown":
        return "down";
      default:
        return "";
    }
  },

  canSetDirection(direction) {
    const lastStepDirection = this.snake.getLastStepDirection();

    return (
      (direction === "up" && lastStepDirection !== "down") ||
      (direction === "right" && lastStepDirection !== "left") ||
      (direction === "down" && lastStepDirection !== "up") ||
      (direction === "left" && lastStepDirection !== "right")
    );
  },

  getStartSnakeBody() {
    return [
      {
        x: Math.floor(this.config.getColsCount() / 2),
        y: Math.floor(this.config.getRowsCount() / 2),
      },
    ];
  },

  getRandomFreeCoordinates() {
    const exclude = [this.food.getCoordinates(), ...this.snake.getBody()];

    while (true) {
      const rndPoint = {
        x: Math.floor(Math.random() * this.config.getColsCount()),
        y: Math.floor(Math.random() * this.config.getRowsCount()),
      };

      if (
        !exclude.some(
          (exPoint) => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y
        )
      ) {
        return rndPoint;
      }
    }
  },

  canMakeStep() {
    const nextStepPoint = this.snake.getNextStepPoint();

    return (
      !this.snake.isOnPoint(nextStepPoint) &&
      nextStepPoint.x < this.config.getColsCount() &&
      nextStepPoint.y < this.config.getRowsCount() &&
      nextStepPoint.x >= 0 &&
      nextStepPoint.y >= 0
    );
  },

  isGameWon() {
    return this.snake.getBody().length > this.config.getWinFoodCount();
  },
};

game.init({ speed: 10 });
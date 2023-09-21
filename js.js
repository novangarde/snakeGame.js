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

  render(snalePointsArray, foodPoint) {
    
  },
};

const snake = {
  body: null,
  direction: null,

  init(startBody, startDirection) {
    this.body = startBody;
    this.direction = startDirection;
  },

  getBody() {
    return this.body;
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
};

const gameStatus = {};

const game = {
  config,
  map,
  snake,
  food,
  gameStatus,

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
    // TODO сделать обработчики.
  },

  reset() {
    this.stop();
    this.snake.init(this.getStartSnakeBody(), "up");
    this.food.setCoordinates(this.getRandomFreeCoordinates());
    this.map.render(this.snake.getBody(), this.food.getCoordinates());
  },

  play() {},

  stop() {},

  finish() {},

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
};

game.init({ speed: 8 });

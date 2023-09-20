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
};

const map = {};

const snake = {};

const food = {};

const status = {};

const game = {
  config,
  map,
  snake,
  food,
  status,

  init(userSettings) {
    this.config.init(userSettings);
    const validation = this.config.validate();
    console.log(validation);
  }
};

game.init({ speed: 8 });

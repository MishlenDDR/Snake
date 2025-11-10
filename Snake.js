let preloaderWas = false;
class Game {
  constructor() {
    this.FieldMaxX = 20; // размер поля по иксам
    this.FieldMaxY = 20; // размер поля по игрикам
    this.arrField = [this.FieldMaxX, this.FieldMaxX]; // размер поля
    this.Start = []; // массив с координатами головы
    this.Body = []; // массив для тела
    this.NewPos = []; // массив для изменения позиции головы
    this.Apple = []; // массив для хранения яблок
    this.NumberOfBombs = 10;
    this.NumberOfApples = 10;
    this.NumberOfMedKits = 3;
    this.Bomb = []; // массив с бомбами
    this.MedKits = []; // хилл
    this.direction = "right"; // при старте изначальное направление вправо
    this.count = 0; // счетчик сьеденных яблок
    this.countBobmActivate = 0; // счетчик сьеденных бомб
    this.SpeedLimit = 0; // просто переменная для обработки скорости
    this.Speed = 250; // начальная скорость движения
    this.oldHead = []; // массив для старого положения головы
    this.tailDirection = "right"; // изначально хвост смотрит туда же куда и голова
    this.bodyDirections = []; // массив для направления тела
    this.oldDirection = "right"; // старое направление
    this.newDirection = "right"; // новое направление
    this.tail = []; // массив для хвоста
    this.TurnPoints = []; // массив для хранения координат точки поворота
    this.snakeDead = false;
    this.currentFireAnimation = 0;
    this.fieldAnimationInterval = 0;
    this.walls = [
      // Левый верхний угол
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },

      // Правый верхний угол
      { x: 14, y: 4 },
      { x: 15, y: 4 },
      { x: 16, y: 4 },
      { x: 16, y: 5 },
      { x: 16, y: 6 },

      // Левый нижний угол
      { x: 4, y: 14 },
      { x: 4, y: 15 },
      { x: 4, y: 16 },
      { x: 5, y: 16 },
      { x: 6, y: 16 },

      // Правый нижний угол
      { x: 16, y: 14 },
      { x: 16, y: 15 },
      { x: 14, y: 16 },
      { x: 15, y: 16 },
      { x: 16, y: 16 },
    ];
  }

  start() {
    // генерация головы на поле
    this.Start = [
      Math.floor(Math.random() * this.FieldMaxX + 1),
      Math.floor(Math.random() * this.FieldMaxY + 1),
    ];
    this.count = 0;
  }

  apple() {
    // генерируется случайно 10 яблок на поле
    this.Apple = [];
    for (let i = 0; i < this.NumberOfApples; i++) {
      let Apples;
      do {
        Apples = [
          Math.floor(Math.random() * this.FieldMaxX + 1),
          Math.floor(Math.random() * this.FieldMaxY + 1),
        ];
      } while (
        (this.Start[0] === Apples[0] && this.Start[1] === Apples[1]) || // проверка головы
        this.Apple.some(
          (apple) => apple[0] === Apples[0] && apple[1] === Apples[1]
        ) || // проверка других яблок
        this.Body.some(
          (body) => body[0] === Apples[0] && body[1] === Apples[1]
        ) || // проверка тела
        this.walls.some((wall) => wall.x === Apples[0] && wall.y === Apples[1])
      );

      this.Apple.push(Apples);
    }
    return this.Apple;
  }
  bombGeneration() {
    this.Bomb = [];
    for (let i = 0; i < this.NumberOfBombs; i++) {
      let bombs;
      do {
        // создаем бомбы в случайном месте 20 на 20
        bombs = [
          Math.floor(Math.random() * this.FieldMaxX + 1),
          Math.floor(Math.random() * this.FieldMaxY + 1),
        ];
        // тут проверки что координаты тела, другой бомбы, головы, или яблок не создадутся друг на друге
      } while (
        (this.Start[0] === bombs[0] && this.Start[1] === bombs[1]) || // проверка головы
        this.Bomb.some(
          (bomb) => bomb[0] === bombs[0] && bomb[1] === bombs[1]
        ) || // проверка других бомб
        this.Body.some(
          (body) => body[0] === bombs[0] && body[1] === bombs[1]
        ) || // проверка тела
        this.Apple.some(
          (apple) => apple[0] === bombs[0] && apple[1] === bombs[1]
        ) || // проверка яблок
        this.walls.some((wall) => wall.x === bombs[0] && wall.y === bombs[1])
      );

      this.Bomb.push(bombs); // добавили созданные бомбы в массив бомб
    }
    return this.Bomb;
  }
  addApple() {
    // добавляется яблоко если сьели одно
    let newApple;
    do {
      newApple = [
        Math.floor(Math.random() * this.FieldMaxX + 1),
        Math.floor(Math.random() * this.FieldMaxY + 1),
      ];
    } while (
      (this.Start[0] === newApple[0] && this.Start[1] === newApple[1]) || // проверка головы
      this.Apple.some(
        (apple) => apple[0] === newApple[0] && apple[1] === newApple[1]
      ) || // проверка других яблок
      this.Body.some(
        (body) => body[0] === newApple[0] && body[1] === newApple[1]
      ) || // проверка тела
      this.Bomb.some(
        (bomb) => bomb[0] === newApple[0] && bomb[1] === newApple[1]
      ) || // проверка бомб
      this.walls.some(
        (wall) => wall.x === newApple[0] && wall.y === newApple[1]
      )
    );

    return newApple;
  }
  addBombs() {
    // добавили 4 бомбы если одну сьели
    const newBombs = [];
    for (let i = 0; i < 4; i++) {
      let newBomb;
      do {
        newBomb = [
          Math.floor(Math.random() * this.FieldMaxX + 1),
          Math.floor(Math.random() * this.FieldMaxY + 1),
        ];
        // проверки на то чтобы они не появлялись там где есть яблоки голова и тело
      } while (
        (this.Start[0] === newBomb[0] && this.Start[1] === newBomb[1]) || // проверка головы
        this.Bomb.some(
          (bomb) => bomb[0] === newBomb[0] && bomb[1] === newBomb[1]
        ) || // проверка других бомб
        this.Body.some(
          (body) => body[0] === newBomb[0] && body[1] === newBomb[1]
        ) || // проверка тела
        this.Apple.some(
          (apple) => apple[0] === newBomb[0] && apple[1] === newBomb[1]
        ) || // проверка яблок
        this.walls.some(
          (wall) => wall.x === newBomb[0] && wall.y === newBomb[1]
        )
      );

      newBombs.push(newBomb);
    }
    return newBombs;
  }
  MedKitSpawn() {
    this.MedKits = [];
    for (let i = 0; i < this.NumberOfMedKits; i++) {
      let med;
      do {
        med = [
          Math.floor(Math.random() * this.FieldMaxX + 1),
          Math.floor(Math.random() * this.FieldMaxY + 1),
        ];
      } while (
        (this.Start[0] === med[0] && this.Start[1] === med[1]) || // проверка головы
        this.Bomb.some((bomb) => bomb[0] === med[0] && bomb[1] === med[1]) || // проверка бомб
        this.Body.some((body) => body[0] === med[0] && body[1] === med[1]) || // проверка тела
        this.Apple.some(
          (apple) => apple[0] === med[0] && apple[1] === med[1]
        ) || // проверка яблок
        this.walls.some((wall) => wall.x === med[0] && wall.y === med[1])
      );

      this.MedKits.push(med); // добавили созданные бомбы в массив бомб
    }
    return this.MedKits;
  }
  FireAnimation() {
    setInterval(() => {
      this.currentFireAnimation = (this.currentFireAnimation + 1) % 3;
    }, 50);
  }

  failsWithImages() {
    // это обьект для хранения изображений
    const directionFromTo = {
      body: {
        turnUpRight: "images/ТелоВверхВправо.png",
        turnUpLeft: "images/ТелоВверхВлево.png",
        turnDownLeft: "images/ТелоВнизВлево.png",
        turnDownRight: "images/ТелоВнизВправо.png",
        turnUpDown: "images/ТелоВерхНиз.png",
        turnLeftRight: "images/ТелоВлевоВправо.png",
      },
      head: {
        turnUp: "images/ГоловаВверх.png",
        turnDown: "images/ГоловаВниз.png",
        turnLeft: "images/ГоловаВлево.png",
        turnRight: "images/ГоловаВправо.png",
      },
      tail: {
        turnUp: "images/ХвостВерх.png",
        turnDown: "images/ХвостНиз.png",
        turnLeft: "images/ХвостЛево.png",
        turnRight: "images/ХвостПраво.png",
      },
      otherObjects: {
        explosive: "images/Взрыв.png",
        appleSkin: "images/Яблоко2.png",
        bombSkin: "images/Бомба.png",
        fieldBlock: "images/Кубик3.png",
        MedKit: "images/Аптечка.png",
        WallBlock: [
          "images/Огонь1.png",
          "images/Огонь2.png",
          "images/Огонь3.png",
        ],
        preloadAnimationImages: [
          "images/Картинка1.png",
          "images/Картинка2.png",
          "images/Картинка3.png",
          "images/Картинка4.png",
          "images/Картинка5.png",
          "images/Картинка6.png",
          "images/Картинка7.png",
          "images/Картинка8.png",
          "images/Картинка9.png",
          "images/Картинка8.png",
          "images/Картинка5.png",
          "images/Картинка4.png",
          "images/Картинка3.png",
          "images/Картинка2.png",
        ],
        fieldAnimationImages: [
          "images/Поле1.png",
          "images/Поле2.png",
          "images/Поле3.png",
          "images/Поле4.png",
        ],
      },
    };
    return directionFromTo;
  }
  findTurnBody(bodyIndex) {
    // это номер элемента в массиве который пошел через поворот
    const images = this.failsWithImages();
    const direction = this.bodyDirections[bodyIndex] || this.oldDirection; // тут мы передаем какой по индекс передается для изменения направления
    // то есть если прошел элемент номер 2, в bodyDirections есть его направление и оно передается в switch(direction) ниже
    switch (direction) {
      case "w":
      case "s":
        return images.body.turnUpDown;
      case "d":
      case "a":
        return images.body.turnLeftRight;
      default:
        return images.body.turnLeftRight;
    }
  }

  findTurnforBody(from, to) {
    // передается старое и новое направление движения для поворотов
    const images = this.failsWithImages();
    const turn = `${from}-${to}`;

    switch (turn) {
      case "w-d":
      case "a-s":
        return images.body.turnUpRight;
      case "w-a":
      case "d-s":
        return images.body.turnUpLeft;
      case "d-w":
      case "s-a":
        return images.body.turnDownLeft;
      case "a-w":
      case "s-d":
        return images.body.turnDownRight;
      default:
        return images.body.turnLeftRight;
    }
  }

  findTurnHead() {
    // передается направление движения для головы
    const images = this.failsWithImages();
    const turn = `${this.oldDirection}-${this.newDirection}`;

    if (this.oldDirection === this.newDirection) {
      // для отрисовки головы до начала игры
      const directionlistForHead = {
        w: images.head.turnUp,
        s: images.head.turnDown,
        d: images.head.turnRight,
        a: images.head.turnLeft,
      };
      return directionlistForHead[this.direction] || images.head.turnRight; // смотрит по умолчанию вправо
    }

    switch (turn) {
      case "w-s":
        return images.head.turnDown;
      case "w-d":
        return images.head.turnRight;
      case "w-a":
        return images.head.turnLeft;

      case "s-w":
        return images.head.turnUp;
      case "s-d":
        return images.head.turnRight;
      case "s-a":
        return images.head.turnLeft;

      case "a-w":
        return images.head.turnUp;
      case "a-s":
        return images.head.turnDown;
      case "a-d":
        return images.head.turnRight;

      case "d-w":
        return images.head.turnUp;
      case "d-s":
        return images.head.turnDown;
      case "d-a":
        return images.head.turnLeft;

      default:
        const directionlistForHead = {
          w: images.head.turnUp,
          s: images.head.turnDown,
          d: images.head.turnRight,
          a: images.head.turnLeft,
        };
        return directionlistForHead[this.direction];
    }
  }

  findTurnTail() {
    // передается движение для определения направления хвоста
    const images = this.failsWithImages();

    const directions = {
      w: images.tail.turnUp,
      s: images.tail.turnDown,
      d: images.tail.turnRight,
      a: images.tail.turnLeft,
    };
    return directions[this.tailDirection] || images.tail.turnRight;
  }

  animation() {
    // отрисовка элементов
    console.clear(); // очищаем консоль для оптимизации
    let field = ""; // строки поля изначально пустые

    const headImages = this.findTurnHead(); // передаем картинки головы
    const tailImages = this.findTurnTail(); // передаем картинки хвоста
    const images = this.failsWithImages().otherObjects; // передаем все изображения

    for (let y = 0; y <= this.FieldMaxY; y++) {
      // обработка поля по вертикали
      let row = ""; // строки пустые изанчально
      for (let x = 0; x <= this.FieldMaxX; x++) {
        // обработка по горизонтали

        const turnTrue = this.TurnPoints.find(
          (turn) => turn.pos[0] === x && turn.pos[1] === y
        ); // есть поворот
        const bodyTrue = this.Body.some(
          (body) => body[0] === x && body[1] === y
        ); // найден элемент тела
        const headTrue = y === this.Start[1] && x === this.Start[0]; // найдена голова
        const tailTrue =
          this.tail &&
          this.tail.length > 0 &&
          y === this.tail[1] &&
          x === this.tail[0]; // найден хвост
        const trueApple = this.Apple.some(
          (apple) => apple[0] === x && apple[1] === y
        );
        const trueBomb = this.Bomb.some(
          (bomb) => bomb[0] === x && bomb[1] === y
        );
        const trueWalls = this.walls.some(
          (wall) => wall.x === x && wall.y === y
        );
        const trueMed = this.MedKits.some(
          (med) => med[0] === x && med[1] === y
        );

        if (headTrue && this.snakeDead) {
          // если голова существуем и столкновение было
          row += `<img src="${images.explosive}"class="head" width="25" height="25">`; // добавили взрыв если змея врезалась
        } else if (headTrue) {
          row += `<img src="${headImages}"class="head" width="25" height="25">`; // добавили в строку голову
        } else if (tailTrue) {
          row += `<img src="${tailImages}"class="body" width="25" height="25">`; // добавили в строку хвост
        } else if (turnTrue) {
          // есть поворот
          if (turnTrue.from && turnTrue.to) {
            // передача от куда и куда был сделан поворот
            const turnImages = this.findTurnforBody(turnTrue.from, turnTrue.to);
            row += `<img src="${turnImages}"class="body" width="25" height="25">`; // добавляем поворот в строку
          }
        } else if (bodyTrue) {
          const bodyIndex = this.Body.findIndex(
            (body) => body[0] === x && body[1] === y
          ); // находим индекс элемента тела который нужен
          const bodyImage = this.findTurnBody(bodyIndex); // передаем в фукнцию чтобы определить направление картинки
          row += `<img src="${bodyImage}"class="body" width="25" height="25">`; // добавляем тело
        } else if (trueApple) {
          row += `<img src="${images.appleSkin}" width="25" height="25">`; // добавляем яблоки если ничего не найдено
        } else if (trueBomb) {
          row += `<img src="${images.bombSkin}" width="25" height="25">`;
        } else if (trueWalls) {
          row += `<img src="${
            images.WallBlock[this.currentFireAnimation]
          }"class="fire" width="25" height="25">`;
        } else if (trueMed) {
          row += `<img src="${images.MedKit}"class="medkit" width="25" height="25">`;
        } else {
          row += `<div style="display:inline-block; width:25px; height:25px; background:transparent; margin:0;
           padding:0; border:none; vertical-align:top; line-height:0; font-size:0;"></div>`; // отрисовка поля если ничего не найдено
        }
      }
      field += row + "\n";
    }
    document.getElementById("Web").innerHTML = field;
    document.getElementById("Score").textContent = `SCORE: ${this.count}`;
  }
  speendChange() {
    // изменение скорости в зависимости от количества сьеденных яблок
    if (this.count === 50) {
      clearInterval(this.SpeedLimit);
      this.Speed = 150;
      this.SpeedLimit = setInterval(() => {
        this.movement();
      }, this.Speed);
    } else if (this.count === 150) {
      clearInterval(this.SpeedLimit);
      this.Speed = 80;
      this.SpeedLimit = setInterval(() => {
        this.movement();
      }, this.Speed);
    }
  }
  win() {
    document.getElementById("Win").style.display = "flex"; // показываем картинку с победой
    document.getElementById("restart").style.display = "flex"; // показываем кнопку рестарта
    document.getElementById("SelectButton").style.display = "flex";
    document.getElementById("ButtonDefaultSkin").style.display = "flex";
    document.getElementById("ButtonYulyaSkin").style.display = "flex";
    document.getElementById("ButtonMamysSkin").style.display = "flex";
  }
  lose() {
    this.snakeDead = true;
    clearInterval(this.SpeedLimit);
    document.getElementById("Lose").style.display = "flex"; // показываем кнопку поражения
    document.getElementById("restart").style.display = "flex"; // показываем кнопку рестарта
    document.getElementById("SelectButton").style.display = "flex";
    document.getElementById("ButtonDefaultSkin").style.display = "flex";
    document.getElementById("ButtonYulyaSkin").style.display = "flex";
    document.getElementById("ButtonMamysSkin").style.display = "flex";
    this.animation(); // для отрисовки взрыва вызываем обновленные сведение про голову
  }
  bombActiveAnimation() {
    switch (this.countBobmActivate) {
      case 1:
        document.getElementById("Heart3").style.display = "none";
        break;
      case 2:
        document.getElementById("Heart2").style.display = "none";
        break;
      case 3:
        document.getElementById("Heart1").style.display = "none";
        break;
    }
  }
  MedKitActivate() {
    switch (this.countBobmActivate) {
      case 1:
        document.getElementById("Heart3").style.display = "flex";
        this.countBobmActivate = 0;
        break;
      case 2:
        document.getElementById("Heart2").style.display = "flex";
        this.countBobmActivate = 1;
        break;
      case 3:
        document.getElementById("Heart1").style.display = "flex";
        this.countBobmActivate = 2;
        break;
    }
  }
  restartButton() {
    document.getElementById("Heart3").style.display = "flex"; // по умолчанию сердечки показываются на экране по этому "flex"
    document.getElementById("Heart2").style.display = "flex";
    document.getElementById("Heart1").style.display = "flex";
    document.getElementById("Lose").style.display = "none"; // после рестарты скрываем
    document.getElementById("Win").style.display = "none"; // так же скрываем
    document.getElementById("restart").style.display = "none"; // опять же, скрываем
    document.getElementById("SelectButton").style.display = "none";
    document.getElementById("ButtonDefaultSkin").style.display = "none";
    document.getElementById("ButtonYulyaSkin").style.display = "none";
    document.getElementById("ButtonMamysSkin").style.display = "none";
    const princessField = document.getElementById("FieldAnimation");
    const defaultField = document.getElementById("fieldAnimation");

    if (princessField) princessField.style.display = "none";
    if (defaultField) defaultField.style.display = "block";
    clearInterval(this.SpeedLimit); // сбрасываем все накопившиеся за время игры условия
    if (this.fieldAnimationInterval) {
      clearInterval(this.fieldAnimationInterval);
    }
    this.Speed = 250; // тут
    this.Start = []; // тут
    this.Body = []; // тут
    this.TurnPoints = []; // тут
    this.count = 0; // и тут
    this.countBobmActivate = 0; // тут тоже
    this.tailDirection = "right"; // изначально хвост смотрит туда же куда и голова
    (this.bodyDirections = []), // массив для направления тела
      (this.oldDirection = "right"); // старое направление
    this.newDirection = "right"; // новое направление
    this.tail = []; // массив для хвоста
    this.TurnPoints = [];
    this.snakeDead = false;
    this.fieldAnimation();
    this.preloadImages(); // снова запускаем игру
  }
  movement() {
    // обработка нажатия клавишь для движения
    if (this.count === 240) {
      this.win();
      return;
    }

    if (this.Body.length > 0) {
      this.tail = [...this.Body[0]]; // хвост принимается за первый элемент массива бади, то есть первый элемент тела
    } else {
      this.tail = [...this.Start]; // или хвост будет следовать строго за головой
      this.tailDirection = this.oldDirection;
    }

    this.oldHead = [...this.Start]; // перед изменениями движения головы приравниваем, чтобы было новое и старое значение

    switch (
      this.direction // обработка направления
    ) {
      case "w":
        if (this.Start[1] > 0) {
          this.NewPos = [this.Start[0], this.Start[1] - 1];
        } else {
          this.lose();
          return;
        }
        break;
      case "d":
        if (this.Start[0] < this.FieldMaxX) {
          this.NewPos = [this.Start[0] + 1, this.Start[1]];
        } else {
          this.lose();
          return;
        }
        break;
      case "s":
        if (this.Start[1] < this.FieldMaxY) {
          this.NewPos = [this.Start[0], this.Start[1] + 1];
        } else {
          this.lose();
          return;
        }
        break;
      case "a":
        if (this.Start[0] > 0) {
          this.NewPos = [this.Start[0] - 1, this.Start[1]];
        } else {
          this.lose();
          return;
        }
        break;
      default:
        console.log("ERR");
        this.NewPos = [...this.Start];
    }

    this.Start = [...this.NewPos]; // мы обрабатывали NewPos для перемещения, теперь приравниваем чтобы голова имела новое значение

    if (
      this.Body.some(
        (
          body // если голова имеет теле координаты что и тело значит мы врезались, это поражение
        ) => body[0] === this.Start[0] && body[1] === this.Start[1]
      ) ||
      this.countBobmActivate === 3
    ) {
      this.lose();
      return;
    }

    this.Body.push([...this.oldHead]); // тело принмиает значение старой позиции головы, как бы движется за ней
    this.bodyDirections.push(this.oldDirection);

    const eatenApple = this.Apple.findIndex(
      (
        apple // проверяем что координаты яблока совпадают с головой значит сьели яблоко
      ) => apple[0] === this.Start[0] && apple[1] === this.Start[1]
    );

    const bombActive = this.Bomb.findIndex(
      (
        bomb // проверяем про прошли через бомбу
      ) => bomb[0] === this.Start[0] && bomb[1] === this.Start[1]
    );

    const eatenMed = this.MedKits.findIndex(
      (
        med // проверка на аптечку
      ) => med[0] === this.Start[0] && med[1] === this.Start[1]
    );

    const WallActive = this.walls.findIndex(
      (wall) => wall.x === this.Start[0] && wall.y === this.Start[1]
    );

    const oldTailPos = this.Body.length > 0 ? [...this.Body[0]] : null; // если тело больше 0 то старый хвост будет им или не будет
    if (eatenApple !== -1) {
      // если сьели яблоко
      this.Apple.splice(eatenApple, 1); // в массиве яблок удаляем одно последнее
      this.Apple.push(this.addApple()); // и добавляем сразу же еще одно случайное
      this.speendChange(); // вызываем для проверки, чтобы каждый раз проверяло условие
      this.count += 10; // добавляем единицу к счетчику сьеденных яблок
    } else {
      this.Body.shift(); // если не сьели то удаляем первый элемент тела, то есть хвост
      this.bodyDirections.shift();
    }

    if (this.oldDirection !== this.direction) {
      // тут, если направление изменилось, старое не равно новому
      this.newDirection = this.direction; // добавляем текушее направление в новое
      if (this.Body.length > 0) {
        this.TurnPoints.push({
          // добавляем позицию где повернула голова
          pos: [...this.oldHead], // из какой позиции
          from: this.oldDirection, // куда двигалась голова
          to: this.direction, // куда двигается теперь
        });
      }
      this.oldDirection = this.direction; // обновили, теперь на следующей итерации движение обновленное
    }
    if (oldTailPos) {
      // если старый хвост теперь первый элемент тела
      if (this.count <= 0) {
        // если яблоко яблоко не сьели, значит изначально голова + хвост
        this.tailDirection = this.direction; // хвост четко движется за головой
      } else {
        const turnIndex = this.TurnPoints.findIndex(
          (turn) =>
            turn.pos[0] === oldTailPos[0] && turn.pos[1] === oldTailPos[1]
        ); // если он проходит через координаты поворота

        if (turnIndex !== -1) {
          // если да то удаляем поворот
          this.tailDirection = this.TurnPoints[turnIndex].to; // и поменяли направление хвоста там где он проходит через поворот
          this.TurnPoints.splice(turnIndex, 1); // очищаем старый поворот
        }
      }
    }
    this.Body.forEach((segment, index) => {
      // ищем тело которое пересекает поворот
      const turn = this.TurnPoints.find(
        (t) => t.pos[0] === segment[0] && t.pos[1] === segment[1]
      );

      if (turn) {
        // если нашли то меняем конкретный пройденный через поворот сегмент тела на новое наравление
        this.bodyDirections[index] = turn.to;
      }
    });
    if (bombActive !== -1) {
      this.Bomb.splice(bombActive, 1);
      this.Bomb.push(...this.addBombs());
      this.countBobmActivate++;
      this.bombActiveAnimation();
    }
    if (eatenMed !== -1) {
      this.MedKits.splice(eatenMed, 1);
      this.MedKitActivate();
    }
    if (WallActive !== -1) {
      this.lose();
      return;
    }

    this.animation(); // вызываем отрисовку
  }
  fieldAnimation() {
    let currentShot = 0;
    this.fieldAnimationInterval = setInterval(() => {
      currentShot =
        (currentShot + 1) %
        this.failsWithImages().otherObjects.fieldAnimationImages.length;
      document.getElementById("fieldAnimation").src =
        this.failsWithImages().otherObjects.fieldAnimationImages[currentShot];
    }, 350);
  }
  preloadAnimtion() {
    if (this.fieldAnimationInterval) {
      clearInterval(this.fieldAnimationInterval);
    }
    let currentShot = 0;
    setInterval(() => {
      currentShot =
        (currentShot + 1) %
        this.failsWithImages().otherObjects.preloadAnimationImages.length;
      document.getElementById("preloadAnimation").src =
        this.failsWithImages().otherObjects.preloadAnimationImages[currentShot];
    }, 400);
  }

  preloadImages() {
    if (!preloaderWas) {
      this.preloadAnimtion();
      const imagePreload = [
        "images/ГоловаВверх.png",
        "images/ГоловаВниз.png",
        "images/ГоловаВлево.png",
        "images/ГоловаВправо.png",
        "images/ГоловаВверхЮ.png",
        "images/ГоловаВнизЮ.png",
        "images/ГоловаВлевоЮ.png",
        "images/ГоловаВправоЮ.png",
        "images/ТелоВверхВлево.png",
        "images/ТелоВверхВправо.png",
        "images/ТелоВнизВлево.png",
        "images/ТелоВнизВправо.png",
        "images/ТелоВерхНиз.png",
        "images/ТелоВлевоВправо.png",
        "images/ТелоВверхВлевоЮ.png",
        "images/ТелоВверхВправоЮ.png",
        "images/ТелоВнизВлевоЮ.png",
        "images/ТелоВнизВправоЮ.png",
        "images/ТелоВлевоВправоЮ.png",
        "images/ТелоВверхВнизЮ.png",
        "images/ХвостВерх.png",
        "images/ХвостНиз.png",
        "images/ХвостЛево.png",
        "images/ХвостПраво.png",
        "images/ХвостВверхЮ.png",
        "images/ХвостВнизЮ.png",
        "images/ХвостВлевоЮ.png",
        "images/ХвостВправоЮ.png",
        "images/ЧервякГоловаВверх.png",
        "images/ЧервякГоловаВниз.png",
        "images/ЧервякГоловаВлево.png",
        "images/ЧервякГоловаВправо.png",
        "images/ЧервякВверхВлево.png",
        "images/ЧервякВверхВправо.png",
        "images/ЧервякВнизВлево.png",
        "images/ЧервякВнизВправо.png",
        "images/ЧервякВверхВниз.png",
        "images/ЧервякВлевоВправо.png",
        "images/ЧервякХвостВверх.png",
        "images/ЧервякХвостВниз.png",
        "images/ЧервякХвостВлево.png",
        "images/ЧервякХвостВправо.png",
        "images/Яблоко2.png",
        "images/Бомба.png",
        "images/Взрыв.png",
        "images/Кубик3.png",
        "images/Аптечка.png",
        "images/Огонь1.png",
        "images/Огонь2.png",
        "images/Огонь3.png",
        "images/Деньги.png",
        "images/Цветок1.png",
        "images/Цветок2.png",
        "images/Цветок3.png",
        "images/Яд.png",
        "images/БашняЛевыйВерх.png",
        "images/БашняЛевыйНиз.png",
        "images/БашняПравыйВерх.png",
        "images/БашняПравыйНиз.png",
        "images/Поле1.png",
        "images/Поле2.png",
        "images/Поле3.png",
        "images/Поле4.png",
        "images/Море1.png",
        "images/Море2.png",
        "images/Море3.png",
        "images/Море4.png",
      ];
      let onloadImagesCount = 0;
      let gameStart = false;

      imagePreload.forEach((item) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          onloadImagesCount++;
        };
        img.src = item;
      });

      const hidePreloadScreen = () => {
        if (!gameStart) {
          gameStart = true;
          const preloadScreen = document.getElementById("preloadScreen");
          preloadScreen.style.transition = "opacity 0.5s ease-in-out";
          preloadScreen.style.opacity = "0";
          preloaderWas = true;

          setTimeout(() => {
            preloadScreen.style.display = "none";
          }, 500);
          this.run();
        }
      };

      setTimeout(hidePreloadScreen, 10000);

      const checkLoad = () => {
        if (onloadImagesCount === imagePreload.length && !gameStart) {
          hidePreloadScreen();
        } else if (!gameStart) {
          setTimeout(checkLoad, 1000);
        }
      };

      setTimeout(checkLoad, 6000);
    } else {
      document.getElementById("preloadScreen").style.display = "none";
      this.run();
    }
  }
  control() {
    document.addEventListener("keydown", (e) => {
      // обрабатываем нажатие на кливиатуре
      switch (e.key) {
        case "ArrowUp":
          this.direction = "w";
          break; // движение по стрелочкам справа снизу на клавиатуре
        case "ArrowDown":
          this.direction = "s";
          break;
        case "ArrowLeft":
          this.direction = "a";
          break;
        case "ArrowRight":
          this.direction = "d";
          break;
      }
    });
  }
  run() {
    // запуск последовательно всех функций для отрисовки
    this.start(); // сгенерировали голову
    this.apple(); // сгенерировали яблоки
    this.bombGeneration(); // генерируем бомбы
    this.MedKitSpawn(); // спавн аптечек
    this.FireAnimation();
    this.animation(); // рисуем их
    this.fieldAnimation();
    this.control();
    this.SpeedLimit = setInterval(() => {
      this.movement();
    }, this.Speed);
  }
}

class PrincessSkin extends Game {
  constructor() {
    super();
    this.walls = [
      // Левый нижний
      { x: 4, y: 5 },
      { x: 5, y: 5 }, // 0 1
      { x: 4, y: 15 },
      { x: 5, y: 15 }, // 2 3

      // Правый нижний
      { x: 14, y: 15 },
      { x: 15, y: 15 }, // 4 5
      { x: 14, y: 5 },
      { x: 15, y: 5 }, // 6 7
    ];
    this.roof = [
      // Левый верхний
      { x: 4, y: 4 },
      { x: 5, y: 4 }, // 0 1
      { x: 4, y: 14 },
      { x: 5, y: 14 }, // 2 3

      // Правый верхний
      { x: 14, y: 14 },
      { x: 15, y: 14 }, // 4 5
      { x: 14, y: 4 },
      { x: 15, y: 4 }, // 6 7
    ];
    this.FieldAnimationInterval = 0;
  }
  failsWithImages() {
    // это обьект для хранения изображений
    const directionFromTo = {
      body: {
        turnUpRight: "images/ТелоВверхВправоЮ.png",
        turnUpLeft: "images/ТелоВверхВлевоЮ.png",
        turnDownLeft: "images/ТелоВнизВлевоЮ.png",
        turnDownRight: "images/ТелоВнизВправоЮ.png",
        turnUpDown: "images/ТелоВверхВнизЮ.png",
        turnLeftRight: "images/ТелоВлевоВправоЮ.png",
      },
      head: {
        turnUp: "images/ГоловаВверхЮ.png",
        turnDown: "images/ГоловаВнизЮ.png",
        turnLeft: "images/ГоловаВлевоЮ.png",
        turnRight: "images/ГоловаВправоЮ.png",
      },
      tail: {
        turnUp: "images/ХвостВверхЮ.png",
        turnDown: "images/ХвостВнизЮ.png",
        turnLeft: "images/ХвостВлевоЮ.png",
        turnRight: "images/ХвостВправоЮ.png",
      },
      otherObjects: {
        explosive: "images/Взрыв.png",
        appleSkin: "images/Деньги.png",
        bombSkin: "images/Самокат.png",
        fieldBlock: "images/Кубик3.png",
        MedKit: "images/Аптечка.png",
        WallBlock: {
          leftDown: "images/БашняЛевыйНиз.png",
          leftUp: "images/БашняЛевыйВерх.png",
          RightDown: "images/БашняПравыйНиз.png",
          RightUp: "images/БашняПравыйВерх.png",
        },
        FieldAnimationImages: [
          "images/Море1.png",
          "images/Море2.png",
          "images/Море3.png",
          "images/Море4.png",
        ],
      },
    };
    return directionFromTo;
  }
  animation() {
    // отрисовка элементов
    console.clear(); // очищаем консоль для оптимизации
    let field = ""; // строки поля изначально пустые

    const headImages = this.findTurnHead(); // передаем картинки головы
    const tailImages = this.findTurnTail(); // передаем картинки хвоста
    const images = this.failsWithImages().otherObjects; // передаем все изображения

    for (let y = 0; y <= this.FieldMaxY; y++) {
      // обработка поля по вертикали
      let row = ""; // строки пустые изанчально
      for (let x = 0; x <= this.FieldMaxX; x++) {
        // обработка по горизонтали

        const turnTrue = this.TurnPoints.find(
          (turn) => turn.pos[0] === x && turn.pos[1] === y
        ); // есть поворот
        const bodyTrue = this.Body.some(
          (body) => body[0] === x && body[1] === y
        ); // найден элемент тела
        const headTrue = y === this.Start[1] && x === this.Start[0]; // найдена голова
        const tailTrue =
          this.tail &&
          this.tail.length > 0 &&
          y === this.tail[1] &&
          x === this.tail[0]; // найден хвост
        const trueApple = this.Apple.some(
          (apple) => apple[0] === x && apple[1] === y
        );
        const trueBomb = this.Bomb.some(
          (bomb) => bomb[0] === x && bomb[1] === y
        );
        const trueWalls = this.walls.some(
          (wall) => wall.x === x && wall.y === y
        );
        const trueRoof = this.roof.some((roof) => roof.x === x && roof.y === y);
        const trueMed = this.MedKits.some(
          (med) => med[0] === x && med[1] === y
        );

        if (trueRoof) {
          let roofAngle;
          const roofIndex = this.roof.findIndex((w) => w.x === x && w.y === y);
          if (
            roofIndex === 0 ||
            roofIndex === 2 ||
            roofIndex === 4 ||
            roofIndex === 6
          )
            roofAngle = "leftUp";
          else if (
            roofIndex === 1 ||
            roofIndex === 3 ||
            roofIndex === 5 ||
            roofIndex === 7
          )
            roofAngle = "RightUp";
          row += `<img src="${images.WallBlock[roofAngle]}"class="roof" width="25" height="25">`;
        } else if (headTrue && this.snakeDead) {
          // если голова существуем и столкновение было
          row += `<img src="${images.explosive}"class="head" width="25" height="25">`; // добавили взрыв если змея врезалась
        } else if (headTrue) {
          row += `<img src="${headImages}"class="head" width="25" height="25">`; // добавили в строку голову
        } else if (tailTrue) {
          row += `<img src="${tailImages}"class="body" width="25" height="25">`; // добавили в строку хвост
        } else if (turnTrue) {
          // есть поворот
          if (turnTrue.from && turnTrue.to) {
            // передача от куда и куда был сделан поворот
            const turnImages = this.findTurnforBody(turnTrue.from, turnTrue.to);
            row += `<img src="${turnImages}"class="body" width="25" height="25">`; // добавляем поворот в строку
          }
        } else if (bodyTrue) {
          const bodyIndex = this.Body.findIndex(
            (body) => body[0] === x && body[1] === y
          ); // находим индекс элемента тела который нужен
          const bodyImage = this.findTurnBody(bodyIndex); // передаем в фукнцию чтобы определить направление картинки
          row += `<img src="${bodyImage}"class="body" width="25" height="25">`; // добавляем тело
        } else if (trueApple) {
          row += `<img src="${images.appleSkin}" width="25" height="25">`; // добавляем яблоки если ничего не найдено
        } else if (trueBomb) {
          row += `<img src="${images.bombSkin}" width="25" height="25">`;
        } else if (trueWalls) {
          let wallAngle;
          const wallIndex = this.walls.findIndex((w) => w.x === x && w.y === y);

          if (
            wallIndex === 0 ||
            wallIndex === 2 ||
            wallIndex === 4 ||
            wallIndex === 6
          )
            wallAngle = "leftDown";
          else if (
            wallIndex === 1 ||
            wallIndex === 3 ||
            wallIndex === 5 ||
            wallIndex === 7
          )
            wallAngle = "RightDown";

          row += `<img src="${images.WallBlock[wallAngle]}"class="wall" width="25" height="25">`;
        } else if (trueMed) {
          row += `<img src="${images.MedKit}"class="medkit" width="25" height="25">`;
        } else {
          row += `<div style="display:inline-block; width:25px; height:25px; background:transparent; margin:0;
           padding:0; border:none; vertical-align:top; line-height:0; font-size:0;"></div>`; // отрисовка поля если ничего не найдено
        }
      }
      field += row + "\n";
    }
    document.getElementById("Web").innerHTML = field;
    document.getElementById("Score").textContent = `SCORE: ${this.count}`;
  }
  restartButton() {
    document.getElementById("Heart3").style.display = "flex"; // по умолчанию сердечки показываются на экране по этому "flex"
    document.getElementById("Heart2").style.display = "flex";
    document.getElementById("Heart1").style.display = "flex";
    document.getElementById("Lose").style.display = "none"; // после рестарты скрываем
    document.getElementById("Win").style.display = "none"; // так же скрываем
    document.getElementById("restart").style.display = "none"; // опять же, скрываем
    document.getElementById("SelectButton").style.display = "none";
    document.getElementById("ButtonDefaultSkin").style.display = "none";
    document.getElementById("ButtonYulyaSkin").style.display = "none";
    document.getElementById("ButtonMamysSkin").style.display = "none";
    clearInterval(this.SpeedLimit); // сбрасываем все накопившиеся за время игры условия
    if (this.fieldAnimationInterval) {
      clearInterval(this.fieldAnimationInterval);
    }
    if (this.FieldAnimationInterval) {
      clearInterval(this.FieldAnimationInterval);
    }
    this.Speed = 250; // тут
    this.Start = []; // тут
    this.Body = []; // тут
    this.TurnPoints = []; // тут
    this.count = 0; // и тут
    this.countBobmActivate = 0; // тут тоже
    this.tailDirection = "right"; // изначально хвост смотрит туда же куда и голова
    (this.bodyDirections = []), // массив для направления тела
      (this.oldDirection = "right"); // старое направление
    this.newDirection = "right"; // новое направление
    this.tail = []; // массив для хвоста
    this.TurnPoints = [];
    this.snakeDead = false;
    this.FieldAnimation();
    this.preloadImages(); // снова запускаем игру
  }
  FieldAnimation() {
    if (this.FieldAnimationInterval) {
      clearInterval(this.FieldAnimationInterval);
    }

    let currentShot = 0;
    this.FieldAnimationInterval = setInterval(() => {
      currentShot =
        (currentShot + 1) %
        this.failsWithImages().otherObjects.FieldAnimationImages.length;
      document.getElementById("FieldAnimation").src =
        this.failsWithImages().otherObjects.FieldAnimationImages[currentShot];
    }, 350);
  }
  run() {
    // запуск последовательно всех функций для отрисовки
    this.start(); // сгенерировали голову
    this.apple(); // сгенерировали яблоки
    this.bombGeneration(); // генерируем бомбы
    this.MedKitSpawn(); // спавн аптечек
    this.FireAnimation();
    this.animation(); // рисуем их
    this.FieldAnimation();
    this.control();
    this.SpeedLimit = setInterval(() => {
      this.movement();
    }, this.Speed);
  }
}

class MamysSkin extends Game {
  constructor() {
    super();
    this.FlowerImages = [
      "images/Цветок1.png",
      "images/Цветок2.png",
      "images/Цветок3.png",
    ];
    this.Speed = 350;
    this.NumberOfApples = 20;
  }
  failsWithImages() {
    // это обьект для хранения изображений
    const directionFromTo = {
      body: {
        turnUpRight: "images/ЧервякВверхВправо.png",
        turnUpLeft: "images/ЧервякВверхВлево.png",
        turnDownLeft: "images/ЧервякВнизВлево.png",
        turnDownRight: "images/ЧервякВнизВправо.png",
        turnUpDown: "images/ЧервякВверхВниз.png",
        turnLeftRight: "images/ЧервякВлевоВправо.png",
      },
      head: {
        turnUp: "images/ЧервякГоловаВверх.png",
        turnDown: "images/ЧервякГоловаВниз.png",
        turnLeft: "images/ЧервякГоловаВлево.png",
        turnRight: "images/ЧервякГоловаВправо.png",
      },
      tail: {
        turnUp: "images/ЧервякХвостВверх.png",
        turnDown: "images/ЧервякХвостВниз.png",
        turnLeft: "images/ЧервякХвостВлево.png",
        turnRight: "images/ЧервякХвостВправо.png",
      },
      otherObjects: {
        explosive: "images/Взрыв.png",
        bombSkin: "images/Яд.png",
        fieldBlock: "images/Кубик3.png",
        MedKit: "images/Яблоко2.png",
      },
    };
    return directionFromTo;
  }
  apple() {
    this.Apple = [];
    for (let i = 0; i < this.NumberOfApples; i++) {
      let Apples;
      do {
        Apples = [
          Math.floor(Math.random() * this.FieldMaxX + 1),
          Math.floor(Math.random() * this.FieldMaxY + 1),
          Math.floor(Math.random() * this.FlowerImages.length),
        ];
      } while (
        (this.Start[0] === Apples[0] && this.Start[1] === Apples[1]) ||
        this.Apple.some(
          (apple) => apple[0] === Apples[0] && apple[1] === Apples[1]
        ) ||
        this.Body.some(
          (body) => body[0] === Apples[0] && body[1] === Apples[1]
        ) ||
        this.Bomb.some((bomb) => bomb[0] === Apples[0] && bomb[1] === Apples[1])
      );

      this.Apple.push(Apples);
    }
    return this.Apple;
  }
  addApple() {
    // добавляется яблоко если сьели одно
    let newApple;
    do {
      newApple = [
        Math.floor(Math.random() * this.FieldMaxX + 1),
        Math.floor(Math.random() * this.FieldMaxY + 1),
        Math.floor(Math.random() * this.FlowerImages.length),
      ];
    } while (
      (this.Start[0] === newApple[0] && this.Start[1] === newApple[1]) ||
      this.Apple.some(
        (apple) => apple[0] === newApple[0] && apple[1] === newApple[1]
      ) ||
      this.Body.some(
        (body) => body[0] === newApple[0] && body[1] === newApple[1]
      ) ||
      this.Bomb.some(
        (bomb) => bomb[0] === newApple[0] && bomb[1] === newApple[1]
      ) ||
      this.walls.some(
        (wall) => wall.x === newApple[0] && wall.y === newApple[1]
      )
    );

    return newApple;
  }
  animation() {
    // отрисовка элементов
    console.clear(); // очищаем консоль для оптимизации
    let field = ""; // строки поля изначально пустые

    const headImages = this.findTurnHead(); // передаем картинки головы
    const tailImages = this.findTurnTail(); // передаем картинки хвоста
    const images = this.failsWithImages().otherObjects; // передаем все изображения

    for (let y = 0; y <= this.FieldMaxY; y++) {
      // обработка поля по вертикали
      let row = ""; // строки пустые изанчально
      for (let x = 0; x <= this.FieldMaxX; x++) {
        // обработка по горизонтали

        const turnTrue = this.TurnPoints.find(
          (turn) => turn.pos[0] === x && turn.pos[1] === y
        ); // есть поворот
        const bodyTrue = this.Body.some(
          (body) => body[0] === x && body[1] === y
        ); // найден элемент тела
        const headTrue = y === this.Start[1] && x === this.Start[0]; // найдена голова
        const tailTrue =
          this.tail &&
          this.tail.length > 0 &&
          y === this.tail[1] &&
          x === this.tail[0]; // найден хвост
        const trueApple = this.Apple.some(
          (apple) => apple[0] === x && apple[1] === y
        );
        const trueBomb = this.Bomb.some(
          (bomb) => bomb[0] === x && bomb[1] === y
        );
        const trueMed = this.MedKits.some(
          (med) => med[0] === x && med[1] === y
        );

        if (headTrue && this.snakeDead) {
          // если голова существуем и столкновение было
          row += `<img src="${images.explosive}"class="head" width="25" height="25">`; // добавили взрыв если змея врезалась
        } else if (headTrue) {
          row += `<img src="${headImages}"class="head" width="25" height="25">`; // добавили в строку голову
        } else if (tailTrue) {
          row += `<img src="${tailImages}"class="body" width="25" height="25">`; // добавили в строку хвост
        } else if (turnTrue) {
          // есть поворот
          if (turnTrue.from && turnTrue.to) {
            // передача от куда и куда был сделан поворот
            const turnImages = this.findTurnforBody(turnTrue.from, turnTrue.to);
            row += `<img src="${turnImages}"class="body" width="25" height="25">`; // добавляем поворот в строку
          }
        } else if (bodyTrue) {
          const bodyIndex = this.Body.findIndex(
            (body) => body[0] === x && body[1] === y
          ); // находим индекс элемента тела который нужен
          const bodyImage = this.findTurnBody(bodyIndex); // передаем в фукнцию чтобы определить направление картинки
          row += `<img src="${bodyImage}"class="body" width="25" height="25">`; // добавляем тело
        } else if (trueApple) {
          const RandomImage = this.Apple.find(
            (apple) => apple[0] === x && apple[1] === y
          );
          row += `<img src="${
            this.FlowerImages[RandomImage[2]]
          }" width="25" height="25">`; // добавляем яблоки если ничего не найдено
        } else if (trueBomb) {
          row += `<img src="${images.bombSkin}" width="25" height="25">`;
        } else if (trueMed) {
          row += `<img src="${images.MedKit}"class="medkit" width="25" height="25">`;
        } else {
          row += `<div style="display:inline-block; width:25px; height:25px; background:transparent;"></div>`; // отрисовка поля если ничего не найдено
        }
      }
      field += row + "\n";
    }
    document.getElementById("Web").innerHTML = field;
    document.getElementById("Score").textContent = `SCORE: ${this.count}`;
  }
  speendChange() {
    // изменение скорости в зависимости от количества сьеденных яблок
    if (this.count === 50) {
      clearInterval(this.SpeedLimit);
      this.Speed = 300;
      this.SpeedLimit = setInterval(() => {
        this.movement();
      }, this.Speed);
    } else if (this.count === 150) {
      clearInterval(this.SpeedLimit);
      this.Speed = 200;
      this.SpeedLimit = setInterval(() => {
        this.movement();
      }, this.Speed);
    }
  }
  restartButton() {
    document.getElementById("Heart3").style.display = "flex"; // по умолчанию сердечки показываются на экране по этому "flex"
    document.getElementById("Heart2").style.display = "flex";
    document.getElementById("Heart1").style.display = "flex";
    document.getElementById("Lose").style.display = "none"; // после рестарты скрываем
    document.getElementById("Win").style.display = "none"; // так же скрываем
    document.getElementById("restart").style.display = "none"; // опять же, скрываем
    document.getElementById("SelectButton").style.display = "none";
    document.getElementById("ButtonDefaultSkin").style.display = "none";
    document.getElementById("ButtonYulyaSkin").style.display = "none";
    document.getElementById("ButtonMamysSkin").style.display = "none";
    clearInterval(this.SpeedLimit); // сбрасываем все накопившиеся за время игры условия
    if (this.fieldAnimationInterval) {
      clearInterval(this.fieldAnimationInterval);
    }
    this.Speed = 350; // тут
    this.Start = []; // тут
    this.Body = []; // тут
    this.TurnPoints = []; // тут
    this.count = 0; // и тут
    this.countBobmActivate = 0; // тут тоже
    this.tailDirection = "right"; // изначально хвост смотрит туда же куда и голова
    this.bodyDirections = []; // массив для направления тела
    this.oldDirection = "right"; // старое направление
    this.newDirection = "right"; // новое направление
    this.tail = []; // массив для хвоста
    this.TurnPoints = [];
    this.snakeDead = false;
    this.preloadImages(); // снова запускаем игру
  }
  movement() {
    // обработка нажатия клавишь для движения
    if (this.count === 200) {
      this.win();
      return;
    }

    if (this.Body.length > 0) {
      this.tail = [...this.Body[0]]; // хвост принимается за первый элемент массива бади, то есть первый элемент тела
    } else {
      this.tail = [...this.Start]; // или хвост будет следовать строго за головой
      this.tailDirection = this.oldDirection;
    }

    this.oldHead = [...this.Start]; // перед изменениями движения головы приравниваем, чтобы было новое и старое значение

    switch (
      this.direction // обработка направления
    ) {
      case "w":
        if (this.Start[1] > 0) {
          this.NewPos = [this.Start[0], this.Start[1] - 1];
        } else {
          this.lose();
          return;
        }
        break;
      case "d":
        if (this.Start[0] < this.FieldMaxX) {
          this.NewPos = [this.Start[0] + 1, this.Start[1]];
        } else {
          this.lose();
          return;
        }
        break;
      case "s":
        if (this.Start[1] < this.FieldMaxY) {
          this.NewPos = [this.Start[0], this.Start[1] + 1];
        } else {
          this.lose();
          return;
        }
        break;
      case "a":
        if (this.Start[0] > 0) {
          this.NewPos = [this.Start[0] - 1, this.Start[1]];
        } else {
          this.lose();
          return;
        }
        break;
      default:
        console.log("ERR");
        this.NewPos = [...this.Start];
    }

    this.Start = [...this.NewPos]; // мы обрабатывали NewPos для перемещения, теперь приравниваем чтобы голова имела новое значение

    if (
      this.Body.some(
        (
          body // если голова имеет теле координаты что и тело значит мы врезались, это поражение
        ) => body[0] === this.Start[0] && body[1] === this.Start[1]
      ) ||
      this.countBobmActivate === 3
    ) {
      this.lose();
      return;
    }

    this.Body.push([...this.oldHead]); // тело принмиает значение старой позиции головы, как бы движется за ней
    this.bodyDirections.push(this.oldDirection);

    const eatenApple = this.Apple.findIndex(
      (apple) => apple[0] === this.Start[0] && apple[1] === this.Start[1]
    );

    const bombActive = this.Bomb.findIndex(
      (
        bomb // проверяем про прошли через бомбу
      ) => bomb[0] === this.Start[0] && bomb[1] === this.Start[1]
    );

    const eatenMed = this.MedKits.findIndex(
      (med) => med[0] === this.Start[0] && med[1] === this.Start[1]
    );

    const oldTailPos = this.Body.length > 0 ? [...this.Body[0]] : null; // если тело больше 0 то старый хвост будет им или не будет
    if (eatenApple !== -1) {
      // если сьели яблоко
      this.Apple.splice(eatenApple, 1); // в массиве яблок удаляем одно последнее
      this.Apple.push(this.addApple()); // и добавляем сразу же еще одно случайное
      this.speendChange(); // вызываем для проверки, чтобы каждый раз проверяло условие
      this.count += 10; // добавляем единицу к счетчику сьеденных яблок
    } else {
      this.Body.shift(); // если не сьели то удаляем первый элемент тела, то есть хвост
      this.bodyDirections.shift();
    }

    if (this.oldDirection !== this.direction) {
      // тут, если направление изменилось, старое не равно новому
      this.newDirection = this.direction; // добавляем текушее направление в новое
      if (this.Body.length > 0) {
        this.TurnPoints.push({
          // добавляем позицию где повернула голова
          pos: [...this.oldHead], // из какой позиции
          from: this.oldDirection, // куда двигалась голова
          to: this.direction, // куда двигается теперь
        });
      }
      this.oldDirection = this.direction; // обновили, теперь на следующей итерации движение обновленное
    }
    if (oldTailPos) {
      // если старый хвост теперь первый элемент тела
      if (this.count <= 0) {
        // если яблоко яблоко не сьели, значит изначально голова + хвост
        this.tailDirection = this.direction; // хвост четко движется за головой
      } else {
        const turnIndex = this.TurnPoints.findIndex(
          (turn) =>
            turn.pos[0] === oldTailPos[0] && turn.pos[1] === oldTailPos[1]
        ); // если он проходит через координаты поворота

        if (turnIndex !== -1) {
          // если да то удаляем поворот
          this.tailDirection = this.TurnPoints[turnIndex].to; // и поменяли направление хвоста там где он проходит через поворот
          this.TurnPoints.splice(turnIndex, 1); // очищаем старый поворот
        }
      }
    }
    this.Body.forEach((segment, index) => {
      // ищем тело которое пересекает поворот
      const turn = this.TurnPoints.find(
        (turn) => turn.pos[0] === segment[0] && turn.pos[1] === segment[1]
      );

      if (turn) {
        // если нашли то меняем конкретный пройденный через поворот сегмент тела на новое наравление
        this.bodyDirections[index] = turn.to;
      }
    });
    if (bombActive !== -1) {
      this.Bomb.splice(bombActive, 1);
      this.Bomb.push(...this.addBombs());
      this.countBobmActivate++;
      this.bombActiveAnimation();
    }
    if (eatenMed !== -1) {
      this.MedKits.splice(eatenMed, 1);
      this.MedKitActivate();
    }

    this.animation(); // вызываем отрисовку
  }
}

const GameStart = {
  // класс для смены классов
  chooseSnake: 0, //

  SelectSnakes(type) {
    // получаем в эту функцию параметр из html файла в зависимости от кнопки которую нажали
    if (this.chooseSnake) {
      // пока не нажали кнопку скорость 0, значит стоим на месте
      clearInterval(this.chooseSnake.SpeedLimit);
    }
    switch (type) {
      case "default":
        this.chooseSnake = new Game(); // основная змея
        break;
      case "Yulya":
        this.chooseSnake = new PrincessSkin();
        document.getElementById("FieldAnimation").style.display = "block";
        document.getElementById("fieldAnimation").style.display = "none";
        break;
      case "Mamys":
        this.chooseSnake = new MamysSkin();
    }
    this.chooseSnake.preloadImages(); // запускаем игру с определенным классом
  },
  GlobalRestart() {
    // вызывает рестарт для своего класса
    if (this.chooseSnake) {
      this.chooseSnake.restartButton();
    }
  },
};

window.addEventListener("DOMContentLoaded", () => {
  GameStart.SelectSnakes("default"); // запускаем обычную игру изначально при открытии страницы
});

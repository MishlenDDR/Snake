const Game = {
    arrField: [20, 20], // размер поля
    Start: [], // массив с координатами головы
    Body: [], // массив для тела
    NewPos: [], // массив для изменения позиции головы 
    Apple: [], // массив для хранения яблок
    Bomb: [],
    direction: "right", // при старте изначальное направление вправо
    count: 0, // счетчик сьеденных яблок
    countBobmActivate: 0,
    SpeedLimit: 0, // просто переменная для обработки скорости
    Speed: 250, // начальная скорость движения 
    oldHead: [], // массив для старого положения головы
    tailDirection: "right", // изначально хвост смотрит туда же куда и голова
    bodyDirections: [], // массив для направления тела
    oldDirection: "right", // старое направление 
    newDirection:"right", // новое направление
    tail: [], // массив для хвоста
    TurnPoints: [], // массив для хранения координат точки поворота
    

    start() { // генерация головы на поле 
       this.Start = [Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)];
        this.count = 0;
        
    },

    apple() { // генерируется случайно 10 яблок на поле
         this.Apple = [];
        for(let i = 0; i < 10; i++) {
            let Apples;
                do {        
                Apples = [Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)];      
        
                } while(JSON.stringify(this.Start) === JSON.stringify(Apples) || // тут условие чтобы яблоки  при генерации не появлялись на месте головы, тела или других яблок
                this.Apple.some(el => JSON.stringify(el) === JSON.stringify(Apples)) ||
                 this.Body.some(any => JSON.stringify(any) === JSON.stringify(Apples)));   
            
            this.Apple.push(Apples);
        }
        return this.Apple;
    },
    bombGeneration() {
        this.Bomb = [];
        for(let i = 0; i < 10; i++) {
            let bombs;
            do {
                bombs = [Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)];
            } while(JSON.stringify(this.Start) === JSON.stringify(bombs) ||
                this.Bomb.some(el => JSON.stringify(el) === JSON.stringify(bombs)) ||
                this.Body.some(any => JSON.stringify(any) === JSON.stringify(bombs)) || 
                this.Apple.some(any => JSON.stringify(any) === JSON.stringify(bombs)));

                this.Bomb.push(bombs);
        }
        return this.Bomb;
        
    },
    addApple() { // добавляется яблоко если сьели одно
        let newApple;
            do {
             newApple = [Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)];

                } while (JSON.stringify(this.Start) === JSON.stringify(newApple) || // тут тоже уловие чтобы новое появлялось там где нет тела головы и других яблок
                this.Apple.some(el => JSON.stringify(el) === JSON.stringify(newApple)) ||
                this.Body.some(any => JSON.stringify(any) === JSON.stringify(newApple)) || 
                this.Bomb.some(any => JSON.stringify(any) === JSON.stringify(newApple)));

            return newApple;
    },
    addBombs() { // добавили 4 бомбы если одну сьели 
        const newBombs = [];
        for(let i = 0; i < 4; i++) {
        let newBomb;
        do {
            newBomb = [Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)];
        } while(JSON.stringify(this.Start) === JSON.stringify(newBomb) ||  // проверки на то чтобы они не появлялись там где есть яблоки голова и тело                     
                this.Bomb.some(el => JSON.stringify(el) === JSON.stringify(newBomb)) ||
                this.Body.some(any => JSON.stringify(any) === JSON.stringify(newBomb)) || 
                this.Apple.some(any => JSON.stringify(any) === JSON.stringify(newBomb)));
            newBombs.push(newBomb);
        }
        return newBombs
    },
    failsWithImages() { // это обьект для хранения изображений
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
            }
        };
        return directionFromTo;
    },
    findTurnBody(bodyIndex) { // это номер элемента в массиве который пошел через поворот
        const images = this.failsWithImages();
        const direction = this.bodyDirections[bodyIndex] || this.oldDirection; // тут мы передаем какой по индекс передается для изменения направления
        // то есть если прошел элемент номер 2, в bodyDirections есть его направление и оно передается в switch(direction) ниже 
        switch(direction) {
            case "w": case "s": return images.body.turnUpDown;       
            case "d": case "a": return images.body.turnLeftRight;      
            default: return images.body.turnLeftRight;
        }
    },

    findTurnforBody(from, to) { // передается старое и новое направление движения для поворотов
        const images = this.failsWithImages();
        const turn = `${from}-${to}`;
    
        switch(turn) {
            case "w-d": case "a-s": return images.body.turnUpRight;   
            case "w-a": case "d-s": return images.body.turnUpLeft;    
            case "d-w": case "s-a": return images.body.turnDownLeft; 
            case "a-w": case "s-d": return images.body.turnDownRight;  
        default:
            return images.body.turnLeftRight;
        }
    },

    findTurnHead() { // передается направление движения для головы 
        const images = this.failsWithImages();
        const turn = `${this.oldDirection}-${this.newDirection}`;
    
        switch(turn) {
            case "w-s": return images.head.turnDown;    
            case "w-d": return images.head.turnRight;   
            case "w-a": return images.head.turnLeft;   
        
            case "s-w": return images.head.turnUp;      
            case "s-d": return images.head.turnRight;  
            case "s-a": return images.head.turnLeft;    
        
            case "a-w": return images.head.turnUp;      
            case "a-s": return images.head.turnDown;  
            case "a-d": return images.head.turnRight;   
        
            case "d-w": return images.head.turnUp;      
            case "d-s": return images.head.turnDown;    
            case "d-a": return images.head.turnLeft;    
        
        default:
            const directionlistForHead = {
                "w": images.head.turnUp,
                "s": images.head.turnDown,
                "d": images.head.turnRight,
                "a": images.head.turnLeft,
            }
            return directionlistForHead[this.direction];
        }
    },

    findTurnTail() { // передается движение для определения направления хвоста
    const images = this.failsWithImages();
    const directionlist = {
        "w": images.tail.turnUp,                      
        "s": images.tail.turnDown, 
        "d": images.tail.turnRight,
        "a": images.tail.turnLeft
    };
    return directionlist[this.tailDirection] || images.tail.turnRight;
    },

    animation() { // отрисовка элементов
       console.clear(); // очищаем консоль для оптимизации
        let field = ""; // строки поля изначально пустые 

            const headImages = this.findTurnHead(); // передаем картинки головы
            const tailImages = this.findTurnTail(); // передаем картинки хвоста
            
        for(let y = 0; y <= 20; y++) { // обработка поля по вертикали
            let row = ""; // строки пустые изанчально 
            for(let x = 0; x <= 20; x++) { // обработка по горизонтали 
            
                const turnTrue = this.TurnPoints.find(turn => turn.pos[0] === x && turn.pos[1] === y); // есть поворот
                const bodyTrue = this.Body.some(el => el[0] === x && el[1] === y); // найден элемент тела
                const headTrue = y === this.Start[1] && x === this.Start[0]; // найдена голова
                const tailTrue = this.tail && this.tail.length > 0 && y === this.tail[1] && x === this.tail[0]; // найден хвост 

                if(headTrue) {
                    row += `<img src="${headImages}"class="head" width="25" height="25">`; // добавили в строку голову 
                }
                else if (tailTrue) {
                    row += `<img src="${tailImages}"class="body" width="25" height="25">`; // добавили в строку хвост
                }
                else if(turnTrue) { // есть поворот 
                    if(turnTrue.from && turnTrue.to) { // передача от куда и куда был сделан поворот
                        const turnImages = this.findTurnforBody(turnTrue.from, turnTrue.to);
                    row += `<img src="${turnImages}"class="body" width="25" height="25">`; // добавляем поворот в строку
                    }
                }
                 else if(bodyTrue) { 
                    const bodyIndex = this.Body.findIndex(el => el[0] === x && el[1] === y); // находим индекс элемента тела который нужен 
                    const bodyImage = this.findTurnBody(bodyIndex); // передаем в фукнцию чтобы определить направление картинки
                    row += `<img src="${bodyImage}"class="body" width="25" height="25">`; // добавляем тело
                }
                 else if(this.Apple.some(any => any[0] === x && any[1] === y)) {
                    row += `<img src="images/Яблоко2.png" width="25" height="25">`; // добавляем яблоки если ничего не найдено
                } else if(this.Bomb.some(any => any[0] === x && any[1] === y)) {
                    row += `<img src="images/Бомба.png" width="25" height="25">`; 
                } else {
                    row += `<img src="images/Кубик3.png" width="25" height="25">`; // отрисовка поля если ничего не найдено
                }
            
            }
            field += row + "\n";
        }
        document.getElementById('Web').innerHTML = field;
    },
    speendChange() { // изменение скорости в зависимости от количества сьеденных яблок
        if(this.count === 5) {
            clearInterval(this.SpeedLimit);
            this.Speed = 150;
           this.SpeedLimit = setInterval(() => {
        this.movement();
        }, this.Speed);

        } else if(this.count === 15) {
            clearInterval(this.SpeedLimit);
            this.Speed = 80;
            this.SpeedLimit = setInterval(() => {
                this.movement();
            }, this.Speed);
        }  
    },
    win() { 
        document.getElementById('Win').style.display = 'flex'; // показываем картинку с победой
        document.getElementById('restart').style.display = 'flex'; // показываем кнопку рестарта
    },
    lose() {
        clearInterval(this.SpeedLimit);
        document.getElementById('Lose').style.display = 'flex'; // показываем кнопку поражения 
        document.getElementById('restart').style.display = 'flex'; // показываем кнопку рестарта
    },
    restartButton() {
        document.getElementById('Lose').style.display = 'none'; // после рестарты скрываем 
        document.getElementById('Win').style.display = 'none'; // так же скрываем 
        document.getElementById('restart').style.display = 'none'; // опять же, скрываем
        clearInterval(this.SpeedLimit); // сбрасываем все накопившиеся за время игры условия
        this.Speed = 250; // тут 
        this.Start = []; // тут 
        this.Body = []; // тут 
        this.TurnPoints = []; // тут 
        this.count = 0; // и тут 
        this.countBobmActivate = 0; // тут тоже
        this.run(); // снова запускаем игру
        this.tailDirection = "right" // изначально хвост смотрит туда же куда и голова
        this.bodyDirections = [], // массив для направления тела
        this.oldDirection = "right"// старое направление 
        this.newDirection = "right" // новое направление
        this.tail = [] // массив для хвоста
        this.TurnPoints = []
    },
    movement() { // обработка нажатия клавишь для движения
        if(this.count === 24) {
            this.win();
            return;
        }
        
         if(this.Body.length > 0) { 
            this.tail = [...this.Body[0]]; // хвост принимается за первый элемент массива бади, то есть первый элемент тела
         } else {
            this.tail = [...this.Start]; // или хвост будет следовать строго за головой
            this.tailDirection = this.oldDirection;
         }

         this.oldHead = [...this.Start]; // перед изменениями движения головы приравниваем, чтобы было новое и старое значение
        
        switch(this.direction) { // обработка направления
            case "w": 
            if(this.Start[1] > 0) {
               this.NewPos = [
                    this.Start[0],
                    this.Start[1] - 1
                ];
                } else {
                 this.NewPos = [...this.Start];
                };
                break;
            case "d":
            if(this.Start[0] < 20) {
                this.NewPos = [
                    this.Start[0] + 1,
                    this.Start[1]
                ];
                } else {
                 this.NewPos = [...this.Start];
                };
                break;
            case "s":
            if(this.Start[1] < 20) {
                this.NewPos = [
                    this.Start[0],
                    this.Start[1] + 1
                ];
                } else {
                 this.NewPos = [...this.Start];
                };
                break;
            case "a":
                if(this.Start[0] > 0) {
                this.NewPos = [
                    this.Start[0] - 1,
                    this.Start[1]
                ];
                } else {
                 this.NewPos = [...this.Start];
                };
                break;
            default:
                console.log("ERR");
                this.NewPos = [...this.Start];
        }
         
        this.Start = [...this.NewPos]; // мы обрабатывали NewPos для перемещения, теперь приравниваем чтобы голова имела новое значение

        if(this.Body.some(el => // если голова имеет теле координаты что и тело значит мы врезались, это поражение
            el[0] === this.Start[0] &&
            el[1] === this.Start[1] 
         ) || this.countBobmActivate === 2) {
            this.lose();
            return;
         }
       
          this.Body.push([...this.oldHead]); // тело принмиает значение старой позиции головы, как бы движется за ней
            this.bodyDirections.push(this.oldDirection);
         const eatenApple = this.Apple.findIndex(any => // проверяем что координаты яблока совпадают с головой значит сьели яблоко
          JSON.stringify(any) === JSON.stringify(this.Start))

           const bombActive = this.Bomb.findIndex(any => // проверяем про прошли через бомбу
          JSON.stringify(any) === JSON.stringify(this.Start))
        
          const oldTailPos = this.Body.length > 0 ? [...this.Body[0]] : null; // если тело больше 0 то старый хвост будет им или не будет
        if(eatenApple !== -1) { // если сьели яблоко 
            this.Apple.splice(eatenApple, 1); // в массиве яблок удаляем одно последнее
            this.Apple.push(this.addApple()) // и добавляем сразу же еще одно случайное
            this.speendChange(); // вызываем для проверки, чтобы каждый раз проверяло условие
            this.count++; // добавляем единицу к счетчику сьеденных яблок

        } else {
            this.Body.shift(); // если не сьели то удаляем первый элемент тела, то есть хвост
            this.bodyDirections.shift();
        }
          
         if(this.oldDirection !== this.direction) { // тут, если направление изменилось, старое не равно новому
            this.newDirection = this.direction; // добавляем текушее направление в новое
            if(this.Body.length > 0) {
            this.TurnPoints.push({ // добавляем позицию где повернула голова
                pos: [...this.oldHead], // из какой позиции
                from: this.oldDirection, // куда двигалась голова
                to: this.direction, // куда двигается теперь
            });
        }
            this.oldDirection = this.direction; // обновили, теперь на следующей итерации движение обновленное

        }
        if(oldTailPos) { // если старый хвост теперь первый элемент тела
            if(this.count <= 0) { // если яблоко яблоко не сьели, значит изначально голова + хвост
                this.tailDirection = this.direction; // хвост четко движется за головой
                } else {
                    const turnIndex = this.TurnPoints.findIndex(turn => 
                    turn.pos[0] === oldTailPos[0] && turn.pos[1] === oldTailPos[1]); // если он проходит через координаты поворота
    
                if(turnIndex !== -1) { // если да то удаляем поворот
                    this.tailDirection = this.TurnPoints[turnIndex].to; // и поменяли направление хвоста там где он проходит через поворот
                    this.TurnPoints.splice(turnIndex, 1); // очищаем старый поворот
                }
            }
        }
            this.Body.forEach((segment, index) => { // ищем тело которое пересекает поворот
            const turn = this.TurnPoints.find(t => 
                t.pos[0] === segment[0] && t.pos[1] === segment[1]);
    
            if(turn) { // если нашли то меняем конкретный пройденный через поворот сегмент тела на новое наравление
                this.bodyDirections[index] = turn.to;
                }
            });
            if(bombActive !== -1) {
            this.Bomb.splice(bombActive, 1);
            this.Bomb.push(...this.addBombs());
            this.countBobmActivate++;
            }
        
            this.animation(); // вызываем отрисовку  
    },
    
    run() { // запуск последовательно всех функций для отрисовки 
            this.start(); // сгенерировали голову
            this.apple(); // сгенерировали яблоки
            this.bombGeneration(); // генерируем бомбы
            this.animation(); // рисуем их
            
        document.addEventListener('keydown', (e) => { // обрабатываем нажатие на кливиатуре 
                switch(e.key) {
                    case 'ArrowUp': this.direction = "w"; break; // движение по стрелочкам справа снизу на клавиатуре
                    case 'ArrowDown': this.direction = "s"; break;
                    case 'ArrowLeft': this.direction = "a"; break;
                    case 'ArrowRight': this.direction = "d"; break;
                }
                    });
       this.SpeedLimit = setInterval(() => {
        this.movement();
        }, this.Speed);

        },
}
window.addEventListener('DOMContentLoaded', () => { // передали на страницу сайта
    Game.run();
});


diff --git a/Snake.js b/Snake.js
index 45d57b9..aa7caef 100644
--- a/Snake.js
+++ b/Snake.js
@@ -1,3 +1,4 @@
+let preloaderWas = false;
 class Game  {
     constructor() {
     this.FieldMaxX = 20; // размер поля по иксам
@@ -42,7 +43,7 @@ class Game  {
     // Правый нижний угол 
     {x: 16, y: 14}, {x: 16, y: 15},
     {x: 14, y: 16}, {x: 15, y: 16}, {x: 16, y: 16}
-];
+    ];
     }
 
     start() { // генерация головы на поле 
@@ -172,6 +173,22 @@ class Game  {
                             "images/Огонь2.png",
                             "images/Огонь3.png",
                             ],
+                preloadAnimationImages: [
+                    "images/Картинка1.png",
+                    "images/Картинка2.png",
+                    "images/Картинка3.png",
+                    "images/Картинка4.png",
+                    "images/Картинка5.png",
+                    "images/Картинка6.png",
+                    "images/Картинка7.png",
+                    "images/Картинка8.png",
+                    "images/Картинка9.png",
+                    "images/Картинка8.png",
+                    "images/Картинка5.png",
+                    "images/Картинка4.png",
+                    "images/Картинка3.png",
+                    "images/Картинка2.png",
+                ]
             }
 
         };
@@ -410,7 +427,7 @@ class Game  {
         this.tail = [] // массив для хвоста
         this.TurnPoints = []
         this.snakeDead = false;
-        this.run(); // снова запускаем игру
+        this.preloadImages(); // снова запускаем игру
     }
     movement() { // обработка нажатия клавишь для движения
         if(this.count === 240) {
@@ -564,6 +581,35 @@ class Game  {
             }
         
             this.animation(); // вызываем отрисовку  
+    }
+    preloadAnimtion() {
+        let currentShot = 0;
+     setInterval(() => {
+        currentShot = (currentShot + 1) % this.failsWithImages().otherObjects.preloadAnimationImages.length;
+       document.getElementById('preloadAnimation').src = this.failsWithImages().otherObjects.preloadAnimationImages[currentShot];
+        },400);
+    }
+    preloadImages() {
+        if(!preloaderWas) {
+    this.preloadAnimtion()
+    setTimeout(() => {
+            const preloadScreen = document.getElementById('preloadScreen');
+            
+            preloadScreen.style.transition = 'opacity 0.5s ease-in-out';
+            preloadScreen.style.opacity = '0';
+            preloaderWas = true;
+            setTimeout(() => {
+                preloadScreen.style.display = 'none';
+            }, 500);
+        
+    }, 6000);
+    this.run(); 
+} else {
+    document.getElementById('preloadScreen').style.display = 'none';
+    this.run();
+}
+
+
     }
     control() {
         document.addEventListener('keydown', (e) => { // обрабатываем нажатие на кливиатуре 
@@ -909,7 +955,7 @@ class MamysSkin extends Game {
         this.tail = [] // массив для хвоста
         this.TurnPoints = []
         this.snakeDead = false;
-        this.run(); // снова запускаем игру
+        this.preloadImages(); // снова запускаем игру
     }
      movement() { // обработка нажатия клавишь для движения
         if(this.count === 240) {
@@ -1076,7 +1122,7 @@ const GameStart = { // класс для смены классов
             case 'Mamys':
                 this.chooseSnake = new MamysSkin();
         }
-        this.chooseSnake.run() // запускаем игру с определенным классом 
+        this.chooseSnake.preloadImages() // запускаем игру с определенным классом 
         
     },
     GlobalRestart() { // вызывает рестарт для своего класса
diff --git a/index.html b/index.html
index cf0a139..58bdd39 100644
--- a/index.html
+++ b/index.html
@@ -12,6 +12,9 @@
     <script src="Snake.js"></script>
 </head>
 <body>
+    <div id="preloadScreen">
+        <img src="images/Картинка1.png" class="preloadAnimation" id="preloadAnimation" alt="">
+    </div>
     <div class="Healths">
             <div class="healthText"><p>HEALTH:</p></div>
             <img src="images/Сердце.png" class="imgHeart1" id="Heart1" alt="">
diff --git a/style.css b/style.css
index c3c61af..7cd5e64 100644
--- a/style.css
+++ b/style.css
@@ -77,6 +77,23 @@
             -webkit-text-fill-color: transparent;
             background-clip: text;
         }
+        #preloadScreen {
+            position: absolute;
+            top: 0px;
+            left: 0px;
+            width: 100%;
+            height: 100%;
+            border: none;
+            display: flex;
+            justify-content: center;
+            align-items: center;
+            font-size: 24px;
+            z-index: 1000;
+            background-color: black;
+        }
+        .preloadAnimation {
+            border-radius: 30px;
+        }
         .frame {
             margin-top: 0px;
             border: 5px solid #272222;

(function() {

    class Buttons{
        constructor(spells, method, ...buttons){
            this.spells = spells;
            this.method = method;
            this.buttons = Array.from(buttons);
        }

        onButtonClick(){
            if(this.buttons.length > 1){
                for(let value of this.buttons){
                    value.addEventListener('click',(e) => {
                        this[this.method](e);
                    });
                }
            } else {
                for(let value of this.buttons[0]){
                    value.addEventListener('click', (e) => {
                        this[this.method](e);
                    });
                }
            }
        }

        onClickCast(e){
            if (e.target.classList.contains('btn-attack')) {
                this.spells.castAttack(e);
            } else {
                this.spells.castHeal(e);
            }
        }

        onClickSpell(e){

            for(let value of [document.querySelector('.btn-attack'), document.querySelector('.btn-heal')]){
                value.setAttribute('data-anim', e.target.getAttribute('data-power'));
            }

            e.target.parentNode.classList.add('hide');

            switch(e.target.getAttribute('data-power')){ // difficulty of the task
                case "simple":
                    this.spells.useSimpleAttack();
                    break;
                case "middle":
                    this.spells.useMiddleAttack();
                    break;
                case "special":
                    this.spells.useSpecialAttack();
                    break;
            }
        }
    }

    class Spells{
        constructor(gameContainer, canvas, duelPopup, taskContainer, popupAttack, taskTextP, textInput, pokemonLeft, pokemonRight, hpScaleLeft, hpScaleRight, healAnimation, spellAnimation, enemyName,  englishWordsObject = null, russianWordsObject = null){
            this.canvas = canvas;
            this.gameContainer = gameContainer;
            this.duelPopup = duelPopup;
            this.taskContainer = taskContainer;
            this.popupAttack = popupAttack;
            this.taskTextP = taskTextP;
            this.textInput = textInput;
            this.pokemonLeft = pokemonLeft;
            this.pokemonRight = pokemonRight;
            this.hpScaleLeft = hpScaleLeft;
            this.hpScaleRight = hpScaleRight;
            this.healAnimation = healAnimation;
            this.spellAnimation = spellAnimation;
            this.result = null;
            this.damage = null;
            this.scalePlayer = 100;
            this.scaleEnemy = 100;
            this.enemyName = enemyName;
            this.englishWordsObject = englishWordsObject;
            this.russianWordsObject = russianWordsObject;
        }

        useSimpleAttack(){
            this.taskContainer.classList.remove('hide');
            this.taskContainer.classList.remove('hide');
            this.damage = String((40 + Math.round(Math.random()*20)));
            let wordsArray = [];
            let wordIndex = Math.round(Math.random()*19);

            for(let key in this.russianWordsObject){
                wordsArray.push(key);
            }

            this.taskTextP.innerHTML = `В слове допущены ошибки, напишите его правильно:<br><br> ' ${wordsArray[wordIndex]} '`;
            this.result = this.russianWordsObject[wordsArray[wordIndex]];
        }

        useMiddleAttack(){
            this.taskContainer.classList.remove('hide');
            const mathSymbolArray = ['+', '-', '*', '/'];
            const mathOperation = {
                a: Math.round(Math.random()*100),
                b: Math.round(Math.random()*100),
                '+': function () {
                    return this.a + this.b;
                },
                '-': function () {
                    return this.a - this.b;
                },
                '*': function () {
                    this.a = Math.round(Math.random()*10);
                    this.b = Math.round(Math.random()*10);
                    return this.a * this.b;
                },
                '/': function () {
                    if(this.a%2 === 0){
                        this.b = 2;
                    } else if (this.a%3 === 0) {
                        this.b = 3;
                    } else {
                        this.b = 1;
                    }
                    return this.a / this.b;
                }
            };

            let symbolIndex = Math.round(Math.random()*3);

            this.damage = String((60 + Math.round(Math.random()*20)));

            for(let key in mathOperation){
                if(mathSymbolArray[symbolIndex] === key){
                    this.result = mathOperation[key]();
                    this.taskTextP.innerHTML = `\n Попробуйте решить следующий пример ${mathOperation.a} ${key} ${mathOperation.b}`;
                }
            }
        }

        useSpecialAttack(){
            this.taskContainer.classList.remove('hide');
            this.damage = String((80 + Math.round(Math.random()*20)));
            let wordsArray = [];
            let wordIndex = Math.round(Math.random()*19);

            for(let key in this.englishWordsObject){
                wordsArray.push(key);
            }
            this.taskTextP.innerHTML = `Попробуйте перевести следующее слово ${wordsArray[wordIndex]}`;
            this.result = this.englishWordsObject[wordsArray[wordIndex]];

        }

        castAttack(e){
            this.spellAnimation.classList.remove('hide');

            switch(e.target.getAttribute('data-anim')){ // difficulty of the task
                case "simple":
                    this.spellAnimation.style.backgroundImage = "url(assets/images/simple-spell.png)";
                    break;
                case "middle":
                    this.spellAnimation.style.backgroundImage = "url(assets/images/middle-spell.png)";
                    break;
                case "special":
                    this.spellAnimation.style.backgroundImage = "url(assets/images/special-spell.png)";
                    break;
            }

            this.taskContainer.classList.add('hide');

            this.pokemonLeft.classList.add('pokemon-jump-animation');
            this.pokemonRight.classList.add('pokemon-tremor-animation');

            setTimeout(() => {
                if(Array.isArray(this.result)){
                    for(let value of this.result){
                        if(String(value).toUpperCase() === String(this.textInput.value).toUpperCase()){
                            let damage = this.onTakingHeath(this.hpScaleRight, this.damage);
                            this.scaleEnemy -= Math.round(damage/4);

                            if(this.scaleEnemy <= 1){
                                this.hpScaleRight.innerHTML = `0%`;
                                this.onWin();
                            } else {
                                this.scaleEnemy += Math.round(damage/4);
                                this.hpScaleRight.innerHTML = `${this.scaleEnemy - Math.round(damage/4)}%`;
                                this.scaleEnemy -= Math.round(damage/4);
                            }
                        }
                    }
                } else {
                    if(String(this.result).toUpperCase() === String(this.textInput.value).toUpperCase()){
                        let damage = this.onTakingHeath(this.hpScaleRight, this.damage);
                        this.scaleEnemy -= Math.round(damage/4);

                        if(this.scaleEnemy <= 1){
                            this.hpScaleRight.innerHTML = `0%`;
                            this.onWin();
                        } else {
                            this.scaleEnemy += Math.round(damage/4);
                            this.hpScaleRight.innerHTML = `${this.scaleEnemy - Math.round(damage/4)}%`;
                            this.scaleEnemy -= Math.round(damage/4);
                        }
                    }
                }

                this.textInput.value = '';
                this.pokemonLeft.classList.remove('pokemon-jump-animation');
                this.pokemonRight.classList.remove('pokemon-tremor-animation');
                this.spellAnimation.classList.add('hide');
            }, 2000);

            setTimeout(()=>{
                this.spellAnimation.classList.remove('hide');                            // opponent attack
                this.spellAnimation.style.backgroundImage = "url(assets/images/simple-spell.png)";
                this.spellAnimation.style.transform = "scale(-1, 1)";
                this.pokemonRight.classList.add('pokemon-jump-animation');
                this.pokemonLeft.classList.add('pokemon-tremor-animation');

                setTimeout(()=>{
                    let damage = this.onTakingHeath(this.hpScaleLeft);
                    this.scalePlayer -= Math.round(damage/4);

                    this.pokemonRight.classList.remove('pokemon-jump-animation');
                    this.pokemonLeft.classList.remove('pokemon-tremor-animation');
                    this.spellAnimation.classList.add('hide');

                    if(this.scalePlayer <= 1){
                        this.hpScaleLeft.innerHTML = `0%`;
                        this.onLose();
                    } else {
                        this.scalePlayer += Math.round(damage/4);
                        this.hpScaleLeft.innerHTML = `${this.scalePlayer - Math.round(damage/4)}%`;
                        this.scalePlayer -= Math.round(damage/4);
                    }
                }, 2000);
                setTimeout(()=>{
                    this.popupAttack.classList.remove('hide');
                }, 2200);
            }, 2500);
        }

        castHeal(e){
            this.healAnimation.classList.remove('hide');
            this.taskContainer.classList.add('hide');


            setTimeout(()=>{
                if(Array.isArray(this.result)){
                    for(let value of this.result){
                        if(String(value).toUpperCase() === String(this.textInput.value).toUpperCase()){
                            let heal = this.onGivenHealt(this.hpScaleLeft, this.damage);
                            this.hpScaleLeft.innerHTML = `${this.scalePlayer + Math.round(heal/4)}%`;
                            this.scalePlayer += Math.round(heal/4);
                        }
                    }
                } else {
                    if(String(this.result).toUpperCase() === String(this.textInput.value).toUpperCase()){
                        let heal = this.onGivenHealt(this.hpScaleLeft, this.damage);
                        this.hpScaleLeft.innerHTML = `${this.scalePlayer + Math.round(heal/4)}%`;
                        this.scalePlayer += Math.round(heal/4);
                    }
                }
                this.textInput.value = '';
                this.healAnimation.classList.add('hide');
            }, 2000);

            setTimeout(()=>{
                this.spellAnimation.classList.remove('hide');                            // opponent attack
                this.spellAnimation.style.backgroundImage = "url(assets/images/simple-spell.png)";
                this.spellAnimation.style.transform = "scale(-1, 1)";
                this.pokemonRight.classList.add('pokemon-jump-animation');
                this.pokemonLeft.classList.add('pokemon-tremor-animation');

                setTimeout(()=>{
                    this.pokemonRight.classList.remove('pokemon-jump-animation');
                    this.pokemonLeft.classList.remove('pokemon-tremor-animation');
                    this.spellAnimation.classList.add('hide');
                }, 2000);

                setTimeout(()=>{
                    this.popupAttack.classList.remove('hide');
                }, 2200);

            }, 1000);

        }

        onTakingHeath(hpScale, damage = Math.round(50 + Math.random()*40)){
            let width = (Number(hpScale.offsetWidth) - Number(damage));
            if(width <= 0){
                width = 0;
            }
            hpScale.style.width =  width + 'px';
            return damage;
        }

        onGivenHealt(hpScale, damage){
            let width = (Number(hpScale.offsetWidth) + Number(damage));
            hpScale.style.width =  width + 'px';
            return damage;
        }

        onWin(){
            this.pokemonRight.classList.remove(this.enemyName);
            this.scaleEnemy = 100;
            this.scalePlayer = 100;
            window.totalWins++;
            this.gameContainer.classList.add('hide');
            this.gameContainer.classList.add('appearing');
            this.gameContainer.removeChild(this.gameContainer.firstChild);
            this.gameContainer.removeChild(this.gameContainer.lastChild);
            this.canvas.classList.remove('hide');
            this.canvas.classList.remove('filter');
            this.gameContainer.classList.remove('hide');

            setTimeout(() => {
                this.gameContainer.classList.remove('appearing');
                let duelTextP = document.querySelector('.duel-text');
                duelTextP.innerHTML = `На этот раз тебе повезло, ты победил. Но в следующий раз у тебя не будет шансов!`;
                let duelButton = document.querySelector('.make-duel');
                duelButton.classList.add('hide');
                this.duelPopup.classList.remove('hide');
            }, 1000);

            setTimeout(() => {
                this.duelPopup.classList.add('hide');
                let duelButton = document.querySelector('.make-duel');
                duelButton.classList.remove('hide');
            }, 3000);
        }

        onLose(){
            window.isEnd(window.totalWins);
        }

    }

    let spells;
    let spellAttack;
    let castButtonsArray;


    let bttnMakeDuel = document.querySelector('.make-duel');
    let game = document.querySelector('.game');
    let canvas = document.querySelector('.canvas');
    let duelPopup = document.querySelector('.duel-popup-overlay');
    window.totalWins = 0;

    bttnMakeDuel.addEventListener('click', function(){

        game.style.display = 'none';
        game.classList.add('appearing');
        makeDuel();
        game.style.display = 'block';

        setTimeout(function(){
            game.classList.remove('appearing');
        }, 1000);

    });


    let makeDuel = function makeDuel(){
        let canvas = document.querySelector('canvas');

        const englishWordsObject = {
            "cat": ["кот", "кошка", "котик", "котяра"],
            "dog": ["собака", "пёс", "пес"],
            "apple": ["яблоко", "яблочко"],
            "tree": ["дерево", "древо", "деревце"],
            "pen": ["ручка", "перо", "авторучка"],
            "window": ["окно", "окошко", "стекло", "иллюминатор"],
            "bed": ["кровать", "койка", "постель", "ложе", "спальное место"],
            "sky": ["небо", "небеса", "поднебесье", "небосвод", "небосклон"],
            "sun": ["солнце", "солнышко", "солнечные лучи", "солнечный свет"],
            "girl": ["девушка", "девочка", "девчонка", "женщина", "девица"],
            "boy": ["мальчик", "мальчишка", "парень", "юноша", "малыш"],
            "kitchen": ["кухня"],
            "house": ["дом", "здание", "домик", "жилой дом", "домишко"],
            "box": ["коробка", "рамка", "коробочка", "ящик", "ящичек",  "короб"],
            "grass": ["трава", "зелень", "травка", "травяной", "травянистый"],
            "school": ["школа", "колледж", "училище", "школьный", "учебный"],
            "paper": ["бумага", "документ", "статья", "доклад"],
            "meat": ["мясо", "фарш", "пища", "мясной"],
            "knife": ["нож", "ножик", "лезвие", "ножичек", "ножевой"],
            "book": ["книга", "книжка", "книжечка", "книжица", "сборник"]
        };

        const russianWordsObject = {
            "ольбом":"альбом",
            "богажь":"багаж",
            "восим":"восемь",
            "гарох":"горох",
            "девачька":"девочка",
            "ещо":"ещё",
            "жолты":"жёлтый",
            "завот":"завод",
            "интирес":"интерес",
            "кастёр":"костёр",
            "лучьше":"лучше",
            "митро":"метро",
            "назат":"назад",
            "акиан":"океан",
            "писок":"песок",
            "ростение":"растение",
            "салюд":"салют",
            "тромвай":"трамвай",
            "ужен":"ужин",
            "фламастир":"фломастер"
        }

        let duelContainerHtml = `<div class="duel-container">
                                <div class="hp-scale-left">100%</div>
                                <div class="hp-scale-right">100%</div>
                                <span class="pokemon-left"></span>
                                <span class="pokemon-right"></span>
                                <div class="popup-attack">
                                    <button class="spell-attack simple-attack" data-power="simple"></button>
                                    <button class="spell-attack middle-attack" data-power="middle"></button>
                                    <button class="spell-attack special-attack" data-power="special"></button>
                                </div>
                                <span class="simple-animation hide"></span>
                                <span class="heal-animation hide"></span>
                              </div>`;

        let taskContainerHtml = `<div class="task-container hide">
                                <div class="task-area">
                                    <div class="task-text">
                                        <p class="task-text-p"></p>
                                    </div>
                                    <input type="text" class="task-answer" placeholder="your answer">
                                    <button class="btn-cast btn-attack">Cast Spell</button>
                                    <button class="btn-cast btn-heal">Heal Yourself</button>
                                </div>
                              </div>`;

        canvas.classList.add('hide');                   // hide the canvas
        duelPopup.classList.add('hide');



        game.insertAdjacentHTML('afterBegin', duelContainerHtml);
        game.insertAdjacentHTML('beforeEnd', taskContainerHtml);

        // let totalWins = 0;

        let taskContainer = document.querySelector('.task-container');
        let popupAttack = document.querySelector('.popup-attack');
        let taskTextP = document.querySelector('.task-text-p');
        let textInput = document.querySelector('.task-answer');
        let pokemonLeft = document.querySelector('.pokemon-left');
        let pokemonRight = document.querySelector('.pokemon-right');
        let hpScaleLeft = document.querySelector('.hp-scale-left');
        let hpScaleRight = document.querySelector('.hp-scale-right');
        let healAnimation = document.querySelector('.heal-animation');
        let spellAnimation = document.querySelector('.simple-animation');
        //
        let enemyArray = ['charmander', 'squirtle', 'evee', 'render', 'bulbasaur'];
        let randomEnemyIndex = Math.round(Math.random()*4);

        pokemonRight.classList.add(enemyArray[randomEnemyIndex]);




            spells = new Spells(game, canvas, duelPopup, taskContainer, popupAttack, taskTextP, textInput, pokemonLeft, pokemonRight, hpScaleLeft, hpScaleRight, healAnimation, spellAnimation, enemyArray[randomEnemyIndex],  englishWordsObject, russianWordsObject);
            spellAttack = new Buttons(spells, 'onClickSpell', document.querySelectorAll('.spell-attack'));
            castButtonsArray = new Buttons(spells, 'onClickCast', [document.querySelector('.btn-attack'), document.querySelector('.btn-heal')]);


        spellAttack.onButtonClick();
        castButtonsArray.onButtonClick();
    }
})();

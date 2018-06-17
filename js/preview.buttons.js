(function() {
    let bttn = document.querySelector('.bttns-container');  
    let start = document.querySelector('.start'); 
    let fName = document.querySelector('.first-name');
    let lName = document.querySelector('.last-name');
    let email = document.querySelector('.email');

    let playerObject = {};
    let makeGame = function(event){
        let e = event || window.event;
        let canvas = document.querySelector('.canvas');
        let preview = document.querySelector('.preview');
        let game = document.querySelector('.game');

        if(!e.target.closest('input')) return;

        preview.classList.add('vanishing-up');

        e.target.setAttribute('selected', '');

        setTimeout(function(){
            [preview.style.display, game.style.display] = 
            [game.style.display, preview.style.display];
            
            game.classList.add('appearing');
        }, 1000);
        
        setTimeout(function(){
            game.classList.remove('appearing');
        }, 2000);
        
    };

    bttn.addEventListener('click', function clickNewGame(e) {
        let playerObject = {
            'firstName': fName.value,
            'lastName': lName.value,
            'email': email.value,
            };
        localStorage.setItem('player', JSON.stringify(playerObject));
        let playerStorage = JSON.parse(localStorage.getItem('player'));
        console.log(playerStorage);
        });
    bttn.addEventListener('click', makeGame, false);

    //localStorage.clear();         
})();
!function(){
    let game = document.querySelector('.game');

    window.isEnd = function(winCount){
        let playAgain = document.querySelector('.play-again');
        let conclusion = document.querySelector('.conclusion');
        let topTen = document.querySelector('.top_10');

        let storageArray = [];
        let playerScore = {toString: function () {

            return `${this.firstName} ${this.totalWins}`  // place for TOTALWINS

        }};
        let playerStorage = JSON.parse(localStorage.getItem('player'));
        playerScore.firstName = playerStorage.firstName;

        playerScore.totalWins = winCount;										// place for TOTALWINS

        if(localStorage.length > 1){
            for(let i = 0; i < localStorage.length; i++){
                if(!isNaN(Number(localStorage.key(i)))){
                    storageArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                }
            }
        }
        storageArray.push(playerScore);
        storageArray = storageArray.sort((a, b) => {
            return Number(a.totalWins) < Number(b.totalWins);
        });
        for(let i = 0; i < storageArray.length; i++){
            if(i === 10){
                break;
            }
            localStorage.setItem(String(i), JSON.stringify(storageArray[i]));
        }
        let i = 0;
        storageArray.forEach((value,key) => {
            if(i === 10){
                return;
            }
            let li = document.createElement('li');
            li.classList.add('top_10_li');
            li.innerHTML = `Name: ${value.firstName} Wins:  ${value.totalWins}`;
            document.querySelector('.top_10').appendChild(li);
            i++;
        });

        game.style.filter = 'blur(5px)';
        conclusion.style.display = '';
        conclusion.classList.add('opacity-plus');

        playAgain.addEventListener('click', function (e) {
            location.reload();
        })
    }
}();
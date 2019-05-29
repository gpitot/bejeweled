

import Game from './js/game';


const config = {
    width : 1000,
    height: 400,
    columns : 10,
    rows : 4
}
new Game(document.getElementById('game'), config);
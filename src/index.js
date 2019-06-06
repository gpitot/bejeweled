import Map from './js/map';

const dimensions = {
    rows : 3,
    cols : 10,
}
const parentEl = document.getElementById('game');
new Map({dimensions, parentEl})
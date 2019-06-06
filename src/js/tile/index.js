import tileOptions from './tile-options';
import { throws } from 'assert';

class Tile {
    constructor({parent, tileSize}) {
        this.parent = parent;
        this.config = {
            ...this.getRandomTile(),
            ...tileSize,
            coords : {
                x : null,
                y : null
            },
        }
        this.active = false;

        this.createElement();
    }

    getRandomTile = () => {
        return tileOptions[Math.floor(Math.random() * tileOptions.length)];
    }

    

    createElement = () => {
        const el = document.createElement('div');
        el.classList.add('tile');
        el.style.width = (this.config.size - (this.config.margin * 2)) + 'px';
        el.style.height = (this.config.size - (this.config.margin * 2)) + 'px';
        el.style.background = this.config.color;
        el.style.top = "-999px";
        el.style.left = "-999px";
        this.el = el;
        this.parent.element.appendChild(el);
    }

    startDestroyAnimation = () => {
        //do animation
        this.el.style.background = "black";
        this.el.classList.add('destroy');
    }

    destroyElement = () => {
        
        //delete node
        this.el.parentNode.removeChild(this.el);
    }

    draw = (x=null, y=null) => {
       
        if (x!==null && y!==null) {
            this.el.style.top = `${(y * this.config.size)+ this.config.margin}px`;
            this.el.style.left = `${(x * this.config.size)+ this.config.margin}px`;
            // this.el.style.top = `${y * (this.config.size - this.config.margin)}px`
            // this.el.style.left = `${x * (this.config.size - this.config.margin)}px`;
        }
        
        
        if (this.destroyed) {
            this.startDestroyAnimation();
        }

        if (this.active) {
            this.el.classList.add('active');
        } else if (this.el.classList.contains('active')) {
            this.el.classList.remove('active');
        }

        this.config.coords = {
            x, y
        }
    }
}

export default Tile;
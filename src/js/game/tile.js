const tileTypes = [
    {
        id : 1,
        background : "rgb(255,0,0)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 2, 
        background : "rgb(255,255,0)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 3, 
        background : "rgb(0,255,255)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 4, 
        background : "rgb(255,0,255)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 5, 
        background : "rgb(125,0,0)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 6, 
        background : "rgb(0,125,0)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 7, 
        background : "rgb(0,0,125)",
        destroySheet : [],
        //other sheets if needed
    },
    {
        id : 8, 
        background : "rgb(100,100,0)",
        destroySheet : [],
        //other sheets if needed
    }
]


export default class Tile {


    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;
        this.active = false;
        this.destroyed = false;
        this.getRandomBackground();
    }

    getRandomBackground() {
        //dev version return color
        const r1 = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        this.config = {
            ...this.config,
            ...r1
        }
    }


    draw = (x, y) => {
        const {ctx} = this;
        const {
            size,
            background,
        } = this.config;

        ctx.fillStyle = background;
        ctx.fillRect(x * size, y * size, size, size);
        //if active add opacity background so obvious
        if (this.active) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(x * size, y * size, size, size);
        }

       
        if (this.destroyed) {
            console.log('tile is destroyed', this.config);
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(x * size, y * size, size, size);
        }
    }
}
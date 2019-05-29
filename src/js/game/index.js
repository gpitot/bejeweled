import cloneDeep from 'lodash.clonedeep'
import Tile from './tile';


export default class Bejewled {
    constructor(canvas, config) {

        //squareSize is smaller of the two ratios
        config.squareSize = config.width / config.columns > config.height / config.rows ? config.height / config.rows : config.width / config.columns;

        this.config = config;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.activeSquare = null;
        this.animating = false; //cannot click during animation (true) period;

        this.setUpCanvas();
        this.setUpBoard();
        this.drawBoard();
    }

    setUpCanvas = () => {
        const {
            width,
            height
        } = this.config;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.addEventListener('click', this.handleClick);
        
    }

    setUpBoard = () => {
        const {
            rows,
            columns
        } = this.config;
        let board = [];

        for (let y=0; y < rows; y+=1) {
            let col = [];
            for (let x=0; x< columns;x +=1) {
                const config = {
                    x, 
                    y,
                    size : this.config.squareSize
                }
                col.push(new Tile(config, this.ctx));
            }
            board.push(col);
        }

        this.board = board;
    }


    drawBoard = () => {
        const {
            board,
        } = this;

        for (let row=0;row<board.length; row+=1) {
            for (let col=0;col<board[row].length; col+=1) {
                const tile = board[row][col];
                tile.draw();
            }
        }
    }



    handleClick = (e) => {
        //check to see what tile has been clicked
        if (this.animating) return;
        const {
            offsetX, offsetY
        } = e;
        const row = Math.floor(offsetY / this.config.squareSize);
        const col = Math.floor(offsetX / this.config.squareSize);
        
        if (this.activeSquare) {
            //reset
            this.activeSquare.active = false;
        }
        
        //check if tile should swap
        if (this.tilesAreAdjacent(this.activeSquare, this.board[row][col])) {
            this.swapTiles(this.activeSquare, this.board[row][col]);
        } else {
            this.activeSquare = this.board[row][col];
            this.activeSquare.active = true;
            this.drawBoard();
        }

        
        
    }


    tilesAreAdjacent = (tile1, tile2) => {
        //checks if tiles are next to eachother 
        if (tile1 === null) return;
        console.log(Math.abs(tile1.config.x - tile2.config.x), Math.abs(tile1.config.y - tile2.config.y))
        return Math.abs(tile1.config.x - tile2.config.x) < 2 && Math.abs(tile1.config.y - tile2.config.y) < 2;
    }

    willTilesDestroy = (board) => {
        //uses a given board instead of current board so we can check tile swaps
        //check all tiles and see if any die
        //return boolean result
        let destroy = false;
        for (let row=0;row<board.length;row+=1) {
            for (let col=0;col<board.length;col+=1) {
                destroy = this.checkTileDestroy(board, board[row][col]);
            }
        }
        return destroy;

    }

    checkTileDestroy = (board, tile) => {
        const {
            x, 
            y
        } = tile.config;
        //check UP
        if (board[y-1][x].id === tile.id) {
            //1 up is same
            //check 1 below 
            if (board[y+1][x].id === tile.id) {
                //3 in a row
                board[y-1][x].destroyed = true;
                tile.destroyed = true;
                board[y+1][x].destroyed = true;
                return true;
            }
            //check 2 up
            if (board[y-2][x].id === tile.id) {
                board[y-2][x].destroyed = true;
                board[y-1][x].destroyed = true;
                tile.destroyed = true;
                return true;
            }
        }

        //check DOWN
        if (board[y+1][x].id === tile.id) {
            //1 down is same
            //check 1 up 
            if (board[y-1][x].id === tile.id) {
                //3 in a row
                board[y-1][x].destroyed = true;
                tile.destroyed = true;
                board[y+1][x].destroyed = true;
                return true;
            }
            //check 2 down
            if (board[y+2][x].id === tile.id) {
                board[y+2][x].destroyed = true;
                board[y+1][x].destroyed = true;
                tile.destroyed = true;
                return true;
            }
        }

    }

    swapTiles = (tile1, tile2) => {
        //create dummy board with tiles swapped 
        //check willTilesDestroy
        //if true then do full swap and doActualDestroy
        //else do swap animation
        const futureBoard = cloneDeep(this.board);

        futureBoard[tile1.config.y][tile1.config.x] = tile2;
        futureBoard[tile2.config.y][tile2.config.x] = tile1;
        
        const willDestroy = this.willTilesDestroy(futureBoard);
        console.log(willDestroy);
        
    }
}

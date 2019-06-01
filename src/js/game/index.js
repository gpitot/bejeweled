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
        this.willTilesDestroy(this.board);
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
               
                tile.draw(col, row);
            }
        }
        console.log('draw')
        console.log(board);
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
            this.activeSquare.tile.active = false;

            if (this.tilesAreAdjacent(this.activeSquare.coords, {x:col, y:row})) {
                this.swapTiles(this.activeSquare.coords, {x:col, y:row});
            }
        }
        
        this.activeSquare = {
            tile : this.board[row][col],
            coords : {
                x : col,
                y : row
            }
        }
        this.activeSquare.tile.active = true;
        this.drawBoard();       
        
    }


    tilesAreAdjacent = (coord1, coord2) => {
        //checks if tiles are next to eachother 
       
        //console.log('tiles are adjacent = ', Math.abs(tile1.config.x - tile2.config.x) < 2 && Math.abs(tile1.config.y - tile2.config.y) < 2)
        return Math.abs(coord1.x - coord2.x) < 2 && Math.abs(coord1.y - coord2.y) < 2;
    }

    willTilesDestroy = (board) => {
        //uses a given board instead of current board so we can check tile swaps
        //check all tiles and see if any die
        //return boolean result
        let willDestroy = false;
        let currentType = null;
        let destroyInOrderCount = 0; //if this gets to 3 then last 3 are destroyed
       
        //check rows
        for (let row=0;row<board.length;row+=1) {
            for (let col=0;col<board[row].length;col+=1) {
                if (board[row][col].config.id === currentType) {
                    destroyInOrderCount += 1;
                    
                    if (destroyInOrderCount === 2) {
                        //row of 3
                        //set last 3 to destroyed = true
                        board[row][col].destroyed = true;
                        board[row][col-1].destroyed = true;
                        board[row][col-2].destroyed = true;
                        console.log('DESTROYING ROW ' , row, col);
                        willDestroy = true;

                    } else if (destroyInOrderCount > 2) {
                        //set current to destroyed = true
                        board[row][col].destroyed = true;
                    }

                } else {
                    currentType = board[row][col].config.id;
                    destroyInOrderCount = 0;
                }
            }
            //reset at end of row
            currentType = null;
            destroyInOrderCount = 0;
        }


        //check columns
        currentType = null;
        destroyInOrderCount = 0;
        for (let col=0;col<board[0].length;col+=1) {
            for (let row=0;row<board.length;row+=1) {
                if (board[row][col].config.id === currentType) {
                    destroyInOrderCount += 1;
                    
                    if (destroyInOrderCount === 2) {
                        //row of 3
                        //set last 3 to destroyed = true
                        board[row][col].destroyed = true;
                        board[row-1][col].destroyed = true;
                        board[row-2][col].destroyed = true;
                        console.log('DESTROYING COL' , row, col);
                        willDestroy = true;

                    } else if (destroyInOrderCount > 2) {
                        //set current to destroyed = true
                        board[row][col].destroyed = true;
                    }

                } else {
                    currentType = board[row][col].config.id;
                    destroyInOrderCount = 0;
                }
            }
            //reset at end of row
            currentType = null;
            destroyInOrderCount = 0;
        }


        return willDestroy;

    }

   

    swapTiles = (tile1, tile2) => {
        //swap tiles
        //check if will destroy
        //if yes then start destroy animation 
        //if no then reset tiles

        const temp = this.board[tile1.y][tile1.x];
        this.board[tile1.y][tile1.x] = this.board[tile2.y][tile2.x];
        this.board[tile2.y][tile2.x] = temp; 
        
       
       
        
        const willDestroy = this.willTilesDestroy(this.board);
        
        if (willDestroy) {
            //swap tiles
            //futureBoard[tile1.config.y][tile1.config.x] = tile2;
           
            
            this.activeSquare.tile.active = false;
            this.activeSquare = null;
            
            

            
            
        } else {
            //do fake swap animation


            //reset tiles
            setTimeout(()=>{
                this.board[tile2.y][tile2.x] = this.board[tile1.y][tile1.x];
                this.board[tile1.y][tile1.x] = temp;
                this.drawBoard();
            },400)
            
            
        }

        
        
    }
}

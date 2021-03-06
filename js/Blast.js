import {gameSettings} from './GameSettings.js'
import {Node} from './Node.js'
export let tileMatrix = [];

let $ = (id) => {return document.getElementById(id)};
let cnv = $('cnv');
let ctx = cnv.getContext('2d');

class Blast {
    
    constructor( width, height, timer) {
        this.width = width;
        this.height = height; 
        this.timer = timer
    }

    rect = (x, y, w, h, color) => {
        let image = new Image();
        image.src = `img/tiles/${color}.png`;
        ctx.drawImage(image, x, y, w, h);
    };
   
    create_node = (id, x, y, w, h, color, row, col, visited) => {
        return new Node(id, x, y, w, h, color, row, col, visited);
    };

    deleteAnimation = (coords) => {
        let start = performance.now();
        let stop = 1000;

        let step = timestamp => {
            let progress = timestamp - start;
            ctx.clearRect(coords.x, coords.y, coords.w, coords.h);

            coords.draw();
            if(coords.w==0 && coords.h==0) {
                return;
            }
            coords.h-=1;
            coords.w-=1;
   
            if (progress < stop) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step); 
    }

    update = () => {
        ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i<tileMatrix.length; i++) {
            for(let j = 0;j<tileMatrix[i].length; j++ ){
                tileMatrix[i][j]._update();
                tileMatrix[i][j].draw();
            }
        }   

        if(this.timer < 1000) {
            requestAnimationFrame(this.update);
        }
        this.timer++;
    };
  
    start = (W, H) => {
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        this.width = W;
        this.height = H;
        cnv.width = this.width;
        cnv.height = this.height;
        this.update();
    };
   
    clickListener = () => {
        let progressBar = document.getElementById("progressBar");
        let movesLeft = document.getElementById('movesLeft');
        progressBar.max = 40;
        movesLeft.textContent = gameSettings.countClicksToLose;
        cnv.addEventListener('click', function(event) {
            
            let x1 = event.pageX - cnv.offsetLeft + cnv.clientLeft,
            y1 = event.pageY - cnv.offsetTop + cnv.clientTop;
            
            tileMatrix.forEach(function(elem) {
                elem.forEach(function(element) {

                    if (y1 > element.y && y1 < element.y + element.h 
                        && x1 > element.x && x1 < element.x + element.w) {
                            
                            if (gameSettings.countClicksToLose === 0) {
                                alert('Game is over');
                            }
                            let res = [];
                            function adjacentTiles(array, item, row, col) {
                        
                                if (array[row][col].visited === true) return;
                                array[row][col].visited = true;
                                
                                res.push(array[row][col]);
                                // left
                                if (col!=0&& array[row][col - 1].color === item.color) {
                                  adjacentTiles(array, item, row, col - 1);
                                }
                                // right
                                if (col!=array.length-1 && array[row][col + 1].color === item.color) {
                                  adjacentTiles(array, item, row, col + 1);
                                }
                                // top
                                if (row!=0 &&array[row - 1] && array[row - 1][col].color === item.color) {
                                  adjacentTiles(array, item, row - 1, col);
                                }
                                // bottom
                                if (row!=array.length && array[row + 1] && array[row + 1][col].color === item.color) {
                                  adjacentTiles(array, item, row + 1, col);
                                }
                                if(res.length > 1 ) {
                                    return res;
                                } else {
                                    array[row][col].visited = false;
                                }
                                return res;
                            }
                            
                            let adjArray = adjacentTiles(tileMatrix, element, element.row, element.col);
                            if (adjArray.length>1) {
                                gameSettings.countClicksToLose--;
                                movesLeft.textContent = gameSettings.countClicksToLose;
                                gameSettings.score+=adjArray.length;
                                progressBar.value += adjArray.length;

                                for(let k =0; k<adjArray.length; k++) {
                                    for (let i = 0; i<tileMatrix.length; i++) {
                                        
                                        let color = gameSettings.colors[Math.floor(Math.random() * gameSettings.colors.length)];
                                        let tmpImg = new Image();
                                        tmpImg.src = `../img/tiles/${color}.png`;
                                        let p = new Blast();
                                        for (let j = 0; j<tileMatrix[i].length; j++) {
                                            if(adjArray[k].row==tileMatrix[i][j].row && adjArray[k].col == tileMatrix[i][j].col){
                                                p.deleteAnimation(tileMatrix[i][j]);

                                                tileMatrix[i][j] = (p.create_node(tileMatrix[i][j].id, tileMatrix[i][j].x, tileMatrix[i][j].y, 40, 40, color, tileMatrix[i][j].row, tileMatrix[i][j].col, false));

                                                ctx.drawImage(tmpImg, tileMatrix[i][j].x, tileMatrix[i][j].y, 40, 40);
                                            }
                                        }
                                    } 
                                } 
                            }
                    }
                })
            });
            if (gameSettings.score >= 40) {
                alert("???? ????????????????!");
            }
        }, false)
    };
};
export {Blast}
let matrix = [];
let score = 0;
const SPIN = new function () {
    let SPIN = this,
        cnv, ctx, width, height, nodes = [], 
       timer = 0;
        
    let $ = (id) => {return document.getElementById(id)};
  
    let rect = (x, y, w, h, color) => {
        let image = new Image();
        image.src = `img/${color}.png`;
        ctx.drawImage(image, x, y, w, h);
    };
    cnv = $('cnv');
    ctx = cnv.getContext('2d');

    class Node {
        constructor (id, x, y, w, h, color, row, col, visited) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.color = color;
            this.row = row;
            this.col = col;
            this.visited = visited;
            nodes.push(this);
        }

        _update () {
            if (this.update)
                this.update(this);
            
        }
        _delete() {
            if(this.delete)
                this.delete(this)
        }

        draw () {
            rect(this.x, this.y, this.w, this.h, this.color, this.row, this.col, this.visited);
        }
    }

    SPIN.create_node = (id, x, y, w, h, color, row, col, visited) => {
        return new Node(id, x, y, w, h, color, row, col, visited);
    };

    SPIN.delete = (tile, coords, callback) =>{
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
            
            let time = new Date();
            
            if (progress < stop) {
                requestAnimationFrame(step);
            } else {
                //callback();
            }
        }

        requestAnimationFrame(step); 
    }

    SPIN.update = () => {
        ctx.clearRect(0, 0, width, height);
        for(let i = 0; i<matrix.length; i++) {
            for(let j = 0;j<matrix[i].length; j++ ){
                matrix[i][j]._update();
                matrix[i][j].draw();
            }
        }   

        if(timer < 1000) {
            requestAnimationFrame(SPIN.update);
        }
        timer++;
    };
  
    SPIN.start = (W, H) => {
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        width = W;
        height = H;
        cnv.width = width;
        cnv.height = height;
        SPIN.update();
    };
    SPIN.next = () =>{
        let progressBar = document.getElementById("progressBar");
        let movesLeft = document.getElementById('movesLeft');
        progressBar.max = 40;
        let countClicksToLose = 15;
        movesLeft.textContent = countClicksToLose;
        cnv.addEventListener('click', function(event) {
            
            var x1 = event.pageX - cnv.offsetLeft + cnv.clientLeft,
            y1 = event.pageY - cnv.offsetTop + cnv.clientTop;
            
            matrix.forEach(function(elem, index) {
                elem.forEach(function(element) {

                    if (y1 > element.y && y1 < element.y + element.h 
                        && x1 > element.x && x1 < element.x + element.w) {
                            
                            countClicksToLose--;
                            
                            movesLeft.textContent = countClicksToLose;
                            if (countClicksToLose === 0) {
                                alert('Game is over');
                            }
                            let res = [];
                            function removeItem(array, item, row, col) {
                                
                                if (array[row][col].visited === true) return;
                                array[row][col].visited = true;
                                console.log(array[row][col]);
                                
                                res.push(array[row][col]);
                                // left
                                if (col!=0&& array[row][col - 1].color === item.color) {
                                  removeItem(array, item, row, col - 1);
                                }
                                // right
                                if (col!=array.length-1 && array[row][col + 1].color === item.color) {
                                  removeItem(array, item, row, col + 1);
                                }
                                // top
                                if (row!=0 &&array[row - 1] && array[row - 1][col].color === item.color) {
                                  removeItem(array, item, row - 1, col);
                                }
                                // bottom
                                if (row!=array.length && array[row + 1] && array[row + 1][col].color === item.color) {
                                  removeItem(array, item, row + 1, col);
                                }
                                if(res.length > 1 ) {
                                    return res;
                                }
                            }
                              
                            let tmp = removeItem(matrix,element,element.row, element.col);
                            let tt = res.length;
                            score+=tmp.length;
                            progressBar.value += tmp.length;
                            for(let k =0; k<tt; k++) {
                                
                                
                                for (let i = 0; i<matrix.length; i++) {
                                    const colors = ["red", "green", "blue", "yellow", "purple"];
                                    color = colors[Math.floor(Math.random() * colors.length)];
                                    
                                    let tmpImg = new Image();
                                    tmpImg.src = `../img/${color}.png`
                                
                                    for (let j = 0; j<matrix[i].length; j++) {
                                        if(tmp[k].row==matrix[i][j].row && tmp[k].col == matrix[i][j].col){

                                            SPIN.delete(matrix[i][j],matrix[i][j],console.log("1111"));

                                            matrix[i][j] = (SPIN.create_node(matrix[i][j].id, matrix[i][j].x, matrix[i][j].y, 40, 40, color, matrix[i][j].row, matrix[i][j].col, false));

                                            ctx.drawImage(tmpImg, matrix[i][j].x, matrix[i][j].y, 40, 40);

                                        }
                                    }
                                } 
                            } 
                    }
                })
            });
            if (score >= 40) {
                alert("Вы победили!");
            }
        }, false)

    };
};

window.addEventListener('load', function () {
    SPIN.start(460, 450);
    
    const ww = 10;
    const hh = 10;
    let countClicks = 3;
    let swapCount = document.getElementById('swapCount');
    swapCount.textContent = countClicks;
    let swapField = document.getElementById('swapField');
    swapField.addEventListener('click', function (event) {
        
        
        countClicks--;
        
        swapCount.textContent = countClicks;
        
        for (let j = 0; j < ww; j++) {
            matrix[j] = [];
            for (let i = 0; i < hh ; i++) {
                const colors = ["red", "green", "blue", "yellow", "purple"];
                color = colors[Math.floor(Math.random() * colors.length)];
                matrix[j][i] = (SPIN.create_node(ttt,30 + (20 + 20) * i, 20 + (20 + 20) * j, 40, 40, color, j, i, false));
                ttt++;
            }
        }
        if(countClicks==0) {
            swapCount.textContent = "";
            swapField.style.opacity = 0.3;
            swapField.style.pointerEvents = 'none';
        }
    })


  
    SPIN.next();
    
    let ttt = 0;
    for (let j = 0; j < ww; j++) {
        matrix[j] = [];
        for (let i = 0; i < hh ; i++) {
            const colors = ["red", "green", "blue", "yellow", "purple"];
            color = colors[Math.floor(Math.random() * colors.length)];
            
            matrix[j][i] = (SPIN.create_node(ttt,30 + (20 + 20) * i, 20 + (20 + 20) * j, 40, 40, color, j, i, false));
            
            ttt++;
            
        }
    }
    
    //SPIN.update();
   
    
});
let enemies = [];
let globalColor = [];
let matrix = [];
let score = 0;
const SPIN = new function () {
    let SPIN = this,
        cnv, ctx, width, height, nodes = [], node_count = 0, for_destroy = {},
        down_keys = {}, timer = 0, user_draw;
        
    let $ = (id) => {return document.getElementById(id)};
  
    let rect = (x, y, w, h, color) => {
        
        let image = new Image();
        //const colors = ["red", "green", "blue", "yellow", "purple"];
        //color = colors[Math.floor(Math.random() * colors.length)];

        image.src = `img/${color}.png`;
        ctx.drawImage(image, x, y, w, h);
        
    };
    cnv = $('cnv');
        ctx = cnv.getContext('2d');
    
    let text = (x, y, clr, text) => {
        ctx.fillStyle = clr;
        ctx.fillText(text, x, y);
    };

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
        _updateNode () {
            if (this.updateNode)
                this.updateNode(this);
        }
        draw () {
            rect(this.x, this.y, this.w, this.h, this.color, this.row, this.col, this.visited);
        }

        destroy () {
            for_destroy[this.id] = this;
        }

        move (x, y) {
            this.x += x;
            this.y += y;
        }

        intersect (node) {
            return !(this.x+this.w < node.x || this.y+this.h < node.y || this.x > node.x+node.w || this.y > node.y+node.h);
        }

        getRow() {
            return this.row;
        }
        getCol() {
            return this.col;
        }
        getDeleteSize( time) {
            if (time < 0) time = 0;
            let size;
    
            
                if (time >= 600) size = 0;
                else {
                    let diff = this.width / 600;
                    size = this.width - diff * time;
                }    
            
    
            return size;
        }
    }

    SPIN.create_node = (id, x, y, w, h, color, row, col, visited) => {
        return new Node(id, x, y, w, h, color, row, col, visited);
    };

    SPIN.draw_text = (x, y, clr, _text) => {
        text(x, y, clr, _text);
    };



    SPIN.updateNode = (node) => {
        
        let counter = 0;
        console.log(node);
        var img = ctx.createImageData(40, 40);
        //for (var i = img.data.length; --i >= 0; )
            //img.data[i] = 0;
        //ctx.putImageData(img, node.x, node.y);
        
        
        if(counter < 100) {
            requestAnimationFrame(SPIN.updateNode);
        }
        
        
        counter++;
    }

    SPIN.delete = (tile, coords, callback) =>{
        let start = performance.now();
        let stop = 1000;

        let step = timestamp => {
            let progress = timestamp - start;
            ctx.clearRect(coords.x, coords.y, coords.w, coords.h);

            let size = coords.getDeleteSize(progress);
            coords.draw();
            if(coords.w==0 && coords.h==0) {
                return;
            }
            coords.w-=1;
            coords.h-=1;
            let time = new Date();
            
            if (progress < stop) {
                requestAnimationFrame(step);
            } else {
                //callback();
            }
        }

        requestAnimationFrame(step); 
    }

    SPIN.update = (node) => {
        ctx.clearRect(0, 0, width, height);
       
        for(let i = 0; i<matrix.length; i++) {
            for(let j = 0;j<matrix[i].length; j++ ){
                matrix[i][j]._update();
                matrix[i][j].draw();
                if(node.w == 0
                 &&   node.h == 0){
                    
                 }
                 node.w -= 1;
                 node.h -= 1; 
            }
        }   

        if(timer < 1000) {
            requestAnimationFrame(SPIN.update);
        }
        
        
        timer++;
    };
  

    SPIN.key = (key) => {
        return down_keys[key];
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
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
           
        for (let i = nodes.length-1; i >= 0; i--) {
           // matrix[i][i]._update();
            //nodes[i]._update();
            //nodes[i].draw();
            
        }
        
        if (user_draw)
            user_draw(SPIN);
        if(timer < 1000) {
           
            requestAnimationFrame(SPIN.update);
        }
        
        
        timer++;
    };
  

    SPIN.key = (key) => {
        return down_keys[key];
    };

    SPIN.clear_timer = () => {
        timer = 0;
    };

    SPIN.get_timer = () => {
        return timer;
    };

    SPIN.set_draw = (f) => {
        user_draw = f;
    };

    SPIN.start = (W, H) => {
        
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        width = W;
        height = H;
        cnv.width = width;
        cnv.height = height;
        ctx.textBaseline = 'top';
        ctx.font = '20px Troika';

        window.addEventListener('keydown', (e) => {
            down_keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            delete down_keys[e.code];
        });

        SPIN.update();
    };
    SPIN.next = () =>{
        let progressBar = document.getElementById("progressBar");
        let movesLeft = document.getElementById('movesLeft');
        progressBar.max = 20;
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
                            if (countClicksToLose === 0) {
                                alert('Game is over');
                            }
                            movesLeft.textContent = countClicksToLose;
                                
                                function ssss(node, m) {
                                    let result = [];
                                    let tmp = node;
                                    for(let i =0; i<m.length; i++){
                                        for(let j =0; j<m[i].length-1; j++){
                                            
                                                if ((Math.abs(node.x-m[i][j+1].x)==40 || Math.abs(node.y-m[i][j+1].y)==40)  &&(node.row==m[i][j+1].row || node.col ==m[i][j+1].col) && node.color == m[i][j+1].color) {
                                                    result.push(node, m[i][j+1]);
                                                    node.visited = true;
                                                    node = m[i][j+1];
                                                    
                                                    //i=0;
                                                }
                                                if ((Math.abs(node.x-m[j+1][i].x)==40 || Math.abs(node.y -m[j+1][i].y)==40)&&(node.row==m[j+1][i].row || node.col ==m[j+1][i].col) && node.color == m[j+1][i].color) {
                                                    result.push(node, m[j+1][i]);
                                                    node.visited = true;
                                                    node = m[j+1][i];
                                                
                                                }
                                            
                                            
                                        }
                                    }
                                    //node = tmp;
                                    for(let i =0; i<m.length; i++){
                                        for(let j =1; j<m[i].length; j++){
                                            
                                                if ((Math.abs(node.x-m[j-1][i].x)==40 || Math.abs(node.y -m[j-1][i].y)==40)&&(node.row==m[j-1][i].row || node.col ==m[j-1][i].col) && node.color == m[j-1][i].color) {
                                                    result.push(node, m[j-1][i]);
                                                    
                                                    node = m[j-1][i];
                                                
                                                }
                                                if ((Math.abs(node.x-m[i][j-1].x)==40 || Math.abs(node.y -m[i][j-1].y)==40)&&(node.row==m[i][j-1].row || node.col ==m[i][j-1].col) && node.color == m[i][j-1].color) {
                                                    result.push(node, m[i][j-1]);
                                                    
                                                    node = m[i][j-1];
                                                
                                                }
                                            
                                        }
                                    }
                                    /*for(let i =0; i<m.length; i++){
                                        for(let j =1; j<m[i].length; j++){
                                            
                                            if ((Math.abs(node.x-m[i][j-1].x)==40 || Math.abs(node.y -m[i][j-1].y)==40)&&(node.row==m[i][j-1].row || node.col ==m[i][j-1].col) && node.color == m[i][j-1].color) {
                                                result.push(node, m[i][j-1]);
                                                node = m[i][j-1];
                                               
                                            }
                                        }
                                    } */
                                    console.log(result);
                                    return result.filter((value, index, self) => {
                                        return self.indexOf(value) == index;
                                    });
                                }
                                
                                console.log(ssss(element,matrix)); 
                                
                                
                               //var img = ctx.createImageData(40, 40);
                               
                                //ctx.putImageData(img, element.x, element.y);
                                
                                
                                let tmp = ssss(element, matrix);
                                let tt = tmp.length;
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
                                                var p = 0;
                                                //delete matrix[i][j];
                                                //SPIN.update(matrix[i][j]);
                                                
                                                //ctx.clearRect(matrix[i][j].x, matrix[i][j].y, 40, 40);
                                                
                                                
                                               //animate();
                                               SPIN.delete(matrix[i][j],matrix[i][j],console.log("1111"));
                                               //obg.animate2();    
                                                matrix[i][j] = (SPIN.create_node(matrix[i][j].id, matrix[i][j].x, matrix[i][j].y, 40, 40, color, matrix[i][j].row, matrix[i][j].col, false));
                                                //nodes[element.id-i] = (SPIN.create_node(element.id-i, nodes[element.id-i].x, nodes[element.id-i].y, 40, 40, color, nodes[element.id-i].row, nodes[element.id-i].col));
                                                //SPIN.update();
                                                 
                                                ctx.drawImage(tmpImg, matrix[i][j].x, matrix[i][j].y, 40, 40);
                                                //ctx.drawImage(tmpImg, tmp[k].x, tmp[k].y, 40, 40);
                                                
                                                
                                                //if(p < 1000)
                                                  //  requestAnimationFrame(() => matrix[i][j].w=0);
                                                //p++;
                                                
                                            }
                                            //ctx.drawImage(tmpImg, matrix[i][j-1].x, matrix[i][j-1].y, 40, 40);
                                        }
                                    } 
                                } 
                                
                                
                                
                               
                        
                    }
                })
            });
            if (score >= 20) {
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
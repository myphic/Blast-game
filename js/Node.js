import {Blast} from './Blast.js'

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
        let b = new Blast();
        b.rect(this.x, this.y, this.w, this.h, this.color, this.row, this.col, this.visited);
    }
}
export {Node}
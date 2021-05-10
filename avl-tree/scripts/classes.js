class Circle {
    static radius = 0;

    constructor() {
        this.isDone = false;
    }

    shiftCoordinates() {
        this.startX = this.endX;
        this.startY = this.endY;
    }

    setEndCoordinates(endX, endY) { 
        this.curX = this.startX;
        this.curY = this.startY;
        
        this.endX = endX;
        this.endY = endY;
        
        this.xDiff = (this.endX - this.startX) / 60;
        this.yDiff = (this.endY - this.startY) / 60;
        
        this.isDone = false;
    }

    draw() {
        if(!this.isDone) {
            let nowDone = true;
            if(Math.abs(this.curX - this.endX) > Math.abs(this.xDiff)) {
                this.curX += this.xDiff;
                nowDone = false;
            }
            if(Math.abs(this.curY - this.endY) > Math.abs(this.yDiff)) {
                this.curY += this.yDiff;
                nowDone = false;
            }
            
            if(nowDone) {
                this.isDone = true;
            }
        }
        
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.curX, this.curY, Circle.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(this.key, this.curX, this.curY, Circle.radius * 2 - 10);
    }
}

class Node extends Circle {
    constructor(key) {
        super();
        this.key = key;
        this.childNodes = new Map();
    }
    
    getHeight() {
        return 1 + Math.max(Node.getHeightOfChild(this.childNodes.get(-1)), Node.getHeightOfChild(this.childNodes.get(1)));
    }
    
    hasChildren() {
        return this.childNodes.get(-1) !== undefined || this.childNodes.get(1) !== undefined;
    }
    
    replaceChild(oldChild, newChild) {
        if(this.childNodes.get(-1) === oldChild) {
            this.childNodes.set(-1, newChild);
        }
        else {
            this.childNodes.set(1, newChild);
        }
    }
    
    static getHeightOfChild(child) {
        return child === undefined ? 0 : child.getHeight();
    }
}

class AddChange {
    constructor(key) {
        this.key = key;
    }
    
    performChange() {
        let addedNode = new Node(this.key);
        addNode(addedNode);

        if(addedNode.parent === undefined) {
            addedNode.startX = canvas.width / 2;
            addedNode.startY = canvas.height / 2;
        }
        else {
            addedNode.startX = addedNode.parent.startX;
            addedNode.startY = addedNode.parent.startY;
        }
    }
    
    toString() {
        return "Insert: " + this.key;
    }
}

class RemoveChange {
    constructor(key) {
        this.key = key;
    }
    
    performChange() {
        removeNode(this.key);
    }
    
    toString() {
        return "Delete: " + this.key;
    }
}

class RebalanceChange {
    performChange() {
        rebalance(rootNode);
    }
    
    toString() {
        return "Balance";
    }
}

class DuplicateError extends Error {
    constructor(...params) {
        super(params);
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicateError);
        }
    }
}

class KeyNotFoundError extends Error {
    constructor(...params) {
        super(params);
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, KeyNotFoundError);
        }
    }
}

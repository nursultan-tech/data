let canvas;
let ctx;
let mouseX = 0;
let mouseY = 0;
let heightDiff;
let spaces;

function initRenderer() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
    ctx.strokeStyle = "blue";
    ctx.font = "20px Arial";
}

function drawConnection(c1, c2) {
    if(dist(c1.curX, c1.curY, c2.curX, c2.curY) <= 2 * Circle.radius) {
        return;
    }
    
    ctx.beginPath();
    ctx.moveTo(c1.curX, c1.curY);
    ctx.lineTo(c2.curX, c2.curY);
    ctx.closePath();
    ctx.stroke();
}

function dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt((dx * dx) + (dy * dy));
}

function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    if(currentChange !== undefined) {
        ctx.textAlign = "left";
        ctx.fillText(currentChange.toString(), 20, 50);
    }
    ctx.fillStyle = "white";
    
    if(rootNode === undefined) {
        return;
    }
    
    drawConnections(rootNode);
    drawNodes(rootNode);
}

function drawConnections(node) {
    node.childNodes.forEach(child => {
        if(child !== undefined) {
            drawConnection(node, child)
            drawConnections(child);
        }
    });
}

function drawNodes(node) {
    node.draw();
    node.childNodes.forEach(child => {
        if(child !== undefined) {
            drawNodes(child);
        }
    });
}

function setCoordinates() {
    if(rootNode === undefined) {
        return;
    }
    
    let treeHeight = rootNode.getHeight();

    if(treeHeight == 1) {
        Circle.radius = canvas.height / 4;
        rootNode.setEndCoordinates(canvas.width / 2, canvas.height / 2);
        return;
    }

    let leafCount = Math.pow(2, treeHeight - 1);
    let diameter = Math.min(canvas.height, canvas.width) / (leafCount * 2);
    let radius = diameter / 2;
    Circle.radius = radius;
    heightDiff = (canvas.height - 2 * diameter) / (treeHeight - 1);
    spaces = [];
    
    spaces[treeHeight - 1] = canvas.width / (leafCount * 2);
    for(let i = treeHeight - 2; i >= 0; i--) {
        spaces[i] = spaces[i + 1] * 2;
    }
    
    rootNode.setEndCoordinates(canvas.width / 2, diameter);
    
    setCoordinatesRec(rootNode, 1);
}

function setCoordinatesRec(node, curDepth) {
    node.childNodes.forEach((child, index) => {
        if(child !== undefined) {
            let endX = node.endX + spaces[curDepth] * index;
            let endY = node.endY + heightDiff;
            child.setEndCoordinates(endX, endY);
            setCoordinatesRec(child, curDepth + 1);
        }
    });
}

function isDone(node) {
    if(node === undefined) {
        return true;
    }
    return node.isDone && isDone(node.childNodes.get(-1)) && isDone(node.childNodes.get(1));
}
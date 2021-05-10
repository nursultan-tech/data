let animationQueue = [];
let animationDone = true;
let currentChange;

function initAnimationHandler() {
    setInterval(update, 2000 / 60);
}

function update() {
    draw();
    
    if(animationDone === true) {
        return;
    }
    
    if(isDone(rootNode)) {
        currentChange = undefined;
        if(animationQueue.length === 0) {
            animationDone = true;
            return;
        }
        
        try {
            startNextAnimation();
        }
        catch(ex) {
            alert(ex);
        }
    }
}

function startNextAnimation() {
    currentChange = animationQueue.shift();
    
    shiftCoordinates(rootNode);
    
    currentChange.performChange();
    
    setCoordinates();
}

function pushAction(change) {
    animationQueue.push(change);
    if(animationDone) {
        animationDone = false;
        try {
            startNextAnimation();
        }
        catch(ex) {
            alert(ex);
        }
    }
}

function isDone(node) {
    if(node === undefined) {
        return true;
    }
    return node.isDone && isDone(node.childNodes.get(-1)) && isDone(node.childNodes.get(1));
}

function shiftCoordinates(node) {
    if(node !== undefined) {
        node.shiftCoordinates();
        shiftCoordinates(node.childNodes.get(-1));
        shiftCoordinates(node.childNodes.get(1));
    }
}
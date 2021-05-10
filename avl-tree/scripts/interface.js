let txt_key;
let btn_add;
let btn_remove;
let div_error;

window.onload = function() {
    initRenderer();
    initAnimationHandler();
    
    txt_key = document.getElementById("txt_key");
    btn_add = document.getElementById("btn_add");
    btn_remove = document.getElementById("btn_remove");
    div_error = document.getElementById("div_error");
    
    btn_add.addEventListener("click", onAdd);
    btn_remove.addEventListener("click", onRemove);
}

function onAdd() {
    let key = txt_key.value;
    
    if(isEmpty(key)) {
        alert("The key cannot be empty");
        return;
    }
    
    pushAction(new AddChange(key));
    
    txt_key.value = "";
}

function onRemove() {
    let key = txt_key.value;
    
    if(isEmpty(key)) {
        alert("The key cannot be empty");
        return;
    }
    
    pushAction(new RemoveChange(key));
    
    txt_key.value = "";
}

function isEmpty(str) {
    return (str === undefined || str.length === 0 || !str.trim());
};

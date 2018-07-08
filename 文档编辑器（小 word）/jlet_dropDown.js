function $dropDown() {

}

$dropDown.create = function $dropDown$create(elemtTrigger, elemtDrop) {
    if (elemtTrigger.id == null || elemtTrigger.id == "")
        throw "elemtTrigger 必须指定 id。";

    elemtDrop.style.display = "none";
    elemtDrop.addEventListener("mouseover", new Function("document.getElementById('" + elemtTrigger.id + "').isMouseOver = true;"));
    elemtDrop.addEventListener("mouseout", new Function("document.getElementById('" + elemtTrigger.id + "').isMouseOver = false;"));

    elemtTrigger.elemtDrop = elemtDrop;
    elemtTrigger.addEventListener("mousedown", new Function("$dropDown.open( document.getElementById('" + elemtTrigger.id + "') );"));
    elemtTrigger.addEventListener("mouseover", new Function("this.isMouseOver = true;"));
    elemtTrigger.addEventListener("mouseout", new Function("this.isMouseOver = false;"));

    document.documentElement.addEventListener("mousedown", new Function("$dropDown.documentElement_mousedown( document.getElementById('" + elemtTrigger.id + "') );"));
    //window.addEventListener("mousedown", new Function("$dropDown.documentElement_mousedown( document.getElementById('" + elemtTrigger.id + "') );"));
    //elemtDrop.addEventListener("mousedown", new Function("$writeMsg(4444444444);"));

}

$dropDown.open = function $dropDown$open(elemtTrigger) {
    //$writeMsg("open");
    elemtTrigger.elemtDrop.style.display = "";
}

$dropDown.close = function $dropDown$close(elemtTrigger) {
    elemtTrigger.elemtDrop.style.display = "none";
}

$dropDown.documentElement_mousedown = function $dropDown$documentElement_mousedown(elemtTrigger) {
    //$writeMsg("doc mousedown " + elemtTrigger.isMouseOver);
    if (elemtTrigger.isMouseOver != true)
        $dropDown.close(elemtTrigger);
}
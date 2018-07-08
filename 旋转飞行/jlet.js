

function $dialog() {

}

$dialog.isInit = false;
$dialog.txtFocusForNoSelection = null;
$dialog.draggingDiv = null;
$dialog.offX = 0;
$dialog.offY = 0;
$dialog.defaultZIndex = 50;
$dialog.draggingZIndex = 100;

//$dialog.dialogDivs = [];

$dialog.draggingDiv_mousedown =
    function $dialog$draggingDiv_mousedown(div) {

        var e = window.event;

        $dialog.txtFocusForNoSelection.focus();
        div.focus();
        
        if ($dialog.draggingDiv != null)
            $dialog.draggingDiv.style.zIndex = $dialog.defaultZIndex;

        div.style.zIndex = $dialog.draggingZIndex;
        
        
        $dialog.draggingDiv = div;
        //$writeMsg(div.offsetTop);
        $dialog.offX = e.clientX - div.offsetLeft;
        $dialog.offY = e.clientY - div.offsetTop;

        document.documentElement.style.cursor = "default";

        //div.focus();

        window.addEventListener("mouseup", $dialog.window_mouseup);
        window.addEventListener("mousemove", $dialog.window_mousemove);// = new Function("body_mousemove(event);");

    }

$dialog.window_mouseup = 
    function $dialog$window_mouseup() {

        $dialog.txtFocusForNoSelection.focus();
        $dialog.draggingDiv.focus();
    
        document.documentElement.style.cursor = "";

        window.removeEventListener("mouseup", $dialog.window_mouseup);
        window.removeEventListener("mousemove", $dialog.window_mousemove);// = new Function("body_mousemove(event);");
    }

$dialog.window_mousemove = 
    function $dialog$window_mousemove() {
    
        if ( $dialog.draggingDiv == null )
            return;

        $dialog.txtFocusForNoSelection.focus();
        $dialog.draggingDiv.focus();

        var e = window.event;
        var div = $dialog.draggingDiv;

        div.style.position = "absolute";
        div.style.top = (e.clientY - $dialog.offY) + "px";
        div.style.left = (e.clientX - $dialog.offX) + "px";
    
    }


function $writeMsg(msg) {
    
    document.getElementById("txaMsg").value += msg + "\r\n";
}


$dialog.createDialog =
    function $dialog$createDialog(elemt, left, top) {

        if (left == undefined || left == null)
            left = 200;
        if (top == undefined || top == null)
            top = 100;

        if ( $dialog.isInit == false )
        {
            var txtFocus = document.createElement("input");
            txtFocus.type = "text";
            txtFocus.style.width = "0px";
            txtFocus.style.height = "0px";
            txtFocus.style.position = "absolute";
            txtFocus.style.top = "-10px";
            txtFocus.style.left = "-10px";
            
            document.documentElement.appendChild(txtFocus);
            
            $dialog.txtFocusForNoSelection = txtFocus;

            $dialog.isInit = true;
        }
        
        var div = document.createElement("div");

        div.style.position = "absolute";
        div.style.top = top + "px";
        div.style.left = left + "px";
        //div.attributes["onmousedown"] = "return false;";
        div.setAttribute("onmousedown", "return false;");
        div.addEventListener("mousedown", new Function("$dialog.draggingDiv_mousedown( this );return false;"));
        
        document.documentElement.appendChild(div);

        div.appendChild(elemt);
        

    }


function $animation() {

}

$animation.create =
    function $animation$create(action, interval) {
        var ani = new $animation();
        ani.action = action;
        ani.interval = interval;
        ani.inv = null;

        return ani;
    }

$animation.start =
    function $animation$start(ani) {

        if (ani.inv != null)
            $animation.stop(ani);

        ani.stepCount = 0;
        ani.inv = window.setInterval(ani.action, ani.interval, ani);
    }

$animation.stop =
    function $animation$stop(ani) {
        window.clearInterval(ani.inv);
        ani.inv = null;
    }
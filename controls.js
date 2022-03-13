var fs_state=false;
var ar_state = false;





function bt_toggle_live(){

    if (document.getElementById("vlive").style.display === "none"){
    document.getElementById("vlive").style.display = "block";
    //document.getElementById("logos").style.display = "block";

    }
    else   
    {
    document.getElementById("vlive").style.display = "none";
    //document.getElementById("logos").style.display = "none";

    }


}

function bt_toggle_AR(){

    ar_state = !ar_state;


}

function bt_toggle_CFG(){

var configbox = document.getElementById("configbox");

}


function bt_toggle_FS(){

    var maindoc= document.documentElement;

    if(fs_state){
        
            document.exitFullscreen();
            fs_state=false;
        

    }else{
      
            maindoc.requestFullscreen();
            fs_state=true;
      


    }



}
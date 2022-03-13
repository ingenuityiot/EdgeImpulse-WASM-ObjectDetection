var fs_state=false;
var ar_state = false;
var run_state = false;
var stats_state =false;



function bt_toggle_live(){

    if (!run_state){
    document.getElementById("vlive").style.display = "block";
    document.getElementById("camhud").innerText="Camera Mode: ON";
    ar_state= true;
    run_state=true;


    }
    else if(run_state)   
    {
    ar_state = false;
    run_state = false;
    document.getElementById("vlive").style.display = "none";
    //document.getElementById("logos").style.display = "none";
    document.getElementById("camhud").innerText="Camera Mode: OFF";


    }


}

function bt_toggle_AR(){

    if(!stats_state){
        document.getElementById("stats").style.display="block";
        stats_state=true;

    }else if (stats_state){
        stats_state =false;
        document.getElementById("stats").style.display= "none";


    }



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
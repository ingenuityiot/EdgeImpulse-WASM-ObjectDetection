/* window.onload = ()=> {

    if('serviceWorker' in navigator ){
    
        navigator.serviceWorker.register('/sw.js');
    }
    
    
    }

*/
// Main Application - This is the starting point 


var classifier = new EdgeImpulseClassifier();

(async ()=>{

await classifier.init();


})();


if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){

   openCamera();
   setTimeout(grabframe, 4000);//startup delay to allow for Edge Impulse WASM module to load as file size can be over 10Meg and slower connections may struggle
     

}else{

    alert("Browser not supported");
}


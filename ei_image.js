
const screenwidth  = window.screen.width;
const screenheight = window.screen.height;
const feature_pix = 160;
const objdet_mode = 1; // 0: Normal object detection 1: FOMO


var settingsd ;
//alert("width: " +screenwidth + " height: " + screenheight);

var objbox = new BoundingBox();
var objoverlay = new ObjectOverlay();

const framebuffer = document.getElementById('framebuffer');
const backbuffer = document.getElementById('backbuffer');

const frame_ar = document.getElementById('overlay');
backbuffer.width=1280;
backbuffer.height=720;
const vidsettings = {
    video: {
        facingMode: 'environment',
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      }
    }
  }


const framebuf_ctx = framebuffer.getContext('2d');
const backbuf_ctx = backbuffer.getContext('2d');

const ar_ctx = frame_ar.getContext('2d');

function BoundingBox(){}
function ObjectOverlay(){}


ObjectOverlay.prototype.drawAnchor =(gtx, ei_results,ei_feature_sz, mode) => {
  gtx.clearRect(0,0, backbuffer.width, backbuffer.height); // assuming gtx is backbuffer clear between renderings 

  var anchors = [];
  let scaling_factor = framebuffer.height/ei_feature_sz; // Edge Impulse Features 
  let scaled_width  = Math.trunc(framebuffer.width/scaling_factor) ;
  let scaled_height = framebuffer.height/scaling_factor;
  let crop_factor = (scaled_width-feature_pix)/2; // Dependant on feature size

  // now create coordintes for results 




if (mode == 0){


}else if (mode ==1){
  for (var i =0; i<ei_results.results.length;i++){
    offset_origin_x= crop_factor * scaling_factor;
    offset_origin_y= 0;

    scaled_x = ((ei_results.results[i].x *scaling_factor) + offset_origin_x) + (ei_results.results[i].height * scaling_factor/2) ;
    scaled_y= ((ei_results.results[i].y * scaling_factor)+offset_origin_y) + (ei_results.results[i].width * scaling_factor/2);
   
    anchors.push({"label": ei_results.results[i].label, "value": ei_results.results[i].value, "x":scaled_x, "y": scaled_y });// can be pushed to backend
    //draw now 
    anchors.forEach(function(obj){
      gtx.beginPath();

      gtx.arc(obj.x,obj.y, 10, 0, 2 * Math.PI);
      gtx.stroke();


    });
  }

  console.log("Anchors");
  //}



}



  
}

BoundingBox.prototype.drawbox = (g_tx,lbl,x,y,w,h)=> {
      
    g_tx.lineWidth=4;
    g_tx.strokeStyle='lightgreen';
    g_tx.beginPath();

    
let scaling_factor = framebuffer.height/feature_pix; // Edge Impulse default feature

let scaled_width  = Math.trunc(framebuffer.width/scaling_factor) ;
let scaled_height = framebuffer.height/scaling_factor;
let crop_factor = (scaled_width-feature_pix)/2; // Edge Impulse default feature

    offset_origin_x= crop_factor * scaling_factor;
    offset_origin_y= 0;

    scaled_x = (x *scaling_factor) + offset_origin_x;
    scaled_y= (y * scaling_factor)+offset_origin_y;
    scaled_h= h* scaling_factor;
    scaled_w = w * scaling_factor;

    g_tx.strokeRect(scaled_x, scaled_y, scaled_w, scaled_h);
 
}





// Camera
const openCamera = async () => {

    vidhtml = document.querySelector('video');
    
  const videostream = await  navigator.mediaDevices.getUserMedia(vidsettings);

    vidhtml.srcObject= videostream;
    vidhtml.play();

    settingsd= videostream.getVideoTracks()[0].getSettings();
    framebuffer.width =settingsd.width;
    framebuffer.height=settingsd.height;
    frame_ar.height = settingsd.height;
    frame_ar.width = settingsd.width;



    //frame_ar.width=settingsd.width;
       //frame_ar.height=settingsd.height;



}



// CV functions to preprocess for Edge Impulse Object Detection WASM 

function scaleimage_to_ei_featurebuf(canvas_src, bufctx_dst){
  // target image size is 320x320 per default in Edge Impulse
if (window.innerheight> window.innerWidth){

  let scaling_factor = canvas_src.width/feature_pix;
  let scaled_height  = Math.trunc(canvas_src.height/scaling_factor) ;
let scaled_width = canvas_src.width/scaling_factor;
let crop_factor = (scaled_height-feature_pix)/2;
  

}else{
let scaling_factor = canvas_src.height/feature_pix;

let scaled_width  = Math.trunc(canvas_src.width/scaling_factor) ;
let scaled_height = canvas_src.height/scaling_factor;
let crop_factor = (scaled_width-feature_pix)/2;

}

//renderbuf_gtx.drawImage(framebuffer,0,0,scaled_width,scaled_height);
bufctx_dst.drawImage(canvas_src, ((canvas_src.width-canvas_src.height)/2),0,canvas_src.height,canvas_src.height,0,0,feature_pix,feature_pix);//who needs OpenCV when you have Canvas API!!

}

function get_ei_img_signalt(src_buffer, buf_ctx_dst){
  scaleimage_to_ei_featurebuf(src_buffer,buf_ctx_dst);
  const features = [];
  var k=0;
  var imgdata = buf_ctx_dst.getImageData(0,0,feature_pix,feature_pix);
  var method=0 // Grayscale conversion method 


  if (objdet_mode ==0){



    for (var i=0; i<imgdata.data.length; i+=4){ // Object Detection uses RRGGBB requiring customized convertor
        var feature=0x00000;

        for(j=0; j<3;j++){

          let f = i+j;
        
          feature |=   (((imgdata.data[f] << 16)) >> (8*j));
        
        //feature &= (imgdata.data[(i+j)] << (8*j));

        }
        features[k++] = feature;

    }

  }else if(objdet_mode ==1){  // Constrained Object Detection uses Grayscale 8bpp BGR888

    // Average method
    
      
      for (var i=0;i<imgdata.data.length;i+=4){
      
        if (method ==0) 
          var gray_pix = ((imgdata.data[i] + imgdata.data[i+1] + imgdata.data[i+2]) /3);
        else if(method ==1)
          var gray_pix = (((0.3 *imgdata.data[i]) + (0.59*imgdata.data[i+1]) + (0.11*imgdata.data[i+2])) /3);

        features[k++] = (gray_pix )| (gray_pix<<8) | (gray_pix<<16);

          

    }

  }

  return features;



}


function grabframe(){

  setInterval(()=>{
   

      framebuf_ctx.drawImage(this.vidhtml,0,0, framebuffer.width, framebuffer.height); // grab framebuffer

      if (ar_state){
        console.log("Inference Started");
        var inference_st = performance.now()

       results = classifier.classify(get_ei_img_signalt(framebuffer,backbuf_ctx));
        var inference_end = performance.now();

        var inference_time = inference_end - inference_st;
        console.log('Inference Time: ',inference_time);
        if(results.results.length >0){
          objoverlay.drawAnchor(ar_ctx,results,feature_pix, 1);
        }

      }

    
    
    },50);


}     
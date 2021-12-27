let video = document.querySelector("#videoElement");
let x = document.getElementById("demo");

function startVideo() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(function (stream) {
      video.srcObject = stream;
    }).catch(function (err0r) {
      x.innerHTML = "Something went wrong!";
    });
  }
}

// library blazeface

let model;
// declare a canvas variable and get its context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  console.log(prediction);

  // draw the video first
  ctx.drawImage(video, 0, 0, 600, 400);

  prediction.forEach((pred) => {
    
    // draw the rectangle enclosing the face
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "blue";
    // the last two arguments are width and height
    // since blazeface returned only the coordinates,
    // we can find the width and height by subtracting them.
    ctx.rect(
      pred.topLeft[0],
      pred.topLeft[1],
      pred.bottomRight[0] - pred.topLeft[0],
      pred.bottomRight[1] - pred.topLeft[1]
    );
    ctx.stroke();
    
    // drawing small rectangles for the face landmarks
    ctx.fillStyle = "red";
    pred.landmarks.forEach((landmark) => {
      ctx.fillRect(landmark[0], landmark[1], 5, 5);
    });
    
  });
};

video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // call detect faces every 100 milliseconds or 10 times every second
  setInterval(detectFaces, 100);
});
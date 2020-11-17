const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('audio');
let isRedEffect = false, isRgbSplit = false;

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error('OH NO!!', err);
        });
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 50; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i -150] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);       
        
        // take the pixels out of the canvas
        let pixels = ctx.getImageData(0, 0, width, height);

        // mess with them
        if (isRedEffect) {
          pixels = redEffect(pixels);
        }

        if (isRgbSplit) {
          pixels = rgbSplit(pixels);
          ctx.globalAlpha = 0.5;
        }

        pixels = greenScreen(pixels);

        // put them back on the image 
        ctx.putImageData(pixels, 0, 0);
        
    }, 450);
}

function takePhoto() {
    // played the sound 
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas 
    const data = canvas.toDataURL('image/jpeg'); 
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man!" />`;
    strip.insertBefore(link, strip.firstChild);
    window.scrollTo(0, document.body.scrollHeight);
    document.querySelector('.strip').style.border = "2px solid #fff";
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
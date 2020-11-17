const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('audio');

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
    for (let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
    }
    return pixels;
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // take the pixels out of the canvas 
    let pixels = ctx.getImageData(0, 0, width, height);

    // mess with them 
    pixels = redEffect(pixels);

    // put them back on the image 
    ctx.putImageData(pixels, 0, 0);
    
    return setInterval(() => {
       ctx.drawImage(video, 0, 0, width, height);
    }, 450);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas 
    const data = canvas.toDataURL('image/jpeg'); 
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man!" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
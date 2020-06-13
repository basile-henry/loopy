const player = document.getElementById('audio');
const chunks = [];

function handleKeyPress(event, mediaRecorder) {
  if (mediaRecorder.state == "recording" && event.charCode == 32) {
    console.log("recording and pressing space");
    // mediaRecorder.requestData();

    mediaRecorder.stop()
    mediaRecorder.start()
  }
  else if (event.charCode == 32) {
    console.log("start recording");
    mediaRecorder.start()
  }
}



async function main() {
  let mediaRecorder = await navigator
        .mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(stream => {
          console.log("streaming");
          return new MediaRecorder(stream)
       });
  
  mediaRecorder.ondataavailable = event => { 
    // chunks.push(event.data);
    // console.log(chunks);

    // player.src = window.URL.createObjectURL(chunks[chunks.length - 1]);


    console.log("Play");
    console.log(event.data);

    player.srcObject = null;
    player.src = window.URL.createObjectURL(event.data);
    player.play();

    console.log(player.srcObject);
  };

  document.addEventListener("keypress", event => handleKeyPress(event, mediaRecorder));
  
  //mediaRecorder.ondataavailable = handle
}

main()
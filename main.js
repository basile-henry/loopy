const loopStates = {
  INIT: 'init',
  FIRST_RECORDING: 'first_recording',
  IDLE: 'idle',
  ARMED: 'armed',
  SUBSEQUENT_RECORDING: 'subsequent_recording',
}

function handleKeyPress(event, state) {
  // Space bar pressed
  if (event.charCode == 32) {
    console.log("space bad pressed");

    switch(state.loopState) {
      case loopStates.INIT:
        state.mediaRecorder.start();
        state.loopState = loopStates.FIRST_RECORDING;
        break;

      case loopStates.FIRST_RECORDING:
        state.loopState = loopStates.IDLE;
        state.mediaRecorder.stop();
        break;

      case loopStates.IDLE:
        state.loopState = loopStates.ARMED;
        break;

      case loopStates.ARMED:
        // disarm
        state.loopState = loopStates.IDLE;
        break;

      case loopStates.SUBSEQUENT_RECORDING:
        // Stop early
        state.loopState = loopStates.IDLE;
        state.mediaRecorder.stop();
        // TODO request data?
        break;
    }

    console.log(state.loopState);
  }
}

function startAudio(state) {
  state.tracks.forEach((track, _) => {
    let audioNode = new AudioBufferSourceNode(state.audioCtx)
    audioNode.buffer = track;
    audioNode.connect(audioCtx.destination);
  });
}

function handleDataAvailable(event, state) {
    console.log("Play");
    console.log(event.data);

    state.tracks.push(event.data);

    // Start playing audio
    if (state.tracks.length == 1) {
      startAudio(state);
    }
}

async function main() {
  // const player = document.getElementById('audio');
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();

  let mediaRecorder = await navigator
        .mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(stream => {
          console.log("streaming");
          return new MediaRecorder(stream)
       });

  let state = {
    loopState: loopStates.INIT,
    duration: null,
    tracks: [],
    mediaRecorder: mediaRecorder,
    audioCtx: audioCtx,
  }

  mediaRecorder.ondataavailable = event => handleDataAvailable(event, state);
  document.addEventListener("keypress", event => handleKeyPress(event, mediaRecorder));
}

main()

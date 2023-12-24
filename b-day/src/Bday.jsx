import React, { useState, useEffect, useRef } from "react";
import GreetingCard from "./GreetingCard";
import "./Bday.css";

const BirthdayCard = () => {
  let mediaRecorder = null;
  const chunks = [];
  const microphone = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      microphone.current = new MediaStream();
      stream.getAudioTracks().forEach((track) => {
        microphone.current.addTrack(track);
      });

      mediaRecorder = new MediaRecorder(microphone.current);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunks.length > 0) {
          const recordedBlob = new Blob(chunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(recordedBlob);

          analyzeAudio(audioUrl);
        }
      };

      mediaRecorder.start();

      // Stop recording after 3 seconds
      setTimeout(() => {
        console.log("I am stopped");
        mediaRecorder.stop();
      }, 2000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const [logs, setLogs] = useState([]);

  const analyzeAudio = (audioUrl) => {
    const audioElement = new Audio(audioUrl);
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkForSound = () => {
      analyser.getByteFrequencyData(dataArray);

      const averageVolume =
        dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;

      // You can adjust this threshold based on testing
      const soundThreshold = 10;

      if (averageVolume > soundThreshold) {
        console.log("There was sound");
        setLogs((prevLogs) => [...prevLogs, "sound"]);
      } else {
        console.log("There was silence");
      }

      // Continue checking for sound until the audio ends
      if (!audioElement.ended) {
        requestAnimationFrame(checkForSound);
      }
    };

    // Start playing the audio
    audioElement.play();

    // Stop the audio context after 3 seconds
    setTimeout(() => {
      console.log("I am stopped");
      audioContext.close();
    }, 3000);

    // Start the analysis
    checkForSound();
  };

  useEffect(() => {
    console.log(logs);
  }, [logs]);

  return (
    <div className="main">
      <GreetingCard hasCandles={!logs.includes("sound")} />
      <button
        className="wish-btn"
        onClick={() => {
          console.log("Blow out the candles button clicked.");
          startRecording();
        }}
      >
        Blow out the candles!
      </button>
    </div>
  );
};

export default BirthdayCard;

import React, { useState } from "react";
import "./styles.scss";
import audios from "./audios";

export default function App() {
  const triggerCodes = "QWEASDZXC".split("").map((char) => char.charCodeAt(0));

  const triggerSound = (charCode) => {
    let char = String.fromCharCode(charCode).toUpperCase();
    let sound = document.querySelector(`#${char}`);
    sound.play();
    setDisplayText(char);
  };

  document.addEventListener("keypress", (e) => triggerSound(e.charCode));

  const [displayText, setDisplayText] = useState("");

  return (
    <div id="drum-machine" className="App">
      <div id="display">{displayText}</div>
      <div className="drum-pad-container">
        {triggerCodes.map((charCode, i) => (
          <div
            onClick={() => triggerSound(charCode)}
            key={i}
            id={"pad" + i}
            className="drum-pad"
          >
            {String.fromCharCode(charCode)}
            <audio
              id={String.fromCharCode(charCode)}
              className="clip"
              src={audios[i]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

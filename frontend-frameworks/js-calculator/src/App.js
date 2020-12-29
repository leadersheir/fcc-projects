import React, { useState } from "react";
import "./styles.scss";

// import third-party modules
const conv = require("number-to-words");
const conv2 = require("words-to-numbers");
const math = require("mathjs");

export default function App() {
  // declare a list of numbers and convert to words
  const nums = Array.from("7894561230").map((num) => conv.toWords(num));

  // arithmatic operation enum class
  const op = {
    add: "+",
    subtract: "-",
    multiply: "*",
    divide: "/"
  };

  // input types enum class
  const inputType = {
    NUM: "number",
    ARITH: "arithmatic",
    DEC: "decimal",
    CLR: "clear",
    CALC: "calculate"
  };

  // displays enum class
  const displayType = {
    PRIMARY: "primary",
    OVERALL: "overall"
  };

  // chars enum class - the characters that are displayed in the display
  const char = {
    DEC: "."
  };

  // record result after calculation
  const [memory, setMemory] = useState(0);
  // record if a decimal has been used in the present sum
  const [decEntered, setDecEntered] = useState(false);
  // record the previous input
  const [lastInputType, setLastInputType] = useState(null);
  // keep track of the number of consecutive arithmetic signs
  const [signs, setSigns] = useState(0);
  // record the previous arithmetic operator
  const [previousSign, setPreviousSign] = useState(null);
  // states for the contents of the displays
  const [primaryDisp, setPrimaryDisp] = useState("0");
  const [overallDisp, setOverallDisp] = useState("");

  // function to reset all states to original value
  const reset = () => {
    setMemory(0);
    setDecEntered(false);
    setLastInputType(null);
    setPrimaryDisp("0");
    setOverallDisp("");
    setSigns(0);
  };

  // function to append a character to display
  const appendToDisplay = (char, display) => {
    let disp =
      display === displayType.PRIMARY
        ? primaryDisp.split("")
        : display === displayType.OVERALL
        ? overallDisp.split("")
        : console.error("ivalid display");
    disp.push(char);
    disp = disp.join("");
    display === displayType.PRIMARY
      ? setPrimaryDisp(disp)
      : display === displayType.OVERALL
      ? setOverallDisp(disp)
      : console.error("invalid display");
  };

  const replaceLastChar = (char, display, n = 1) => {
    let disp =
      display === displayType.PRIMARY
        ? primaryDisp.split("")
        : display === displayType.OVERALL
        ? overallDisp.split("")
        : console.error("ivalid display");
    let i = 0;
    while (i < n) {
      disp.pop();
      i++;
    }
    disp.push(char);
    disp = disp.join("");
    display === displayType.PRIMARY
      ? setPrimaryDisp(disp)
      : display === displayType.OVERALL
      ? setOverallDisp(disp)
      : console.error("invalid display");
  };

  // input numeral digits to display
  const inputNumberToDisplay = (num) => {
    switch (lastInputType) {
      case inputType.CALC /* === lastInputType */:
        setPrimaryDisp(num);
        setOverallDisp(num);
        break;
      case inputType.NUM /* === lastInputType */:
        appendToDisplay(num, displayType.PRIMARY);
        appendToDisplay(num, displayType.OVERALL);
        break;
      case inputType.ARITH:
        appendToDisplay(num, displayType.OVERALL);
        setPrimaryDisp(num);
        setSigns(0);
        break;
      case inputType.DEC /* === lastInputType */:
        appendToDisplay(num, displayType.PRIMARY);
        appendToDisplay(num, displayType.OVERALL);
        break;
      default:
        if (num !== "0") {
          setOverallDisp(num);
          setPrimaryDisp(num);
        }
        break;
    }

    if (num !== "0") setLastInputType(inputType.NUM);
  };

  // input the decimal sign to display
  const inputDecimalToDisplay = () => {
    if (decEntered === false) {
      switch (lastInputType) {
        case inputType.NUM:
          appendToDisplay(char.DEC, displayType.PRIMARY);
          appendToDisplay(char.DEC, displayType.OVERALL);
          break;
        case inputType.ARITH:
          setPrimaryDisp(`0${char.DEC}`);
          appendToDisplay(char.DEC, displayType.OVERALL);
          setSigns(0);
          break;
        default:
          setPrimaryDisp(`0${char.DEC}`);
          setOverallDisp(`0${char.DEC}`);
          break;
      }
      // set lastInput to DEC(IMAL)
      setLastInputType(inputType.DEC);
      // record that a decimal has been entered
      setDecEntered(true);
    }
  };

  // input arithmetic operators to display
  const inputOperatorToDisplay = (operator) => {
    let operatorSign = op[operator];
    switch (lastInputType) {
      case inputType.ARITH:
        if (previousSign !== op.subtract && operatorSign !== op.subtract) {
          setPrimaryDisp(operatorSign);
          replaceLastChar(operatorSign, displayType.OVERALL);
          setSigns(1);
        } else if (
          previousSign !== op.subtract &&
          operatorSign === op.subtract
        ) {
          setPrimaryDisp(operatorSign);
          appendToDisplay(operatorSign, displayType.OVERALL);
          setSigns(2);
        } else if (
          previousSign === op.subtract &&
          operatorSign !== op.subtract &&
          signs !== 2
        ) {
          setPrimaryDisp(operatorSign);
          replaceLastChar(operatorSign, displayType.OVERALL);
          setSigns(1);
        } else if (
          previousSign === op.subtract &&
          operatorSign !== op.subtract &&
          signs === 2
        ) {
          setPrimaryDisp(operatorSign);
          replaceLastChar(operatorSign, displayType.OVERALL, 2);
        } else if (
          previousSign === op.subtract &&
          operatorSign === op.subtract &&
          signs !== 2
        ) {
          setPrimaryDisp(operatorSign);
          appendToDisplay(operatorSign, displayType.OVERALL);
          setSigns(2);
        }

        break;
      case inputType.CALC:
        setPrimaryDisp(operatorSign);
        setOverallDisp(`${memory}${operatorSign}`);
        break;
      default:
        setPrimaryDisp(operatorSign);
        appendToDisplay(operatorSign, displayType.OVERALL);
        break;
    }

    setLastInputType(inputType.ARITH);
    setDecEntered(false);
    setPreviousSign(operatorSign);
  };

  const equals = () => {
    if (lastInputType !== inputType.CALC) {
      let result = math.evaluate(overallDisp);
      appendToDisplay(` = ${result}`, displayType.OVERALL);
      setPrimaryDisp(result);
      setMemory(result);
    }

    // set lastInput to CACL(ULATE)
    setLastInputType(inputType.CALC);
  };

  const inputHandler = (e) => {
    let data = e.target.dataset;
    let inpType = data.inptype;

    switch (inpType) {
      case inputType.CLR:
        reset();
        break;
      case inputType.NUM:
        inputNumberToDisplay(data.numvalue);
        break;
      case inputType.DEC:
        inputDecimalToDisplay();
        break;
      case inputType.ARITH:
        inputOperatorToDisplay(data.operator);
        break;
      case inputType.CALC:
        equals();
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div id="displayContainer">
        <div id="overallDisp">{overallDisp}</div>
        <div id="display">{primaryDisp}</div>
      </div>
      <div id="console">
        <div id="btnContainer">
          <div id="numpad">
            {
              // pass second user story
              nums.map((num, index) => (
                <div
                  onClick={inputHandler}
                  data-inptype={inputType.NUM}
                  data-numvalue={conv2.wordsToNumbers(num)}
                  key={index}
                  className="numKey"
                  id={num}
                >
                  {conv2.wordsToNumbers(num)}
                </div>
              ))
            }
          </div>
          <div id="opContainer">
            {
              // pass third user story
              Object.keys(op).map((key, index) => (
                <div
                  onClick={inputHandler}
                  data-inptype={inputType.ARITH}
                  data-operator={key}
                  key={index}
                  id={key}
                  className="opKey"
                >
                  {op[key]}
                </div>
              ))
            }
          </div>
        </div>
        <div id="miscContainer">
          <div
            data-inptype={inputType.CLR}
            onClick={inputHandler}
            id="clear"
            className="miscKey"
          >
            CLR
          </div>
          <div
            onClick={inputHandler}
            data-inptype={inputType.CALC}
            id="equals"
            className="miscKey"
          >
            =
          </div>
          <div
            onClick={inputHandler}
            data-inptype={inputType.DEC}
            id="decimal"
            className="miscKey"
          >
            .
          </div>
        </div>
      </div>
    </div>
  );
}

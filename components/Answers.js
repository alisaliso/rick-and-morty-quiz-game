import React from "react";
import Answer from "./Answer";

function Answers(props) {
  return (
    <div>
      <ul className="list">
        {props.answers.map((answer, index) => (
          <Answer
            key={index}
            handleClick={props.handleClick}
            selected={props.currentAnswer === answer.name}
            title={answer.name}
          />
        ))}
      </ul>
    </div>
  );
}

export default Answers;

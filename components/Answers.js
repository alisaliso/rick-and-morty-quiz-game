import React from "react";
import Answer from "./Answer";
import styles from "@scss/Game.module.scss";

function Answers(props) {
  return (
    <div>
      <ul className={styles.list}>
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

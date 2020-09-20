import React from "react";

function Answer(props) {
  let classes = ["list__item"];
  if (props.selected) {
    classes.push("selected");
  }
  return (
    <li onClick={props.handleClick} className={classes.join(" ")}>
      {props.title}
    </li>
  );
}

export default Answer;

import React, { useState, useEffect, useReducer, useCallback } from "react";
import { getCharacter } from "rickmortyapi";

// Components
import Question from "@components/Question";
import Answers from "@components/Answers";
import Timer from "@components/Timer";

// Helpers
import formQuestions from "../helpers/formQuestions";
import styles from "@scss/Game.module.scss";

function useGameReducer() {
  const initialState = {
    gameState: "NOT_STARTED",
    score: 0,
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "START_GAME": {
        return { ...state, gameState: "STARTED" };
      }
      case "END_GAME": {
        return { ...state, gameState: "FINISHED" };
      }
      case "RESTART_GAME": {
        return { ...state, gameState: "STARTED", score: 0 };
      }
      case "SUBMIT_CHARACTER": {
        let newScore = state.score;
        newScore += 1;
        return {
          ...state,
          score: newScore,
        };
      }

      default: {
        throw new Error("STATE HASN'T FINDED");
      }
    }
  }, initialState);

  return [state, dispatch];
}

const filerCharacters = (res) =>
  res.map((character) => {
    return {
      id: character.id,
      name: character.name,
      image: character.image,
    };
  });

const initial = 60000;

export default function Game() {
  const [state, dispatch] = useGameReducer();
  const { gameState, score } = state;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState([]);
  const [characters, setCharacters] = useState([]);

  const fetchCharacters = useCallback(() => {
    const characters = getCharacter();
    characters
      .then((res) => {
        const filter = filerCharacters(res.results);
        setCharacters(formQuestions(filter));
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const question = characters[currentQuestion];

  const handleClick = (e) => {
    setCurrentAnswer(e.target.innerHTML);
    setError("");
  };

  const renderError = () => {
    if (!error) {
      return;
    }

    return <div>{error}</div>;
  };

  const next = () => {
    const answer = { id: question.id, answer: currentAnswer };

    if (!currentAnswer) {
      setError("Please select your answer");
      return;
    }
    answers.push(answer);
    setAnswers(answers);
    setCurrentAnswer("");

    if (question.correctAnswer === answer.answer) {
      dispatch({ type: "SUBMIT_CHARACTER" });
    }

    if (currentQuestion + 1 < characters.length) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    dispatch({ type: "END_GAME" });
  };

  const renderResultsData = () => {
    return answers.map((answer) => {
      const question = characters.find((question) => question.id === answer.id);

      return (
        <div key={question.id}>
          <span>{question.correctAnswer}</span> -{" "}
          <span
            className={`answer-${question.correctAnswer === answer.answer}`}
          >
            {answer.answer}
          </span>
        </div>
      );
    });
  };

  const restart = () => {
    dispatch({ type: "RESTART_GAME" });
    setAnswers([]);
    setCurrentAnswer("");
    setCurrentQuestion(0);
  };

  return (
    <div>
      {gameState === "NOT_STARTED" && (
        <GameNotStartedComponent dispatch={dispatch} />
      )}

      {gameState === "STARTED" && (
        <div className={styles.container__start}>
          <Timer dispatch={dispatch} initialTimeMs={initial} />
          {renderError()}
          <GameStartedComponent
            image={question.image}
            answers={question.answers}
            currentAnswer={currentAnswer}
            handleClick={handleClick}
            next={next}
            dispatch={dispatch}
          />
        </div>
      )}

      {gameState === "FINISHED" && (
        <div className={styles.container__start}>
          <h1>Results</h1>
          <h1>
            {score} out of {answers.length}
          </h1>
          <ul>{renderResultsData()}</ul>
          <button onClick={restart}>Start over</button>
        </div>
      )}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.8;
          color: #f7f7f7;
          font-family: sans-serif;
          background-color: #000000;
        }
        h1 {
          font-weight: 700;
        }
        p {
          margin-bottom: 10px;
        }
        button {
          background-color: #1d35f8;
          border: none;
          color: #f7f7f7;
          border-bottom-left-radius: 4px;
          font-size: 16px;
          text-transform: uppercase;
          background: linear-gradient(-135deg, transparent 10px, #1d35f8 10px);
          transition: all 0.2s ease;
          padding: 20px 30px;
          position: relative;
          cursor: pointer;
          font-weight: 700;
        }
        button:before {
          content: "";
          position: absolute;
          background-color: #000000;
          width: 6px;
          height: 6px;
          transform: rotate(45deg);
          bottom: 34px;
          left: -3px;
        }
        button:hover {
          background: linear-gradient(-135deg, transparent 10px, #11198c 10px);
          transition: all 0.2s ease;
        }
        li {
          list-style: none;
        }

        .list__item {
          padding: 10px 20px;
          cursor: pointer;
        }

        .list__item:hover {
          background-color: #11198c;
        }

        .list__item:not(:last-child) {
          border-bottom: 1px solid white;
        }

        .list__item.selected {
          background-color: #1d35f8;
        }
        .answer-true {
          color: green;
        }
        .answer-false {
          color: tomato;
        }
      `}</style>
    </div>
  );
}

function GameNotStartedComponent(props) {
  return (
    <div className={styles.container__center}>
      <h1>Do you know Rick and Morty?</h1>
      <button
        onClick={() => {
          props.dispatch({ type: "START_GAME" });
        }}
      >
        Start the Game
      </button>
    </div>
  );
}

function GameStartedComponent(props) {
  return (
    <>
      <Question question={props.image} />
      <Answers
        answers={props.answers}
        currentAnswer={props.currentAnswer}
        handleClick={props.handleClick}
      />
      <button onClick={props.next}>Confirm</button>
    </>
  );
}

import { useReducer, useEffect } from "react";

export default function Game() {
  const initialState = {
    gameState: "NOT_STARTED",
    score: 0,
    currentCharacter: "",
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "START_GAME": {
        return { ...state, gameState: "STARTED" };
      }
      case "END_GAME": {
        return { ...state, gameState: "FINISHED", currentCharacter: "" };
      }
      case "RESTART_GAME": {
        return { ...state, gameState: "STARTED", score: 0 };
      }
      case "TYPE_CHARACTER": {
        return { ...state, currentCharacter: action.character };
      }
      case "SUBMIT_CHARACTER": {
        let newScore = state.score;
        if (name === action.character) {
          newScore += 1;
        } else {
          newScore -= 1;
        }
        return { ...state, currentCharacter: "", score: newScore };
      }

      default: {
        throw new Error("STATE HASN'T FINDED");
      }
    }
  }, initialState);

  let { gameState, score, currentCharacter } = state;

  return (
    <>
      <h1>Rick and Morty typing game</h1>
      {gameState === "NOT_STARTED" && (
        <button
          onClick={() => {
            dispatch({ type: "START_GAME" });
          }}
        >
          Starts Game
        </button>
      )}
      {gameState === "STARTED" && (
        <>
          <input
            type="text"
            name=""
            placeholder="Name Character"
            value={currentCharacter}
            onChange={(e) => {
              dispatch({
                type: "TYPE_CHARACTER",
                character: e.target.value,
              });
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                dispatch({
                  type: "SUBMIT_CHARACTER",
                  character: e.target.value,
                });
              }
            }}
          />
          <button
            onClick={() => {
              dispatch({ type: "END_GAME" });
            }}
          >
            Give up
          </button>
        </>
      )}
      {gameState === "FINISHED" && (
        <>
          <div>Score: {score}</div>
          <button
            onClick={() => {
              dispatch({ type: "RESTART_GAME" });
            }}
          >
            Start over?
          </button>
        </>
      )}
    </>
  );
}

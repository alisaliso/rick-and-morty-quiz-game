import { useState, useReducer, useEffect } from "react";
import { getCharacter } from "rickmortyapi";
import styles from "@scss/Game.module.scss";

// import Character from "@components/Character";

function getRandomNumberForCharacter() {
  const numberOfCharacters = 591;
  return Math.floor(Math.random() * numberOfCharacters);
}

// const randomNumber = getRandomNumberForCharacter();

function useGameReducer() {
  const initialState = {
    gameState: "NOT_STARTED",
    score: 0,
    currentCharacter: "",
    guessedCharacter: [],
    mostRecentlySunmitted: "",
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
        if (character === action.character) {
          newScore += 1;
          return {
            ...state,
            currentCharacter: "",
            mostRecentlySunmitted: action.character,
            score: newScore,
          };
        } else {
          newScore -= 1;
          return {
            ...state,
            currentCharacter: "",
            mostRecentlySunmitted: null,
            score: newScore,
          };
        }
      }

      case "GET_CHARACTER": {
        return { ...state, guessedCharacter: [] };
      }

      default: {
        throw new Error("STATE HASN'T FINDED");
      }
    }
  }, initialState);

  return [state, dispatch];
}

function useCharacter(characterId, dispatch) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    let current = true;
    const randomCharacter = getCharacter(characterId);

    randomCharacter
      .then((res) => {
        const name = res.name;
        const image = res.image;
        const id = res.id;
        if (current) {
          setName(name);
          setImage(image);
          setIds(ids.concat(id));
        }
      })
      .catch((error) => {
        setError(error);
      });

    return () => {
      current = false;
    };
  }, [characterId]);

  return [character, img];
}

export default function Game() {
  const [state, dispatch] = useGameReducer();
  // const [name, setName] = useState("");
  // const [image, setImage] = useState(null);
  const { gameState, score, currentCharacter, guessedCharacter } = state;
  // useCharacter(randomNumber, dispatch);

  return (
    <div className={styles.container}>
      <h1>Do you know Rick and Morty?</h1>

      {gameState === "NOT_STARTED" && (
        <GameNotStartedComponent dispatch={dispatch} />
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
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.8;
          color: #333;
          font-family: sans-serif;
        }
        h1 {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function GameNotStartedComponent(props) {
  return (
    <button
      onClick={() => {
        props.dispatch({ type: "START_GAME" });
      }}
    >
      Starts Game
    </button>
  );
}

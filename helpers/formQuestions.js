// Select three random characters for answers list
const selectThreeCharacters = (characters, selectedCharacterId) =>
  characters
    // Exclude selected character
    .filter((character) => character.id !== selectedCharacterId)
    // Shaffle characters
    .sort(() => Math.random() - 0.5)
    // Take first three(randomized)
    .slice(0, 3);

// Form question from the list of characters
const formQuestions = (characters) =>
  characters.map((character) => {
    return {
      id: character.id,
      image: character.image,
      correctAnswer: character.name,
      answers: [
        ...selectThreeCharacters(characters, character.id),
        character,
      ].sort(() => Math.random() - 0.5), // Randize answers
    };
  });

export default formQuestions;

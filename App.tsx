import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function App() {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const maxAttempts = 6;

  const stages = [
    `
        -----
        |   |
        |    
        |    
        |
        |
      `,
    `
        -----
        |   |
        |   O
        |    
        |
        |
      `,
    `
        -----
        |   |
        |   O
        |   |
        |
        |
      `,
    `
        -----
        |   |
        |   O
        |  /|
        |
        |
      `,
    `
        -----
        |   |
        |   O
        |  /|\\
        |
        |
      `,
    `
        -----
        |   |
        |   O
        |  /|\\
        |  /
        |
      `,
    `
        -----
        |   |
        |   O
        |  /|\\
        |  / \\
        |
      `,
  ];

  const words = {
    easy: ["река", "котл", "крас", "перо", "вода"],
    medium: ["книга", "света", "птица", "долга", "берег"],
    hard: ["камень", "страна", "второй", "долина", "корень"],
  };

  function off (){
    setGameStarted(false),
    setSelectedLevel(''),
    setSelectedWord(''),
    setGuessedLetters([]),
    setWrongGuesses(0),
    setInputValue('')
    setCluesLeft(2)
    setAllLetters([])
  }

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    let randomWord

    if (level === 'Легкий') {
      randomWord = words.easy[Math.floor(Math.random() * words.easy.length)]
    } else if (level === 'Средний') {
      randomWord = words.medium[Math.floor(Math.random() * words.medium.length)]
    } else if (level === 'Сложный') {
      randomWord = words.hard[Math.floor(Math.random() * words.hard.length)]
    }else {
      alert("Ошибка уровня сложности");
      return;
    }

    setSelectedWord(randomWord);
    setGuessedLetters(Array(randomWord.length).fill('_') );
    setWrongGuesses(0);
    setGameStarted(true);

    console.log(randomWord)
  };
  
  const [allLetters, setAllLetters] = useState<string[]>([]);
  const handleLetterSubmit = (inputValue: string) => () => {
    setAllLetters(prevLetters => [...prevLetters, inputValue]);
    if (inputValue.length !== 1) {
      Alert.alert("Ошибка", "Введите букву.");
      return;
    }else if (!/^[а-яА-Я]$/.test(inputValue)) {
      Alert.alert("Ошибка", "Введите русскую букву.");
      return;
    }else if (allLetters.includes(inputValue)) {
      Alert.alert("Ошибка", "Вы уже вводили эту букву.");
      return;
    }
   

    const letter = inputValue.toLowerCase();
    setInputValue('');

    if (selectedWord.includes(letter)) {
      const updatedGuessedLetters = guessedLetters.map((char, index) =>
        selectedWord[index] === letter ? letter : char
      );
      setGuessedLetters(updatedGuessedLetters as string[]);

      if (!updatedGuessedLetters.includes('_')) {
        Alert.alert("Поздравляем!", "Вы угадали слово!");
        off()
      }
    } else {
      setWrongGuesses(wrongGuesses + 1);

      if (wrongGuesses + 1 === maxAttempts) {
        Alert.alert("Игра окончена", `Вы проиграли. Слово было: ${selectedWord}`);
        off()
      }
    }
  };

    const [cluesLeft, setCluesLeft] = useState(2);
    const guessRandomLetter = () => {
      console.log(cluesLeft)
      if (cluesLeft <= 0) {
        Alert.alert("У вас закончились подсказки.");
        return;
      }
      if (!selectedWord) {
        Alert.alert("Ошибка", "Выберите уровень сложности перед получением подсказки.");
        return;
      }
      const Letters = selectedWord.split('');

    
      const unguessedLetters = Letters.filter((letter) => !guessedLetters.includes(letter));
      
      const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      
      const updatedGuessedLetters = guessedLetters.map((char, index) =>
          selectedWord[index] === randomLetter ? randomLetter : char
           );
      
      setGuessedLetters(updatedGuessedLetters);
      setCluesLeft(cluesLeft - 1);

      if (!updatedGuessedLetters.includes('_')) {
        Alert.alert("Поздравляем!", "Вы угадали слово!");
        off()
      }else {
        return;
      }
    };
  
  
  return (
    <View style={styles.mainContainer}>
      {gameStarted ? (
        <View style={styles.containerGame}>
          <View style={styles.gameScreen}>
            <Text style={styles.hangmanText}>{stages[wrongGuesses]}</Text>
          </View>

          <View style={styles.texts}>
            <Text style={styles.textOne}>Сложность: {selectedLevel}</Text>
            <Text style={styles.textOne}>Ошибки: {wrongGuesses}/{maxAttempts}</Text>
          </View>

          <View style={styles.letters}>
            {guessedLetters.map((letter, index) => (
              <View key={index} style={styles.letterBlock}>
                <Text style={styles.letterText}>{letter}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.textOne}>Введите букву:</Text>
          <View style={styles.inputContent}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgb(139, 139, 139)"
              placeholder="А-Я"
              autoCapitalize="characters"
              maxLength={1}
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity style={styles.buttonConfirm} onPress={handleLetterSubmit(inputValue as string)}>
              <AntDesign name="check" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.gameButtons}>
          <TouchableOpacity style={styles.buttonGame} onPress={guessRandomLetter}>
              <Text style={styles.buttonGameText}>Получить подсказку</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonGame} onPress={
              () => {
                setGuessedLetters(Array(selectedWord.length).fill('_'));
                setWrongGuesses(0);
                setInputValue('');
                setCluesLeft(2)
                setAllLetters([])
              }
            }>
              <Text style={styles.buttonGameText}>Начать заново</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonGame}
              onPress={() => {
                off()
              }}
            >
              <Text style={styles.buttonGameText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.containerMenu}>
          <Text style={styles.tipoH1}>Выберите сложность:</Text>
          <TouchableOpacity style={styles.selectLevel} onPress={() => handleLevelSelect('Легкий')}>
            <Text style={styles.selectLevelText}>Легкий</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectLevel} onPress={() => handleLevelSelect('Средний')}>
            <Text style={styles.selectLevelText}>Средний</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectLevel} onPress={() => handleLevelSelect('Сложный')}>
            <Text style={styles.selectLevelText}>Сложный</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgb(38, 38, 38)',
  },
  containerMenu: {
    flex: 1,
    backgroundColor: 'rgb(38, 38, 38)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  tipoH1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  selectLevel: {
    backgroundColor: 'rgb(100, 100, 100)',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  containerGame: {
    flex: 1,
    backgroundColor: 'rgb(38, 38, 38)',
    alignItems: 'center',
    padding: 10,
    paddingTop: 60,
    gap: 10,
  },
  gameScreen: {
    width: '90%',
    minHeight: 150,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
   alignItems: 'center',
   justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  hangmanText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
    
  },
  texts: {
    width: '90%',
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textOne: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  letters: {
    width: '90%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  letterBlock: {
    width: '13%',
    height: 50,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContent: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 100,
    height: 50,
    borderColor: 'white',
    borderBottomWidth: 3,
    padding: 10,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  buttonConfirm: {
    width: 50,
    height: 50,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
  gameButtons: {
    width: '90%',
    flexDirection: 'column',
    gap: 15,
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonGame: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  buttonGameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

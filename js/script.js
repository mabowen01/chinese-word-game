const levels = [
    { chineseWords: ["你好", "谢谢", "再见", "请", "对不起", "早上好", "晚安", "学生", "老师", "朋友"], 
      englishWords: ["Hello", "Thank you", "Goodbye", "Please", "Sorry", "Good Morning", "Good Night", "Student", "Teacher", "Friend"] },
    // Repeat for 9 more levels with different HSK1 words
];
let currentLevel = 0;
let score = 0;
let health = 4;
let selectedChineseWord = null;
let selectedEnglishWord = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createWords(level) {
    const chineseContainer = document.querySelector('.chinese-words');
    const englishContainer = document.querySelector('.english-words');
    chineseContainer.innerHTML = '';
    englishContainer.innerHTML = '';

    shuffle(level.chineseWords).forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        wordDiv.dataset.type = 'chinese';
        wordDiv.addEventListener('click', selectWord);
        chineseContainer.appendChild(wordDiv);
    });

    shuffle(level.englishWords).forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        wordDiv.dataset.type = 'english';
        wordDiv.addEventListener('click', selectWord);
        englishContainer.appendChild(wordDiv);
    });
}

function selectWord(event) {
    const word = event.target;

    if (word.dataset.type === 'chinese') {
        if (selectedChineseWord) {
            selectedChineseWord.classList.remove('selected');
        }
        selectedChineseWord = word;
    } else {
        if (selectedEnglishWord) {
            selectedEnglishWord.classList.remove('selected');
        }
        selectedEnglishWord = word;
    }

    word.classList.add('selected');

    if (selectedChineseWord && selectedEnglishWord) {
        checkMatch();
    }
}

function checkMatch() {
    const chineseIndex = levels[currentLevel].chineseWords.indexOf(selectedChineseWord.textContent);
    const englishIndex = levels[currentLevel].englishWords.indexOf(selectedEnglishWord.textContent);

    if (chineseIndex === englishIndex) {
        selectedChineseWord.classList.add('matched');
        selectedEnglishWord.classList.add('matched');
        selectedChineseWord.removeEventListener('click', selectWord);
        selectedEnglishWord.removeEventListener('click', selectWord);
        selectedChineseWord = null;
        selectedEnglishWord = null;
        score += 10;
        updateScore();
    } else {
        health--;
        updateHealth();
        if (health === 0) {
            alert("Game Over! You've lost all your health.");
            resetGame();
        } else {
            alert("Incorrect match. Try again!");
        }
        selectedChineseWord.classList.remove('selected');
        selectedEnglishWord.classList.remove('selected');
        selectedChineseWord = null;
        selectedEnglishWord = null;
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateHealth() {
    const hearts = document.querySelectorAll('.health-icon');
    hearts[hearts.length - health - 1].style.opacity = '0.3';
}

function checkLevelCompletion() {
    const matchedWords = document.querySelectorAll('.matched').length;
    if (matchedWords === levels[currentLevel].chineseWords.length * 2) {
        if (currentLevel < levels.length - 1) {
            alert("Level Completed! Moving to the next level.");
            currentLevel++;
            document.getElementById('level').textContent = currentLevel + 1;
            createWords(levels[currentLevel]);
        } else {
            alert("Congratulations! You've completed all levels.");
            document.getElementById('result').textContent = `Well done! You scored ${score} points.`;
        }
    }
}

function resetGame() {
    currentLevel = 0;
    score = 0;
    health = 4;
    document.getElementById('level').textContent = currentLevel + 1;
    document.getElementById('score').textContent = score;
    document.querySelectorAll('.health-icon').forEach(icon => icon.style.opacity = '1');
    createWords(levels[currentLevel]);
}

document.getElementById('check-matches').addEventListener('click', checkLevelCompletion);

createWords(levels[currentLevel]);

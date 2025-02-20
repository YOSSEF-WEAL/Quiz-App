const quizContainer = document.querySelector('.quiz-container');
const configContainer = document.querySelector('.config-container');
const answerOptions = document.querySelector('.answer-options');
const questionState = document.querySelector('.question-status');
const timerDisplay = document.querySelector('.time-duration');
const timerContainer = document.querySelector('.quiz-timer');
const resultContainer = document.querySelector('.result-container');
const quizCategoryQuestion = document.querySelector('.quiz-category-question');

const categorysQuestionsOptions = document.querySelectorAll('.category-option,.question-option');
// Quiz bts state variables 
const nextQuestionBtn = document.querySelector('.next-question-btn');
const tryAgainBtn = document.querySelector('.try-again-btn');
const startQuizBtn = document.querySelector('.start-quiz-btn');
// Quiz state variables 
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = 'programming';
let numberOfQuestions = 1;
let currentQuestion = null;
let correctAnswerCount = 0;
const questionIndexHistory = [];


configContainer.style.display = 'block';


// display the quiz result and hide the quiz container
const showQuizResult = () =>
{
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    const resultText = `<p class="result-message">You answred <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> `;

    document.querySelector('.result-message').innerHTML = resultText;
};

// Clear and resetTimer
const resetTimer = () =>
{
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;

};

// Initialize ans=d start the timer for the current question
const startTimer = () =>
{
    timer = setInterval(() =>
    {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0)
        {
            clearInterval(timer);
            HighlightCorrectAnswer();
            nextQuestionBtn.style.visibility = 'visible';

            timerContainer.classList.add('endTime');
            // Disable all answer options after on option is selected
            answerOptions.querySelectorAll('.answer-option').forEach(option => option.classList.add('noPointer'));
        }
    }, 1000);
};

const getRandomQuestion = () =>
{
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    // Show the results if all question have been used
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions))
    {
        return showQuizResult();
    }

    // filter out already asked questions and choose rendom one 
    const availableQuestion = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));

    const randomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
    console.log(randomQuestion);

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion))
    return randomQuestion;

};

// Highlight the Correct Answer option and add icon 
const HighlightCorrectAnswer = () =>
{
    const correntOption = answerOptions.querySelectorAll('.answer-option')[currentQuestion.correctAnswer];
    correntOption.classList.add('correct');
    const iconHTMl = `<span class="material-symbols-rounded">check_circle</span>`;
    correntOption.insertAdjacentHTML("beforeend", iconHTMl);
};

// handle the user's answer selection
const handleAnswer = (option, answerIndex) =>
{
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? HighlightCorrectAnswer() : correctAnswerCount++;

    // Insert icon based on correctness
    const iconHTMl = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTMl);

    // Disable all answer options after on option is selected
    answerOptions.querySelectorAll('.answer-option').forEach(option => option.classList.add('noPointer'));
    nextQuestionBtn.style.visibility = 'visible';

}

// Render the current question and its options in the quiz
const randomQuestion = () =>
{
    timerContainer.classList.remove('endTime');

    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;
    resetTimer();
    startTimer();
    // Update the UI 
    answerOptions.innerHTML = '';
    nextQuestionBtn.style.visibility = 'hidden';
    const questionText = document.querySelector(".question-text");
    questionText.textContent = currentQuestion.question;
    questionState.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`

    // Create option <li> ele and append them, and click event listener
    currentQuestion.options.forEach((option, index) =>
    {
        const li = document.createElement('li');
        li.classList.add('answer-option');
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener('click', () => handleAnswer(li, index))
    });
};


// Reset the quiz and return to the configContainer
const resetQuiz = () =>
{
    resetTimer();
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    resultContainer.style.display = 'none';
    configContainer.style.display = 'block';
    randomQuestion();

};

const startQuiz = () =>
{
    configContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    // Update the quiz category and number of Questions
    quizCategory = configContainer.querySelector('.category-option.active').textContent.trim();
    quizCategoryQuestion.textContent = `In ${quizCategory}`;
    numberOfQuestions = parseInt(configContainer.querySelector('.question-option.active').textContent);

    randomQuestion();
};

// Highlight the selected option an click - category or no. of question
categorysQuestionsOptions.forEach(option =>
{
    option.addEventListener('click', () =>
    {
        option.parentNode.querySelector(".active").classList.remove('active');
        option.classList.add('active');
    });
});


nextQuestionBtn.addEventListener('click', randomQuestion);
tryAgainBtn.addEventListener("click", resetQuiz);
startQuizBtn.addEventListener('click', startQuiz);
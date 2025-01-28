document.addEventListener('DOMContentLoaded', function() {
    loadQuiz();
    setupQuizEventListeners();
});

function setupQuizEventListeners() {
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');
    const endQuizButton = document.getElementById('endQuizButton');

    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (prevButton) prevButton.addEventListener('click', prevQuestion);
    if (endQuizButton) endQuizButton.addEventListener('click', endQuiz);
}

let currentQuestionIndex = 0;
let questions = [];

// Load the selected questions from localStorage
function loadQuiz() {
    const storedQuestions = localStorage.getItem('selectedQuestions');
    if (storedQuestions) {
        questions = JSON.parse(storedQuestions); // Parse the stored questions
        console.log('Loaded questions:', questions);
        if (questions.length > 0) {
            displayCurrentQuestion();
            updateNavigationButtons();
        } else {
            console.error('No questions found');
            document.getElementById('questionContainer').innerHTML = '<p>Error: No questions available. Please return to the main page and try again.</p>';
        }
    } else {
        console.error('No questions found in localStorage');
        document.getElementById('questionContainer').innerHTML = '<p>Error: Unable to load questions. Please try again later.</p>';
    }
}

function displayCurrentQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const currentQuestion = questions[currentQuestionIndex];

    questionContainer.innerHTML = `
        <h3>Question ${currentQuestionIndex + 1}: ${currentQuestion.qtitle}</h3>
        <img src="${currentQuestion.qpic}" alt="Question Image">
        ${currentQuestion.qoptions.map((option, i) => `
            <div>
                <input type="radio" name="q${currentQuestion.qid}" value="${option}" id="q${currentQuestion.qid}o${i}">
                <label for="q${currentQuestion.qid}o${i}">${option}</label>
            </div>
        `).join('')}
        <p id="result${currentQuestion.qid}"></p>
    `;
}

function updateNavigationButtons() {
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    if (currentQuestionIndex === 0) {
        prevButton.style.display = 'none'; // Hide previous button on the first question
    } else {
        prevButton.style.display = 'block'; // Show previous button
    }

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = 'Finish'; // Change next button to finish on the last question
    } else {
        nextButton.textContent = 'Next'; // Change back to next
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        updateNavigationButtons();
    } else {
        endQuiz(); // Call endQuiz if it's the last question
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        updateNavigationButtons();
    }
}

function endQuiz() {
    // Logic to end the quiz, e.g., show results or navigate to another page
    alert('Quiz finished!'); // Placeholder for ending the quiz
    // Optionally, clear selected questions from localStorage
    localStorage.removeItem('selectedQuestions');
    window.location.href = 'index.html'; // Redirect to the main page or results page
}

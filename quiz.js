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

function loadQuiz() {
    const storedQuestions = localStorage.getItem('selectedQuestions');
    console.log('Stored questions from localStorage:', storedQuestions);
    questions = JSON.parse(storedQuestions);
    console.log('Parsed questions:', questions);
    if (questions && questions.length > 0) {
        displayCurrentQuestion();
        updateNavigationButtons();
    } else {
        console.error('No questions found');
        document.getElementById('questionContainer').innerHTML = '<p>Error: No questions available. Please return to the main page and try again.</p>';
    }
}

function displayCurrentQuestion() {
    const container = document.getElementById('questionContainer');
    if (!container) {
        console.error('Question container not found');
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Create an array with all options including the correct answer
    let allOptions = [...question.qoptions];
    if (!allOptions.includes(question.qcor)) {
        allOptions.push(question.qcor);
    }
    
    // Shuffle the options
    const shuffledOptions = shuffleArray(allOptions);
    
    container.innerHTML = `
        <p class="qref">Ref: ${question.qref}</p>
        <h3>Question ${currentQuestionIndex + 1}: ${question.qtitle}</h3>
        ${question.qpic ? `<img src="pics/${question.qpic}" alt="Question Image">` : ''}
        ${shuffledOptions.map((option, i) => `
            <div class="option-container">
                <input type="radio" name="q${question.qid}" value="${option}" id="q${question.qid}o${i}">
                <label class="option-label" for="q${question.qid}o${i}">${option}</label>
            </div>
        `).join('')}
    `;

    // Add event listeners to radio buttons
    const radioButtons = container.querySelectorAll(`input[name="q${question.qid}"]`);
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => checkAnswer());
    });
}

// Add this function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

function checkAnswer() {
    const question = questions[currentQuestionIndex];
    const selectedOption = document.querySelector(`input[name="q${question.qid}"]:checked`);
    const correctAnswer = question.qcor;
    const options = document.querySelectorAll(`input[name="q${question.qid}"]`);

    options.forEach(option => {
        const label = option.nextElementSibling;
        if (option.value === correctAnswer) {
            label.style.backgroundColor = 'lightgreen';
            label.style.borderColor = 'green';
        } else if (option === selectedOption) {
            label.style.backgroundColor = 'lightcoral';
            label.style.borderColor = 'red';
        } else {
            // Reset other options to default state
            label.style.backgroundColor = '';
            label.style.borderColor = '';
        }
        // Disable all options after answering
        option.disabled = true;
    });
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        updateNavigationButtons();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        updateNavigationButtons();
    }
}

// Remove the submitQuiz function as it's no longer needed

function setupOptionListeners() {
    const options = document.querySelectorAll('input[type="radio"]');
    options.forEach(option => {
        option.addEventListener('change', function() {
            // No need to reset styles here, as it's handled by CSS
        });
    });
}

function endQuiz() {
    // Clear the selected questions from localStorage
    localStorage.removeItem('selectedQuestions');
    
    // Redirect to the index.html page
    window.location.href = 'index.html';
}

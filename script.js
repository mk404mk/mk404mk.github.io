// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    loadQuiz();
    setupEventListeners();
});

/*function loadQuizData() {
    fetch('qSrc.json')
        .then(response => response.json())
        .then(data => {
            window.quizData = data;
            console.log('Quiz data loaded:', quizData);
        })
        .catch(error => console.error('Error loading quiz data:', error));
}*/

function setupEventListeners() {
    const startButton = document.getElementById('startQuizButton');
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }
}

function loadQuiz() {
    // Fetch questions from the GitHub Gist
    fetch('https://gist.githubusercontent.com/mk404mk/c5698ff665082c4f287a8c3b70a6ba94/raw/quiz_source.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questions = data; // Assign fetched questions to the questions variable
            console.log('Fetched questions:', questions);
            populateQTypeDropdown(questions); // Populate dropdown with qtypes
            if (questions && questions.length > 0) {
                displayCurrentQuestion();
                updateNavigationButtons();
            } else {
                console.error('No questions found');
                document.getElementById('questionContainer').innerHTML = '<p>Error: No questions available. Please return to the main page and try again.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('questionContainer').innerHTML = '<p>Error: Unable to load questions. Please try again later.</p>';
        });
}

// Function to populate the dropdown with unique qtypes
function populateQTypeDropdown(questions) {
    const qtypeSelect = document.getElementById('qtypeSelect'); // Ensure you have a select element with this ID in your HTML
    const uniqueQTypes = [...new Set(questions.map(q => q.qtype))];

    uniqueQTypes.forEach(qtype => {
        const option = document.createElement('option');
        option.value = qtype;
        option.textContent = qtype;
        qtypeSelect.appendChild(option);
    });
}

function startQuiz() {
    const topic = document.getElementById('topicSelect').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);
    
    if (!topic) {
        console.error('No topic selected');
        return;
    }
    
    // Fetch the JSON file from the qsrc folder
    fetch(`qsrc/${topic}.json`)
        .then(response => response.json())
        .then(data => {
            // Randomly select questions
            const shuffled = data.sort(() => 0.5 - Math.random());
            const selectedQuestions = shuffled.slice(0, questionCount);
            
            // Store selected questions in localStorage
            localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
            console.log('Stored questions:', selectedQuestions);
            
            // Navigate to quiz.html
            window.location.href = 'quiz.html';
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

// The following functions should be moved to a separate quiz.js file
// that will be included in quiz.html

function displayQuestions(questions) {
    const container = document.getElementById('questionContainer');
    if (!container) {
        console.error('Question container not found');
        return;
    }
    
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <h3>Question ${index + 1}: ${question.qtitle}</h3>
            <img src="${question.qpic}" alt="Question Image">
            ${question.qoptions.map((option, i) => `
                <div>
                    <input type="radio" name="q${question.qid}" value="${option}" id="q${question.qid}o${i}">
                    <label for="q${question.qid}o${i}">${option}</label>
                </div>
            `).join('')}
            <p id="result${question.qid}"></p>
        `;
        container.appendChild(questionElement);

        // Add event listeners to radio buttons
        const radioButtons = questionElement.querySelectorAll(`input[name="q${question.qid}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => checkAnswer(question, radio.value));
        });
    });
}

function checkAnswer(question, selectedAnswer) {
    const resultElement = document.getElementById(`result${question.qid}`);
    if (selectedAnswer === question.qanswer) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";
    } else {
        resultElement.textContent = `Incorrect. The correct answer is: ${question.qanswer}`;
        resultElement.style.color = "red";
    }
}

// Remove or comment out the submitQuiz function as it's no longer needed
// function submitQuiz() { ... }

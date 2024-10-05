const jsonFiles = ['main.json', 'qsrc.json']; // Example JSON files
const jsonSelect = document.getElementById('jsonSelect');

jsonFiles.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file;
    jsonSelect.appendChild(option);
});

// Function to load questions from localStorage
function loadQuestionsFromStorage(fileName) {
    const storedData = localStorage.getItem(fileName);
    return storedData ? JSON.parse(storedData) : [];
}

// Function to save questions to localStorage
function saveQuestionsToStorage(fileName, questions) {
    localStorage.setItem(fileName, JSON.stringify(questions));
}

// Function to load questions from file and save to localStorage
function loadQuestionsFromFile(fileName) {
    fetch(`qsrc/${fileName}`)
        .then(response => response.json())
        .then(questions => {
            saveQuestionsToStorage(fileName, questions);
            loadQuestions(fileName);
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Error loading questions. Please try again.');
        });
}

// Modify the loadQuestions function
function loadQuestions(fileName) {
    const questions = loadQuestionsFromStorage(fileName);
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
    questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = `${question.qid}: ${question.qtitle}`;
        questionList.appendChild(li);
    });
}

// Modify the addQuestionBtn event listener
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const selectedFile = jsonSelect.value;
    const questionData = {
        qid: document.getElementById('qid').value,
        qpic: document.getElementById('qpic').value,
        qtitle: document.getElementById('qtitle').value,
        qcor: document.getElementById('qcor').value,
        qref: document.getElementById('qref').value,
        qoptions: [
            document.getElementById('opt1').value,
            document.getElementById('opt2').value,
            document.getElementById('opt3').value,
            document.getElementById('opt4').value
        ].filter(Boolean)
    };

    if (questionData.qid && questionData.qtitle) {
        const questions = loadQuestionsFromStorage(selectedFile);
        const existingQuestionIndex = questions.findIndex(q => q.qid === questionData.qid);
        
        if (existingQuestionIndex !== -1) {
            // Update existing question
            questions[existingQuestionIndex] = questionData;
            console.log(`Updated question with ID: ${questionData.qid}`);
        } else {
            // Add new question
            questions.push(questionData);
            console.log(`Added new question with ID: ${questionData.qid}`);
        }

        saveQuestionsToStorage(selectedFile, questions);
        //alert('Question saved successfully!');
        loadQuestions(selectedFile); // Refresh the question list
    } else {
        alert('Please fill in the required fields (qid, qtitle).');
    }
});

// Modify the jsonSelect change event listener
jsonSelect.addEventListener('change', () => {
    const selectedFile = jsonSelect.value;
    if (!localStorage.getItem(selectedFile)) {
        loadQuestionsFromFile(selectedFile);
    } else {
        loadQuestions(selectedFile);
    }
});

// Initial load of questions
if (!localStorage.getItem(jsonSelect.value)) {
    loadQuestionsFromFile(jsonSelect.value);
} else {
    loadQuestions(jsonSelect.value);
}

document.getElementById('bringQuestionBtn').addEventListener('click', () => {
    const selectedFile = jsonSelect.value;
    const searchQid = document.getElementById('qid').value;

    if (!searchQid) {
        alert('Please enter a Question ID to search.');
        return;
    }

    fetch(`qsrc/${selectedFile}`)
        .then(response => response.json())
        .then(questions => {
            const question = questions.find(q => q.qid === searchQid);
            if (question) {
                fillFormWithQuestion(question);
            } else {
                alert('Question not found.');
            }
        })
        .catch(error => {
            console.error('Error searching for question:', error);
        });
});

function fillFormWithQuestion(question) {
    document.getElementById('qid').value = question.qid;
    document.getElementById('qpic').value = question.qpic || '';
    document.getElementById('qtitle').value = question.qtitle;
    document.getElementById('qcor').value = question.qcor;
    document.getElementById('qref').value = question.qref || '';
    
    // Fill in options
    for (let i = 0; i < 5; i++) {
        document.getElementById(`opt${i+1}`).value = question.qoptions[i] || '';
    }
};

// Add this function to handle JSON download
function downloadJson() {
    const selectedFile = jsonSelect.value;
    const questions = loadQuestionsFromStorage(selectedFile);
    const jsonString = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add event listener for the download button
document.getElementById('downloadJsonBtn').addEventListener('click', downloadJson);

// Function to clear all data from localStorage
function clearStorage() {
    if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
        localStorage.clear();
        alert('All stored data has been cleared.');
        
        // Reload questions for the currently selected file
        const selectedFile = jsonSelect.value;
        loadQuestionsFromFile(selectedFile);
        
        // Clear form fields
        clearFormFields();
    }
}

// Function to clear form fields
function clearFormFields() {
    document.getElementById('qid').value = '';
    document.getElementById('qpic').value = '';
    document.getElementById('qtitle').value = '';
    document.getElementById('qcor').value = '';
    document.getElementById('qref').value = '';
    document.getElementById('opt1').value = '';
    document.getElementById('opt2').value = '';
    document.getElementById('opt3').value = '';
    document.getElementById('opt4').value = '';
}

// Add event listener for the clear storage button
document.getElementById('clearStorageBtn').addEventListener('click', clearStorage);

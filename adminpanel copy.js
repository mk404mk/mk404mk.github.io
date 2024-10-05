const jsonFiles = ['amksrc.json', 'qsrc.json']; // Example JSON files
const jsonSelect = document.getElementById('jsonSelect');

jsonFiles.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file;
    jsonSelect.appendChild(option);
});

jsonSelect.addEventListener('change', () => {
    const selectedFile = jsonSelect.value;
    loadQuestions(selectedFile);
});

function loadQuestions(file) {
    // Fetch JSON data from the selected file
    fetch(`qsrc/${file}`)
        .then(response => response.json())
        .then(questions => {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = ''; // Clear existing list

            questions.forEach(question => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>ID:</strong> ${question.qid}<br>
                    <strong>Title:</strong> ${question.qtitle}
                `;
                questionList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}

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
        // Fetch the current questions
        fetch(`qsrc/${selectedFile}`)
            .then(response => response.json())
            .then(questions => {
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

                // Save updated questions back to the file
                return fetch(`/save-questions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ file: selectedFile, questions: questions }),
                });
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Question saved successfully!');
                    loadQuestions(selectedFile); // Refresh the question list
                } else {
                    alert('Error saving question. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error saving question:', error);
                alert('Error saving question. Please try again.');
            });
    } else {
        alert('Please fill in the required fields (qid, qtitle).');
    }
});

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

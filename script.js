const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");

const word = document.getElementById("word");
const pronunciation = document.getElementById("pronunciation");
const definitions = document.getElementById("definitions");
const synonyms = document.getElementById("synonyms");
const audioPlayer = document.getElementById("audioPlayer");
const errorMessage = document.getElementById("errorMessage");

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchWord = wordInput.value.trim();

    if (searchWord === "") {
        showError("Please enter a word.");
        return;
    }

    clearResults();
    getWord(searchWord);
});

async function getWord(searchWord) {
    try {
        const response = await fetch(API_URL + searchWord);

        if (!response.ok) {
            throw new Error("Word not found.");
        }

        const data = await response.json();

        displayWord(data);

    } catch (error) {
        showError(error.message);
    }
}

function displayWord(data) {

    const entry = data[0];

    word.textContent = entry.word;

    if (entry.phonetic) {
        pronunciation.textContent = entry.phonetic;
    } else {
        pronunciation.textContent = "Pronunciation not available";
    }

    let audioFound = false;

    for (let phonetic of entry.phonetics) {
        if (phonetic.audio) {
            audioPlayer.src = phonetic.audio;
            audioPlayer.style.display = "block";
            audioFound = true;
            break;
        }
    }

    if (!audioFound) {
        audioPlayer.style.display = "none";
    }

    definitions.innerHTML = "<h3>Definitions</h3>";

    entry.meanings.forEach(meaning => {

        meaning.definitions.forEach(def => {

            const p = document.createElement("p");
            p.classList.add("definition");
            p.textContent = "• " + def.definition;

            definitions.appendChild(p);

        });

    });

    synonyms.innerHTML = "<h3>Synonyms</h3>";

    let synonymList = [];

    entry.meanings.forEach(meaning => {

        if (meaning.synonyms.length > 0) {
            synonymList = synonymList.concat(meaning.synonyms);
        }

    });

    synonymList = [...new Set(synonymList)];

    if (synonymList.length > 0) {

        synonymList.slice(0, 10).forEach(synonym => {

            const span = document.createElement("span");
            span.classList.add("synonym");
            span.textContent = synonym;

            synonyms.appendChild(span);

        });

    } else {

        synonyms.innerHTML += "<p>No synonyms found.</p>";

    }
}

function clearResults() {

    word.textContent = "";
    pronunciation.textContent = "";

    definitions.innerHTML = "";
    synonyms.innerHTML = "";

    audioPlayer.src = "";
    audioPlayer.style.display = "none";

    errorMessage.textContent = "";
}


function showError(message) {

    clearResults();

    errorMessage.textContent = message;

}
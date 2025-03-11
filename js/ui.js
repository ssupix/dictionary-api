import { getSavedWords, saveWord, removeWord } from './storage.js';

// Define the color mapping for each word type
const wordTypeColors = {
    article: ['#F1FFAD', '#B2CD28'],
    verb: ['#EDDAFF', '#7D28CD'],
    adverb: ['#FDD5D5', '#EB4444'],
    adjective: ['#DDF1FF', '#1D90DC'],
    pronoun: ['#FDF4D5', '#D99F21'],
    preposition: ['#FDD5EE', '#EB44D2'],
    conjunction: ['#F1FFAD', '#B2CD28'],
    interjection: ['#D5FDEA', '#36CE9B'],
    noun: ['#E7FDD5', '#76C521'],
    determiner: ['#CBD4FF', '#3A40E4'],
    idk: ['#E7E7E7', '#777777'],
};

// Function to update star in definition container
function updateStarInDefinition(word, isSaved) {
    const starButton = document.getElementById('star-button');
    if (starButton && starButton.closest('#definition-container')) {
        // Check if current definition is for the same word
        const definitionWord = document.querySelector('#definition-container h2');
        if (definitionWord && definitionWord.textContent === word) {
            starButton.innerHTML = isSaved ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
    }
}

// Updates the UI to display the definition of a word
export function updateDefinitionUI(data) {
    const container = document.getElementById('definition-container');
    
    // Handle case where word is not found
    if (!data) {
        container.innerHTML = '<p class="text-red-500">Word not found.</p>';
        return;
    }
    
    const word = data[0].word;
    const savedWords = getSavedWords();
    const isSaved = savedWords.includes(word);
    
    // Extract phonetic pronunciation with fallback options
    let phonetic = '';
    if (data[0].phonetic) {
        phonetic = data[0].phonetic;
    } else if (data[0].phonetics && data[0].phonetics.length > 0) {
        for (let i = 0; i < data[0].phonetics.length; i++) {
            if (data[0].phonetics[i].text) {
                phonetic = data[0].phonetics[i].text;
                break;
            }
        }
    }

    // Check the word type
    const wordType = data[0].meanings[0].partOfSpeech || 'idk'; // Default if partOfSpeech is missing
    const colors = wordTypeColors[wordType] || wordTypeColors.noun; 
    
    // Build the definition display HTML
    container.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex flex-col gap-1">
                <h2 class="text-xl font-bold">${word}</h2>
                ${phonetic ? `<p class="text-gray-500 italic">${phonetic}</p>` : ''}
            </div>
            <button id="star-button" class="text-yellow-500 text-xl">
                <i class="${isSaved ? 'fas' : 'far'} fa-star"></i>
            </button>
        </div>
        <p class="mt-2">${data[0].meanings[0].definitions[0].definition}</p>
        <div class="mt-2 inline-block rounded-full px-4 py-1 text-center" style="background-color: ${colors[0]}; color: ${colors[1]};">
            ${wordType}
        </div>
    `;
    container.classList.remove('hidden');
    
    // Add event listener for the star button to save/unsave
    document.getElementById('star-button').addEventListener('click', () => {
        const currentSavedWords = getSavedWords();
        const isCurrentlySaved = currentSavedWords.includes(word);
        
        if (isCurrentlySaved) {
            // Word is already saved, so remove it
            removeWord(word);
            document.getElementById('star-button').innerHTML = '<i class="far fa-star"></i>';
        } else {
            // Try to save the word
            if (currentSavedWords.length >= 5) {
                // We're at the limit
                document.getElementById('limit-warning').classList.remove('hidden');
                setTimeout(() => document.getElementById('limit-warning').classList.add('hidden'), 3000);
                return;
            }
            
            // Save the word and update the star
            saveWord(word);
            document.getElementById('star-button').innerHTML = '<i class="fas fa-star"></i>';
        }
        
        // Update the saved words list
        updateSavedWordsUI();
    });
}

// Updates the UI to display the list of saved words
export function updateSavedWordsUI() {
    const list = document.getElementById('saved-words');
    const clearBtn = document.getElementById('clear-all-btn');
    const savedWords = getSavedWords();
    
    list.innerHTML = '';
    
    // Always update the word count display
    document.getElementById('word-count').textContent = `${savedWords.length}/5`;
    
    // Show/hide the clear button based on whether there are saved words
    if (savedWords.length === 0) {
        list.innerHTML = '<p class="text-gray-500 p-2">No saved words yet.</p>';
        clearBtn.classList.add('hidden');
        return;
    } else {
        clearBtn.classList.remove('hidden');
    }
    
    // Create list items for each saved word
    savedWords.forEach(word => {
        const li = document.createElement('li');
        li.className = "p-2 border-b flex justify-between items-center";
        li.innerHTML = `
            <span class="cursor-pointer word-text">${word}</span>
            <button class="text-yellow-500 remove-word" title="Remove from saved words">
                <i class="fas fa-star"></i>
            </button>
        `;
        
        // Make the word text clickable to search for the word
        li.querySelector('.word-text').addEventListener('click', () => {
            document.getElementById('search').value = word;
            document.getElementById('search-btn').click();
        });
        
        // Make the star clickable to remove the word from saved words
        li.querySelector('.remove-word').addEventListener('click', () => {
            removeWord(word);
            updateStarInDefinition(word, false); // Update definition UI star
            updateSavedWordsUI();
        });
        
        list.appendChild(li);
    });
}
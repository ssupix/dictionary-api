const STORAGE_KEY = 'savedWords';

// Retrieve saved words from localStorage
export function getSavedWords() {
    try {
        const words = JSON.parse(localStorage.getItem(STORAGE_KEY));
        // Validate that words is an array of strings
        if (Array.isArray(words)) {
            return words.filter(word => typeof word === 'string');
        }
        return [];
    } catch (error) {
        console.error('Error parsing saved words:', error);
        // Reset storage if there's an error
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

// Saves a word to localStorage
export function saveWord(word) {
    if (typeof word !== 'string') return false;
    
    let words = getSavedWords();
    
    // Don't save duplicates
    if (words.includes(word)) return true;
    
    // Check if we've reached the limit
    if (words.length >= 5) {
        return false; // Can't save more words
    }
    
    words.push(word);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    return true;
}

// Removes a word from localStorage
export function removeWord(word) {
    let words = getSavedWords().filter(w => w !== word);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

// Clears all saved words from localStorage
export function clearAllSavedWords() {
    localStorage.removeItem(STORAGE_KEY);
}
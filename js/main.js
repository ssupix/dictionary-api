
import { fetchWordDefinition } from './api.js';
import { updateDefinitionUI, updateSavedWordsUI } from './ui.js';
import { clearAllSavedWords } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the saved words list on page load
    updateSavedWordsUI();
    
    // Set up search button click handler
    document.getElementById('search-btn').addEventListener('click', async () => {
        const word = document.getElementById('search').value.trim();
        if (!word) return;
        const data = await fetchWordDefinition(word);
        updateDefinitionUI(data);
    });
    
    // Set up clear all button click handler
    document.getElementById('clear-all-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved words?')) {
            clearAllSavedWords();
            updateSavedWordsUI();
        }
    });
});
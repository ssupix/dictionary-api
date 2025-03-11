//API functions for fetching word definitions.
export async function fetchWordDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error('Word not found');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}
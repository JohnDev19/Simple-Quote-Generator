// Quote Generator

function cleanAuthorName(author) {
    return author.replace('@', '').trim();
}

function cleanQuote(quote) {
    return quote.replace(/\s*@\s*$/, '');
}

function displayQuote() {
    const div = document.querySelector('#quote');

    fetch('https://stoic.tekloon.net/stoic-quote')
        .then(response => response.json())
        .then(data => {
            const author = data.author ? cleanAuthorName(data.author) : 'Unknown';
            const cleanedQuote = cleanQuote(data.quote);
            const quote = `
                <div class="card">
                    <p>“${cleanedQuote}”</p>
                    <p>- ${author}</p>
                </div>
            `;
            div.innerHTML = quote;
        })
        .catch(error => console.error('Error fetching quote:', error));
}

window.onload = displayQuote;

// Poetry Finder

function getPoetry() {
    const authorInput = document.getElementById('authorInput');
    const poetryResult = document.getElementById('poetryResult');

    const author = encodeURIComponent(authorInput.value);

    fetch(`https://poetrydb.org/author/${author}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                const poem = getRandomPoem(data);
                renderPoem(poem, poetryResult);
            } else {
                renderNoPoetry(poetryResult);
            }
        })
        .catch(error => {
            console.error('Error fetching poetry:', error);
            renderError(poetryResult);
        });
}

function getRandomPoem(poems) {
    const randomIndex = Math.floor(Math.random() * poems.length);
    return poems[randomIndex];
}

function renderPoem(poem, container) {
    container.innerHTML = `<div class="card">
        <h3 style="text-align: center;">${poem.title}</h3>
        <p style="text-align: center;">By: ${poem.author}</p>
        <p style="text-align: center;">${poem.lines.join('<br>')}</p>
    </div>`;
}

function renderNoPoetry(container) {
    container.innerHTML = '<div class="card"><p style="text-align: center;">No poetry found for the specified author.</p></div>';
}

function renderError(container) {
    container.innerHTML = '<div class="card"><p style="text-align: center;">Error fetching poetry. Please try again later.</p></div>';
}

// Dictionary

function getDefinition() {
    const wordInput = document.getElementById('wordInput');
    const definitionResult = document.getElementById('definitionResult');

    const word = encodeURIComponent(wordInput.value);

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            const definition = data && data.length > 0 ? formatDefinition(data[0]) : 'No definition found.';
            definitionResult.innerHTML = `<div class="card">${definition}</div>`;
        })
        .catch(error => {
            console.error('Error fetching definition:', error);
            definitionResult.innerHTML = 'Error fetching definition.';
        });
}

function formatDefinition(data) {
    const phonetic = data.phonetics && data.phonetics.length > 0 ? data.phonetics[0].text : '';
    const meanings = data.meanings && data.meanings.length > 0 ? data.meanings.map(formatMeaning).join('') : '';

    return `
        <h3>${data.word}</h3>
        <p>Phonetic: ${phonetic}</p>
        <div>${meanings}</div>
    `;
}

function formatMeaning(meaning) {
    const partOfSpeech = meaning.partOfSpeech ? `<strong>${meaning.partOfSpeech}:</strong>` : '';
    const definitions = meaning.definitions && meaning.definitions.length > 0
        ? meaning.definitions.map(def => `<p>- ${def.definition}</p>`).join('')
        : '';

    return `<div>${partOfSpeech}${definitions}</div>`;
}

// Copyright (c) 2023 JOHN RÉ PORAS

// --- Random Quote Generator --- //

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

// --- Poetry --- //

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

    const word = wordInput.value.trim();

    if (!word) {
        definitionResult.innerHTML = 'Please provide a word.';
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found in the dictionary.');
            }
            return response.json();
        })
        .then(data => {
            const definition = data && data.length > 0 ? formatDefinition(data[0]) : 'No definition found.';
            definitionResult.innerHTML = `<div class="card">${definition}</div>`;
        })
        .catch(error => {
            console.error('Error fetching definition:', error.message);
            definitionResult.innerHTML = `<div class="card">Error: ${error.message}</div>`;
        });
}

function formatDefinition(data) {
    const word = data.word || 'No word provided';
    const phonetic = data.phonetics && data.phonetics.length > 0 ? data.phonetics[0].text : 'No Phonetic';
    const phoneticAudio = data.phonetics && data.phonetics.length > 0 ? data.phonetics[0].audio : '';
    const meanings = data.meanings && data.meanings.length > 0 ? data.meanings.map(formatMeaning).join('') : '';

    return `
        <h3>${word}</h3>
        <p style="text-align: center;">Phonetic: ${phonetic} ${createAudioElement(phoneticAudio)}</p>
        <div>${meanings}</div>
    `;
}

function createAudioElement(audioUrl) {
    if (audioUrl) {
        return `<audio controls><source src="${audioUrl}" type="audio/mpeg"></audio>`;
    } else {
        return '';
    }
}

function formatMeaning(meaning) {
    const partOfSpeech = meaning.partOfSpeech ? `<strong>${meaning.partOfSpeech}:</strong>` : '';
    const definitions = meaning.definitions && meaning.definitions.length > 0
        ? meaning.definitions.map(def => `<p>- ${def.definition}</p>`).join('')
        : '';

    return `<div>${partOfSpeech}${definitions}</div>`;
}


// --- Scrape --- //

function scrape() {
    const urlInput = document.getElementById('urlInput');
    const scrapeResult = document.getElementById('scrapeResult');

    const url = encodeURIComponent(urlInput.value);
    const apiKey = 'dc3fc7bc7dc540a7b1df7827fe205360'; // Replace with your actual API key

    fetch(`https://scrape.abstractapi.com/v1/?api_key=${apiKey}&url=${url}`)
        .then(response => response.json())
        .then(data => {
            const result = data && data.html ? formatScrapeResult(data.html) : 'No data found.';
            scrapeResult.innerHTML = `<div class="card">${result}</div>`;
        })
        .catch(error => {
            console.error('Error scraping:', error);
            scrapeResult.innerHTML = 'Error scraping.';
        });
}

function formatScrapeResult(html) {
    // Format and display the scraped HTML content
    return `
        <h3>Scraped Content</h3>
        <p>${html}</p>
        <button class="btn btn-outline-secondary" onclick="copyToClipboard('${html}')">Copy</button>
        <div class="notification" id="copyNotification">Copied to clipboard successfully!</div>
    `;
}

function copyToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Show the copy notification
    const copyNotification = document.getElementById('copyNotification');
    copyNotification.style.display = 'block';
    setTimeout(() => {
        copyNotification.style.display = 'none';
    }, 2000); // Hide the notification after 2 seconds
}



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

// Copyright (c) 2023 JOHN RÉ PORAS

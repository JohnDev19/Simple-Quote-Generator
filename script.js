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


// Copyright (c) 2023 JOHN RÉ PORAS

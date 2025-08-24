let quotes = JSON.parse(localStorage.getItem('quotesData')) || {
    wisdom: [
        { text: "The child who is not embraced by the village will burn it down to feel its warmth.", author: "African Proverb" },
        { text: "Knowledge is like a garden: if it is not cultivated, it cannot be harvested.", author: "African Proverb" },
        { text: "A wise person will always find a way.", author: "Tanzanian Proverb" }
    ],
    courage: [
        { text: "He who is afraid of the sun will not become chief.", author: "Ugandan Proverb" },
        { text: "Only a fool tests the depth of a river with both feet.", author: "African Proverb" },
        { text: "Do not look where you fell, but where you slipped.", author: "African Proverb" }
    ],
    unity: [
        { text: "If you want to go quickly, go alone. If you want to go far, go together.", author: "African Proverb" },
        { text: "Sticks in a bundle are unbreakable.", author: "Kenyan Proverb" },
        { text: "Cross the river in a crowd and the crocodile won't eat you.", author: "African Proverb" }
    ],
    perseverance: [
        { text: "However long the night, the dawn will break.", author: "African Proverb" },
        { text: "Smooth seas do not make skillful sailors.", author: "African Proverb" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "African Proverb" }
    ]
};

const categorySelect = document.getElementById('category-select');
const categoryFilter = document.getElementById('category-filter');
const newQuoteBtn = document.getElementById('new-quote-btn');
const addFavoriteBtn = document.getElementById('add-favorite-btn');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteInput = document.getElementById('new-quote');
const newAuthorInput = document.getElementById('new-author');
const newCategorySelect = document.getElementById('new-category');
const submitQuoteBtn = document.getElementById('submit-quote-btn');
const favoritesList = document.getElementById('favorites-list');

let favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let currentQuote = null;

function saveQuotesToStorage() {
    localStorage.setItem('quotesData', JSON.stringify(quotes));
}

function populateCategories() {
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    while (newCategorySelect.options.length > 0) {
        newCategorySelect.remove(0);
    }
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption.cloneNode(true));
    Object.keys(quotes).map(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
        newCategorySelect.appendChild(option.cloneNode(true));
    });
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    displayRandomQuote();
}

function quoteDisplay(quote) {
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
}

function displayRandomQuote() {
    const selectedCategory = categoryFilter.value;
    let availableQuotes = [];
    if (selectedCategory === 'all') {
        availableQuotes = Object.values(quotes).flatMap(category => category);
    } else {
        availableQuotes = quotes[selectedCategory] || [];
    }
    if (availableQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        currentQuote = availableQuotes[randomIndex];
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(currentQuote));
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        setTimeout(() => {
            quoteDisplay(currentQuote);
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 300);
    } else {
        quoteText.textContent = "No quotes available for this category.";
        quoteAuthor.textContent = "";
    }
}

function showRandomQuote() {
    displayRandomQuote();
}

function addToFavorites() {
    if (currentQuote && !favoriteQuotes.some(quote => quote.text === currentQuote.text)) {
        favoriteQuotes.push(currentQuote);
        localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
        updateFavoritesDisplay();
        alert("Quote added to favorites!");
    } else if (favoriteQuotes.some(quote => quote.text === currentQuote.text)) {
        alert("This quote is already in your favorites.");
    }
}

function updateFavoritesDisplay() {
    if (favoriteQuotes.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorite quotes yet.</p>';
        return;
    }
    favoritesList.innerHTML = favoriteQuotes.map((quote, index) => `
        <div class="favorite-item">
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">- ${quote.author}</p>
            <button class="btn remove-btn" data-index="${index}">Remove</button>
        </div>
    `).join('');
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromFavorites(index);
        });
    });
}

function removeFromFavorites(index) {
    favoriteQuotes.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
    updateFavoritesDisplay();
}

function addNewQuote() {
    const text = newQuoteInput.value.trim();
    const author = newAuthorInput.value.trim();
    const category = newCategorySelect.value;
    if (text === '' || author === '') {
        alert('Please fill in all fields.');
        return;
    }
    if (!quotes[category]) {
        quotes[category] = [];
        populateCategories();
    }
    quotes[category].push({ text, author });
    saveQuotesToStorage();
    newQuoteInput.value = '';
    newAuthorInput.value = '';
    alert('Quote added successfully!');
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = 'quotes.json';
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            Object.entries(importedQuotes).map(([category, importedList]) => {
                if (!quotes[category]) quotes[category] = [];
                quotes[category] = [...quotes[category], ...importedList];
            });
            saveQuotesToStorage();
            populateCategories();
            alert('Quotes imported successfully!');
            displayRandomQuote();
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

newQuoteBtn.addEventListener('click', displayRandomQuote);
addFavoriteBtn.addEventListener('click', addToFavorites);
submitQuoteBtn.addEventListener('click', addNewQuote);
categoryFilter.addEventListener('change', filterQuotes);
document.getElementById('export-btn').addEventListener('click', exportToJsonFile);
document.getElementById('import-file').addEventListener('change', importFromJsonFile);

populateCategories();
displayRandomQuote();
updateFavoritesDisplay();

const lastQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastQuote) {
    console.log("Last viewed quote:", lastQuote);
}

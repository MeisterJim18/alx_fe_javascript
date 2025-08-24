let quotes = JSON.parse(localStorage.getItem("quotes")) || {
    wisdom: [
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" }
    ],
    motivation: [
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" }
    ]
};
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const addFavoriteBtn = document.getElementById("addFavoriteBtn");
const viewFavoritesBtn = document.getElementById("viewFavoritesBtn");

function saveQuotesToStorage() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveFavoritesToStorage() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function populateCategories() {
    categorySelect.innerHTML = "";
    Object.keys(quotes).map(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}
populateCategories();

function displayRandomQuote() {
    const category = categorySelect.value;
    if (quotes[category] && quotes[category].length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes[category].length);
        const randomQuote = quotes[category][randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.author}`;
    } else {
        quoteDisplay.innerHTML = "No quotes available in this category.";
    }
}

function addQuote() {
    const category = prompt("Enter category:");
    const text = prompt("Enter quote text:");
    const author = prompt("Enter author:");
    if (category && text && author) {
        if (!quotes[category]) {
            quotes[category] = [];
        }
        quotes[category].push({ text, author });
        saveQuotesToStorage();
        populateCategories();
        alert("Quote added successfully!");
    }
}

function addFavorite() {
    const currentQuote = quoteDisplay.innerText;
    if (currentQuote && !favorites.includes(currentQuote)) {
        favorites.push(currentQuote);
        saveFavoritesToStorage();
        alert("Added to favorites!");
    }
}

function viewFavorites() {
    if (favorites.length === 0) {
        alert("No favorites yet!");
    } else {
        alert("Favorites:\n" + favorites.join("\n"));
    }
}

newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
addFavoriteBtn.addEventListener("click", addFavorite);
viewFavoritesBtn.addEventListener("click", viewFavorites);

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; 

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();
        const serverQuotes = data.slice(0, 5).map(post => ({
            text: post.title,
            author: `User ${post.userId}`
        }));
        return { wisdom: serverQuotes }; 
    } catch {
        return {};
    }
}

async function pushQuotesToServer(newQuotes) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            body: JSON.stringify(newQuotes),
            headers: { "Content-Type": "application/json" }
        });
    } catch {}
}

async function syncQuotes() {
    const serverData = await fetchQuotesFromServer();
    for (const category in serverData) {
        if (!quotes[category]) quotes[category] = [];
        quotes[category] = [
            ...serverData[category], 
            ...quotes[category].filter(
                localQuote => !serverData[category].some(serverQuote => serverQuote.text === localQuote.text)
            )
        ];
    }
    saveQuotesToStorage();
    populateCategories();
    displayRandomQuote();
    alert("🔄 Data synced with server!");
}

setInterval(syncQuotes, 30000);

displayRandomQuote();

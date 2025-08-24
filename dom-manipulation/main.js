const quotes = {
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

        function displayRandomQuote() {
            const selectedCategory = categorySelect.value;
            let availableQuotes = [];
            
            if (selectedCategory === 'all') {
                for (const category in quotes) {
                    availableQuotes = availableQuotes.concat(quotes[category]);
                }
            } else {
                availableQuotes = quotes[selectedCategory];
            }
            
            if (availableQuotes.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableQuotes.length);
                currentQuote = availableQuotes[randomIndex];
                
                quoteText.style.opacity = 0;
                quoteAuthor.style.opacity = 0;
                
                setTimeout(() => {
                    quoteText.textContent = `"${currentQuote.text}"`;
                    quoteAuthor.textContent = `- ${currentQuote.author}`;
                    
                    quoteText.style.opacity = 1;
                    quoteAuthor.style.opacity = 1;
                }, 300);
            } else {
                quoteText.textContent = "No quotes available for this category.";
                quoteAuthor.textContent = "";
            }
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
            favoritesList.innerHTML = '';
            
            if (favoriteQuotes.length === 0) {
                favoritesList.innerHTML = '<p class="empty-message">No favorite quotes yet.</p>';
                return;
            }
            
            favoriteQuotes.forEach((quote, index) => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <p class="quote-text">"${quote.text}"</p>
                    <p class="quote-author">- ${quote.author}</p>
                    <button class="btn remove-btn" data-index="${index}">Remove</button>
                `;
                favoritesList.appendChild(favoriteItem);
            });
            
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
            }
            
            quotes[category].push({ text, author });
            
            newQuoteInput.value = '';
            newAuthorInput.value = '';
            
            alert('Quote added successfully!');
        }

        newQuoteBtn.addEventListener('click', displayRandomQuote);
        addFavoriteBtn.addEventListener('click', addToFavorites);
        submitQuoteBtn.addEventListener('click', addNewQuote);
        categorySelect.addEventListener('change', displayRandomQuote);

        displayRandomQuote();
        updateFavoritesDisplay();
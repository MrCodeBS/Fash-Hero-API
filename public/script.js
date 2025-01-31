// public/script.js
const API_BASE = '/.netlify/functions/flashcards';

// Load categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const categories = await response.json();
    
    const categorySelect = document.getElementById('category-select');
    categorySelect.innerHTML = `
      <option value="">Select a category</option>
      ${categories.map(category => 
        `<option value="${category}">${category}</option>`
      ).join('')}
    `;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load flashcards for selected category
async function loadFlashcards(category) {
  try {
    const response = await fetch(`${API_BASE}/category/${category}`);
    const flashcards = await response.json();
    
    const flashcardsContainer = document.getElementById('flashcards-container');
    flashcardsContainer.innerHTML = flashcards.map(card => `
      <div class="flashcard" onclick="this.classList.toggle('flipped')">
        <div class="front">${card.front}</div>
        <div class="back">${card.back}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading flashcards:', error);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  
  const categorySelect = document.getElementById('category-select');
  categorySelect.addEventListener('change', (e) => {
    if (e.target.value) {
      loadFlashcards(e.target.value);
    }
  });
});

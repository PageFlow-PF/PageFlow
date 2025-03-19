import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAKE4dopleQro-BIASM8v-KG_VnYmc_4c",
    authDomain: "pageflow-609fa.firebaseapp.com",
    projectId: "pageflow-609fa",
    storageBucket: "pageflow-609fa.appspot.com",
    messagingSenderId: "66179754558",
    appId: "1:66179754558:web:2d6a0da33f77718dfc7f6f",
    measurementId: "G-WH5RKEY1EV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let booksArray = [];

async function getBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    try {
        const booksRef = collection(db, "books");
        const snapshot = await getDocs(booksRef);

        if (snapshot.empty) {
            bookList.innerHTML = "<p>Geen boeken gevonden.</p>";
            return;
        }

        let delay = 0;
        booksArray = [];

        snapshot.forEach(doc => {
            const bookData = doc.data();
            if (!bookData.downloadLink) {
                console.warn("⚠️ Geen downloadLink gevonden voor", bookData.title);
                return;
            }

            booksArray.push({ id: doc.id, ...bookData });

            const bookElement = document.createElement("div");
            bookElement.classList.add("book");

            bookElement.innerHTML = `
                <img src="${bookData.coverUrl}" alt="Boek Cover">
                <h2>${bookData.title}</h2>
                <button onclick="window.open('${bookData.downloadLink}', '_blank')">
                    📥 Download het boek
                </button>
            `;

            bookList.appendChild(bookElement);

            setTimeout(() => {
                bookElement.classList.add("show");
            }, delay);

            delay += 200;
        });

    } catch (error) {
        console.error("🔥 Fout bij het ophalen van boeken:", error);
        bookList.innerHTML = "<p>Er is een fout opgetreden bij het laden van de boeken.</p>";
    }
}

getBooks();

// 🔍 Zoekfunctie
window.searchBooks = function() {
    let input = document.getElementById("search").value.toLowerCase();
    let selectedCategory = document.getElementById("categoryFilter").value;
    let bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    booksArray.forEach(book => {
        if (
            book.title.toLowerCase().includes(input) &&
            (selectedCategory === "all" || book.category === selectedCategory)
        ) {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book", "show");

            bookElement.innerHTML = `
                <img src="${book.coverUrl}" alt="Boek Cover">
                <h2>${highlightText(book.title, input)}</h2>
                <button onclick="window.open('${book.downloadLink}', '_blank')">
                    📥 Download het boek
                </button>
            `;

            bookList.appendChild(bookElement);
        }
    });

    if (bookList.innerHTML === "") {
        bookList.innerHTML = "<p>Geen resultaten gevonden.</p>";
    }
}

// 🎨 Highlight zoekwoord
function highlightText(text, keyword) {
    if (!keyword) return text;
    let regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<span style="background: yellow; color: black; font-weight: bold;">$1</span>`);
}

async function getBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    try {
        const booksRef = collection(db, "books");
        const snapshot = await getDocs(booksRef);

        if (snapshot.empty) {
            bookList.innerHTML = "<p>Geen boeken gevonden.</p>";
            return;
        }

        // Groepeer boeken per categorie
        const booksByCategory = {};

        snapshot.forEach(doc => {
            const bookData = doc.data();
            if (!bookData.downloadLink) {
                console.warn("⚠️ Geen downloadLink gevonden voor", bookData.title);
                return;
            }

            if (!booksByCategory[bookData.category]) {
                booksByCategory[bookData.category] = [];
            }
            booksByCategory[bookData.category].push({ id: doc.id, ...bookData });
        });

        // Toon boeken per categorie
        for (const category in booksByCategory) {
            const categorySection = document.createElement("div");
            categorySection.classList.add("category-section");

            const categoryTitle = document.createElement("h2");
            categoryTitle.textContent = category;
            categoryTitle.classList.add("category-title");
            categorySection.appendChild(categoryTitle);

            const booksContainer = document.createElement("div");
            booksContainer.classList.add("book-container");

            booksByCategory[category].forEach(book => {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book");

                bookElement.innerHTML = `
                    <img src="${book.coverUrl}" alt="Boek Cover">
                    <h2>${book.title}</h2>
                    <button onclick="window.open('${book.downloadLink}', '_blank')">
                        📥 Download het boek
                    </button>
                `;

                booksContainer.appendChild(bookElement);
            });

            categorySection.appendChild(booksContainer);
            bookList.appendChild(categorySection);
        }

    } catch (error) {
        console.error("🔥 Fout bij het ophalen van boeken:", error);
        bookList.innerHTML = "<p>Er is een fout opgetreden bij het laden van de boeken.</p>";
    }
}
let myLibrary = [];

function saveToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

class Book {
  constructor(title, author, pages, read, image, id) {
    this.id = id || crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.image = image || "";
  }

  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(title, author, pages, read, image) {
  const newBook = new Book(title, author, pages, read, image);
  myLibrary.push(newBook);
  saveToLocalStorage();
  displayLibrary();
}

function removeBook(id) {
  const index = myLibrary.findIndex((book) => book.id === id);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    saveToLocalStorage();

    // Remove just the card from the DOM
    const card = document.querySelector(`.book-card[data-id="${id}"]`);
    if (card) card.remove();
  }
}

function toggleReadStatus(id) {
  const book = myLibrary.find((book) => book.id === id);
  if (book) {
    book.toggleRead();
    saveToLocalStorage();

    // Update just the status text inside the card
    const card = document.querySelector(`.book-card[data-id="${id}"]`);
    if (card) {
      const statusParagraph = card.querySelector(
        ".book-details p:nth-child(4)"
      );
      statusParagraph.innerHTML = `<strong>Status:</strong> ${
        book.read ? "Read" : "Unread"
      }`;
    }
  }
}

function displayLibrary() {
  const libraryContainer = document.getElementById("library");
  libraryContainer.innerHTML = "";

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.dataset.id = book.id;

    card.innerHTML = `
    ${
      book.image
        ? `<img src="${book.image}" alt="Book Cover" class="book-image">`
        : ""
    }
    <div class="book-details">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <p><strong>Status:</strong> ${book.read ? "Read" : "Unread"}</p>
        <button class="remove-btn">Remove</button>
        <button class="toggle-read-btn">Toggle Read Status</button>
    </div>
`;

    libraryContainer.appendChild(card);
  });

  addCardEventListeners();
}

function addCardEventListeners() {
  const removeButtons = document.querySelectorAll(".remove-btn");
  const toggleReadButtons = document.querySelectorAll(".toggle-read-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const bookId = e.target.closest(".book-card").dataset.id;
      removeBook(bookId);
    });
  });

  toggleReadButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const bookId = e.target.closest(".book-card").dataset.id;
      toggleReadStatus(bookId);
    });
  });
}

// Form handling
const newBookBtn = document.getElementById("new-book-btn");
const bookFormContainer = document.getElementById("book-form-container");
const bookForm = document.getElementById("book-form");

newBookBtn.addEventListener("click", () => {
  bookFormContainer.style.display = "block";
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const image = document.getElementById("image").value;
  const read = document.getElementById("read").checked;

  addBookToLibrary(title, author, pages, read, image);

  bookForm.reset();
  bookFormContainer.style.display = "none";
});

// On page load
if (localStorage.getItem("myLibrary")) {
  const storedLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  myLibrary = storedLibrary.map((bookData) => {
    return new Book(
      bookData.title,
      bookData.author,
      bookData.pages,
      bookData.read,
      bookData.image
    );
  });
} else {
  myLibrary = [
    new Book(
      "Think and Grow Rich",
      "Napoleon Hill",
      234,
      true,
      "https://m.media-amazon.com/images/I/61IxJuRI39L._AC_UF1000,1000_QL80_.jpg"
    ),
    new Book(
      "The Lord of the Rings",
      "J.R.R. Tolkien",
      1077,
      false,
      "https://m.media-amazon.com/images/I/81nV6x2ey4L._AC_UF1000,1000_QL80_.jpg"
    ),
    new Book(
      "The 4-Hour Workweek",
      "Tim Ferris",
      448,
      false,
      "https://m.media-amazon.com/images/I/71vO9Tbf4-L.jpg"
    ),
    new Book(
      "The Richest Man In Babylon",
      "George S. Clason",
      160,
      false,
      "https://m.media-amazon.com/images/I/61oQVDIizfL._AC_UF1000,1000_QL80_.jpg"
    ),
  ];
  saveToLocalStorage();
}

displayLibrary();

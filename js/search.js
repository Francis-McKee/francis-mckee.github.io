document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");
  const latestPosts = document.getElementById("latest-posts");
  const bookFilterContainer = document.getElementById("book-filter");

  if (!input || !resultsContainer) return;

  let idx;
  let posts = [];
  const selectedBooks = new Set();

  fetch("/search.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load search index.");
      }
      return response.json();
    })
    .then(data => {
      posts = data;

      idx = lunr(function () {
        this.ref("url");
        this.field("title");
        this.field("content");

        posts.forEach(function (doc) {
          this.add(doc);
        }, this);
      });

      renderBookFilters();
      renderResults();
    })
    .catch(error => {
      console.error("Search initialization failed:", error);
      resultsContainer.textContent = "Search is temporarily unavailable.";
    });

  function renderBookFilters() {
    if (!bookFilterContainer) return;

    // NEEDS to be updated as you add more books to the site!
    const bookOrder = [
      "genesis",
      "exodus",
      "leviticus",
      "numbers",
      "romans",
      "galatians",
      "hebrews"
    ];

    const availableBooks = [...new Set(
      posts
        .map(post => post.book)
        .filter(book => typeof book === "string" && book.length > 0)
    )];

    const books = availableBooks.sort((a, b) => {
      const indexA = bookOrder.indexOf(a.toLowerCase());
      const indexB = bookOrder.indexOf(b.toLowerCase());

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    bookFilterContainer.replaceChildren();

    if (books.length === 0) return;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = "Filter";
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-controls", "book-filter-options");

    const optionsContainer = document.createElement("div");
    optionsContainer.id = "book-filter-options";
    optionsContainer.hidden = true;

    toggleButton.addEventListener("click", function () {
      const isExpanded = !optionsContainer.hidden;
      optionsContainer.hidden = isExpanded;
      toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    });

    books.forEach(book => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.value = book;
      checkbox.checked = selectedBooks.has(book);

      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          selectedBooks.add(book);
        } else {
          selectedBooks.delete(book);
        }

        renderResults();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(
        " " + book.charAt(0).toUpperCase() + book.slice(1)
      ));

      optionsContainer.appendChild(label);
    });

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.textContent = "Clear book filters";

    clearButton.addEventListener("click", function () {
      selectedBooks.clear();

      optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });

      renderResults();
    });

    optionsContainer.appendChild(clearButton);
    bookFilterContainer.appendChild(toggleButton);
    bookFilterContainer.appendChild(optionsContainer);
  }

  function makeSnippetAroundMatch(text, term, radius) {
    if (!text) return "";

    const lower = text.toLowerCase();
    const i = lower.indexOf(term.toLowerCase());

    if (i === -1) {
      return text.substring(0, radius * 2) + "...";
    }

    const start = Math.max(0, i - radius);
    const end = Math.min(text.length, i + radius);

    return (start > 0 ? "..." : "") +
      text.substring(start, end) +
      (end < text.length ? "..." : "");
  }

  function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function highlightTerm(text, term) {
    const escapedText = escapeHTML(text);

    if (!term) return escapedText;

    const safeTerm = escapeHTML(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("(" + safeTerm + ")", "gi");

    return escapedText.replace(regex, "<mark>$1</mark>");
  }

  function showLatest(show) {
    if (!latestPosts) return;
    latestPosts.style.display = show ? "" : "none";
  }

  function renderResults() {
    if (!idx) return;

    const query = input.value.trim();
    const hasQuery = query.length >= 2;
    const hasBookFilters = selectedBooks.size > 0;

    if (!hasQuery && !hasBookFilters) {
      resultsContainer.replaceChildren();
      showLatest(true);
      return;
    }

    showLatest(false);

    let results;

    if (hasQuery) {
      try {
        results = idx.search(query).map(result => ({
          post: posts.find(post => post.url === result.ref),
          score: result.score
        })).filter(result => result.post);
      } catch (error) {
        resultsContainer.textContent = "Unable to process this search query.";
        return;
      }
    } else {
      results = posts.map(post => ({
        post,
        score: 0
      }));
    }

    results = results.filter(result => {
      return !hasBookFilters || selectedBooks.has(result.post.book);
    });

    if (!hasQuery) {
      results.sort((a, b) => a.post.date.localeCompare(b.post.date));
    }

    if (results.length === 0) {
      resultsContainer.textContent = "No matching posts found.";
      return;
    }

    resultsContainer.innerHTML = results.map(({ post }) => {
      const snippetRaw = makeSnippetAroundMatch(
        post.content,
        query,
        70
      );

      const snippet = highlightTerm(snippetRaw, query);
      const title = highlightTerm(post.title, query);
      const url = escapeHTML(post.url);

      return `<br>
              <div>
                <a href="${url}"><strong>${title}</strong></a>
                <div>${snippet}</div>
              </div>`;
    }).join("");
  }

  input.addEventListener("input", renderResults);
});
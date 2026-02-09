document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const latestPosts = document.getElementById('latest-posts');

  if (!input || !resultsContainer) return;

  let idx;
  let posts = [];

  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      posts = data;

      idx = lunr(function () {
        this.ref('url');
        this.field('title');
        this.field('content');

        posts.forEach(function (doc) {
          this.add(doc);
        }, this);
      });
    });

  function makeSnippetAroundMatch(text, term, radius) {
    if (!text) return "";
    const lower = text.toLowerCase();
    const i = lower.indexOf(term.toLowerCase());
    if (i === -1) {
      return text.substring(0, radius * 2) + "...";
    }
    const start = Math.max(0, i - radius);
    const end = Math.min(text.length, i + radius);
    return (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
  }

  function highlightTerm(text, term) {
    if (!term) return text;
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp("(" + safe + ")", "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  function showLatest(show) {
    if (!latestPosts) return;
    latestPosts.style.display = show ? "" : "none";
  }

  input.addEventListener('input', function () {
    if (!idx) return;

    const query = input.value.trim();

    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      showLatest(true);
      return;
    }

    showLatest(false);

    const results = idx.search(query);

    if (results.length === 0) {
        resultsContainer.innerHTML = "<div>No matching posts found.</div>";
    }

    resultsContainer.innerHTML = results.map(result => {
      const post = posts.find(p => p.url === result.ref);
      const snippetRaw = makeSnippetAroundMatch(post.content, query, 70);
      const snippet = highlightTerm(snippetRaw, query);
      const title = highlightTerm(post.title, query);

      return `<div>
        <a href="${post.url}"><strong>${title}</strong></a>
        <div>${snippet}</div>
      </div>`;
    }).join('');
  });
});




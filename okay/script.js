const CATEGORIES = [
  { name: "technology", color: "#9F0D7F" },
  { name: "science", color: "#B2533E" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#f97316" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#eab308" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "Python was created by Guido van Rossum, and first released on February 20, 1991.",
    source: "https://pythoninstitute.org",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 6,
    votesFalse: 4,
    createdIn: 2023,
  },
  {
    id: 2,
    text: "People between the ages of 18 to 33 are the most stressed in the world.",
    source: "https://psychoseri.com/psychological-facts-about-human-behaviour/",
    category: "society",
    votesInteresting: 13,
    votesMindblowing: 2,
    votesFalse: 1,
    createdIn: 2023,
  },
  {
    id: 3,
    text: "The capital city of India is New Delhi. It's located in the National Capital Territory of Delhi (NCT).",
    source: "https://en.wikipedia.org/wiki/India",
    category: "society",
    votesInteresting: 9,
    votesMindblowing: 3,
    votesFalse: 0,
    createdIn: 2023,
  },
];

// Selecting DOM elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

// Create DOM elements: Render facts in list
factsList.innerHTML = "";

// Load data from Supabase
loadFacts();

async function loadFacts() {
  const res = await fetch(
    "https://gzujwjkmfbzsojtbdany.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "your key",
        authorization:
          "Bearer your key",
      },
    }
  );
  const data = await res.json();

  createFactsList(data);
}

function createFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) => `<li class="fact">
    <p>
    ${fact.text}
      <a
        class="source"
        href="${fact.source}"
        target="_blank"
      >(Source)</a>
    </p>
    <span class="tag" style="background-color: ${
      CATEGORIES.find((cat) => cat.name === fact.category).color
    }">${fact.category}</span>
  </li>`
  );
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});

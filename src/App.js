import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "Python was created by Guido van Rossum, and first released on February 20, 1991.",
    source: "https://pythoninstitute.org",
    category: "technology",
    votesInteresting: 21,
    votesMindblowing: 5,
    votesFalse: 2,
    createdIn: 2023,
  },
  {
    id: 2,
    text: "People between the ages of 18 to 33 are the most stressed in the world.",
    source: "https://psychoseri.com/psychological-facts-about-human-behaviour/",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
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

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}> {count} </span>{" "}
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1{" "}
      </button>{" "}
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />{" "}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}{" "}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />{" "}
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}{" "}
      </main>{" "}
    </>
  );
}

function Loader() {
  return <p className="message"> Loading... </p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Did You Know Logo" />
        <h1> {appTitle} </h1>{" "}
      </div>{" "}
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share facts"}{" "}
      </button>{" "}
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");

  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      setText("");
      setSource("");
      setCategory("");

      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with us..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />{" "}
      <span> {200 - textLength} </span>{" "}
      <input
        value={source}
        type="text"
        placeholder="Source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />{" "}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value=""> Choose category: </option>{" "}
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {" "}
            {cat.name.toUpperCase()}{" "}
          </option>
        ))}{" "}
      </select>{" "}
      <button className="btn btn-large" disabled={isUploading}>
        Post{" "}
      </button>{" "}
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All{" "}
          </button>{" "}
        </li>{" "}
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}{" "}
            </button>{" "}
          </li>
        ))}{" "}
      </ul>{" "}
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0)
    return (
      <p className="message">
        No facts for this category yet!Become First to Share{" "}
      </p>
    );

  return (
    <section>
      <ul className="facts-list">
        {" "}
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}{" "}
      </ul>{" "}
      <p>
        {" "}
        There are {facts.length}
        facts in the database.Add your own!{" "}
      </p>{" "}
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({
        [columnName]: fact[columnName] + 1,
      })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {" "}
        {isDisputed ? (
          <span className="disputed"> [⛔️DISPUTED] </span>
        ) : null}{" "}
        {fact.text}{" "}
        <a className="source" href={fact.source} target="_blank">
          (Source){" "}
        </a>{" "}
      </p>{" "}
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}{" "}
      </span>{" "}
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍{fact.votesInteresting}{" "}
        </button>{" "}
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯{fact.votesMindblowing}{" "}
        </button>{" "}
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          {" "}
          ⛔️ {fact.votesFalse}{" "}
        </button>{" "}
      </div>{" "}
    </li>
  );
}

export default App;
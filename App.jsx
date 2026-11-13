import { useState, useEffect } from "react";
import "./App.css";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= (hover || value) ? "star on" : "star"}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function EmojiRating({ rating }) {
  return (
    <span className="emoji-rating" title={`${rating} out of 5`}>
      {"⭐".repeat(rating)}
      {"☆".repeat(5 - rating)} ({rating}/5)
    </span>
  );
}

function MovieItem({ movie, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(movie.comment);

  const saveComment = () => {
    onUpdate(movie.id, { comment: draft.trim() });
    setEditing(false);
  };

  return (
    <li className="movie-card">
      <div className="movie-header">
        <h3>🎬 {movie.title}</h3>
        <button className="btn-remove" onClick={() => onRemove(movie.id)}>
          Remove
        </button>
      </div>

      <EmojiRating rating={movie.rating} />

      {/* Change rating after adding */}
      <StarPicker
        value={movie.rating}
        onChange={(r) => onUpdate(movie.id, { rating: r })}
      />

      {editing ? (
        <div className="comment-edit">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Write your review..."
          />
          <button onClick={saveComment}>Save</button>
          <button className="btn-secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="comment">
          <p>{movie.comment ? `💬 ${movie.comment}` : "No review yet."}</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setDraft(movie.comment);
              setEditing(true);
            }}
          >
            {movie.comment ? "Edit review" : "Add review"}
          </button>
        </div>
      )}
    </li>
  );
}

export default function App() {
  // Load saved movies from localStorage so the list survives a refresh
  const [movies, setMovies] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("movies")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  // Requirement 1 + 2 + 3: add a movie with rating and comment
  const handleAdd = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a movie title.");
      return;
    }
    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: title.trim(),
      rating,
      comment: comment.trim(),
    };

    setMovies([newMovie, ...movies]);
    setTitle("");
    setRating(0);
    setComment("");
    setError("");
  };

  const handleRemove = (id) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  const handleUpdate = (id, changes) => {
    setMovies(movies.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  };

  const average =
    movies.length === 0
      ? 0
      : (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1);

  return (
    <div className="app">
      <h1>🍿 My Movie Watch List</h1>

      <form className="movie-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="rating-row">
          <span>Your rating:</span>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <textarea
          placeholder="Write a short review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Add movie</button>
      </form>

      {movies.length > 0 && (
        <p className="summary">
          {movies.length} movie{movies.length > 1 ? "s" : ""} watched · average
          rating {average} ⭐
        </p>
      )}

      {movies.length === 0 ? (
        <p className="empty">No movies yet. Add the first one above!</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

import { useState } from "react";
import "./App.css";

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? "star on" : "star"}
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
    <span className="emoji-rating">
      {"⭐".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function MovieItem({ movie, onRemove }) {
  return (
    <li className="movie-card">
      <div className="movie-header">
        <h3>🎬 {movie.title}</h3>
        <button className="btn-remove" onClick={() => onRemove(movie.id)}>
          Remove
        </button>
      </div>

      <EmojiRating rating={movie.rating} />

      <div className="comment">
        <p>{movie.comment ? `💬 ${movie.comment}` : "No review yet."}</p>
      </div>
    </li>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

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

      {movies.length === 0 ? (
        <p className="empty">No movies yet. Add the first one above!</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
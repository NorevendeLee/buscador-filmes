// src/pages/MovieDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));

    if (id) {
      getMovieDetails(id).then((data) => setMovie(data));
    }
  }, [id]);

  function toggleFavorite() {
    if (!id) return;
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  if (!movie) {
    return <p style={{ padding: "20px" }}>Carregando detalhes...</p>;
  }

  const isFav = favorites.includes(movie.imdbID);

  return (
    <div className="details">
      <Link to="/" className="back-btn">⬅ Voltar</Link>
      <div className="details-content">
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/200x300?text=Sem+Imagem"
          }
          alt={movie.Title}
        />
        <div>
          <h1>{movie.Title}</h1>
          <p><strong>Ano:</strong> {movie.Year}</p>
          <p><strong>Gênero:</strong> {movie.Genre}</p>
          <p><strong>Diretor:</strong> {movie.Director}</p>
          <p><strong>Elenco:</strong> {movie.Actors}</p>
          <p><strong>Enredo:</strong> {movie.Plot}</p>

          <button
            className={`fav-btn ${isFav ? "fav" : ""}`}
            onClick={toggleFavorite}
          >
            {isFav ? "❤️ Remover dos favoritos" : "🤍 Adicionar aos favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
}

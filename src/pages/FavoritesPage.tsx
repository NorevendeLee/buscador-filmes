// src/pages/FavoritesPage.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useFavorites } from "../contexts/FavoritesContext";

import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Inicia como true para carregar os detalhes
  const navigate = useNavigate();

  useEffect(() => {
    // favorites já contém os objetos Movie completos
    setFavoriteMovies(favorites);
    setLoading(false);
  }, [favorites]); // Depende da lista de favoritos do contexto

  return (
    <div className="container">
      <Link to="/" className="back-btn">⬅ Voltar para o início</Link>
      <h1 className="section-title">Meus Favoritos</h1>

      {loading && <div className="loader"></div>}

      {!loading && favoriteMovies.length === 0 && (
        <p>Você ainda não adicionou nenhum filme aos favoritos.</p>
      )}

      {!loading && favoriteMovies.length > 0 && (
        <div className="movies-grid">
          {favoriteMovies.map((movie) => (
            <MovieCard // MovieCard já espera um objeto Movie
              key={movie.imdbID}
              movie={movie}
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
              isFavorite={true} // Sempre será favorito nesta página
              onToggleFavorite={() => toggleFavorite(movie)} // Passa o objeto Movie completo
            />
          ))}
        </div>
      )}
    </div>
  );
}
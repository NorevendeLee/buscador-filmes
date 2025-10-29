import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // 🔹 Carrega favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // 🔹 Atualiza localStorage quando favoritos mudam
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🔹 Carrega sugestões iniciais (carrossel)
  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      setError("");

      const suggestionsTitles = [
        "Batman",
        "Harry Potter",
        "Avengers",
        "Star Wars",
        "Spider-Man",
        "Frozen",
      ];

      try {
        const allResults = await Promise.all(
          suggestionsTitles.map((title) => searchMovies(title))
        );

        const merged = allResults.flat().slice(0, 6);
        setSuggestions(merged);
      } catch (err) {
        setError("Erro ao carregar sugestões 😔");
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, []);

  // 🔹 Busca manual
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setHasSearched(true);

    const results = await searchMovies(search);

    if (results.length === 0) {
      setError("Nenhum filme encontrado. Tente outro nome!");
    }

    setMovies(results);
    setLoading(false);
  }

  // 🔹 Detalhes
  function handleDetails(id: string) {
    navigate(`/movie/${id}`);
    setSearch("");
    setHasSearched(false);
  }

  // 🔹 Favoritos
  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  // 🔹 Voltar para o início (clicando na logo)
  function handleGoHome() {
    setSearch("");
    setMovies([]);
    setHasSearched(false);
    setError("");
  }

  return (
    <>
      {/* 🔸 Header estilo Netflix */}
      <header>
        <h1 className="logo" onClick={handleGoHome} style={{ cursor: "pointer" }}>
          🎬 RoxFlix
        </h1>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar filme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      <div className="container">
        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}

        {/* 🔹 Sugestões iniciais */}
        {!hasSearched && suggestions.length > 0 && (
          <>
            <h2 className="section-title">✨ Sugestões para você</h2>
            <div className="movies-grid">
              {suggestions.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onClick={() => handleDetails(movie.imdbID)}
                  isFavorite={favorites.includes(movie.imdbID)}
                  onToggleFavorite={() => toggleFavorite(movie.imdbID)}
                />
              ))}
            </div>
          </>
        )}

        {/* 🔹 Resultados da busca */}
        {hasSearched && movies.length > 0 && (
          <>
            <h2 className="section-title">🔍 Resultados da busca</h2>
            <div className="movies-grid-3x">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onClick={() => handleDetails(movie.imdbID)}
                  isFavorite={favorites.includes(movie.imdbID)}
                  onToggleFavorite={() => toggleFavorite(movie.imdbID)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

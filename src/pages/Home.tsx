// src/pages/Home.tsx
import type { MouseEvent } from "react";
import { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getMovieDetails } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeMovie, setActiveMovie] = useState<any | null>(null);
  const [modalDetails, setModalDetails] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  // favoritos do localStorage
  const initialLoad = useRef(true);
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Efeito para buscar detalhes quando um filme é selecionado para o modal
  useEffect(() => {
    if (activeMovie) {
      setModalLoading(true);
      setModalDetails(null); // Limpa detalhes anteriores
      getMovieDetails(activeMovie.imdbID)
        .then((details) => {
          setModalDetails(details);
        })
        .catch(() => {
          setError("Não foi possível carregar os detalhes do filme.");
        })
        .finally(() => setModalLoading(false));
    }
  }, [activeMovie]);

  // sugestões iniciais
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
        setError("Erro ao carregar sugestões");
      } finally {
        setLoading(false);
        initialLoad.current = false;
      }
    }
    if (initialLoad.current)
      loadSuggestions();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setMovies([]);
    setHasSearched(true);

    const results = await searchMovies(search);
    if (!results || results.length === 0) {
      setError("Nenhum filme encontrado. Tente outro nome!");
      setMovies([]);
    } else {
      setMovies(results);
    }

    setLoading(false);
  }



  function handleWatch(id: string) {
    navigate(`/watch/${id}`);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function handleGoHome() {
    setSearch("");
    setMovies([]);
    setHasSearched(false);
    setError("");
  }

  // Define qual filme será usado no fundo: o ativo (modal) ou o primeiro da sugestão.
  const backgroundMovie = activeMovie || (suggestions.length > 0 ? suggestions[0] : null);

  return (
    <div className={`home-container ${activeMovie ? 'modal-open' : ''}`}>
      {/* Header */}
      <header className="home-header">
        <h1 className="logo" onClick={handleGoHome}>🎬 RoxFlix</h1>
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

      {/* Background de destaque (se houver ativo, mostra a imagem como fundo) */}
      <div className="backdrop-container">
        {backgroundMovie ? (
          <img src={backgroundMovie.Poster !== "N/A" ? backgroundMovie.Poster : ""} alt="" className="backdrop-image" />
        ) : (
          <div className="backdrop-placeholder" />
        )}
      </div>

      <main className="home-main">
        {loading && <div className="loader"></div>}
        {error && <p className="error-message">{error}</p>}

        {!hasSearched && suggestions.length > 0 && (
          <>
            <h2 style={{ marginBottom: 16 }}>✨ Sugestões para você</h2>
            <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 24 }}>
              {suggestions.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onClick={() => setActiveMovie(movie)}
                  isFavorite={favorites.includes(movie.imdbID)}
                  onToggleFavorite={() => toggleFavorite(movie.imdbID)}
                  layoutId={movie.imdbID}
                />
              ))}
            </div>
          </>
        )}

        {hasSearched && movies.length > 0 && (
          <>
            <h2 style={{ marginBottom: 16 }}>🔍 Resultados da busca</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 240px)", gap: 18 }}>
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onClick={() => setActiveMovie(movie)}
                  isFavorite={favorites.includes(movie.imdbID)}
                  onToggleFavorite={() => toggleFavorite(movie.imdbID)}
                  layoutId={movie.imdbID}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Expandido */}
      <AnimatePresence>
        {activeMovie && (
          <motion.div
            layoutId={activeMovie.imdbID}
            onClick={() => setActiveMovie(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e: MouseEvent) => e.stopPropagation()}
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-grid">
                <img
                  src={activeMovie.Poster !== "N/A" ? activeMovie.Poster : "https://via.placeholder.com/400x600?text=Sem+Imagem"}
                  alt={activeMovie.Title}
                  className="modal-poster"
                />
                <div className="modal-info">                  
                  {modalLoading ? (
                    <div className="loader-container"><div className="loader"></div></div>
                  ) : (
                    <>
                      <h1>{modalDetails?.Title || activeMovie.Title}</h1>
                      <p className="meta">{modalDetails?.Year} • {modalDetails?.Rated} • {modalDetails?.Runtime}</p>
                      <p className="plot">{modalDetails?.Plot || "Enredo não disponível."}</p>

                      <div className="details-list">
                        <p><strong>Gênero:</strong> {modalDetails?.Genre}</p>
                        <p><strong>Atores:</strong> {modalDetails?.Actors}</p>
                        <p><strong>Diretor:</strong> {modalDetails?.Director}</p>
                      </div>

                      <div className="modal-actions">
                        <button
                          onClick={() => handleWatch(activeMovie.imdbID)}
                          className="btn-primary"
                        >
                          ▶ Assistir Filme
                        </button>

                        <button
                          onClick={() => toggleFavorite(activeMovie.imdbID)}
                          className={`btn-secondary ${favorites.includes(activeMovie.imdbID) ? "active" : ""}`}
                        >
                          {favorites.includes(activeMovie.imdbID) ? "❤️ Remover dos favoritos" : "🤍 Adicionar aos favoritos"}
                        </button>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => setActiveMovie(null)}
                    className="modal-close-btn"
                  >✕</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

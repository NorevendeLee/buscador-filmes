// src/pages/Home.tsx
import type { MouseEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../services/api";
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

  function handleDetails(id: string) {
    navigate(`/movie/${id}`);
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

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000", color: "#fff" }}>
      {/* Header */}
      <header style={{ position: "absolute", zIndex: 20, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", background: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)" }}>
        <h1 style={{ margin: 0, cursor: "pointer" }} onClick={handleGoHome}>🎬 RoxFlix</h1>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Buscar filme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "rgba(255,255,255,0.04)", color: "#fff" }}
          />
          <button type="submit" style={{ padding: "8px 12px", borderRadius: 6, background: "#e11", color: "#fff", border: "none" }}>Buscar</button>
        </form>
      </header>

      {/* Background de destaque (se houver ativo, mostra a imagem como fundo) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {activeMovie ? (
          <img src={activeMovie?.Poster !== "N/A" ? activeMovie.Poster : ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, filter: "blur(4px) contrast(0.9)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#111 0%, #000 50%, #111 100%)" }} />
        )}
      </div>

      <main style={{ position: "relative", zIndex: 10, padding: "120px 40px 40px" }}>
        {loading && <div style={{ color: "#fff" }}>Carregando...</div>}
        {error && <p style={{ color: "#f88" }}>{error}</p>}

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
            <div
              onClick={(e: MouseEvent) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: 1000,
                borderRadius: 14,
                overflow: "hidden",
                background: "rgba(10,10,10,0.9)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                position: "relative",
                color: "#fff",
              }}
            >
              <img
                src={activeMovie.Poster !== "N/A" ? activeMovie.Poster : "https://via.placeholder.com/800x1200?text=Sem+Imagem"}
                alt={activeMovie.Title}
                style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }}
              />

              <div style={{ padding: 24 }}>
                <h1 style={{ margin: 0 }}>{activeMovie.Title}</h1>
                <p style={{ marginTop: 8, color: "#bbb" }}>{activeMovie.Year} • {activeMovie.Type}</p>

                <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                  <button
                    onClick={() => handleDetails(activeMovie.imdbID)}
                    style={{ padding: "10px 16px", borderRadius: 8, background: "#e11", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    Ver detalhes
                  </button>

                  <button
                    onClick={() => {
                      toggleFavorite(activeMovie.imdbID);
                    }}
                    style={{ padding: "10px 16px", borderRadius: 8, background: "transparent", border: "1px solid #444", color: "#fff", cursor: "pointer" }}
                  >
                    {favorites.includes(activeMovie.imdbID) ? "Remover favorito" : "Adicionar aos favoritos"}
                  </button>
                </div>

                <p style={{ marginTop: 18, color: "#ccc" }}>{activeMovie.Plot || ""}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

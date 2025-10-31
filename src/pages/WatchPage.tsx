// src/pages/WatchPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovieDetails(id)
        .then((data) => setMovie(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="watch-page">
      <header className="watch-header">
        <Link to="/" className="back-btn">⬅ Voltar para o início</Link>
        {loading ? (
          <h1>Carregando...</h1>
        ) : (
          <h1>{movie?.Title}</h1>
        )}
      </header>
      <main className="watch-player-container">
        <div className="fake-player">
          <div className="play-button-overlay">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p>Seu filme começaria aqui...</p>
        </div>
      </main>
    </div>
  );
}
// src/components/MovieCard.tsx
import { MouseEvent } from "react";
import { motion } from "framer-motion";

type MovieCardProps = {
  movie: any;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  layoutId?: string; // opcional, para animação
};

export default function MovieCard({
  movie,
  onClick,
  isFavorite,
  onToggleFavorite,
  layoutId,
}: MovieCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="movie-card"
      onClick={onClick}
      style={{
        width: 240,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        background: "#222",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
      }}
    >
      <img
        src={
          movie?.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/200x300?text=Sem+Imagem"
        }
        alt={movie?.Title}
        style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>{movie?.Title}</h3>
        <p style={{ margin: "6px 0 0", color: "#bbb" }}>{movie?.Year}</p>
      </div>

      <button
        className="fav-btn"
        onClick={(e: MouseEvent) => {
          e.stopPropagation(); // importante: não propagar o clique para expandir
          onToggleFavorite();
        }}
        aria-label="toggle favorite"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.5)",
          border: "none",
          padding: 8,
          borderRadius: 8,
          color: isFavorite ? "#ff6b6b" : "#fff",
          cursor: "pointer",
        }}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </motion.div>
  );
}

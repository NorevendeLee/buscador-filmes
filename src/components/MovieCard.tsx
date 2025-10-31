// src/components/MovieCard.tsx
import type { MouseEvent } from "react";
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
    >
      <img
        src={
          movie?.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/200x300?text=Sem+Imagem"
        }
        alt={movie?.Title}
      />
      <div className="info-overlay">
        <h3>{movie?.Title}</h3>
        <p>{movie?.Year}</p>
      </div>

      <button
        className="fav-btn"
        onClick={(e: MouseEvent) => {
          e.stopPropagation(); // importante: não propagar o clique para expandir
          onToggleFavorite();
        }}
        aria-label="toggle favorite"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </motion.div>
  );
}

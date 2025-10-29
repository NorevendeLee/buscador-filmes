// src/components/MovieCard.tsx
type MovieCardProps = {
  movie: any;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function MovieCard({
  movie,
  onClick,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/200x300?text=Sem+Imagem"
        }
        alt={movie.Title}
      />
      <div className="info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
      <button
        className={`fav-btn ${isFavorite ? "fav" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

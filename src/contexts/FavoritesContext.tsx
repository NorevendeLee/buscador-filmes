// src/contexts/FavoritesContext.tsx
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { type Movie } from '../types'; // Importa o tipo Movie

/**
 * Define o formato dos dados que o nosso contexto irá fornecer:
 * - favorites: uma lista (array) de objetos Movie.
 * - toggleFavorite: uma função que recebe um objeto Movie e não retorna nada.
 */
interface FavoritesContextType {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
}

// Cria o contexto. O valor inicial é `undefined` porque ele só terá valor dentro do Provider.
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Cria o componente Provedor. Ele que vai conter toda a lógica.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('favoriteMovies'); // Usa a chave 'favoriteMovies'
    return saved ? JSON.parse(saved) : [];
  });

  // Efeito para salvar os favoritos no localStorage sempre que a lista mudar.
  useEffect(() => {
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites)); // Salva com a chave 'favoriteMovies'
  }, [favorites]);

  // Função para adicionar/remover um favorito.
  const toggleFavorite = (movie: Movie) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.imdbID === movie.imdbID);
      if (isAlreadyFavorite) {
        // Se já é favorito, remove
        return prevFavorites.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        // Se não é favorito, adiciona
        return [...prevFavorites, movie];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto nos componentes.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
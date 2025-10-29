import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_API;

// Busca lista de filmes
export const searchMovies = async (query: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: query,
      },
    });

    return response.data.Response === "True" ? response.data.Search : [];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

// Busca detalhes do filme
export const getMovieDetails = async (id: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: id,
        plot: "full",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
};

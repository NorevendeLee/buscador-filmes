import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import WatchPage from "./pages/WatchPage";
import FavoritesPage from "./pages/FavoritesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
      </Routes>
    </Router>
  );
}

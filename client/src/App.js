import './App.css';
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import TestApp from "./apps/TestApp";
import SpotifyApp from "./apps/SpotifyApp"

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/projects/Shufflefy" exact element={<SpotifyApp />} />
      <Route path="/projects/Shufflefy/" exact element={<SpotifyApp />} />
        <Route path="/projects/Shufflefy/*" exact element={<SpotifyApp />} />
        <Route path="/" element={<TestApp />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}
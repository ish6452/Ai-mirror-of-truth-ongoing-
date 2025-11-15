import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmotionMirror from "./components/EmotionMirror";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmotionMirror />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
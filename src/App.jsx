import { useEffect, useState } from "react";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";

const App = () => {
  return (
    <div className="app">
      <section className="hero">
        <HeroGradient />
        <div className="header-container">
          <div className="header h-1">
            <h1>United,</h1>
            <h1>Unbound</h1>
          </div>
          <div className="header h-2">
            <h1>Tokyo-born,</h1>
            <h1>Creative studio</h1>
          </div>
          <div className="header h-3">
            <h1>Hoi tu,</h1>
            <h1>Khong gioi han</h1>
          </div>
          <div className="header h-4">
            <h1>Creative studio,</h1>
            <h1>Den tu Tokyo</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

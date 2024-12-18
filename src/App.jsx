import { useEffect, useState } from "react";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";
import ReactLenis from "@studio-freight/react-lenis";

import { HiArrowRight } from "react-icons/hi";

const App = () => {
  return (
    <ReactLenis root>
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

        <section className="work">
          <div className="container">
            <div className="work-header">
              <HiArrowRight size={13} />
              <p>Selected project</p>
            </div>

            <div className="projects">
              <div className="project-col">
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project1.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Echo Fjord — Dreamscape Series</h2>
                  </div>
                  <div className="project-description">
                    <p>Art Installation, Visual Effects, Photography</p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project2.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Stellar Horizon</h2>
                  </div>
                  <div className="project-description">
                    <p>
                      Creative Campaign, Augmented Reality, Interactive Design
                    </p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project3.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Neon Veil by Ghost Atelier</h2>
                  </div>
                  <div className="project-description">
                    <p>Lighting Design, Concept Art, Event Production</p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project4.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Monolith (2024)</h2>
                  </div>
                  <div className="project-description">
                    <p>Set Design, Experimental Film, Soundscape</p>
                  </div>
                </div>
              </div>

              <div className="project-col">
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project5.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Lunar Editions</h2>
                  </div>
                  <div className="project-description">
                    <p>Fashion Collaboration, Editorial, Immersive Media</p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project6.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Velvet Mirage — Echo Chamber</h2>
                  </div>
                  <div className="project-description">
                    <p>Music Video, Color Grading, 3D Environments</p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project7.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>Shadow Beacon by Lightforms</h2>
                  </div>
                  <div className="project-description">
                    <p>
                      Interactive Installation, Projection Mapping, Visual
                      Identity
                    </p>
                  </div>
                </div>
                <div className="project">
                  <div className="project-img">
                    <img src="/projects/project8.jpg" alt="Project Thumbnail" />
                  </div>
                  <div className="project-name">
                    <h2>The Machina Chronicles</h2>
                  </div>
                  <div className="project-description">
                    <p>Cinematic Trailer, Narrative Design, VFX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default App;

import React from "react";
import "./Work.css";
import { Link } from "react-router";

import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Cursor from "../../components/Cursor/Cursor";
import Transition from "../../components/Transition/Transition";

import { ReactLenis } from "@studio-freight/react-lenis";

import { IoMdArrowForward } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";

const Work = () => {
  return (
    <ReactLenis root>
      <Cursor />
      <div className="sample-project">
        <div className="back-btn">
          <Link to="/">
            <div className="back-btn-fill"></div>
            <div className="back-btn-icon">
              <IoMdArrowBack size={26} />
            </div>
          </Link>
        </div>

        <section className="sp-title">
          <div className="container">
            <h1>NIGHT GOGGLES by Mindchatter</h1>
          </div>
        </section>

        <section className="sp-banner">
          <img src="/projects/project1.jpg" alt="" />
        </section>

        <section className="sp-details">
          <div className="container">
            <div className="sp-details-col">
              <p className="sp-details-name">Mind Goggles</p>

              <div className="sp-tags">
                <p>Motion Capture</p>
                <p>Creative Direction</p>
                <p>3D</p>
                <p>Post Production</p>
              </div>

              <div className="sp-date">
                <p>February 2021</p>
              </div>

              <div className="sp-link">
                <Link to="/">
                  <button>
                    <div className="icon">
                      <IoIosArrowRoundForward size={16} />
                    </div>
                    View project
                  </button>
                </Link>
              </div>
            </div>
            <div className="sp-details-col">
              <p>Challenge</p>
              <p>
                The label' Mind of a Genius' reached out to us to create a music
                video for the artist Mindchatter and gave us complete control
                over the creative concept and direction. As the project happened
                to be during the pandemic, the inspiration came from the moment
                we ask ourselves this question: where would the outside of earth
                want to be happy and be dancing forever, especially during this
                pandemic? We tried to describe a world where we could be running
                on the massive fields, breathing the fresh air without having to
                come back from where we were, discovering worlds endlessly, as
                an echo to one of the big question humanity have been asking:
                what's next?
              </p>
            </div>
          </div>
        </section>

        <section className="showreel">
          <VideoPlayer />
        </section>

        <section className="sp-info">
          <div className="container">
            <div className="sp-info-title">
              <h3>Challenge</h3>
            </div>

            <div className="sp-info-desc">
              <p>
                This song reminds us about being free of the burdens of every
                day, so we thought of a character with no physical being to
                represent that idea. We want to convey a good story. Thus, the
                man who finds a pair of goggles that changes his life came into
                our minds. He represents the enlightened being that figures out
                the common problems but decides to be joyful instead, eventually
                starts dancing his ways to happiness. We only had one month to
                finish and we also wanted to develop a personal dancing style
                and human-like movements for the character. As a note, the
                client was in New York, so we had to make everything entirely
                remotely.
              </p>
            </div>
          </div>
        </section>

        <section className="sp-img">
          <div className="container">
            <img src="/projects/project2.jpg" alt="" />
          </div>
        </section>

        <section className="sp-info">
          <div className="container">
            <div className="sp-info-title">
              <h3>Creative Solution</h3>
            </div>

            <div className="sp-info-desc">
              <p>
                We wanted to emphasize escapism as the primary goal. Hence, the
                actual shoot versus the dreamy 3D part came into place. With the
                street of Saigon, our friend and Director of Photography, Ray
                Lavers, quickly did the real-life shoots in 2 hours during the
                quarantine time. To ensure our main character is getting lost,
                we thought dancing is the best way to portray it, especially
                when the main character is invisible. We asked our choreographer
                La Zung to do a quick freestyle on top of the music,
                motion-captured for 3D animation. Vicki and Robin worked
                together to create the worlds and rhythms inside the MV to
                deliver the feeling of being free. It is not like we knew every
                step what the MV would look like, but we wanted to be free to
                create, just like the song itself.
              </p>
            </div>
          </div>
        </section>

        <section className="sp-img">
          <div className="container">
            <img src="/projects/project3.jpg" alt="" />
          </div>
        </section>

        <section className="credits">
          <div className="container">
            <h2>Credits</h2>

            <div className="credits-row">
              <div className="credits-col">
                <div className="credits-header">
                  <p>Project</p>
                </div>
                <div className="credits-copy">
                  <p>Mind Goggles</p>
                </div>
              </div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Our role</p>
                </div>
                <div className="credits-copy">
                  <p>
                    Motion Capture, Creative and 3D art Direction, Direction,
                    Post production
                  </p>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="credits-row">
              <div className="credits-col">
                <div className="credits-header">
                  <p>Team</p>
                </div>
              </div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Directories</p>
                </div>
                <div className="credits-copy">
                  <p>
                    Vicki Dang (monopo Saigon), Robin Mahieux (monopo Saigon)
                  </p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Executive Producer</p>
                </div>
                <div className="credits-copy">
                  <p>Bryce Connolly</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Art Direction & Animation</p>
                </div>
                <div className="credits-copy">
                  <p>Vicki Dang (monopo Saigon)</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Editing & Compositing</p>
                </div>
                <div className="credits-copy">
                  <p>Robin Mahieux (monopo Saigon)</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Director of Photography & Color</p>
                </div>
                <div className="credits-copy">
                  <p>Ray Lavers</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Choregrapher</p>
                </div>
                <div className="credits-copy">
                  <p>La Zung</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Sound Design</p>
                </div>
                <div className="credits-copy">
                  <p>Aurae Production</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Label</p>
                </div>
                <div className="credits-copy">
                  <p>Mind Of A Genius</p>
                </div>
              </div>
            </div>

            <div className="credits-row">
              <div className="credits-col"></div>
              <div className="credits-col">
                <div className="credits-header">
                  <p>Special Thanks</p>
                </div>
                <div className="credits-copy">
                  <p>Anh Phi Cako, Andrew Boggs, & Connor Boggs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="next-project">
          <div className="next-project-img">
            <img src="/projects/project4.jpg" alt="" />
          </div>

          <div className="container">
            <div className="next-project-header">
              <div className="next-project-icon">
                <h1>
                  <IoMdArrowForward />
                </h1>
              </div>
              <div className="next-project-title">
                <h1>Super Dan Origin Digital Graphic Novel</h1>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Transition(Work);

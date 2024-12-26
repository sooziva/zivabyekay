import React from "react";
import "./Work.css";
import { Link } from "react-router";

import Transition from "../../components/Transition/Transition";

import { IoMdArrowBack } from "react-icons/io";

const Work = () => {
  return (
    <div className="sample-project">
      <div className="back-btn">
        <Link to="/">
          <div className="back-btn-fill"></div>
          <div className="back-btn-icon">
            <IoMdArrowBack size={26} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Transition(Work);

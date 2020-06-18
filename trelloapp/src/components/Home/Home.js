import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaUnlock, FaPen } from "react-icons/fa";
import MemoHeader from "../Header/Header";
import CoffeeBg from "../Image/Coffee2.svg";
import "./Home.scss";

const Home = () => {
  const [helmetTitle, setHelmetTitle] = useState("");

  useEffect(() => {
    setHelmetTitle("Home");
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <HelmetProvider>
      <Helmet>
        <title>MyTrello - {helmetTitle}</title>
      </Helmet>
      {/* <MemoHeader page="home" user={user} /> */}
      <div className="Home">
      <img src={CoffeeBg} alt="coffee" className="Home__img-bg"/>
      <section className="Home__section">
      <article>
        <h1 className="Home__section-title">Welcome to MyTrello</h1>
        <p className="Home__section-intro">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt itaque officiis cupiditate. Maxime ea repellat repellendus perferendis eum, consequatur aut vero nemo tenetur sint odit consequuntur quasi nisi rerum quo?</p>
      </article>
        {user === null ? (
          <>
            <Link to="/login" className="Home__ctn-smlLinks">
              <FaUnlock style={{ margin: "0 5px" }} />{" "}
              <span style={{ margin: "0" }}>Log In</span>
            </Link>

            <Link to="/register" className="Home__ctn-smlLinks">
              <FaPen style={{ margin: "0 5px " }} />{" "}
              <span style={{ margin: "0" }}>Register</span>
            </Link>
          </>
        ) : (
          <Link to="/register" className="Home__ctn-smlLinks">
            <FaPen style={{ margin: "0 5px " }} />{" "}
            <span style={{ margin: "0" }}>Register</span>
          </Link>
        )}
        </section>
      </div>
    </HelmetProvider>
  );
};

export default Home;

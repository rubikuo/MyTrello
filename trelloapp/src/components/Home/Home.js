import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUnlock, FaPen } from "react-icons/fa";
import MemoHeader from "../Header/Header";
import CoffeeBg from "../Image/Coffee.svg";
import TodoListImg from "../Image/TodoLists.svg";

import "./Home.scss";

const Home = () => {
  const [helmetTitle, setHelmetTitle] = useState("");

  useEffect(() => {
    setHelmetTitle("Home");
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const logout = (e) => {
    e.preventDefault();
    console.log("log out");
    axios.post("/auth/trello/logout").then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem("user", null);
        localStorage.setItem("board", null);
        window.location.reload(false);
      }
    });
  };



  return (
    <HelmetProvider>
      <Helmet>
        <title>MyTrello - {helmetTitle}</title>
      </Helmet>
      {user !== null && <MemoHeader page="home" user={user} logout={logout} />}

      <div className={user === null ? "Home" : "Home Home-loggedIn"}>
        <img src={CoffeeBg} alt="coffee" className="Home__img-bg" />
        <img src={TodoListImg} alt="todolist" className="Home__img-todolist" />
        <section className="Home__section">
          <article>
            {user === null ? (<> <h1 className="Home__section-title">Welcome to MyTrello</h1> <p className="Home__section-intro">MyTrello’s boards, lists, and cards enable you to organize and prioritize your todos in a fun, flexible, and rewarding way. </p> </>) : (<><h1 className="Home__section-title">Hi ! {user.username}</h1>  <p className="Home__section-intro"> You are currently logged in. <br />May your day is fulfilled with MyTrello! </p></>)}

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

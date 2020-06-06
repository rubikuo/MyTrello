import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaUnlock, FaPen } from "react-icons/fa";
import MemoHeader from "../Header/Header";
import Image from "../Image/Image";
import "./Home.scss";

const Home = () => {
  const [images] = useState([
    { id: 1, name: "image-one" },
    { id: 2, name: "image-two" },
    { id: 3, name: "image-three" },
  ]);
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
      <MemoHeader page="home" user={user} />
      <div className="Home">
        {/* <h1>Welcome to MyTrello!</h1> */}
        <div className="Home__ctn-img">
          {images.map((image) => {
            return (
              <Image key={image.id} className="Home__img" id={image.name} />
            );
          })}
        </div>
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
      </div>
    </HelmetProvider>
  );
};

export default Home;

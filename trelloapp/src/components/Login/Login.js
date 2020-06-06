import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FaUser } from "react-icons/fa";
import "./Login.scss";
import axios from "axios";
import MemoHeader from "../Header/Header";
import Form from "../Form/Form";

const LogIn = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    _id: "",
    urlUserName: "",
  });
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [helmetTitle, setHelmetTitle] = useState("");
  const [eyeOpen, setEyeOpen] = useState("block");
  const [eyeClose, setEyeClose] = useState("none");
  const [inputType, setInputType] = useState("password");
  const [userInLocal] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const history = useHistory();

  if (userInLocal) {
    history.push("/trello/" + userInLocal.urlUserName + "/boards");
  }

  useEffect(() => {
    setHelmetTitle("Login");
  }, []);

  useEffect(() => {
    if (!isLogIn) return;
    let _user = user;
    localStorage.setItem("user", JSON.stringify(_user));
  }, [isLogIn, user]);

  const inputOnchange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const logIn = (e) => {
    e.preventDefault();
    if (user.email === "" || user.password === "") {
      setError("Fields are required");
      return;
    }
    let logginUser = {
      email: user.email,
      password: user.password,
    };

    axios
      .post("/auth/trello/login", logginUser)
      .then((res) => {
        console.log("after login", res.data.user);
        let user = res.data.user;
        let name = user.username.split(" ").join("").toLowerCase();
        setUser({ ...user, urlUserName: name });
        setIsLogIn(true);
        setRedirect(true);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error.response.data.message);
          setError(error.response.data.message);
        }
        if (error.response.status === 500) {
          setError("Internal Server Error");
        }
      });
  };

  const onEyeChange = (e) => {
    if (eyeOpen === "none") {
      setEyeOpen("block");
      setEyeClose("none");
      setInputType("password");
    } else {
      setEyeOpen("none");
      setEyeClose("block");
      setInputType("text");
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>MyTrello - {helmetTitle}</title>
      </Helmet>
      {redirect && (
        <Redirect
          to={{
            pathname: "/trello/" + user.urlUserName + "/boards",
          }}
        />
      )}
      <MemoHeader page="login" user={userInLocal} />
      <div className="LogIn">
        <div className="LogIn__ctn">
          <FaUser className="LogIn__userIcon" />
          <Form
            type="LogIn"
            user={user}
            logIn={logIn}
            inputOnchange={inputOnchange}
            inputType={inputType}
            onEyeChange={onEyeChange}
            eyeOpen={eyeOpen}
            eyeClose={eyeClose}
            error={error}
          />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LogIn;

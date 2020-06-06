import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FaUser } from "react-icons/fa";
import "./Register.scss";
import axios from "axios";
import MemoHeader from "../Header/Header";
import Form from "../Form/Form";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
    id: "",
    urlUserName: "",
  });
  // for checking if there is any user has already logged in or not.
  const [userInLocal] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [eyeOpen, setEyeOpen] = useState("block");
  const [eyeClose, setEyeClose] = useState("none");
  const [inputType, setInputType] = useState("password");
  const [errors, setErrors] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [helmetTitle, setHelmetTitle] = useState("");
  const [error, setError] = useState("");
  

  const inputOnchange = (e) => {
    if(e.target.name === "username"){
    if(e.target.value.length > 15){
      setError("Username contains max 15 characters");
    }else{
      setError("");
    }
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setHelmetTitle("Register");
  }, []);
  // assume user has already loggin but came to register page 
  // if the user tries to register again after  logged in 
  //  I check if there is any user in the localstorage(to make sure the user has logged in),
  //  if yes then the user will have to sign out first before register again.

  const logoutAndRegister = (e) => {
    e.preventDefault();
    if (
      user.username === "" ||
      user.email === "" ||
      user.password === "" ||
      user.repassword === ""
    ) {
      setError("Fields are required");
      return;
    }
    let trello = {
      username: user.username,
      email: user.email,
      password: user.password,
      repassword: user.repassword,
    };

    Promise.all([
      axios.post("/auth/trello/logout"),
      axios.post("/auth/trello/register", trello),
    ])
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", null);
        localStorage.setItem("board", null);
        let name = user.username.split(" ").join("").toLowerCase();
        setUser({ ...user, id: res[1].data["_id"], urlUserName: name });
        setRedirect(true);
      })
      .catch((error) => console.log("error", error.response));
  };

  const register = (e) => {
    e.preventDefault();
    if (
      user.username === "" ||
      user.email === "" ||
      user.password === "" ||
      user.repassword === ""
    ) {
      setError("Fields are required");
      return;
    }
    let trello = {
      username: user.username,
      email: user.email,
      password: user.password,
      repassword: user.repassword,
    };

    axios
      .post("/auth/trello/register", trello)
      .then((res) => {
        console.log("after registered", res.data);
        let name = user.username.split(" ").join("").toLowerCase();
        setUser({ ...user, id: res.data["_id"], urlUserName: name });
        setRedirect(true);
      })
      .catch((error) => {
        console.log("error", error.response.data.errors)
        setErrors([...error.response.data.errors]);
      
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
            pathname: "/login",
          }}
        />
      )}
      <MemoHeader page="register" user={userInLocal} />
      <div className="Register">
        <div className="Register__ctn">
          <FaUser className="Register__userIcon" />
          <Form
            type="Register"
            register={register}
            logoutAndRegister={logoutAndRegister}
            user={user}
            userInLocal={userInLocal}
            inputOnchange={inputOnchange}
            inputType={inputType}
            onEyeChange={onEyeChange}
            eyeOpen={eyeOpen}
            eyeClose={eyeClose}
            errors={errors}
            error={error}
          />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Register;

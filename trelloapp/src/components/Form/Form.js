import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Form.scss";
const Form = ({
  type,
  register,
  logIn,
  user,
  inputOnchange,
  onEyeChange,
  eyeOpen,
  eyeClose,
  error,
  errors,
  inputType,
  userInLocal,
  logoutAndRegister,
}) => {
  return (
    <form
      className={`${type}__form`}
      onSubmit={
        type === "Register" && userInLocal === null
          ? register
          : type === "LogIn"
          ? logIn
          : logoutAndRegister
      }
    >
      {type === "Register" && (
        <div className={`${type}__ctn-sml`}>
          <input
            id="name"
            type="text"
            className={`${type}__input`}
            name="username"
            placeholder="Username"
            value={user.name}
            onChange={inputOnchange}
            required
          />
          <div className={`${type}__input--underline`} />
        </div>
      )}
      <div className={`${type}__ctn-sml`}>
        <input
          id="email"
          type="text"
          className={`${type}__input`}
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={inputOnchange}
          required
        />
        <div className={`${type}__input--underline`} />
      </div>
      <div className={`${type}__ctn-sml`}>
        <input
          id="password"
          type={inputType}
          className={`${type}__input`}
          name="password"
          placeholder="Password"
          value={user.password || ""}
          onChange={inputOnchange}
          required
        />
        <div className={`${type}__input--underline`} />
        <i
          className="Form__icon Form__icon-eye"
          onClick={onEyeChange}
          style={{ display: eyeOpen }}
        >
          <FaEye />
        </i>
        <i
          className="Form__icon Form__icon-eye"
          onClick={onEyeChange}
          style={{ display: eyeClose }}
        >
          <FaEyeSlash />
        </i>
      </div>
      {type === "Register" && (
        <div className={`${type}__ctn-sml`}>
          <input
            id="repassword"
            type={inputType}
            className={`${type}__input`}
            name="repassword"
            placeholder="Confirm Password"
            value={user.repassword}
            onChange={inputOnchange}
            required
          />
          <div className={`${type}__input--underline`} />
          <i
            className="Form__icon Form__icon-eye"
            onClick={onEyeChange}
            style={{ display: eyeOpen }}
          >
            <FaEye />
          </i>
          <i
            className="Form__icon Form__icon-eye"
            onClick={onEyeChange}
            style={{ display: eyeClose }}
          >
            <FaEyeSlash />
          </i>
        </div>
      )}

      <button className={`${type}__btn`} type="submit">
        {type === "Register" ? "Register" : "Log In"}
      </button>

      {errors &&
        errors.map((error, i) => {
          return (
            <span key={i} className={`${type}__text-error`}>
              {error.message}
            </span>
          );
        })}
      {error && <span className={`${type}__text-error`}>{error}</span>}
    </form>
  );
};

export default Form;

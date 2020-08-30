import React from "react";
import { FaTrello, FaHome } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header = ({ page, logout, user }) => {
  // console.log("page", page);

  const toBoards = (e) => {
    e.preventDefault();
    window.location.pathname = `/trello/${user.urlUserName}/boards`;
  };
  const toHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  return (
    <header className="Header">
      <div className="Header__ctn Header__ctn-left">
        {page === "boards" || page === "board" || user !== null ? (
          <button
            onClick={toBoards}
            title="Back to boards"
            className="Header__btn Header__btn-board"
          >
            {" "}
              Boards{" "}
          </button>
        ) : null}
      </div>

      {page === "home" && user === null ? null : (
        <div className="Header__ctn Header__ctn-mid">
          <p className="Header__text-logo">
            <FaTrello className="Header__icon　Header__icon-logo" style={{marginRight:"3px"}}/> MyTrello
          </p>
        </div>
      )}

      <div className="Header__ctn Header__ctn-right">
        {page === "boards" || page === "board" ? (
          <>
            <button onClick={toHome} className="Header__btn Header__btn-home">
              <FaHome className="Header__icon Header__icon-home" />
            </button>
            <button
              title="Log Out"
              className="Header__btn Header__btn-logOut"
              onClick={logout}
            >
              <AiOutlineLogout className=" Header__iconHeader__icon-logOut" />
            </button>
          </>
        ) : page === "register" && user === null ? (
          <Link title="Log In" to="/login" className="Header__link">
            {" "}
             Login
          </Link>
        ) : page === "login" ? (
          <Link title="Register" to="/register" className="Header__link">
            Register
          </Link>
        ) : page === "home" && user !== null ? 
        <>
        <Link title="Register" to="/register" className="Header__link">
        Register
      </Link>
        <button
          title="Log Out"
          className="Header__btn Header__btn-logOut"
          onClick={logout}
        >
          <AiOutlineLogout className=" Header__iconHeader__icon-logOut" />
        </button>
        </> : null}
      </div>
    </header>
  );
};

const MemoHeader = React.memo(Header);

export default MemoHeader;

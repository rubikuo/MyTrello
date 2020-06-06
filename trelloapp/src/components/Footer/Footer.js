import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <p> &copy; Ju-I Kuo || May. 2020 </p>
      <span>
        <a href="https://www.freepik.com/free-photos-vectors/background">
          Background vector created by freepik - www.freepik.com
        </a>
      </span>
    </footer>
  );
};

const FooterMemo = React.memo(Footer);

export default FooterMemo;

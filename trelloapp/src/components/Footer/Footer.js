import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <p> &copy; Ju-I Kuo (Rubi) || May. 2020 </p>
    </footer>
  );
};

const FooterMemo = React.memo(Footer);

export default FooterMemo;

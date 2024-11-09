import { PrivacyPolicy } from "..";

import "./Footer.css";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-heading">
        <p>guess the word</p>
        <p>Made by Kerry Zhang</p>
        <PrivacyPolicy />
      </div>
    </div>
  );
}

export default Footer;

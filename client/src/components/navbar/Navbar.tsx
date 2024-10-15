import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links-logo">
          <p>
            <a href="/">guess the word</a>
          </p>
        </div>
        <div className="navbar-links_container">
          <p>about</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

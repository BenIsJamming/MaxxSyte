import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css";

const NavBar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/menu">Menu</Link>
    <Link to="/about">About Us</Link>
    <Link to="/contact">Contact</Link>
    <Link to="/order">Order</Link>
  </nav>
);

const Home = () => (
  <div className="container">
    <h1>Home Page</h1>
    <NavBar />
    <p>Welcome to the Basic outline of the Maxx Byte website! Will be updated regularly</p>
    <div>
      <h2><strong>Delicious Campus Meals Delivered Fast</strong></h2>
      <p>Order your favorites from the comfort of your dorm.</p>
      <button><Link to="/menu">Try Our Menu</Link></button>
    </div>
  </div>
);

const Menu = () => (
  <div className="container">
    <h1>Menu</h1>
    <NavBar />
    <div>
      <img src="https://th.bing.com/th/id/OIP.g_EYshV4TBrKFonMmN2KEgHaE7" alt="Example Burger" />
      <h4><strong>Example Burger</strong></h4>
      <p>$5.99 - Example Burger, get it while it's hot!</p>
    </div>
    <div>
      <img src="https://th.bing.com/th/id/OIP.xeqc5lXSwdVMKjiWSRSAQQHaGA" alt="Example Sushi" />
      <h4><strong>Example Sushi</strong></h4>
      <p>$5.99 - Example Sushi, get it while it's... a preferred temp?</p>
    </div>
  </div>
);

const About = () => (
  <div className="container">
    <h1>About Us</h1>
    <NavBar />
    <div className="boxy">
      <h3><strong>Our Story: The Birth of MAXX Byte</strong></h3>
      <p>It all began on a cold February evening... (full story omitted for brevity)</p>
    </div>
  </div>
);

const Contact = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <NavBar />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Send us a message</h2>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea rows={4} placeholder="Your Message"></textarea>
            <button>Send</button>
            <button className="close" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Order = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div className="container">
      <h1>Order</h1>
      <NavBar />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Place your order</h2>
            <label>Full Name:</label>
            <input type="text" placeholder="Your Name" />
            <label>Student ID:</label>
            <input type="text" placeholder="S1234567" />
            <label>Select your order:</label>
            <select>
              <option>Example Burger</option>
              <option>Example Sushi</option>
            </select>
            <select>
              <option>Example Fries</option>
              <option>Example Onion Rings</option>
            </select>
            <select>
              <option>Example Soda</option>
              <option>Example Water</option>
              <option>Example Lemonade</option>
            </select>
            <label>Special Instructions:</label>
            <textarea rows={4} placeholder="Your Message"></textarea>
            <button>Send</button>
            <button className="close" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/order" element={<Order />} />
    </Routes>
  </Router>
);

export default App;

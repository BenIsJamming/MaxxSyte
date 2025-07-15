/*import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import ReactDOM from 'react-dom/client';


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


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;
*/
import React, { useState, createContext, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import ReactDOM from 'react-dom/client';

export interface FavoriteItem {
  id: string;          // a stable key (slug or SKU)
  name: string;
  price: string;
  image?: string;
}

/* ---------- context boilerplate ---------- */
interface FavoritesCtx {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
}

const Ctx = createContext<FavoritesCtx | null>(null);
export const useFavorites = () => useContext(Ctx)!;

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavs] = useState<FavoriteItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("maxx-favorites") || "[]");
    } catch {
      return [];
    }
  });

  /** add or remove */
  const toggleFavorite = (item: FavoriteItem) =>
    setFavs((prev) =>
      prev.find((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item]
    );

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  /* persist whenever the list changes */
  useEffect(() => {
    localStorage.setItem("maxx-favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <Ctx.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </Ctx.Provider>
  );
};

const NavBar = () => (
  <nav className="navbar">
    <div className="container">
      <Link to="/" className="logo">MAXX Byte</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/order">Order</Link></li>
      </ul>
    </div>
  </nav>
);

const Home = () => (
  <div>
    <NavBar />
    <div className="hero">
      <div className="hero-content">
        <h1>MAXX Byte</h1>
        <p>Delicious Campus Meals Delivered Fast</p>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Order your favorites from the comfort of your dorm.</p>
        <Link to="/menu" className="cta-button">Browse Menu</Link>
      </div>
    </div>
    
    <div className="popular-section">
      <h2>Popular Items</h2>
      <p>Check out what other students are loving this week!</p>
      <div className="popular-items">
        <div className="popular-item">
          <h3>Campus Classic Burger</h3>
          <p className="price">$6.99</p>
        </div>
        <div className="popular-item">
          <h3>Veggie Dorm Delight</h3>
          <p className="price">$5.99</p>
        </div>
        <div className="popular-item">
          <h3>Sushi Combo</h3>
          <p className="price">$9.99</p>
        </div>
      </div>
    </div>
    
    <footer>
      <p>&copy; 2023 MAXX Byte. All rights reserved.</p>
    </footer>
  </div>
);

const Menu = () => (
  <div>
    <NavBar />
    <div className="page-container">
      <div className="page-header">
        <h1>Our Menu</h1>
        <p>Fresh, delicious meals delivered to your door</p>
      </div>
      <div className="container">
        <div className="menu-grid">
          <div className="menu-item">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1899&q=80" alt="Campus Classic Burger" />
            <div className="menu-item-content">
              <h4>Campus Classic Burger</h4>
              <p>Juicy beef patty with fresh lettuce, tomato, and our special sauce</p>
              <p className="price">$6.99</p>
            </div>
          </div>
          <div className="menu-item">
            <img src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80" alt="Fresh Sushi Roll" />
            <div className="menu-item-content">
              <h4>Fresh Sushi Roll</h4>
              <p>Premium sushi roll with fresh fish and vegetables</p>
              <p className="price">$9.99</p>
            </div>
          </div>
          <div className="menu-item">
            <img src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Veggie Delight" />
            <div className="menu-item-content">
              <h4>Veggie Dorm Delight</h4>
              <p>Fresh vegetarian option with seasonal vegetables</p>
              <p className="price">$5.99</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const About = () => (
  <div>
    <NavBar />
    <div className="page-container">
      <div className="page-header">
        <h1>About Us</h1>
        <p>Learn more about our story and mission</p>
      </div>
      <div className="container">
        <div className="about-content">
          <h3>Our Story: The Birth of MAXX Byte</h3>
          <p>
            It all began on a cold February evening when a group of hungry college students 
            realized there had to be a better way to get quality meals delivered right to campus. 
            We founded MAXX Byte with a simple mission: to provide delicious, affordable meals 
            to students who want convenience without compromising on quality.
          </p>
          <p>
            Our team understands student life because we've been there. Late-night study sessions, 
            tight budgets, and the constant search for good food that doesn't break the bank. 
            That's why we've partnered with local restaurants and chefs to bring you the best 
            campus dining experience possible.
          </p>
          <p>
            Today, MAXX Byte serves hundreds of students across campus, and we're just getting started. 
            We're committed to growing our menu, improving our service, and making sure every student 
            has access to great food when they need it most.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Contact = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div>
      <NavBar />
      <div className="page-container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our team</p>
        </div>
        <div className="container">
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Send us a message</h2>
                <label>Your Name</label>
                <input type="text" placeholder="Enter your full name" />
                <label>Your Email</label>
                <input type="email" placeholder="Enter your email address" />
                <label>Subject</label>
                <input type="text" placeholder="What is this about?" />
                <label>Message</label>
                <textarea rows={4} placeholder="Tell us how we can help you..."></textarea>
                <div className="modal-buttons">
                  <button>Send Message</button>
                  <button className="close" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <div>
      <NavBar />
      <div className="page-container">
        <div className="page-header">
          <h1>Place Your Order</h1>
          <p>Quick and easy ordering for campus delivery</p>
        </div>
        <div className="container">
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Place your order</h2>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
                <label>Student ID</label>
                <input type="text" placeholder="S1234567" />
                <label>Phone Number</label>
                <input type="tel" placeholder="(555) 123-4567" />
                <label>Delivery Address</label>
                <input type="text" placeholder="Dorm name and room number" />
                <label>Main Dish</label>
                <select>
                  <option>Campus Classic Burger - $6.99</option>
                  <option>Fresh Sushi Roll - $9.99</option>
                  <option>Veggie Dorm Delight - $5.99</option>
                </select>
                <label>Side (Optional)</label>
                <select>
                  <option>None</option>
                  <option>Crispy Fries - $2.99</option>
                  <option>Onion Rings - $3.49</option>
                </select>
                <label>Drink (Optional)</label>
                <select>
                  <option>None</option>
                  <option>Soft Drink - $1.99</option>
                  <option>Water - $0.99</option>
                  <option>Fresh Lemonade - $2.49</option>
                </select>
                <label>Special Instructions</label>
                <textarea rows={3} placeholder="Any special requests or dietary restrictions?"></textarea>
                <div className="modal-buttons">
                  <button>Place Order</button>
                  <button className="close" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="favorites">add to favorites</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>
);

export default App;
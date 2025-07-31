import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import ReactDOM from 'react-dom/client';
import { useNavigate, useLocation } from "react-router-dom";

async function getCoordinatesFromAddress(): Promise<{ lat: number; lon: number }> {
  const addressInput = document.getElementById("address") as HTMLInputElement;
  const addressValue: string = addressInput.value;

  const encodedAddress = encodeURIComponent(addressValue);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error('No results found for that address.');
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch coordinates: ${error.message}`);
  }
}

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
            It all began on a cold February evening. Maximilian ("Max") Bittleburg, a senior at Redstone University, sat alone in his dorm room, staring at the dim glow of his laptop screen while his stomach growled impatiently. The dining hall had closed hours earlier, campus restaurants were either overwhelmed or offline, and the food delivery apps that did exist couldn't find his building. After waiting 90 minutes for a lukewarm slice of pizza to arrive — only to discover it was delivered to the wrong dorm — Max realized something had to change.

That night planted the seed for MAXX Byte, a bold, student-first food delivery solution designed specifically for the quirks, challenges, and culture of college life. Max didn't have venture capital. He didn't have a business plan or a tech team. What he had was experience — real, hungry, late-night experience — and a growing belief that college students deserved more than slow apps and cold fries.

Over the next few months, Max began to map out what a campus-focused food platform could look like. He interviewed fellow students between classes. He sent surveys to residence halls. He even shadowed local delivery drivers to understand the obstacles they faced — from inaccessible dorm layouts to confusing building codes and entry systems. What he discovered was eye-opening: most commercial delivery systems were built for cities, not campuses.

Students were constantly let down — deliveries were missed, prices inflated, and meals delayed. There was no optimization for academic schedules, no consideration for dietary restrictions, and no coordination with on-campus kitchens. That gap was exactly where MAXX Byte would fit.

Fueled by frustration and a relentless drive to fix what wasn't working, Max began sketching out the solution alone. He spent long nights in his dorm room teaching himself how to code, scraping together fragments of tutorials and open-source snippets. There were no mentors, no teammates — just determination and an ever-growing pile of failed drafts. But eventually, line by line, a rough working version of MAXX Byte took shape. It wasn't pretty. It wasn't fast. But it was his — and it worked.

Within the first month of beta testing, over 300 students signed up. Max delivered nearly 1,000 meals using a bike, an insulated backpack, and an app duct-taped together in JavaScript and sheer willpower. Word spread quickly. Local restaurants, who had struggled to break into the student market, saw a spike in orders and began reaching out to join the platform.

The cracks began to show. One finals week, Max received over 400 orders in 72 hours. He worked until sunrise, crashed for two hours, and did it all again. There was no time to scale, no one to delegate to — and the student body wasn't slowing down. That's when Max made a call that would change everything: he opened MAXX Byte to other students and interns.

Today, MAXX Byte proudly serves thousands of students in campuses around the world. What started as one hungry senior's frustration is now a full-scale delivery network powered by technology, empathy, and a deep love for the student experience. We deliver more than food — we deliver connection. Late-night bites before exams. Comfort meals after long days. Sushi for study groups and cookies for broken hearts.

At MAXX Byte, we believe food is more than fuel — it's a way to take care of each other. And thanks to Max's vision and the students who stepped up to help carry it forward, we're honored to do exactly that.

Our promise is delivery of your food, made to order, in 20 minutes. Everyone at MAXX Byte lives by that mission and we keep that promise, every day.

Welcome to MAXX Byte — built by one student, scaled by many. We're glad you're here and be ready. We deliver.
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
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ display_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const tempInput = document.createElement('input');
      tempInput.id = 'address';
      tempInput.value = addressQuery;
      document.body.appendChild(tempInput);
      
      const coords = await getCoordinatesFromAddress();
      
      document.body.removeChild(tempInput);
      
      console.log(`Coordinates: ${coords.lat}, ${coords.lon}`);
      
      //redirect to progress page, carry the coordinates over
      navigate('/progress', { 
        state: { 
          coordinates: coords,
          address: addressQuery
        }
      });
    } catch (err) {
      console.error(err);
      alert('Failed to get coordinates for the address. Please try again.');
    }
  };
  
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
                <input
                  type="text"
                  id="address"
                  value={addressQuery}
                  placeholder="Dorm name and room number"
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  autoComplete="off"
                />
                {loading && <div>Loading…</div>}

                {suggestions.length > 0 && (
                  <ul className="suggestions">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setAddressQuery(s.display_name);
                          setSuggestions([]);
                        }}
                      >
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}

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
                  <button onClick={handlePlaceOrder}>
                    Place Order
                  </button>
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
const Progress = () => {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [serverImage, setServerImage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState('');
  const logRef = useRef<string[]>([]);

  const { coordinates, address } = location.state || {};

  const addLog = (message: string) => {
    logRef.current = [...logRef.current, `${new Date().toLocaleTimeString()}: ${message}`];
    setLogs([...logRef.current]);
  };

  const showNotificationAlert = (message: string) => {
    setCurrentNotification(message);
    setShowNotification(true);
    setNotifications(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    
    // Auto-hide notification after 10 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  };

  useEffect(() => {
    if (!coordinates) {
      addLog('No coordinates provided');
      return;
    }

    addLog(`Connecting to delivery tracking server...`);
    addLog(`Delivery address: ${address}`);
    addLog(`Coordinates: ${coordinates.lat.toFixed(6)}, ${coordinates.lon.toFixed(6)}`);

    // Connect to WebSocket server
    const ws = new WebSocket("ws://127.0.0.1:7890");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      setConnectionStatus('Connected');
      addLog('Connected to tracking server');
      
      //send coordinates automatically when connected
      //Formatted as "start_lon start_lat end_lon end_lat"
      // Using a default restaurant location and the delivery address
      const restaurantLon = -77.540881; // Default restaurant location
      const restaurantLat = 37.574900;
      const message = `${restaurantLon.toFixed(6)} ${restaurantLat.toFixed(6)} ${coordinates.lon.toFixed(6)} ${coordinates.lat.toFixed(6)}`;
      ws.send(message);
      addLog(`Sent route request: ${message}`);
    };

    ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          //try to parse as JSON notification
          const parsedMessage = JSON.parse(e.data);
          if (parsedMessage.type === 'notification') {
            addLog(`Notification received: ${parsedMessage.message}`);
            showNotificationAlert(parsedMessage.message);
            
            //send acknowledgment back to server
            ws.send(JSON.stringify({
              type: 'notification_ack',
              message: parsedMessage.message,
              timestamp: Date.now()
            }));
          } else {
            //Handle other JSON messages
            addLog(`Server JSON: ${e.data}`);
          }
        } catch (error) {
          //Not JSON, handle as regular string message
          addLog(`Server message: ${e.data}`);
        }
      } else {
        //Handle binary image data
        addLog('Received image data from server');
        const blob = new Blob([e.data], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        setServerImage(url);
        addLog('Route map received and displayed');
      }
    };

    ws.onerror = () => {
      setConnectionStatus('Error');
      addLog('WebSocket connection error');
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      addLog('Connection to server closed');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [coordinates, address]);

  if (!coordinates) {
    return (
      <div>
        <NavBar />
        <div className="page-container">
          <div className="page-header">
            <h1>Order Progress</h1>
            <p>No order information found</p>
          </div>
          <div className="container">
            <p>Please place an order first.</p>
            <Link to="/order">Go to Order Page</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      
      {/*notification popup*/}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '400px',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>{currentNotification}</div>
            <button 
              onClick={() => setShowNotification(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="page-container">
        <div className="page-header">
          <h1>Order Progress</h1>
          <p>Track your delivery</p>
        </div>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <h3>Delivery Information</h3>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lon.toFixed(6)}</p>
            <p><strong>Connection Status:</strong> 
              <span style={{ 
                color: connectionStatus === 'Connected' ? '#27ae60' : connectionStatus === 'Error' ? '#e74c3c' : '#f39c12',
                fontWeight: 'bold',
                marginLeft: '10px'
              }}>
                {connectionStatus}
              </span>
            </p>
          </div>

          {/*notifications*/}
          {notifications.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>🔔 Delivery Notifications</h3>
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                padding: '1rem', 
                borderRadius: '4px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {notifications.map((notification, index) => (
                  <div key={index} style={{ 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          )}

          {serverImage && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Delivery Route Map</h3>
              <img 
                src={serverImage} 
                alt="Server generated route map" 
                style={{ 
                  maxWidth: '100%', 
                  border: '2px solid #333', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
          )}

          <div>
            <h3>Activity Log</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '4px', 
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #dee2e6'
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/order" style={{ 
              backgroundColor: '#3498db', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '1rem'
            }}>
              Place Another Order
            </Link>
            <Link to="/" style={{ 
              backgroundColor: '#95a5a6', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              textDecoration: 'none', 
              borderRadius: '4px'
            }}>
              Back to Home
            </Link>
          </div>
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
      <Route path="/progress" element={<Progress />} />
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

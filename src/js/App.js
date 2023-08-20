import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TakeOrder from './takeorder';
import Navbar from './navbar';
import Order from './order';
import axios from 'axios';
import { useState,useEffect } from 'react';
import '../css/App.css'

function App() {
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      setTotalOrders(response.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderPlaced = (newTotalOrders) => {
    setTotalOrders(newTotalOrders);
  };
  const handleOrderDeleted = (newTotalOrders) => {
    setTotalOrders(newTotalOrders);
  };
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navbar totalOrders={totalOrders} />}
        >
          <Route
            path="take_order"
            element={<TakeOrder onOrderPlaced={handleOrderPlaced} />}
          />
          <Route
            path="order"
            element={<Order setTotalOrders={handleOrderDeleted} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TakeOrder = ({ onOrderPlaced }) => {
  const [iceCreams, setIceCreams] = useState([]);
  const [selectedIceCream, setSelectedIceCream] = useState(null);
  const [noscope, setNoscope] = useState({});
  const [container, setContainer] = useState({});

  useEffect(() => {
    fetchIceCreams();
  }, []);

  const fetchIceCreams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/icecreams');
      const initialNoscope = {};
      const initialContainer = {};

      // Set the initialContainer with 'Cup' as default
      response.data.forEach((iceCream) => {
        initialNoscope[iceCream._id] = 1;
        initialContainer[iceCream._id] = 'Cup';
      });

      setIceCreams(response.data);
      setNoscope(initialNoscope);
      setContainer(initialContainer);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrder = async () => {
    if (selectedIceCream) {
      const totalPrice = selectedIceCream.price * noscope[selectedIceCream._id] + (container[selectedIceCream._id] === 'Cone' ? 10 : 0);
      const order = {
        ref_id: selectedIceCream._id,
        noscope: noscope[selectedIceCream._id],
        container: container[selectedIceCream._id],
        price: totalPrice,
      };

      try {
        await axios.post('http://localhost:5000/orders', order);
        alert('Order placed successfully!');
        // Reset selected ice cream and other fields
        setSelectedIceCream(null);
        const updatedNoscope = { ...noscope };
        const updatedContainer = { ...container };
        updatedNoscope[selectedIceCream._id] = 1;
        updatedContainer[selectedIceCream._id] = 'Cup';
        setNoscope(updatedNoscope);
        setContainer(updatedContainer);
        fetchOrders();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      onOrderPlaced(response.data.length); // Update the totalOrders in App.js
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoscopeChange = (event, iceCreamId) => {
    const updatedNoscope = { ...noscope };
    updatedNoscope[iceCreamId] = Number(event.target.value);
    setNoscope(updatedNoscope);
  };

  const handleContainerChange = (event, iceCreamId) => {
    const updatedContainer = { ...container };
    updatedContainer[iceCreamId] = event.target.value;
    setContainer(updatedContainer);
  };

  const handleIceCreamSelect = (iceCream) => {
    setSelectedIceCream(iceCream);
  };

  return (
    <div>
      <h1>Ice Creams</h1>
      <table border={1} cellSpacing={0} cellPadding={2}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Number of Scoops</th>
            <th>Container</th>
          </tr>
        </thead>
        <tbody>
          {iceCreams.map((iceCream) => (
            <tr key={iceCream._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIceCream === iceCream}
                  onChange={() => handleIceCreamSelect(iceCream)}
                />
              </td>
              <td>{iceCream.name}</td>
              <td>{iceCream.price} INR</td>
              <td>
                <input
                  type="text"
                  min="1"
                  value={noscope[iceCream._id]}
                  onChange={(e) => handleNoscopeChange(e, iceCream._id)}
                />
              </td>
              <td>
                <label>
                  <input
                    type="radio"
                    name={`container-${iceCream._id}`}
                    value="Cone"
                    checked={container[iceCream._id] === 'Cone'}
                    onChange={(e) => handleContainerChange(e, iceCream._id)}
                  />{' '}
                  Cone (Rs 10)
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name={`container-${iceCream._id}`}
                    value="Cup"
                    checked={container[iceCream._id] === 'Cup'}
                    onChange={(e) => handleContainerChange(e, iceCream._id)}
                  />{' '}
                  Cup
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button disabled={!selectedIceCream} onClick={handleOrder}>
        Order
      </button>
    </div>
  );
};

export default TakeOrder;

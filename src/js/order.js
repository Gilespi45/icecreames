import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Order = ({ setTotalOrders }) => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [editedNoscope, setEditedNoscope] = useState({});
  const [editedContainer, setEditedContainer] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      const mappedOrders = response.data.map((order) => ({
        ...order,
        container: order.container ? 'Cone' : 'Cup',
      }));
      setOrders(mappedOrders);
      setTotalOrders(response.data.length); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      alert('Order deleted successfully!');
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditOrder = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    setEditOrder(order);
    setEditedNoscope({ [orderId]: order.noscope });
    setEditedContainer({ [orderId]: order.container });
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async (orderId) => {
    const totalPrice = editOrder.ref_id.price * editedNoscope[orderId] + (editedContainer[orderId] ? 10 : 0);
    const updatedOrder = {
      noscope: editedNoscope[orderId],
      container: editedContainer[orderId],
      price: totalPrice,
    };

    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`, updatedOrder);
      alert('Order updated successfully!');
      setEditOrder(null);
      setEditedNoscope({});
      setEditedContainer({});
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditOrder(null);
    setEditedNoscope({});
    setEditedContainer({});
    setIsModalOpen(false);
  };

  const handleNoscopeChange = (event, orderId) => {
    const updatedNoscope = { ...editedNoscope };
    updatedNoscope[orderId] = Number(event.target.value);
    setEditedNoscope(updatedNoscope);
  };

  const handleContainerChange = (event, orderId) => {
    const updatedContainer = { ...editedContainer };
    updatedContainer[orderId] = event.target.value === 'Cone';
    setEditedContainer(updatedContainer);
  };

  const handleSaveChanges = () => {
    handleUpdateOrder(editOrder._id);
    setIsModalOpen(false);
  };
 

  return (
    <>
      <h1>My Orders</h1>
      <table border={2} cellPadding={2}>
        <thead>
          <tr>
            <th>Ice Cream</th>
            <th>Number of Scoops</th>
            <th>Container</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.ref_id && order.ref_id.name}</td>
              <td>{order.noscope}</td>
              <td>{order.container}</td>
              <td>{order.price} INR</td>
              <td>
                <button onClick={() => handleEditOrder(order._id)}>Edit</button>
                <button onClick={() => handleDeleteOrder(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && editOrder && (
        <Modal show={isModalOpen} onHide={handleCancelEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <table>
                <thead>
                  <tr>
                    <th>Ice Cream Flavor</th>
                    <th>Number of Scoops</th>
                    <th>Container</th>
                    <th>Actual Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{editOrder.ref_id && editOrder.ref_id.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={editedNoscope[editOrder._id]}
                        onChange={(e) => handleNoscopeChange(e, editOrder._id)}
                      />
                    </td>
                    <td>
                      <label>
                        <input
                          type="radio"
                          name={`container-${editOrder._id}`}
                          value="Cup"
                          checked={!editedContainer[editOrder._id]}
                          onChange={(e) => handleContainerChange(e, editOrder._id)}
                        />
                        Cup
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`container-${editOrder._id}`}
                          value="Cone"
                          checked={editedContainer[editOrder._id]}
                          onChange={(e) => handleContainerChange(e, editOrder._id)}
                        />
                        Cone (Rs 10)
                      </label>
                    </td>
                    <td>
                      {editOrder.ref_id && editOrder.ref_id.price * editedNoscope[editOrder._id]}
                      {editedContainer[editOrder._id] ? ' + 10' : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelEdit}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Order;

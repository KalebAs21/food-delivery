import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

function Orders({ url }) {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Error fetching orders");
      console.error(err);
    }
  };

  // Update order status
  const statusHandler = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/update`, {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      toast.error("Error updating order");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders">
      <h2>Orders</h2>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <h3>Order #{order._id.slice(-5)}</h3>
                <p className="date">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={`${url}${item.image}`}
                      alt={item.name}
                      className="item-img"
                    />
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-info">
                <p>
                  <strong>Customer:</strong> {order.address.firstName}{" "}
                  {order.address.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {order.address.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.address.phone}
                </p>
                <p>
                  <strong>Address:</strong> {order.address.city},{" "}
                  {order.address.state}, {order.address.country}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${order.amount}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment ? "✅ Paid" : "❌ Not Paid"}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>

              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) =>
                    statusHandler(order._id, e.target.value)
                  }
                >
                  <option value="food processing">Food Processing</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;

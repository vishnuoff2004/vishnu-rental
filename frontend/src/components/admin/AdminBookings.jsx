import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./adminbookings.css";
import API from "../../api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/admin/bookings`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      setBookings(res.data.bookings);
    } catch {
      navigate("/admin/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await axios.delete(`${API}/admin/booking/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      setBookings(bookings.filter((b) => b._id !== id));
      alert("Booking deleted");
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="admin-bookings-page">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid mx-5">

          <Link className="navbar-brand fw-bold" style={{ color: "red" }}>
            Vishnu Rentals — Admin
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="adminNav">
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link fw-semibold">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/admin/users" className="nav-link fw-semibold">
                  Users
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/admin/bookings" className="nav-link fw-bold text-danger">
                  Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/vehicles" className="nav-link fw-semibold">Vehicles</Link>
              </li>

              <li className="nav-item">
                <button className="btn btn-danger px-3" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      </nav>

      {/* BOOKINGS CONTENT */}
      <div className="container my-5">

        <h2 className="fw-bold text-center mb-4">All Bookings</h2>

        <div className="row g-4">
          {bookings.map((b) => (
            <div key={b._id} className="col-12 col-sm-6 col-lg-4">

              <div className="booking-card shadow-sm p-3">

                <h5 className="fw-bold text-danger text-center mb-2">
                  <i className="bi bi-car-front-fill me-1"></i>
                  {b.vehicleId?.name}
                </h5>

                <div className="booking-info mt-2">
                  <p className="mb-1"><strong>User:</strong> {b.userId?.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {b.userId?.email}</p>
                  <p className="mb-1"><strong>Pickup:</strong> {b.pickupDate}</p>
                  <p className="mb-1"><strong>Drop:</strong> {b.dropDate}</p>
                  {b.totalPrice && (
                    <p className="mb-1"><strong>Total Price:</strong> ₹{b.totalPrice}</p>
                  )}
                </div>

                <div className="text-center mt-3">
                  <button
                    className="btn btn-danger btn-sm px-3"
                    onClick={() => deleteBooking(b._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

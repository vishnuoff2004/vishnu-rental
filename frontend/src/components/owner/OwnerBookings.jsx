import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import OwnerFooter from "./OwnerFooter";
import { toast } from "react-toastify";
import "./owner.css"
import API from "../../../api";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "owner") {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/booking/owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
        return;
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="page-with-fixed-footer">

      {/* ---------- OWNER NAVBAR (INLINE) ---------- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid mx-5">

          <Link to="/" className="navbar-brand fw-bold" style={{ color: "red" }}>
            Vishnu Rentals
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navContent">
            <ul className="navbar-nav gap-5">

              <li className="nav-item">
                <Link to="/owner/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/owner/add-vehicle" className="nav-link">
                  Add Vehicle
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/owner/my-vehicles" className="nav-link">
                  My Vehicles
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/owner/bookings" className="nav-link fw-bold text-danger">
                  Bookings
                </Link>
              </li>

              <li className="nav-item">
                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
              </li>

            </ul>
          </div>

        </div>
      </nav>
      {/* ---------- END NAVBAR ---------- */}


      <div className="container my-5">
        <h2 className="fw-bold mb-4 text-center">Bookings for Your Vehicles</h2>

        {bookings.length === 0 ? (
          <h5 className="text-center text-muted">No bookings yet.</h5>
        ) : (
          <div className="row g-4">
            {bookings.map((b) => (
              <div key={b._id} className="col-md-3 col-sm-6 d-flex justify-content-center">
                <div className="card shadow-sm owner-booking-card">

                  <img
                    src={`${b.vehicleId.vehicleImage}`}
                    className="card-img-top"
                    alt="vehicle"
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{b.vehicleId.name}</h5>
                    <p><strong>Booked By:</strong> {b.userId.name}</p>
                    <p><strong>Email:</strong> {b.userId.email}</p>

                    <p><strong>Pickup:</strong> {new Date(b.pickupDate).toLocaleDateString()}</p>
                    <p><strong>Drop:</strong> {new Date(b.dropDate).toLocaleDateString()}</p>

                    <h6 className="text-danger fw-bold mt-2">₹{b.totalPrice}</h6>

                    <Link to="/owner/my-vehicles" className="btn view-vehicle-btn btn-sm mt-3 w-100">
                      View Vehicle
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OwnerFooter />
    </div>
  );
}

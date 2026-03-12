import { useEffect, useState } from "react";
import axios from "axios";
import UserFooter from "./UserFooter";
import { useNavigate, Link } from "react-router-dom";
import "./bookings.css"
import API from "../../api";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API}/booking/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="booking">

      {/* INLINE NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid mx-5">

          <Link className="navbar-brand fw-bold" style={{ color: "red" }}>
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
                <Link to="/user/home" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link to="/vehicles/cars" className="nav-link">Cars</Link>
              </li>

              <li className="nav-item">
                <Link to="/vehicles/bikes" className="nav-link">Bikes</Link>
              </li>

              <li className="nav-item">
                <Link to="/bookings/user" className="nav-link fw-bold text-danger">
                  My Bookings
                </Link>
              </li>

              <li className="nav-item">
                <button className="btn btn-danger px-3" onClick={handleLogout}>
                  Logout
                </button>
              </li>

            </ul>
          </div>
        </div>
      </nav>
      {/* END NAVBAR */}

      <div className="container my-5">
        <h2 className="fw-bold mb-4 text-center">My Bookings</h2>

        {bookings.length === 0 ? (
          <h5 className="text-center text-muted">No bookings yet.</h5>
        ) : (
          <div className="row g-4">
            {bookings.map((b) => (
              <div key={b._id} className="col-md-4 col-lg-3">
                <div className="card shadow-sm">

                  <img
                    src={`${b.vehicleId.vehicleImage}`}
                    className="card-img-top"
                    alt="vehicle"
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{b.vehicleId.name}</h5>
                    <p className="mb-1"><strong>Type:</strong> {b.vehicleId.type}</p>
                    <p className="mb-1"><strong>Pickup:</strong> {new Date(b.pickupDate).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Drop:</strong> {new Date(b.dropDate).toLocaleDateString()}</p>
                    <h6 className="text-danger fw-bold mt-2">₹{b.totalPrice}</h6>

                    <Link to={`/vehicle/${b.vehicleId._id}`} className="btn btn-sm w-100 view-btn">
                      View Vehicle
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UserFooter />
    </div>
  );
}

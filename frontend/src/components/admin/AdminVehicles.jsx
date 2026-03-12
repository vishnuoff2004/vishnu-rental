import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./adminvehicles.css";
import API from "../api";


export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API}/admin/vehicles`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") },
      });
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error(err);
      navigate("/admin/login");
    }
  };

  const approveVehicle = async (id) => {
    if (!window.confirm("Approve this vehicle?")) return;
    try {
      await axios.post(
        `${API}/admin/vehicle/approve/${id}`,
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") },
        }
      );

      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, approved: true } : v))
      );

      alert("Vehicle approved");
      setSelectedVehicle(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Approve failed");
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle and related bookings?")) return;
    try {
      await axios.delete(`${API}/admin/vehicle/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") },
      });

      setVehicles((prev) => prev.filter((v) => v._id !== id));
      setSelectedVehicle(null);
      alert("Vehicle deleted");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="admin-vehicles-page">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid mx-5">
          <Link className="navbar-brand fw-bold" style={{ color: "red" }}>
            Vishnu Rentals — Admin
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNav"
          >
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
                <Link to="/admin/bookings" className="nav-link fw-semibold">
                  Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/vehicles" className="nav-link fw-bold text-danger">
                  Vehicles
                </Link>
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

      {/* CONTENT */}
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">Vehicles</h2>

        {vehicles.length === 0 ? (
          <p className="text-center text-muted">No vehicles found.</p>
        ) : (
          <div className="row g-4">
            {vehicles.map((v) => (
              <div key={v._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className="vehicle-card shadow-sm"
                  onClick={() => setSelectedVehicle(v)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      v.vehicleImage
                        ? `${v.vehicleImage}`
                        : "/assets/placeholder.png"
                    }
                    alt={v.name}
                    className="vehicle-img"
                  />

                  <div className="p-3 text-center">
                    <h6 className="fw-bold mb-1">{v.name}</h6>
                    <div className="text-muted">{v.type}</div>
                    <div className="fw-semibold">₹{v.pricePerDay}/day</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VEHICLE DETAILS MODAL */}
      {selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h4 className="fw-bold mb-3 text-center">
              {selectedVehicle.name}
            </h4>

            <img
              src={`${selectedVehicle.vehicleImage}`}
              alt="vehicle"
              className="img-fluid rounded mb-3"
            />

            <p><strong>Type:</strong> {selectedVehicle.type}</p>
            <p><strong>Brand:</strong> {selectedVehicle.brand}</p>
            <p><strong>Model:</strong> {selectedVehicle.model}</p>
            <p><strong>Location:</strong> {selectedVehicle.location}</p>
            <p><strong>Price:</strong> ₹{selectedVehicle.pricePerDay}/day</p>
            <p><strong>Owner:</strong> {selectedVehicle.ownerId?.name}</p>

            <div className="d-flex justify-content-end gap-2 mt-4">
              {/* {!selectedVehicle.approved && (
                <button
                  className="btn approve-btn"
                  onClick={() => approveVehicle(selectedVehicle._id)}
                >
                  Approve
                </button>
              )} */}

              <button
                className="btn del-btn"
                onClick={() => deleteVehicle(selectedVehicle._id)}
              >
                Delete
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedVehicle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

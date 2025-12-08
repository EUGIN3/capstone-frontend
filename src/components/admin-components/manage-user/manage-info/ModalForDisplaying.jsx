import React, { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ToastContainer, toast, Slide } from "react-toastify";
import AxiosInstance from "../../../API/AxiosInstance";
import Confirmation from "../../../forms/confirmation-modal/Confirmation";
import "./ModalForEdtting.css";

function ModalForDisplaying({ onClose, id }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    shoulder_width: "",
    arm_length: "",
    leg_length: "",
  });

  // Loading wrapper function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400); // visible delay
      await cb();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserInformation();
    }
  }, [id]);

  const fetchUserInformation = async () => {
    await withLoading(async () => {
      try {
        const res = await AxiosInstance.get(`/user_info/user-information/`, {
          params: { user: id }
        });
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setInfo(data || null);
        if (data) {
          setFormData({
            height: data.height || "",
            weight: data.weight || "",
            chest: data.chest || "",
            waist: data.waist || "",
            hips: data.hips || "",
            shoulder_width: data.shoulder_width || "",
            arm_length: data.arm_length || "",
            leg_length: data.leg_length || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load user information.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        });
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ✅ Validate before showing confirmation
  const handleSaveClick = () => {
    if (saving) return;

    // Check if at least one field has a value
    const hasData = Object.values(formData).some(value => value.trim() !== "");
    
    if (!hasData) {
      toast.error(
        <div style={{ padding: "8px" }}>
          Please enter at least one measurement.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Show confirmation dialog
    const action = info ? 'update' : 'create';
    const message = info 
      ? 'Update user measurements? This will replace the existing measurements.'
      : 'Save these measurements for this user?';

    setShowConfirm({
      severity: action === 'update' ? 'warning' : 'success',
      message: message,
      action: action
    });
  };

  // ✅ Execute save after confirmation
  const doSave = async () => {
    setSaving(true);
    try {
      if (info) {
        // Update existing measurement
        await AxiosInstance.patch(`/user_info/user-information/${info.id}/`, {
          user: info.user,
          ...formData,
        });
        
        toast.success(
          <div style={{ padding: "8px" }}>Measurements updated successfully!</div>,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
            transition: Slide,
            closeButton: false,
          }
        );
      } else {
        // Create new measurement
        await AxiosInstance.post(`/user_info/user-information/`, {
          user: id,
          ...formData,
        });
        
        toast.success(
          <div style={{ padding: "8px" }}>Measurements added successfully!</div>,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
            transition: Slide,
            closeButton: false,
          }
        );
      }
      
      setIsEditing(false);
      
      // Refresh data after short delay
      setTimeout(async () => {
        await fetchUserInformation();
        setSaving(false);
      }, 1000);

    } catch (error) {
      setSaving(false);
      
      let errorMessage = "Failed to save measurements. Please try again.";
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      "Invalid measurement data. Please check your entries.";
      } else if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You do not have permission to update measurements.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please refresh and try again.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message === 'Network Error') {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }

      toast.error(
        <div style={{ padding: "8px" }}>{errorMessage}</div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  // ✅ Handle confirmation response
  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed) {
      doSave();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (info) {
      setFormData({
        height: info.height || "",
        weight: info.weight || "",
        chest: info.chest || "",
        waist: info.waist || "",
        hips: info.hips || "",
        shoulder_width: info.shoulder_width || "",
        arm_length: info.arm_length || "",
        leg_length: info.leg_length || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="outerAddUpdateModal" style={{ position: "relative" }}>
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        <button 
          className="close-update-modal" 
          onClick={onClose}
          disabled={saving}
        >
          <CloseRoundedIcon
            sx={{
              color: "#f5f5f5",
              fontSize: 28,
              padding: "2px",
              backgroundColor: "#0c0c0c",
              borderRadius: "50%",
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          />
        </button>

        <div className="AddUpdateModal" style={{ padding: "30px" }}>
          <div className="add-new-update-header" style={{ marginBottom: "30px" }}>
            <p style={{ margin: 0 }}>User Measurements</p>
          </div>

          {!info && !isEditing ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <p style={{ color: "#999", marginTop: "10px" }}>No measurement yet.</p>
              <button
                onClick={() => setIsEditing(true)}
                disabled={saving}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: saving ? "#11B36450" : "#11B364",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Add Measurements
              </button>
            </div>
          ) : isEditing ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                {Object.entries(formData).map(([key, value]) => {
                  const unit = key === "weight" ? "kg" : "cm";
                  return (
                  <div key={key}>
                    <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#333", fontSize: "13px" }}>
                      {key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, " ").slice(1).toLowerCase()} ({unit})
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      disabled={saving}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s ease",
                        cursor: saving ? "not-allowed" : "text",
                        opacity: saving ? 0.6 : 1,
                      }}
                      onFocus={(e) => !saving && (e.target.style.borderColor = "#11B364")}
                      onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    />
                  </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                <button
                  onClick={handleSaveClick}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
                    width:'200px',
                    backgroundColor: saving ? "#11B36450" : "#0c0c0c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: saving ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = "#0c0c0cc4")}
                  onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = "#0c0c0c")}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: saving ? "#f0f0f050" : "#f0f0f0",
                    color: saving ? "#99999950" : "#333",
                    border: "1px solid #e5e5e5",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: saving ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = "#e5e5e5")}
                  onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = "#f0f0f0")}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                <div>
                  <div className="measurement-item">
                    <span>Height</span> : <strong>{info.height || "N/A"} cm</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Weight</span> : <strong>{info.weight || "N/A"} kg</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Chest</span> : <strong>{info.chest || "N/A"} cm</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Waist</span> : <strong>{info.waist || "N/A"} cm</strong>
                  </div>
                </div>
                <div>
                  <div className="measurement-item">
                    <span>Hips</span> : <strong>{info.hips || "N/A"} cm</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Shoulder Width</span> : <strong>{info.shoulder_width || "N/A"} cm</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Arm Length</span> : <strong>{info.arm_length || "N/A"} cm</strong>
                  </div>
                  <div className="measurement-item">
                    <span>Leg Length</span> : <strong>{info.leg_length || "N/A"} cm</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "20px",
                  backgroundColor: saving ? "#0c0c0c50" : "#0c0c0c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = "#1a1a1a")}
                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = "#0c0c0c")}
              >
                Edit Measurements
              </button>
            </>
          )}
        </div>

        {/* ✅ Confirmation Dialog */}
        {showConfirm && (
          <Confirmation
            message={showConfirm.message}
            severity={showConfirm.severity}
            onConfirm={handleConfirm}
            isOpen={true}
          />
        )}

        <ToastContainer />
      </div>
    </>
  );
}

export default ModalForDisplaying;
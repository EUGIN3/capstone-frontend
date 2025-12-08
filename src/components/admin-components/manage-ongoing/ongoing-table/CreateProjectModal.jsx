import './CreateProjectModal.css';
import React, { useState, useEffect } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import ButtonElement from '../../../forms/button/ButtonElement';
import NormalDatePickerComponent from '../../../forms/date-picker/NormalDatePicker';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../API/AxiosInstance';
import useNotificationCreator from '../../../notification/UseNotificationCreator';
import MultiSelectTimeSlots from '../../../forms/multiple-time/MultipleTime';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from '@mui/material';

function CreateProjectModal({ onClose, onProjectCreated }) {
  const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      user: '',
      attire_type: '',
      process_status: 'concept',
      total_amount: '',
      amount_paid: '',
    },
  });

  const [targetDate, setTargetDate] = useState(null);
  const [fittingDate, setFittingDate] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const { sendDefaultNotification } = useNotificationCreator();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [users, setUsers] = useState([]);

  // Watch form values for validation
  const totalAmount = watch('total_amount');
  const amountPaid = watch('amount_paid');
  const selectedUser = watch('user');

  // ✅ Attire type options
  const attireTypeOptions = [
    // Women's Formal Attire - Gowns & Dresses
    { value: 'ball gown', label: 'Ball Gown' },
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'a line', label: 'A-Line' },
    { value: 'trumpet', label: 'Trumpet' },
    { value: 'sheath', label: 'Sheath' },
    { value: 'empire waist', label: 'Empire Waist' },
    { value: 'tea length', label: 'Tea Length' },
    { value: 'high low', label: 'High-Low' },
    { value: 'column', label: 'Column' },
    { value: 'fit and flare', label: 'Fit and Flare' },
    { value: 'princess', label: 'Princess' },
    { value: 'slip dress', label: 'Slip Dress' },
    { value: 'off shoulder', label: 'Off-Shoulder' },
    { value: 'halter', label: 'Halter' },
    { value: 'strapless', label: 'Strapless' },
    { value: 'one shoulder', label: 'One-Shoulder' },
    { value: 'cap sleeve', label: 'Cap Sleeve' },
    { value: 'long sleeve', label: 'Long Sleeve' },
    { value: 'illusion', label: 'Illusion' },
    { value: 'two piece', label: 'Two-Piece' },
    { value: 'jumpsuit', label: 'Jumpsuit' },
    { value: 'pantsuit', label: 'Pantsuit' },
    
    // Men's Formal Attire
    { value: 'tuxedo', label: 'Tuxedo' },
    { value: 'three piece suit', label: 'Three-Piece Suit' },
    { value: 'two piece suit', label: 'Two-Piece Suit' },
    { value: 'dinner jacket', label: 'Dinner Jacket' },
    { value: 'morning coat', label: 'Morning Coat' },
    { value: 'tailcoat', label: 'Tailcoat' },
    { value: 'white tie', label: 'White Tie' },
    { value: 'black tie', label: 'Black Tie' },
    { value: 'blazer', label: 'Blazer' },
    { value: 'waistcoat', label: 'Waistcoat/Vest' },
    { value: 'nehru jacket', label: 'Nehru Jacket' },
    { value: 'barong tagalog', label: 'Barong Tagalog' },
    { value: 'sherwani', label: 'Sherwani' },
    
    // Unisex/Gender-Neutral Formal Attire
    { value: 'formal suit', label: 'Formal Suit' },
    { value: 'cocktail attire', label: 'Cocktail Attire' },
    { value: 'evening wear', label: 'Evening Wear' },
    { value: 'formal jumpsuit', label: 'Formal Jumpsuit' },
    { value: 'cape gown', label: 'Cape Gown' },
    { value: 'kimono formal', label: 'Formal Kimono' },
    { value: 'kaftan', label: 'Kaftan' },
    { value: 'other', label: 'Other' },
  ];

  // Time slot → model field mapping
  const slotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five',
  };

  const allTimeSlots = Object.keys(slotMap);

  // ✅ Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosInstance.get('auth/users/');
        const userOptions = response.data.map(user => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name}`.trim() || user.username || `User ${user.id}`
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  // ✅ Fetch availability data on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await AxiosInstance.get('availability/display_unavailability/');
        setAvailabilityData(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching availability:', error);
      }
    };
    fetchAvailability();
  }, []);

  // ✅ Check if a date should be disabled (NO available slots)
  const shouldDisableDate = (date) => {
    if (!date) return false;
    
    const dateStr = date.format('YYYY-MM-DD');
    const dayAvailability = availabilityData.find(item => item.date === dateStr);
    if (!dayAvailability) {
      return false;
    }

    const allSlotsUnavailable = 
      dayAvailability.slot_one === true &&
      dayAvailability.slot_two === true &&
      dayAvailability.slot_three === true &&
      dayAvailability.slot_four === true &&
      dayAvailability.slot_five === true;

    return allSlotsUnavailable;
  };

  // ✅ Update available slots when fitting date changes
  useEffect(() => {
    if (!fittingDate) {
      setAvailableSlots([]);
      setSelectedTimes([]);
      return;
    }

    const dateStr = fittingDate.format('YYYY-MM-DD');
    const dayAvailability = availabilityData.find(item => item.date === dateStr);

    if (!dayAvailability) {
      setAvailableSlots(allTimeSlots);
      return;
    }

    const available = allTimeSlots.filter(timeSlot => {
      const slotKey = slotMap[timeSlot];
      const isAvailable = dayAvailability[slotKey] === false;
      
      return isAvailable;
    });

    setAvailableSlots(available);
    
    setSelectedTimes(prev => prev.filter(time => available.includes(time)));
  }, [fittingDate, availabilityData]);

  const handleImageChange = (e) => {
    setReferenceImage(e.target.files[0]);
  };

  // ✅ Validate amount inputs
  const validateAmount = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return false;
    }

    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0) {
      toast.error(
        <div style={{ padding: '8px' }}>
          {fieldName} must be a valid positive number.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return false;
    }

    return true;
  };

  // ✅ Returns config object if confirmation needed
  const getConfirmationConfig = (data) => {
    if (!targetDate || !data.user) {
      return null;
    }

    const selectedUserData = users.find(u => u.value === data.user);
    const userName = selectedUserData?.label || 'the selected user';

    const fittingTimeInfo = selectedTimes.length > 0 
      ? ` with ${selectedTimes.length} fitting slot${selectedTimes.length > 1 ? 's' : ''}`
      : '';

    return {
      severity: 'warning',
      message: `Create project for ${userName}? This will create a new project${fittingTimeInfo} and notify the client.`
    };
  };

  // ✅ Main save handler
  const handleSave = (data) => {
    if (saving) return;

    // Check user selection
    if (!data.user) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select a user.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Check attire type
    if (!data.attire_type) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select attire type.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!targetDate) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select a target date.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Check if total cost is empty
    if (!data.total_amount || data.total_amount.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Total cost is required. Please enter the attire total cost.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Validate total amount
    if (!validateAmount(data.total_amount, 'Total cost')) {
      return;
    }

    // Check if amount paid is empty
    if (!data.amount_paid || data.amount_paid.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Amount paid is required. Please enter the amount paid.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Validate amount paid
    if (!validateAmount(data.amount_paid, 'Amount paid')) {
      return;
    }

    // Check if total amount >= amount paid
    const total = parseFloat(data.total_amount);
    const paid = parseFloat(data.amount_paid);

    if (paid > total) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Amount paid cannot be greater than total cost.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Check if fitting date is specified
    if (!fittingDate) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Fitting date is required. Please select a fitting date.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    // Check if at least one time slot is selected
    if (!selectedTimes || selectedTimes.length === 0) {
      toast.error(
        <div style={{ padding: '8px' }}>
          At least one fitting time slot must be selected.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    const config = getConfirmationConfig(data);
    
    if (config) {
      setShowConfirm({ ...config, formData: data });
    }
  };

  // ✅ Actual save logic
  const doSave = async (data) => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('user', data.user);
      formData.append('attire_type', data.attire_type || '');
      
      formData.append(
        'targeted_date',
        targetDate.format('YYYY-MM-DD')
      );
      formData.append(
        'fitting_date',
        fittingDate ? fittingDate.format('YYYY-MM-DD') : ''
      );
      
      formData.append('fitting_time', JSON.stringify(selectedTimes));
      formData.append('process_status', 'concept'); // Always set to concept
      formData.append('total_amount', data.total_amount || '');
      formData.append('payment_status', data.payment_status || 'no_payment');
      formData.append('amount_paid', data.amount_paid || '');

      if (referenceImage) {
        formData.append('reference_image', referenceImage);
      }

      await AxiosInstance.post('/design/designs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      sendDefaultNotification('project_created', data.user);

      // HANDLE FITTING TIME UNAVAILABILITY
      if (fittingDate && selectedTimes.length > 0) {
        try {
          const dateStr = fittingDate.format('YYYY-MM-DD');

          const availabilityRes = await AxiosInstance.get(
            `availability/display_unavailability/?date=${dateStr}`
          );

          const existing = availabilityRes.data?.[0] || { date: dateStr };

          const updatedUnavailability = { ...existing };

          selectedTimes.forEach((time) => {
            const key = slotMap[time];
            if (key) {
              updatedUnavailability[key] = true;
              updatedUnavailability[`reason_${key.split('_')[1]}`] =
                'Scheduled Fitting';
            }
          });

          await AxiosInstance.post(
            'availability/set_unavailability/',
            updatedUnavailability
          );
        } catch (err) {
          console.error('Error marking fitting slots unavailable:', err);
        }
      }

      // ✅ Call onProjectCreated callback to refresh parent component
      if (onProjectCreated) {
        onProjectCreated();
      }

      // Hide loading spinner first
      setSaving(false);

      const selectedUserData = users.find(u => u.value === data.user);
      const userName = selectedUserData?.label || 'the user';

      // Then show success toast
      toast.success(
        <div style={{ padding: '8px' }}>
          Project created successfully for {userName}!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );

      // Close modal after success toast
      setTimeout(() => {
        reset();
        setTargetDate(null);
        setFittingDate(null);
        setSelectedTimes([]);
        setReferenceImage(null);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Failed to create project:', error);
      setSaving(false);

      let errorMessage = 'Failed to create project. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid project data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create this project.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  // ✅ Handles confirmation response
  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed && showConfirm?.formData) {
      doSave(showConfirm.formData);
    }
  };

  // ✅ Reset form when closing
  const handleClose = () => {
    if (!saving) {
      reset();
      setTargetDate(null);
      setFittingDate(null);
      setSelectedTimes([]);
      setReferenceImage(null);
      onClose();
    }
  };

  return (
    <>
      <div className="projectOuterModal" style={{ position: 'relative' }}>
        
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

          <Tooltip title="Close" arrow>
            <button className="close-modal" onClick={handleClose} disabled={saving}>
              <CloseRoundedIcon
                sx={{
                  color: '#f5f5f5',
                  fontSize: 28,
                  padding: '2px',
                  backgroundColor: '#0c0c0c',
                  borderRadius: '50%',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
              />
            </button>
          </Tooltip>

        <div className="createProjectModal">


          <div className="project-modal-body">
            <div className="project-title">Create Project</div>

            <div className="user-selection-container project-container">
              <DropdownComponentTime
                items={users}
                dropDownLabel="Select User"
                name="user"
                control={control}
              />
            </div>

            <div className="attire-type-container project-container">
              <DropdownComponentTime
                items={attireTypeOptions}
                dropDownLabel="Attire Type"
                name="attire_type"
                control={control}
              />
            </div>

            <div className="date-status-container">
              <div className="targeted-date-container project-container">
                <NormalDatePickerComponent
                  value={targetDate}
                  onChange={setTargetDate}
                  label="Target Date"
                />
              </div>

              <div className="progress-status-container project-container">
                <div style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 16px', 
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  border: '1px solid #c4c4c4'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginBottom: '2px',
                    lineHeight: '1.2'
                  }}>
                    Process Status
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '400', 
                    color: '#333',
                    lineHeight: '1.2'
                  }}>
                    Concept
                  </div>
                </div>
              </div>
            </div>

            <div className="total-container project-container">
              <NormalDatePickerComponent
                value={fittingDate}
                onChange={setFittingDate}
                label="Fitting Date"
                shouldDisableDate={shouldDisableDate}
              />
            </div>

            <div className="total-container project-container">
              <MultiSelectTimeSlots
                value={selectedTimes}
                onChange={setSelectedTimes}
                availableSlots={availableSlots}
                disabled={!fittingDate}
              />
            </div>

            <div className="payment-container">
              <NormalTextField
                label="Attire Total Cost"
                name="total_amount"
                control={control}
                placeHolder="Enter Total Cost"
                type="number"
              />

              <NormalTextField
                label="Amount Paid"
                name="amount_paid"
                control={control}
                placeHolder="Enter Amount"
                type="number"
              />
            </div>

            <div className="save-container">
              <ButtonElement
                label="Save"
                variant="filled-black"
                type="button"
                onClick={handleSubmit(handleSave)}
                disabled={saving}
              />
            </div>
          </div>

          {showConfirm && (
            <Confirmation
              message={showConfirm.message}
              severity={showConfirm.severity}
              onConfirm={handleConfirm}
              isOpen={true}
            />
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default CreateProjectModal;
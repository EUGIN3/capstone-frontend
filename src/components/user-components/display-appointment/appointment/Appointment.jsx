import './Appointment.css'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import Dialog from '@mui/material/Dialog'
import ButtonElement from '../../../forms/button/ButtonElement'
import NormalTextField from '../../../forms/text-fields/NormalTextField'
import AxiosInstance from '../../../API/AxiosInstance'
import DatePickerComponent from '../../../forms/date-picker/DatePicker'
import FixTime from '../../../forms/fixtime/FixTime'
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone'
import UploadBox from '../../../forms/upload-file/ImageUpload'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import noImage from '../../../../assets/no-image.jpg'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { Tooltip } from '@mui/material'
import Confirmation from '../../../forms/confirmation-modal/Confirmation'
import { toast, Slide } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

function Appointment(props) {
  const {
    date,
    time,
    status,
    id,
    onUpdate,
    description,
    image
  } = props

  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [selectedTime, setSelectedTime] = useState('')
  const [availabilityData, setAvailabilityData] = useState({})
  const [disabledSlots, setDisabledSlots] = useState({})
  const [resetUploadBox, setResetUploadBox] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(null)

  const { handleSubmit, control, reset } = useForm()

  const getFullImageUrl = (img) => {
    if (!img) return '/placeholder.png'
    return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`
  }

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const getAvailability = (dateStr) => {
    AxiosInstance.get(`availability/display_unavailability/?date=${dateStr}`)
      .then((response) => {
        const data = response.data[0]
        if (data) {
          setAvailabilityData(data)
          const unavailableSlots = {
            '7:00 - 8:30 AM': data.slot_one,
            '8:30 - 10:00 AM': data.slot_two,
            '10:00 - 11:30 AM': data.slot_three,
            '1:00 - 2:30 PM': data.slot_four,
            '2:30 - 4:00 PM': data.slot_five
          }
          setDisabledSlots(unavailableSlots)
        } else {
          setAvailabilityData({})
          setDisabledSlots({})
        }
      })
      .catch((error) => {
        console.error('Failed to fetch availability:', error)
        toast.error(
          <div style={{ padding: '8px' }}>
            Failed to load available time slots.
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
        )
      })
  }

  useEffect(() => {
    if (open) {
      const formattedDate = dayjs(date)
      setSelectedDate(formattedDate)
      setSelectedTime('')
      setSelectedImage(null)
      reset({
        time: '',
        updatedAppointmentDescription:
          description && description !== 'undefined' ? description : ''
      })
    }
  }, [open])

  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD')
    getAvailability(formattedDate)
    // Empty the time selection when date changes
    setSelectedTime('')
    // Reset the form field for time
    reset((formValues) => ({
      ...formValues,
      time: ''
    }))
  }, [selectedDate])

  const timeToSlotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five'
  }

  const handleCancelClick = () => {
    setShowConfirm({
      action: 'cancel',
      severity: 'alert',
      message: `Are you sure you want to cancel your appointment on ${dayjs(date).format('MMM DD, YYYY')} at ${time}?`
    })
  }

  const handleCancel = async () => {
    if (loading) return
    setLoading(true)

    try {
      const oldStatus = status

      // Cancel the appointment
      await AxiosInstance.patch(
        `appointment/user_appointments/${id}/`,
        { appointment_status: 'cancelled' }
      )

      // If appointment was approved, free up the slot
      if (oldStatus === 'approved') {
        const formattedDate = dayjs(date).format('YYYY-MM-DD')
        const slotField = timeToSlotMap[time]

        if (slotField) {
          try {
            const res = await AxiosInstance.get(
              `availability/display_unavailability/?date=${formattedDate}`
            )
            const unavailability = res.data[0]

            if (unavailability) {
              await AxiosInstance.patch(
                `availability/set_unavailability/${unavailability.id}/`,
                { [slotField]: false }
              )
            }
          } catch (err) {
            console.error('Error freeing slot:', err)
          }
        }
      }

      toast.success(
        <div style={{ padding: '8px' }}>
          Appointment cancelled successfully.
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
      )

      // Trigger parent refresh
      if (onUpdate) {
        setTimeout(() => {
          onUpdate()
        }, 100)
      }

    } catch (error) {
      console.error('Failed to cancel appointment:', error)
      
      let errorMessage = 'Failed to cancel appointment. Please try again.'

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid request. Please try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to cancel this appointment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. It may have been deleted.';
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
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setShowConfirm({
      action: 'delete',
      severity: 'alert',
      message: `Are you sure you want to delete this appointment? This action cannot be undone.`
    })
  }

  const handleDelete = async () => {
    if (loading) return
    setLoading(true)

    try {
      await AxiosInstance.patch(`appointment/user_appointments/${id}/`, {
        appointment_status: 'archived'
      })

      toast.success(
        <div style={{ padding: '8px' }}>
          Appointment deleted successfully.
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
      )

      // Trigger parent refresh
      if (onUpdate) {
        setTimeout(() => {
          onUpdate()
        }, 100)
      }

    } catch (error) {
      console.error('Failed to delete appointment:', error)
      
      let errorMessage = 'Failed to delete appointment. Please try again.'

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid request. Please try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this appointment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. It may have already been deleted.';
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
      )
    } finally {
      setLoading(false)
    }
  }

  const submission = (data) => {
    // Validation: Check if time is selected
    if (!selectedTime) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select a time slot.
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
      )
      return
    }

    setShowConfirm({
      action: 'edit',
      severity: 'warning',
      message: `Save changes to your appointment on ${selectedDate.format('MMM DD, YYYY')} at ${selectedTime}?`,
      data: data
    })
  }

  const doSubmit = async (data) => {
    if (loading) return
    setLoading(true)
    
    const formData = new FormData()
    formData.append('date', selectedDate.format('YYYY-MM-DD'))
    formData.append('time', selectedTime)
    formData.append('description', data.updatedAppointmentDescription)

    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    try {
      await AxiosInstance.patch(`appointment/user_appointments/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success(
        <div style={{ padding: '8px' }}>
          Appointment updated successfully!
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
      )

      // Trigger parent refresh
      if (onUpdate) {
        setTimeout(() => {
          onUpdate()
        }, 100)
      }

      // Close modal after slight delay to show success message
      setTimeout(() => {
        handleClose()
        reset()
        setSelectedTime('')
        setSelectedDate(dayjs(date))
        setSelectedImage(null)
        setResetUploadBox((prev) => !prev)
      }, 100)

    } catch (error) {
      console.error('Failed to update appointment:', error)
      
      let errorMessage = 'Failed to update appointment. Please try again.'

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid appointment data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update this appointment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. It may have been deleted.';
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
      )
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = (confirmed) => {
    const action = showConfirm?.action
    const data = showConfirm?.data
    setShowConfirm(null)
    
    if (confirmed) {
      if (action === 'cancel') {
        handleCancel()
      } else if (action === 'delete') {
        handleDelete()
      } else if (action === 'edit') {
        doSubmit(data)
      }
    }
  }

  const handleSaveClick = (e) => {
    e.preventDefault()
    handleSubmit(submission)()
  }

  const handleTimeSelect = (time) => setSelectedTime(time)

  const formattedDate = dayjs(date).format('MMMM DD, YYYY')

  return (
    <>
      <div className={`appointment-box ${status}`} style={{ position: 'relative' }}>
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh',
              padding: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              zIndex: 1300
            }
          }}
          style={{ zIndex: 1300 }}
        >
          <form onSubmit={(e) => e.preventDefault()} className="update-appointment-form">
            <div className="outerUpdateAppointment">
              <Tooltip title="Close" arrow>
                <button className="close-modal" onClick={handleClose}>
                  <CloseRoundedIcon
                    sx={{
                      color: '#f5f5f5',
                      fontSize: 28,
                      padding: '2px',
                      backgroundColor: '#0c0c0c',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </button>
              </Tooltip>

              <div className="update-dialog-container">
                <div className="update-dialog-title-container">
                  <p>Update Appointment</p>
                </div>

                <div className="update-dialog-input-container">
                  <div className="update-appointment-image">
                    <div className="current-image">
                      <img src={image === null ? noImage : getFullImageUrl(image)} alt="Appointment" />
                    </div>

                    <UploadBox
                      onImageSelect={(file) => setSelectedImage(file)}
                      resetTrigger={resetUploadBox}
                    />
                  </div>

                  <div className="update-dialog-time-date-container">
                    <DatePickerComponent
                      name="date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                    />

                    <FixTime
                      onSelect={handleTimeSelect}
                      disabledSlots={disabledSlots}
                      value={selectedTime}
                      control={control}
                      name={'time'}
                    />
                  </div>

                  <NormalTextField
                    label="Description"
                    name={'updatedAppointmentDescription'}
                    control={control}
                    classes="appointment-description"
                    placeHolder="Appointment description"
                  />
                </div>

                <div className="update-dialog-button-container">
                  <ButtonElement 
                    label="Save" 
                    variant="filled-black" 
                    type={'button'} 
                    onClick={handleSaveClick} 
                    disabled={loading} 
                  />
                </div>
              </div>
            </div>
          </form>
        </Dialog>

        {status === 'cancelled' && <p className="status-text cancelled">Cancelled</p>}
        {status === 'denied' && <p className="status-text denied">Denied</p>}
        {status === 'approved' && <p className="status-text approved">Approved</p>}
        {status === 'pending' && <p className="status-text pending">Pending</p>}

        <div className="information-container">
          <div className="appointment-date">
            <p>{formattedDate}</p>
          </div>
          <div className="appointment-time">
            <p>{time}</p>
          </div>
        </div>

        {status === 'pending' && (
          <div className="appointment-button-container">
            <div className="edit-icon" onClick={handleClickOpen}>
              <Tooltip title="Edit" arrow placement="left">
                <EditTwoToneIcon />
              </Tooltip>
            </div>
            <div className="cancel-icon" onClick={handleCancelClick}>
              <Tooltip title="Cancel" arrow placement="left">
                <CancelTwoToneIcon />
              </Tooltip>
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div className="appointment-button-container">
            <div className="cancel-icon" onClick={handleCancelClick}>
              <Tooltip title="Cancel" arrow placement="left">
                <CancelTwoToneIcon />
              </Tooltip>
            </div>
          </div>
        )}

        {(status === 'cancelled' || status === 'denied') && (
          <div className="appointment-button-container">
            <div className="edit-icon" onClick={handleDeleteClick}>
              <Tooltip title="Delete" arrow placement="left">
                <DeleteTwoToneIcon />
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Confirmation
          message={showConfirm.message}
          severity={showConfirm.severity}
          onConfirm={handleConfirm}
          isOpen={true}
        />
      )}
    </>
  )
}

export default Appointment
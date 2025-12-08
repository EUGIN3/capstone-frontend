import './LoginRegistration.css'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Components
import NormalTextField from '../forms/text-fields/NormalTextField'
import MyPassField from '../forms/text-fields/PassTextField'
import ButtonElement from '../forms/button/ButtonElement'
import AxiosInstance from '../API/AxiosInstance'
// Images
import logo from '../../assets/estrope-logo.png'
import curlyArrowLogRes from '../../assets/curly-arrow.png'
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function Register() {
    const navigate = useNavigate()
    
    // State for Terms & Conditions modal
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [registrationFormData, setRegistrationFormData] = useState(null)
    
    // State for OTP modal
    const [showOTPModal, setShowOTPModal] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [isLoadingOTP, setIsLoadingOTP] = useState(false)
    const [registrationData, setRegistrationData] = useState(null)
    const [otpSent, setOtpSent] = useState(false)
    const [isLoadingSendOTP, setIsLoadingSendOTP] = useState(false)
    
    const schema = yup.object({
        fname : yup.string().required('Enter your first name.'),
        lname : yup.string().required('Enter your last name.'),
        pnumber : yup.string().required('Enter your contact number.'),
        email : yup.string().email('Invalid email.').required('Enter your email.'),
        password : yup.string().required('Enter your password.'),
        confirmPassword : yup.string().required('Re-enter your password.')
                    .oneOf([yup.ref('password'), null], 'Password do not match.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    // Step 1: Show Terms & Conditions Modal
    const submission = (data) => {
        setRegistrationFormData(data)
        setShowTermsModal(true)
        setTermsAccepted(false)
    }

    // Step 2: Accept Terms & Conditions, then send OTP
    const handleAcceptTerms = () => {
        if (!termsAccepted) {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Please accept the Terms and Conditions to proceed.
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
            return
        }

        setShowTermsModal(false)
        setRegistrationData(registrationFormData)
        setUserEmail(registrationFormData.email)
        setShowOTPModal(true)
        setOtpSent(false)
        setOtpCode('')
        
        // Automatically send OTP
        sendOTP(registrationFormData.email)
    }

    // Step 3: Send OTP to email
    const sendOTP = async (email) => {
        setIsLoadingSendOTP(true)
        try {
            await AxiosInstance.post(`auth/send-otp/`, {
                email: email
            })
            
            toast.success(
                <div style={{ padding: '8px' }}>
                    OTP sent to your email. Please check your inbox.
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
            setOtpSent(true)
        } catch (error) {
            toast.error(
                <div style={{ padding: '8px' }}>
                    {error.response?.data?.error || 'Failed to send OTP. Please try again.'}
                </div>, 
                {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Slide,
                    closeButton: false,
                }
            );
            setShowOTPModal(false)
        } finally {
            setIsLoadingSendOTP(false)
        }
    }

    // Step 4: Verify OTP
    const verifyOTP = async (email, otp) => {
        setIsLoadingOTP(true)
        try {
            await AxiosInstance.post(`auth/verify-otp/`, {
                email: email,
                otp_code: otp
            })
            
            toast.success(
                <div style={{ padding: '8px' }}>
                    OTP verified successfully!
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
            
            // Step 5: Complete registration with verified OTP
            setTimeout(() => {
                completeRegistration(registrationData, otp)
            }, 500)
            
        } catch (error) {
            toast.error(
                <div style={{ padding: '8px' }}>
                    {error.response?.data?.error || 'Invalid OTP. Please try again.'}
                </div>, 
                {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Slide,
                    closeButton: false,
                }
            );
        } finally {
            setIsLoadingOTP(false)
        }
    }

    // Step 5: Complete registration
    const completeRegistration = (data, otp) => {
        AxiosInstance.post(`auth/register/`, {
            first_name: data.fname,
            last_name: data.lname,
            address: data.address,
            phone_number: data.pnumber,
            facebook_link: data.fblink,
            email: data.email,
            password: data.password,
            otp_code: otp
        })
        .then(() => {
            toast.success(
                <div style={{ padding: '8px' }}>
                    Registration successful. You can now log in to your account.
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

            setTimeout(() => {
                navigate(`/login`)
            }, 2500);
            
            setShowOTPModal(false)
            setOtpCode('')
            setOtpSent(false)
        })
        .catch((error) => {
            toast.error(
                <div style={{ padding: '8px' }}>
                    {error.response?.data?.otp_code?.[0] || 'Registration failed. Please try again.'}
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
        });
    }

    const handleOTPChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
        setOtpCode(value)
    }

    const handleVerifyOTP = () => {
        if (otpCode.length !== 6) {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Please enter a 6-digit OTP code.
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
            return
        }
        verifyOTP(userEmail, otpCode)
    }

    const handleResendOTP = () => {
        setOtpCode('')
        setOtpSent(false)
        sendOTP(userEmail)
    }

    const handleCloseTermsModal = () => {
        setShowTermsModal(false)
        setTermsAccepted(false)
        setRegistrationFormData(null)
    }

    return (
        <>
            <form onSubmit={handleSubmit(submission)}>
                <div className={'main-login'}>
                    <div className="black-side">
                        <img src={logo} alt="Ramil Estrope's logo" className='logo'/>
                        <p className="logo-name">Ramil Estrope</p>
                        <p className="logo-profession">Fashion Designer</p>
                    </div>

                    <div className="white-side">
                        <div className="white-container">
                            <div className="info-container">
                                <p className="welcome">Welcome!</p>
                                <p className="welcome-message">
                                    Connect with us and make your design possible for the world to be seen.
                                </p>
                            </div>

                            <div className="register-input-container">
                                <div className="resgister-name-input-con">
                                    <NormalTextField 
                                        label='First Name'
                                        name={'fname'}
                                        control={control}
                                        classes='fname'
                                        placeHolder='First Name'
                                    />
                                    <NormalTextField 
                                        label='Last Name'
                                        name={'lname'}
                                        control={control}
                                        classes='lname'
                                        placeHolder='Last Name'
                                    />
                                </div>

                                <div className="resgister-contact-input-con">
                                    <NormalTextField 
                                        label='Phone Number'
                                        name={'pnumber'}
                                        control={control}
                                        classes='pnumber'
                                        placeHolder='09********9'
                                    />
                                    <NormalTextField 
                                        label='Facebook Link'
                                        name={'fblink'}
                                        control={control}
                                        classes='fblink'
                                        placeHolder='Facebook Link'
                                    />
                                </div>

                                <NormalTextField 
                                    label='Adress'
                                    name={'address'}
                                    control={control}
                                    classes='address'
                                    placeHolder='Brgy. 1, Lucena City'
                                />

                                <NormalTextField 
                                    label='Email'
                                    name={'email'}
                                    control={control}
                                    classes='email'
                                    placeHolder='email@gmail.com'
                                />

                                <MyPassField
                                    label='Password'
                                    name={'password'}
                                    control={control}
                                    classes='password'
                                />

                                <MyPassField
                                    label='Confirm password'
                                    name={'confirmPassword'}
                                    control={control}
                                    classes='password'
                                />
                            </div>

                            <div className="logres-button-container">
                                <div className="btn-con">
                                    <ButtonElement
                                        label='SIGN UP'
                                        type={'submit'}
                                        variant='filled-black'
                                    />
                                </div>
                                <p>Already have an account? <Link to='/login' className='blue'>Please login.</Link></p>
                            </div>
                        </div>

                        <Link target="" className="arrow-resgister-login" to='/login'>
                            <p>Log in</p>
                            <img src={curlyArrowLogRes} alt="Clickable arrow to get to the appointment system."/>
                        </Link>
                    </div>
                </div>

                <ToastContainer />
            </form>

            {/* Terms & Conditions Modal */}
            {showTermsModal && (
                <div className="terms-modal-overlay" onClick={() => handleCloseTermsModal()}>
                    <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="terms-modal-header">
                            <h2>Terms and Conditions</h2>
                            <button 
                                className="terms-modal-close"
                                onClick={() => handleCloseTermsModal()}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="terms-modal-body">
                            <div className="terms-scroll-container">
                                <h3>1. Acceptance of Terms</h3>
                                <p>By accessing or using the platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.</p>

                                <h3>2. User Accounts</h3>
                                <p>Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials. The platform reserves the right to suspend or delete accounts that violate system rules or engage in misuse.</p>

                                <h3>3. Access and Usage</h3>
                                <p><strong>Users may:</strong></p>
                                <ul>
                                    <li>Book appointments based on designer availability</li>
                                    <li>View, modify, or cancel existing appointments</li>
                                    <li>Generate AI-assisted design previews</li>
                                    <li>View messages and communicate with the designer</li>
                                    <li>Track the progress of their design projects</li>
                                </ul>

                                <h3>4. AI-Generated Designs</h3>
                                <p>AI-generated images are intended only as concept previews. They do not represent final design accuracy, fabric quality, or fit. The designer has the right to refine or reject AI concepts deemed unsuitable.</p>

                                <h3>5. Appointment Policies</h3>
                                <p>Appointments are subject to designer availability. Cancellations must be made before the scheduled date. Failure to attend scheduled meetings may affect future booking privileges.</p>

                                <h3>6. Intellectual Property</h3>
                                <p>All design outputs, uploaded images, and project files remain the intellectual property of Ramil Estrope. Users may not copy, sell, or redistribute designs without permission.</p>

                                <h3>7. System Availability</h3>
                                <p>The platform aims to remain accessible, but scheduled maintenance may occur. Technical issues may cause temporary downtime. The platform is not liable for delays, losses, or missed appointments due to system interruptions.</p>

                                <h3>8. Prohibited Activities</h3>
                                <p>Users must not:</p>
                                <ul>
                                    <li>Attempt to hack, alter, or disrupt system operations</li>
                                    <li>Upload harmful, offensive, or copyrighted materials without permission</li>
                                    <li>Misuse the messaging system for harassment or spam</li>
                                </ul>

                                <h3>9. Modification of Terms</h3>
                                <p>The system administrator reserves the right to update these Terms. Continued use of the platform after changes implies acceptance.</p>

                                <h3>10. Contact Information</h3>
                                <p>For inquiries or concerns, users may contact the administrative email provided within the platform.</p>
                            </div>

                            <div className="terms-checkbox-container">
                                <input 
                                    type="checkbox" 
                                    id="terms-agree" 
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                <label htmlFor="terms-agree">
                                    I agree to the Terms and Conditions
                                </label>
                            </div>
                        </div>

                        <div className="terms-modal-footer">
                            <button
                                type="button"
                                className="terms-btn-decline"
                                onClick={() => handleCloseTermsModal()}
                            >
                                Decline
                            </button>
                            <button
                                type="button"
                                className="terms-btn-accept"
                                onClick={handleAcceptTerms}
                                disabled={!termsAccepted}
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="otp-modal-overlay" onClick={() => !isLoadingOTP && setShowOTPModal(false)}>
                    <div className="otp-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="otp-modal-header">
                            <h2>Verify Email</h2>
                            <button 
                                className="otp-modal-close"
                                onClick={() => !isLoadingOTP && setShowOTPModal(false)}
                                disabled={isLoadingOTP}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="otp-modal-body">
                            <p className="otp-description">
                                We've sent a verification code to <strong>{userEmail}</strong>
                            </p>

                            <div className="otp-input-container">
                                <label htmlFor="otp-input">Enter Verification Code</label>
                                <input
                                    id="otp-input"
                                    type="text"
                                    maxLength="6"
                                    value={otpCode}
                                    onChange={handleOTPChange}
                                    placeholder="000000"
                                    className="otp-input"
                                    disabled={isLoadingOTP}
                                />
                                <p className="otp-hint">6-digit code</p>
                            </div>

                            {otpSent && (
                                <p className="otp-timer">
                                    Code expires in 10 minutes. Didn't receive it? 
                                    <button 
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoadingSendOTP}
                                        className="resend-btn"
                                    >
                                        {isLoadingSendOTP ? 'Sending...' : 'Resend'}
                                    </button>
                                </p>
                            )}
                        </div>

                        <div className="otp-modal-footer">
                            <button
                                type="button"
                                className="otp-btn-cancel"
                                onClick={() => !isLoadingOTP && setShowOTPModal(false)}
                                disabled={isLoadingOTP}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="otp-btn-verify"
                                onClick={handleVerifyOTP}
                                disabled={isLoadingOTP || otpCode.length !== 6}
                            >
                                {isLoadingOTP ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Register


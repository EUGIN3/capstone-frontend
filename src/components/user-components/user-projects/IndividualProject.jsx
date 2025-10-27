import React, { useState } from 'react';
import './IndividualProject.css';
import noImage from '../../../assets/no-image.jpg';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';

function IndividualProject({ project }) {
  const [openIndex, setOpenIndex] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="IndividualProject">
      {project && project.length > 0 ? (
        project.map((item, index) => (
          <div
            className="indi-container-main"
            key={index}
          >
            <div className="indi-colapse-container">
              <div className="indi-left-section">
                <div className="indi-image-container">
                  <img src={noImage} alt={item.attire_type} />
                </div>

                <div className="indi-details-sections">
                  <div className="indi-last-update">
                    <p className="indi-time-date">
                      {new Date(item.updated_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="attire-type-container">
                    <p className="indi-type">{item.attire_type}</p>
                  </div>
                </div>
              </div>

              <div className="view-details-container">
                <p className="indi-view" onClick={(e) => {
                  e.stopPropagation(); 
                  toggleOpen(index);
                }}>
                  View
                  {openIndex === index ? (
                    <KeyboardArrowUpTwoToneIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <KeyboardArrowDownTwoToneIcon sx={{ fontSize: 20 }} />
                  )}
                </p>
              </div>
            </div>

            {openIndex === index && (
              <div className="indi-details">
                <div className="indi-hr-container">
                  <hr />
                </div>

                <div className="indi-informtaion">
                  <p className='label'>Information:</p>
                  <div className="indi-information-top">
                    <div className="indi-sttire-type">
                      <span>Attire:</span>
                      <p>{item.process_status}</p>
                    </div>

                    <div className="indi-status">
                      <span>Status:</span>
                      <p>{item.process_status}</p>
                    </div>

                    <div className="indi-target">
                      <span>Target Date:</span>
                      <p>{item.targeted_date}</p>
                    </div>

                    <div className="indi-started">
                      <span>Started:</span>
                      <p>{item.created_at}</p>
                    </div>
                  </div>

                  <div className="indi-information-bottom">
                    <div className="indi-total">
                      <span>Payment Status:</span>
                      <p>{item.payment_status}</p>
                    </div>

                    <div className="indi-price">
                      <span>Price:</span>
                      <p>{item.total_amount}</p>
                    </div>

                    <div className="indi-paid">
                      <span>Paid:</span>
                      <p>{item.amount_paid}</p>
                    </div>

                    <div className="indi-balance">
                      <span>Balance:</span>
                      <p>{item.balance}</p>
                    </div>
                  </div>
                </div>

                <div className="indi-hr-container">
                  <hr />
                </div>

                <div className="indi-details-container">
                  <p className='label'>Updates:
                      { showUpdates ? 
                        <span 
                          className='indi-show-update'
                          onClick={() => setShowUpdates(!showUpdates)}>
                          Show<KeyboardArrowDownTwoToneIcon sx={{ fontSize: 20 }}/>
                        </span>
                        : 
                        <span 
                          className='indi-show-update'
                          onClick={() => setShowUpdates(!showUpdates)}>
                          Hide<KeyboardArrowUpTwoToneIcon sx={{ fontSize: 20 }}/>
                        </span>
                      }
                  </p>

                  { showUpdates ?
                    <>
                      <div className="indi-update-container">
                        <div className="indi-update-top">
                          <p className='inid-date-time'>Oct 26, 2025, 11:39 AM</p>

                          <div className="indi-paid">
                            <p className="indi-paid-label">Amount Paid:</p>
                            <p className="indi-paid-amount">₱500.00</p>
                          </div>

                          <div className="indi-status">
                            <p className="indi-status-label">Status:</p>
                            <p className="indi-status-note">designing</p>
                          </div>
                        </div>

                        <div className="indi-note">
                          <p className="indi-update-note">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit id commodi nulla. Iste accusantium omnis beatae itaque modi suscipit odio neque corrupti, illum officiis cupiditate, fuga totam, quas eveniet cum.</p>
                        </div>

                      </div> 
                    </> 
                    : 
                    null
                  }
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="indi-noproject">No projects available.</p>
      )}
    </div>
  );
}

export default IndividualProject;

import React from 'react';
import './ProjectUpdates.css';
import noImage from '../../../../assets/no-image.jpg';

function ProjectUpdates({ project }) {
  // Format date for updates
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="ProjectUpdates">
      {project?.updates && project.updates.length > 0 ? (
        // ✅ Reverse the array to show latest updates first
        [...project.updates].reverse().map((update, index) => (
          <div className="update-container" key={index}>
            {/* 🖼 Image */}
            <div className="update-image">
              <img
                src={ update.image === null ? noImage :
                  `http://127.0.0.1:8000${update.image}`
                }
                alt={`Update ${index + 1}`}
                className="update-img"
              />
            </div>

            {/* 📝 Details */}
            <div className="update-details-container">
              <div className="update-date">
                <p>{formatDateTime(update.timestamp)}</p>
              </div>

              <div className="update-note">
                <p className="update-text">{update.message}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-updates">No project updates yet.</p>
      )}
    </div>
  );
}

export default ProjectUpdates;
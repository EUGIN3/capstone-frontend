import React, { useState, useEffect } from 'react';
import './ManageOngoingUpdates.css';

import AppHeader from '../../../user-components/user-header/userHeader';
import ProjectDetails from './ProjectDetails';
import ProjectUpdates from './ProjectUpdates';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../../API/AxiosInstance';
import curlyArrowLogRes from '../../../../assets/curly-arrow.png';

function ManageOngoingUpdates() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get(`design/designs/${projectId}/`);
        setProject(response.data);
      } catch (err) {
        console.error('❌ Failed to fetch project details:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="ManageOngoingUpdates">
      <div className="updates-header" onClick={() => navigate(-1)}>
        <div className="arrow-container">
          <img
            src={curlyArrowLogRes}
            alt="Back to appointments"
            className="arrow-back"
          />
        </div>

        <AppHeader headerTitle={`Updates`} />
      </div>

      <div className="update-body">
        <ProjectDetails project={project} />
        <div className="update-text">
          <p>Updates:</p>
        </div>
        <ProjectUpdates projectId={projectId} />
      </div>
    </div>
  );
}

export default ManageOngoingUpdates;

import React, { useState, useEffect } from 'react';
import './ManageOngoingUpdates.css';

import AppHeader from '../../../user-components/user-header/userHeader';
import ProjectDetails from './ProjectDetails';
import ProjectUpdates from './ProjectUpdates';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../../API/AxiosInstance';
import curlyArrowLogRes from '../../../../assets/curly-arrow.png';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Dialog from '@mui/material/Dialog';

import { Fab, Tooltip } from '@mui/material';
import AddUpdateModal from './AddUpdateModal';
import ButtonElement from '../../../forms/button/ButtonElement'

import ChangeFitting from './ChangeFitting';

function ManageOngoingUpdates() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false)
  const [changeFittingOpen, setChangeFittingOpen] = useState(false)

  const handleOpenFitting = () => {
    setChangeFittingOpen(true)
  }
  
  const handleCloseFitting = () => {
    setChangeFittingOpen(false)
    // ✅ Refresh project data after modal closes
    fetchProject()
  }

  const handleOpenAdd = () => {
    setOpen(true)
  }
  
  const handleCloseAdd = () => {
    setOpen(false)
    // ✅ Refresh project data after modal closes
    fetchProject()
  }

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

  useEffect(() => {
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
      <div className="updates-header">
        <div className="updates-header-left" onClick={() => navigate(-1)}>
          <div className="arrow-container">
            <img
              src={curlyArrowLogRes}
              alt="Back to appointments"
              className="arrow-back"
            />
          </div>

          <AppHeader headerTitle={`Updates`} />
        </div>

        <div className="add-update-btn">
          <ButtonElement
            label='Fitting'
            variant='outlined-black'
            onClick={handleOpenFitting}
          />

          <ButtonElement
            label='Add update'
            variant='filled-black'
            onClick={handleOpenAdd}
          />
        </div>
      </div>

      <div className="update-body">
        <ProjectDetails project={project} />
        <div className="update-text">
          <p>Updates:</p>
        </div>
        <ProjectUpdates project={project} />

      </div>
        <Dialog
          open={open}
          onClose={handleCloseAdd}
          fullWidth
          maxWidth={false}
          PaperProps={{
            style: {
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh',
              padding: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}>
          <AddUpdateModal 
            onClose={handleCloseAdd}
            projectId={projectId}
            onSuccess={fetchProject}
          />
        </Dialog>

        <Dialog
          open={changeFittingOpen}
          onClose={handleCloseFitting}
          fullWidth
          maxWidth={false}
          PaperProps={{
            style: {
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh',
              padding: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}>
          <ChangeFitting 
            onClose={handleCloseFitting}
            project={project}
            onSuccess={fetchProject}
          />
        </Dialog>
    </div>
  );
}

export default ManageOngoingUpdates;
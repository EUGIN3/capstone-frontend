import { useCallback } from "react";
import AxiosInstance from "../API/AxiosInstance";

const useNotificationCreator = () => {
  const defaultNotifications = {
    // Appointment for user
    appointment_approved: {
      header: "Appointment Approved",
      message: "Your appointment has been approved. See you soon!",
      link: "/user/all-appointments"
    },
    appointment_denied: {
      header: "Appointment Denied",
      message: "Your appointment has been denied. Please contact support if needed.",
      link: "/user/all-appointments"
    },
    appointment_cancelled: {
      header: "Appointment Cancelled",
      message: "Your appointment has been cancelled. Please contact support if needed.",
      link: "/user/all-appointments"
    },
    appointment_pending: {
      header: "Appointment Pending",
      message: "Your appointment has been put back to pending. Please contact support if needed.",
      link: "/user/all-appointments"
    },

    // Appointment for admin
    appointment_created: {
      header: "Appointment Created",
      message: "New appointment has been created.",
      link: "/admin/manage-appointments"
    },
    appointment_deleted: {
      header: "Appointment Deleted",
      message: "An appointment has been deleted.",
      link: "/admin/manage-appointments"
    },
    appointment_cancelled: {
      header: "Appointment Cancelled",
      message: "An appointment has been cancelled.",
      link: "/admin/manage-appointments"
    },

    // Project
    project_created: {
      header: "New Project",
      message: "Your project has been posted. See updates!",
      link: "/user/projects"
    },
    update_posted: {
      header: "New Update",
      message: "A new update has been posted. Please contact for any concern.",
      link: "/user/projects"
    },

    // Message
    new_message: {
      header: "New Message",
      message: "You’ve received a new message.",
      link: "/user/message"
    },

    // Schedule
    schedule_changes: {
      header: "Designer's Schedule",
      message: "There has been changes to the designer's schedule.",
      link: "-"
    }
  };

    // ✅ Core notification creator (receiver optional)
  const createNotification = useCallback(
    async ({ receiver = null, header, message, link = null, is_system = false }) => {
      try {
        const response = await AxiosInstance.post("/notifications/notifications/", {
          receiver, // backend handles null as "send to admin"
          header,
          message,
          link,
          is_system,
        });
        return response.data;
      } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
      }
    },
    []
  );

  // ✅ Helper for sending notifications from default templates
  const sendDefaultNotification = useCallback(
    async (type, receiver = null, extra = {}) => {
      const template = defaultNotifications[type];
      if (!template) {
        console.error(`❌ No default notification found for type: ${type}`);
        return;
      }

      return await createNotification({
        receiver, // optional — backend will handle admin routing if null
        header: template.header,
        message: template.message,
        link: template.link,
        ...extra,
      });
    },
    [createNotification]
  );

  return { createNotification, sendDefaultNotification, defaultNotifications };
};

export default useNotificationCreator;

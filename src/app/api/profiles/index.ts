import axiosServices from '../../../utils/axios'; // Make sure this path is correct

// Function to fetch profiles from the API
export const fetchProfiles = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.get('/featured-profile', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
    });
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Function to fetch reported profiles from the API
export const getReportedProfiles = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.get('/profile-escalation/pending', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
    });
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};

// Function to fetch reported profiles from the API
export const getReportedContent = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.get('/content-escalation', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
    });
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};
// Function to fetch reported profiles from the API
export const getAllCollages = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.get('/education-institution-info', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
    });
    console.log('list', response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};
export const deleteProfileById = async (id: string) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.delete(
      `/education-institution-info/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      }
    );
    return response.data; // Return success response
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
// Function to fetch reported profiles from the API
export const getAllSpecializations = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await axiosServices.get('/specialization', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
    });
    console.log('list', response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};

import axiosServices from '../../../utils/axios'; // Make sure this path is correct

// Function to fetch profiles from the API
export const fetchProfiles = async () => {
  try {
    const response = await axiosServices.get('/featured-profile');
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
// Function to fetch profiles from the API
export const getReportedProfiles = async () => {
  try {
    const response = await axiosServices.get('/profile-escalation/pending');
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};

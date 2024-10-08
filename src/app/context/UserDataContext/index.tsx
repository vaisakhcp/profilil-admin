'use client';
import React, { createContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import {
  PostType,
  profiledataType,
} from '@/app/(DashboardLayout)/types/apps/userProfile';

// Define context type
export type UserDataContextType = {
  posts: PostType[];
  users: any[];
  gallery: any[];
  loading: boolean;
  profileData: profiledataType;
  followers: any[];
  search: string;
  featuredProfiles: any[]; // Featured profiles state
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  addGalleryItem: (item: any) => void;
  addReply: (postId: number, commentId: number, reply: string) => void;
  likePost: (postId: number) => void;
  addComment: (postId: number, comment: string) => void;
  likeReply: (postId: number, commentId: number) => void;
  toggleFollow: (id: number) => void;
  fetchFeaturedProfiles: () => Promise<void>; // Function to fetch featured profiles
};

// Create context
export const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// Default config values
const config = {
  posts: [],
  users: [],
  gallery: [],
  followers: [],
  search: '',
  loading: true,
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<PostType[]>(config.posts);
  const [users, setUsers] = useState<any[]>(config.users);
  const [gallery, setGallery] = useState<any[]>(config.gallery);
  const [followers, setFollowers] = useState<any[]>(config.followers);
  const [search, setSearch] = useState<string>(config.search);
  const [loading, setLoading] = useState<boolean>(config.loading);
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]); // Featured profiles state
  const [profileData, setProfileData] = useState<profiledataType>({
    name: 'Mathew Anderson',
    role: 'Designer',
    avatar: '/images/profile/user-1.jpg',
    coverImage: '/images/backgrounds/profilebg.jpg',
    postsCount: 938,
    followersCount: 3586,
    followingCount: 2659,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get('/api/data/postData');
        const usersResponse = await axios.get('/api/data/users');
        const galleryResponse = await axios.get('/api/data/gallery');
        setPosts(postsResponse.data);
        setUsers(usersResponse.data);
        setGallery(galleryResponse.data);
        setFollowers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to fetch featured profiles
  const fetchFeaturedProfiles = async () => {
    try {
      const response = await axios.get('/api/app/featured-profile'); // API call for featured profiles
      if (response.status === 200) {
        setFeaturedProfiles(response.data); // Store featured profiles in state
      } else {
        console.error(
          'Failed to fetch featured profiles:',
          response.data.message
        );
      }
    } catch (error) {
      console.error('Error fetching featured profiles:', error);
    }
  };

  // Function to add a new item to the gallery
  const addGalleryItem = (item: any) => {
    setGallery((prevGallery) => [...prevGallery, item]);
  };

  // Other functions: likePost, addComment, etc...

  return (
    <UserDataContext.Provider
      value={{
        posts,
        users,
        gallery,
        loading,
        profileData,
        addGalleryItem,
        addReply,
        likePost,
        addComment,
        likeReply,
        followers,
        toggleFollow,
        setSearch,
        search,
        featuredProfiles, // Provide featured profiles
        fetchFeaturedProfiles, // Provide function to fetch featured profiles
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

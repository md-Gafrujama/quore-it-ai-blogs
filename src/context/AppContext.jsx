'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseURL } from '@/config/api';
// const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");
    const [mounted, setMounted] = useState(false);

    // Set token from localStorage on mount
    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem('token') : null;
        if (storedToken) {
            setToken(storedToken);
        }
        setMounted(true);
    }, []);

    // Set axios default header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Fetch blogs only on client after mount
    useEffect(() => {
        if (mounted) {
            fetchBlogs();
        }
        // eslint-disable-next-line
    }, [mounted]);

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/blog/all`);
            if (data.success) {
                // Filter to ensure only published blogs are shown
                const publishedBlogs = data.blogs.filter(blog => blog.isPublished !== false);
                setBlogs(publishedBlogs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        axios, token, setToken, blogs, setBlogs, input, setInput
    };

    // Prevent rendering until mounted to avoid hydration mismatch
    if (!mounted) return null;

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
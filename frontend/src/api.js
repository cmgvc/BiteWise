import React from 'react';
import axios from 'axios';

export const addItemToData = async (items, user) => {
    try {
        console.log(items);
        const response = await axios.post('http://127.0.0.1:5000/add_items', {
            image_items: items,
            user: user,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data);
    } catch (error) {
        console.error("Error adding items:", error.response?.data || error.message);
    }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};


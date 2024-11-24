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

import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import axios from 'axios';
import { addItemToData } from '../api.js';
import '../styles/Home.css';

const ImageAnalyzer = ({setIsModalOpen}) => {
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [chosenItem, setChosenItem] = useState(null);
    const [mode, setMode] = useState('');
    const [foodName, setFoodName] = useState('');
    const [foodCategory, setFoodCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const webcamContainerRef = useRef(null);
    const URL = "model/";
    const user = localStorage.getItem('user');

    let webcam, labelContainer, maxPredictions;

    useEffect(() => {
        const loadModel = async () => {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            try {
                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        loadModel();
    }, []);

    const initWebcam = async () => {
        if (webcam) return;

        try {
            console.log("Setting up webcam...");
            webcam = new tmImage.Webcam(400, 200, true);
            await webcam.setup();
            console.log("Webcam setup completed");

            if (webcam && webcam.canvas) {
                await webcam.play();
                webcamContainerRef.current.appendChild(webcam.canvas);
                maxPredictions = model.getTotalClasses();
                labelContainer = document.getElementById("label-container");
                for (let i = 0; i < maxPredictions; i++) {
                    labelContainer.appendChild(document.createElement("div"));
                }
                startPredictionLoop();
            } else {
                console.error("Webcam canvas is not available or webcam setup failed");
            }
        } catch (error) {
            console.error("Error initializing webcam:", error);
        }
    };

    const startPredictionLoop = async () => {
        const loop = async () => {
            if (!webcam) return;
            webcam.update();
            await predict();
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    };

    const predict = async () => {
        if (!model) return;

        const prediction = await model.predict(webcam.canvas);
        const highestPrediction = prediction.reduce((max, current) => {
            return current.probability > max.probability ? current : max;
        });

        setPrediction({
            className: highestPrediction.className,
            probability: highestPrediction.probability.toFixed(2),
        });
    };

    const startWebcam = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setIsWebcamActive(true);
                initWebcam();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        } else {
            console.error("Webcam not supported in this browser.");
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                predictImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const predictImage = async (imageData) => {
        if (!model) return;

        const img = new Image();
        img.src = imageData;
        img.onload = async () => {
            const prediction = await model.predict(img);
            const highestPrediction = prediction.reduce((max, current) => {
                return current.probability > max.probability ? current : max;
            });

            setPrediction({
                className: highestPrediction.className,
                probability: highestPrediction.probability.toFixed(2),
            });
        };
    };

    const handleChooseItem = () => {
        if (prediction) {
            setChosenItem({
                className: prediction.className,
                probability: prediction.probability,
            });
        }
    };

    const handleSendToApi = () => {
        if (chosenItem) {
            if (!user) {
                console.error("No user logged in.");
                setIsModalOpen(true);   
                return;
            }
            addItemToData([chosenItem.className],  user);
        } else {
            console.error("No item chosen to send.");
        }
    };

    const handleBackButton = () => {
        setMode('');
        setChosenItem(null);
        window.location.reload();
    };


    const handleFoodNameChange = (e) => setFoodName(e.target.value);
    const handleFoodCategoryChange = (e) => setFoodCategory(e.target.value);
    const handleExpiryDateChange = (e) => setExpiryDate(e.target.value);

    const handleManualSubmit = () => {
        if (!foodName || !foodCategory || !expiryDate) {
            alert("Please fill out all fields.");
            return;
        }
        setChosenItem(foodName);
        handleSendToApi();
        console.log({
            foodName,
            foodCategory,
            expiryDate
        });
    };

    return (
        <div className="camera-page">
            {!mode && (
                <div className="buttons4">
                    <button onClick={() => {setMode('webcam'); startWebcam()}}>Use Webcam</button>
                    <button onClick={() => setMode('upload')}>Upload Pic</button>
                    <button onClick={() => setMode('manual')}>Manual Input</button>
                </div>
            )}
            
            {mode === 'webcam' && (
                <div>
                    <div ref={webcamContainerRef}></div>
                    <div className='label-container' id="label-container">
                        {prediction && (
                            <div>
                                <p>{prediction.className}</p>
                                <button onClick={handleChooseItem}>Choose This Item</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mode === 'upload' && (
                <div>
                    <label htmlFor="file-upload" className="custom-file-button">
                        <i className="fas fa-upload"></i> Upload Your Files
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <div style={{marginTop: '3vh'}}>
                        {imageSrc && <img src={imageSrc} alt="uploaded" style={{ width: '200px', marginTop: '10px' }} />}
                    </div>
                    {prediction && (
                        <div>
                            <p style={{color: 'white', fontWeight: 'bold', scale: '1.5', marginTop: '3vh'}}>{prediction.className}</p>
                            <div style={{marginTop: '6vh'}}>
                                <button onClick={handleChooseItem}>Choose This Item</button>
                            </div>
                        </div>
                    )}
                    
                </div>
            )}

            {mode === 'manual' && (
                <div className="manual-input">
                    <h2 style={{color: 'white'}}>Enter Food Details</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleManualSubmit(); }}>
                        <div>
                            <label>Food Name:  </label>
                            <input
                                type="text"
                                value={foodName}
                                onChange={handleFoodNameChange}
                                placeholder="Enter food name"
                            />
                        </div>
                        <div>
                            <div>
                                <input
                                    type="radio"
                                    id="fruit"
                                    name="category"
                                    value="Fruit"
                                    checked={foodCategory === 'Fruit'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="fruit">Fruit</label>
                                <input
                                    type="radio"
                                    id="vegetable"
                                    name="category"
                                    value="Vegetable"
                                    checked={foodCategory === 'Vegetable'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="vegetable">Vegetable</label>
                                <input
                                    type="radio"
                                    id="seafood"
                                    name="category"
                                    value="Seafood"
                                    checked={foodCategory === 'Seafood'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="seafood">Seafood</label>
                                <input
                                    type="radio"
                                    id="meat"
                                    name="category"
                                    value="Meat"
                                    checked={foodCategory === 'Meat'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="meat">Meat</label>
                                <input
                                    type="radio"
                                    id="grain"
                                    name="category"
                                    value="Grain"
                                    checked={foodCategory === 'Grain'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="grain">Grain</label>
                                <input
                                    type="radio"
                                    id="dairy"
                                    name="category"
                                    value="Dairy"
                                    checked={foodCategory === 'Dairy'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="dairy">Dairy</label>
                                <input
                                    type="radio"
                                    id="processed-food"
                                    name="category"
                                    value="Processed Food"
                                    checked={foodCategory === 'Processed Food'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="processed-food">Processed Food</label>
                                <input
                                    type="radio"
                                    id="other"
                                    name="category"
                                    value="Other"
                                    checked={foodCategory === 'Other'}
                                    onChange={handleFoodCategoryChange}
                                />
                                <label htmlFor="other">Other</label>
                            </div>
                        </div>
                        <div>
                            <label>Expiry Date: </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                            />
                        </div>

                    </form>
                </div>
            )}
            
            {chosenItem && (
                <div>
                    <div style={{marginBottom: '4vh', marginTop: '6vh'}}>
                        <button onClick={handleSendToApi}>Add {chosenItem.className} to fridge?</button>
                    </div>
                </div>
            )}
            {mode !== '' && (
                <div style={{marginTop: '6vh'}}>
                    <button onClick={handleBackButton}>Back</button>
                </div>
            )}
            
        </div>
    );
};

export default ImageAnalyzer;

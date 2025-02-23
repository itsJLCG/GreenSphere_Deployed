import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import './Feedback.css'

const Feedback = () => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState(5); // Default to show 5-star feedbacks
  const [showDropdown, setShowDropdown] = useState(false); // For mobile-friendly dropdown

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return "#4caf50"; // Green for excellent
      case 4: return "#2196f3"; // Blue for good
      case 3: return "#ffeb3b"; // Yellow for average
      case 2: return "#ff9800"; // Orange for below average
      case 1: return "#f44336"; // Red for poor
      default: return "#8884d8"; // Default color
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/feedback", {
        withCredentials: true,
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Failed to fetch feedbacks.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/feedback",
        { rating, comment },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setComment("");
        setRating(4);
        fetchFeedbacks();
      } else {
        setError("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while submitting feedback.");
    }
  };

  const getRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((feedback) => {
      counts[feedback.rating]++;
    });
    return Object.entries(counts).map(([key, value]) => ({
      rating: key,
      count: value,
    }));
  };

  const ratingCounts = getRatingCounts();

  const filteredFeedbacks = feedbacks
    .filter((feedback) => feedback.rating === selectedRating)
    .sort((a, b) => new Date(b.date) - new Date(a.date));



  return (
    <div className="feedback-page">
      {/* Feedback Form */}
      <div className="feedback-container">
        <h1>How would you rate us:</h1>
        <div className="rating-section">
          <Rating
            name="rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
            sx={{ fontSize: 100 }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="comment">Give us your Feedback:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            required
          ></textarea>
          <button type="submit">Submit Feedback</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Feedback Display Section */}
      <div className="feedback-display">
        <h2>Our Trusted Client Feedback</h2>
        <div className="rating-selector">
          <button onClick={() => setShowDropdown(!showDropdown)}>
            {selectedRating} Star{selectedRating !== 1 ? "s" : ""} ▼
          </button>
          {showDropdown && (
            <div className="rating-dropdown">
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  key={star}
                  className="rating-option"
                  onClick={() => {
                    setSelectedRating(star);
                    setShowDropdown(false);
                  }}
                >
                  {star} Star{star !== 1 ? "s" : ""}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="feedback-list-container">
          {filteredFeedbacks.length === 0 ? (
            <p>No feedback yet for {selectedRating} star{selectedRating !== 1 ? "s" : ""}.</p>
          ) : (
            <div className="feedback-list">
              {filteredFeedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <p className="feedback-comment">"{feedback.comment}"</p>
                  <Rating value={feedback.rating} readOnly size="small" />
                  <div className="feedback-profile">
                    <div className="profile-avatar"></div>
                    <div>
                      <p className="profile-name">{feedback.name || "Anonymous"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Rating Analysis */}
      <div className="feedback-analysis" style={{ padding: "20px", borderRadius: "10px" }}>
        <h2>Feedback Rating Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" tick={{ fill: "#333", fontSize: 14 }} />
            <YAxis tick={{ fill: "#333", fontSize: 14 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Total Reviews" fill="#8884d8">
              {ratingCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRatingColor(entry.rating)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Feedback;

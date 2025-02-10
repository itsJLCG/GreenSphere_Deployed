import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "@mui/material";
import "../styles.css";

const Feedback = () => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

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
        {feedbacks.length === 0 ? (
          <p>No feedback yet. Be the first to leave one!</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((feedback, index) => (
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
  );
};

export default Feedback;

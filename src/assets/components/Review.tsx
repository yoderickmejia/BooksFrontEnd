import React from "react";

interface ReviewCardProps {
  
  rating: number;
  comment: string;
}
const ReviewCard: React.FC<{ review: ReviewCardProps }> = ({ review }) => {

  const username = localStorage.getItem('name') ;
  return (
    <div className="max-w-md w-full mx-auto p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{username}</h3>
        <span className="text-yellow-500 font-bold text-sm">
          {review.rating} / 5 ⭐
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;

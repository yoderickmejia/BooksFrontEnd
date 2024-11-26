import React, { useState, useEffect } from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import axios from "axios";
import ReviewCard from "./Review";


interface Book {
  _id: string;
  coverImage: string;
  title: string;
  author: string;
  genre: string[];
  year: number;
  rating: number;
  comment: string;
}

interface BookDetailsProps {
  book: Book;
}

const BookView: React.FC<BookDetailsProps> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Book[]>([]);
  const [formData, setFormData] = useState<{
    bookId: string;
    userId: string;
    rating: string;
    comment: string;
  }>({
    bookId: book._id,
    userId: localStorage.getItem("userId") || "",
    rating: "",
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/reviews/new`, formData);
      setFormData({
        bookId: book._id,
        userId: localStorage.getItem("userId") || "",
        rating: "",
        comment: "",
      });
      setIsOpen(false);

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
    window.location.reload();
  };

  const fetchBooks = async () => {
    const userId = localStorage.getItem("userId") ;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/reviews/all/${userId}?`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error al obtener los libros:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const foto = `${import.meta.env.VITE_API_URL}/public/Images/${book.coverImage}`;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="w-full md:w-1/3">
          <img
            src={foto}
            alt={`${book.title} Cover`}
            className="w-full object-cover rounded-md shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg">by {book.author}</p>
          </div>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Genre:</span>{" "}
              {book.genre.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Year:</span> {book.year}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              <span className="font-bold">{book.rating}/5</span>
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-6 flex items-center justify-center space-x-2 px-5 py-3 rounded-md shadow-md text-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <RateReviewIcon />
            <span>Add Review</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 dark:bg-gray-800 dark:text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add a Review</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <div>
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 py-5">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookView;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useParams } from "react-router-dom";

const genresList = ['Fiction', 'Non-Fiction', 'Fantasy', 'Biography', 'Science', 'Classic', 'Mystery'];

const EditBook: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    year: string;
    genre: string[];
    coverImage: string;
    rating: string;
    userId: string;
  }>({
    title: '',
    author: '',
    year: '',
    genre: [],
    coverImage: '',
    rating: '',
    userId: localStorage.getItem('userId') || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/books/by-id/${bookId}`);
        const book = response.data;
        setFormData({
          title: book.title,
          author: book.author,
          year: book.year,
          genre: book.genre,
          coverImage: book.coverImage,
          rating: book.rating,
          userId: book.userId,
        });
      } catch (error) {
        console.error('Error al obtener el libro:', error);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genre = e.target.value;
    if (e.target.checked) {
      setFormData((prevData) => ({
        ...prevData,
        genre: [...prevData.genre, genre],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        genre: prevData.genre.filter((g) => g !== genre),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, coverImage: file.name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let coverImageUrl = formData.coverImage;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await axios.post(`${import.meta.env.VITE_API_URL}api/v1/Images/upload`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        coverImageUrl = uploadResponse.data.imageUrl;
      }

      const bookData = {
        ...formData,
        coverImage: coverImageUrl,
      };

      await axios.put(`${import.meta.env.VITE_API_URL}api/v1/books/update/${bookId}`, bookData);
      console.log('Libro actualizado:', bookData);
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className="flex justify-between w-full p-4">
        <button onClick={toggleTheme} className="text-2xl p-2 rounded-full focus:outline-none">
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
        <Link to="/home">
          <button className="flex items-center space-x-2 text-sm font-medium hover:text-indigo-500">
            <HomeIcon className="text-lg" />
            <span>Home</span>
          </button>
        </Link>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="max-w-4xl w-full p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Edit Book</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-gray-800 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-semibold">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className="w-full p-4 text-gray-800 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-semibold">Year</label>
              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                className="w-full text-gray-800 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="genres" className="block text-sm font-semibold">Genres</label>
              <div className="grid grid-cols-2 gap-4">
                {genresList.map((genre) => (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      id={genre}
                      name="genres"
                      value={genre}
                      onChange={handleGenreChange}
                      checked={formData.genre.includes(genre)}
                      className="h-4 w-4 text-indigo-600 text-gray-800 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={genre} className="ml-2 block text-sm">{genre}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-semibold">Rating</label>
              <input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 text-gray-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Upload Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full p-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBook;

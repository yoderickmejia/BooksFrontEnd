import React, { useState } from 'react';
import axios from 'axios';
const genresList = ['Fiction', 'Non-Fiction', 'Fantasy', 'Biography', 'Science', 'Classic', 'Mystery'];



const AddBook: React.FC = () => {
  const userId = localStorage.getItem('userId');

  // Manejo de cambios en los checkboxes
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
    userId: userId || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      const bookData = {
        ...formData,
        coverImage: coverImageUrl,
      };

      const requests = [];

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadRequest = axios.post(`${import.meta.env.VITE_API_URL}/api/v1/Images/upload`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        requests.push(uploadRequest);
      }

      const bookRequest = axios.post(`${import.meta.env.VITE_API_URL}/api/v1/books/new`, bookData);
      console.log('Book data:', bookData);
      requests.push(bookRequest);
      console.log('Requests:', bookData);
      const [uploadResponse, bookResponse] = await Promise.all(requests);

      if (uploadResponse) {
        console.log('Imagen subida:', uploadResponse.data);
        coverImageUrl = uploadResponse.data.imageUrl;
      }

      console.log('Libro guardado:', bookResponse.data);
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Add a New Book</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await handleSubmit(e);

              setFormData({
                title: '',
                author: '',
                year: '',
                genre: [],
                coverImage: '',
                rating: '',
                userId: userId || '',
              });
              setImageFile(null);
            } catch (error) {
              console.error('Error al enviar el formulario:', error);
            }
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-semibold text-gray-700">Author</label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-semibold text-gray-700">Year</label>
            <input
              id="year"
              name="year"
              type="text"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="genres" className="block text-sm font-semibold text-gray-700">Genres</label>
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
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={genre} className="ml-2 block text-sm text-gray-700">
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>          

          <div>
            <label htmlFor="rating" className="block text-sm font-semibold text-gray-700">Rating</label>
            <input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
  );
};

export default AddBook;

import React, { useState } from "react";
import axios from "axios";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Book {
  _id: string;
  title: string;
  author: string;
  rating: number;
  coverImage: string;
  isFavorite: boolean;
  genre: [string];
  year: number;
}

const ResponsiveCard: React.FC<{ book: Book }> = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);

  const handleDeleteClick = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/books/delete/${book._id}`)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error deleting the book!", error);
      });
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    axios.put(`${import.meta.env.VITE_API_URL}/api/v1/books/favorite/${book._id}`)
      .then(response => console.log(response))
      .catch(error => console.error("There was an error updating the favorite status!", error));
  };

  const foto = `../../../public/Images/${book.coverImage}`;

  return (
    
      <div>
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
      <div className="relative"></div>
      <img src={foto} alt={book.title} className="w-full h-48 object-cover" />
    </div><div className="p-4">
        <h3 className="text-lg font-bold">{book.title} - {book.year}</h3>
        <p className="text-sm mt-1">{book.author}</p>
        <div className="flex items-center mt-2 space-x-2">
         
          <div className="flex">
          <span className="text-yellow-500 font-bold text-sm">
          {book.rating} / 5 ⭐
        </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link to={`/book/${book._id}`}>
          <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md font-medium text-sm transition-all">
            Ver más
          </button>
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${isFavorite ? "bg-yellow-400 hover:bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
          >
            <StarBorderIcon className="w-5 h-5" />
          </button>
          <Link to={`/edit/${book._id}`}>
            <button className="px-4 py-2 rounded-md p-1 text-gray-800 hover:bg-green-500 font-medium text-sm transition-all bg-gray-200">
              <EditIcon className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 rounded-md p-1 text-gray-800 hover:bg-red-500 font-medium text-sm transition-all bg-gray-200"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResponsiveCard;

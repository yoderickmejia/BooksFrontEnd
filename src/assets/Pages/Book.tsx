import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useParams } from "react-router-dom";
import BookView from "../components/BookView";
interface Book {
    _id: string;
    title: string;
    author: string;
    rating: number;
    imageUrl: string;
    coverImage: string;
    isFavorite: boolean;
    genre: string[];
    year: number;
    comment: string;
}

const Book: React.FC = () => {
    const [book, setBook] = useState<Book | null>(null);
    const { id: bookId } = useParams<{ id: string }>();
    const [darkMode, setDarkMode] = useState(false);

    const fetchBook = useCallback(async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/books/by-id/${bookId}`
            );
            setBook(response.data);
        } catch (error) {
            console.error("Error al obtener el libro:", error);
        }
    }, [bookId]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return (
        <div
            className={`h-screen w-screen ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
        >
            <div className="flex justify-between w-full p-4">
                <button
                    onClick={toggleTheme}
                    className="text-2xl p-2 rounded-full focus:outline-none"
                >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </button>
                <Link to="/home">
                    <button className="flex items-center space-x-2 text-sm font-medium hover:text-indigo-500">
                        <HomeIcon className="text-lg" />
                        <span>Home</span>
                    </button>
                </Link>
            </div>
            {book && <BookView book={book} />}
        </div>
    );
};

export default Book;

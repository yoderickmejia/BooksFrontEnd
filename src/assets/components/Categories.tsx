import { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveCard from "./card";

interface CategoriesProps {
    Category: string;
}

interface Book {
    _id: string;
    id: string;
    title: string;
    author: string;
    rating: number;
    imageUrl: string;
    coverImage: string;
    isFavorite: boolean;
    genre: [string];
    year: number;
}

const Categories: React.FC<CategoriesProps> = ({ Category }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const userId = localStorage.getItem('userId');

    const fetchBooks = async (category: string, page: number) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/books/categories`, {
                params: {
                    userId,
                    genre: category,
                    page,
                },
            });
            setBooks(response.data);
        } catch (error) {
            console.error("Error al obtener los libros:", error);
            setBooks([]);
        }
    };

    useEffect(() => {
        fetchBooks(Category, page);
    }, [Category, page]);

    return (
        <div className="p-6 min-h-screen">
            <div className="p-4">
                <h1 className="text-3xl font-bold text-center mb-6">{Category}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                    {books.map((book) => (
                        <ResponsiveCard key={book._id} book={book} />
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center mt-8 space-x-4">
                <button
                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                        page === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-500"
                    }`}
                >
                    Página anterior
                </button>
                <span className="text-lg font-semibold text-gray-700">Página: {page}</span>
                <button
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-500"
                >
                    Página siguiente
                </button>
            </div>
        </div>
    );
};

export default Categories;

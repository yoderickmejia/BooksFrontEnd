import { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveCard from "../components/card";

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

const MyBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [searchGenre, setSearchGenre] = useState("");
  const [searchYear, setSearchYear] = useState(0);
  const [searchAuthor, setSearchAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
   
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/books/advancedSearch?`, {
        params: {
          userId: localStorage.getItem('userId'),
          genre: searchGenre ,
          year: searchYear,
          author: searchAuthor,
          page: page,
        },
      });
      setBooks(response.data);
      console.log(response.data); 
    } catch (error) {
      console.error("Error al obtener los libros:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, searchAuthor, searchGenre, searchYear]);

  return (
  
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">My Books</h1>

      <div className="w-full mx-auto mb-8 grid grid-cols-3 gap-5">
        <input
          type="text"
          placeholder="Find by genre(s)..."
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
          className="col-span-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
        />
        <input
          type="text"
          placeholder="Find by author(s)..."
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
        />
        <input
          type="number"
          placeholder="Find by year(s)..."
          value={searchYear === 0 ? "" : searchYear}
          onChange={(e) => setSearchYear(e.target.valueAsNumber  || 0)}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
          {books.map((book) => (
            <ResponsiveCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No se encontraron libros</p>
      )}

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
export default MyBooks;


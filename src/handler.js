const books = require("./books");
const {
  checkName,
  checkReadPage,
  checkPageCount,
  searchBookName,
} = require("./utils/utils");
const { nanoid } = require("nanoid");

//___POST BOOK___
const postBooks = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  //___CHECK IF NAME IS EMPTY___
  if (!name || name === undefined || name === "") {
    const response = await checkName(h, { type: "POST" });
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  //___CHECK IF readPage === pageCount___
  if (pageCount < readPage) {
    const response = await checkPageCount(h, { type: "POST" });
    return response;
  }

  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((books) => books.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
  response.code(500);
  return response;
};

//____GET BOOKS____
const getBooks = (request, h) => {
  const { bookId } = request.params;
  //___SEARCH BOOK NAME___
  if (Object.keys(request.query).length > 0) {
    const response = searchBookName(books, request.query, h);
    return response;
  }
  if (!bookId || bookId === undefined) {
    let filteredBooks = [];
    for (let book of books) {
      let newBookData = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      filteredBooks.push(newBookData);
    }
    const response = h.response({
      status: "success",
      data: { books: filteredBooks },
    });
    response.code(200);
    return response;
  }
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

//___UPDATE BOOK___
const changeBooks = async (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  //___CHECK IF NAME IS EMPTY___
  if (!name || name === undefined || name === "") {
    const response = await checkName(h, { type: "PUT" });
    return response;
  }

  //___CHECK IF readPage === pageCount___
  if (pageCount < readPage) {
    const response = await checkPageCount(h, { type: "PUT" });
    return response;
  }

  const updatedAt = new Date().toISOString();
  const newUpdatedBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  //___CHECK readPage___
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const response = await checkReadPage(newUpdatedBook, books, index, h);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBooks = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = { getBooks, postBooks, changeBooks, deleteBooks };

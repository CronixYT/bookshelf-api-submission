const searchBookName = (books, query, h) => {
  let newQuery = {};

  if (query.reading !== undefined) {
    if (query.reading == 0) query.reading = false;
    if (query.reading == 1) query.reading = true;
    newQuery = { ...newQuery, reading: query.reading };
  }
  if (query.finished !== undefined) {
    if (query.finished == 0) query.finished = false;
    if (query.finished == 1) query.finished = true;
    newQuery = { ...newQuery, finished: query.finished };
  }

  //___SEARCH BOOKS___

  filteredBooks = books.filter((book) => {
    return Object.keys(newQuery).every((key) => {
      return newQuery[key] === book[key];
    });
  });

  if (query.name) {
    let newFilteredBooks = [];
    for (book of filteredBooks) {
      if (book.name.toLowerCase().includes(query.name.toLowerCase())) {
        newFilteredBooks.push(book);
      }
    }
    filteredBooks = newFilteredBooks;
  }

  let data = [];
  for (book of filteredBooks) {
    let newBook = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    data.push(newBook);
  }

  const response = h.response({
    status: "success",
    data: {
      books: data,
    },
  });
  response.code(200);

  return response;
};

const checkReadPage = (newUpdatedBook, books, index, h) => {
  books[index] = {
    ...books[index],
    ...newUpdatedBook,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  // console.log("Upload success");
  return response;
};

const checkName = (h, { type }) => {
  // console.log("Failed");
  let message;
  if (type == "POST") {
    message = "Gagal menambahkan buku. Mohon isi nama buku";
  }
  if (type == "PUT") {
    message = "Gagal memperbarui buku. Mohon isi nama buku";
  }
  const response = h.response({
    status: "fail",
    message: message,
  });
  response.code(400);
  return response;
};

const checkPageCount = (h, { type }) => {
  let message;
  if (type == "POST") {
    message =
      "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
  }
  if (type == "PUT") {
    message =
      "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
  }
  const response = h.response({
    status: "fail",
    message: message,
  });
  response.code(400);
  return response;
};

module.exports = { checkReadPage, checkName, checkPageCount, searchBookName };

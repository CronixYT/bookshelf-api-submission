const { getBooks, postBooks, changeBooks, deleteBooks } = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/books/{bookId?}",
    handler: getBooks,
  },
  {
    method: "POST",
    path: "/books",
    handler: postBooks,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBooks,
  },
  { method: "PUT", path: "/books/{bookId}", handler: changeBooks },
  {
    method: "*",
    path: "/{any*}",
    handler: function (request, h) {
      return "404 Error! Page Not Found!";
    },
  },
];

module.exports = routes;

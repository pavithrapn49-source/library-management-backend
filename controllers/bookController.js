import { create, find } from "../models/book";

export async function addBook(req, res) {
  const book = await create(req.body);
  res.json(book);
}

export async function getBooks(req, res) {
  const books = await find();
  res.json(books);
}

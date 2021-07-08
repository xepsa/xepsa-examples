## Book Library.


Create a “booklibrary” actor (fun fact: calling your crate library can cause bizarre compilation failures) that exposes a CRUD (Create/Retrieve/Update/Delete) interface over an HTTP server (e.g. “RESTful”) on a library, allowing users to create new book entries, query existing books, update books, and delete books.

You don’t need to expose a query for the list of all books, as the REST interface will be driven by ISBN numbers:

```bash
POST
	/books 	Store/create the book given in the payload

GET
	/books/{ISBN} 	Retrieve a single book identified by the ISBN; returns a 404 for a non-existent book

PUT
	/books/{ISBN} 	Update an existing book, returning a code 404 for non-existent book

DELETE
	/books/{ISBN} 	Deletes a book
```

The Book stored in the key-value store should be a JSON string serialized from the following Rust struct:

```rust
#[derive(Serialize, Deserialize, Clone, Debug)]
struct Book {
    pub isbn: String,
    pub title: String,
    pub description: String,
    pub price: u32,
}
```

You should be able to draw from the preceding code samples to help you build this lab. You can use the wash tool to start and configure your providers and the library actor. 

For resources, you will want to look at the code/documentation for the key-value and HTTP server actor interfaces for wasmCloud.


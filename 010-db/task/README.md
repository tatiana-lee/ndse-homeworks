```javascript
db.books.insertOne(
  {
    title: "Harry Potter and the Philosopher's Stone",
    description: "Novel",
    authors: "Joanne Rowling"
  }
)

db.books.insertMany( [
  {
    title: "Harry Potter and the Chamber of Secrets",
    description: "Fantasy novel",
    authors: "J. K. Rowling"
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    description: "Fantasy novel",
    authors: "J. K. Rowling"
  }
] )


db.books.find(
  { title: "Harry Potter and the Chamber of Secrets" }
)


db.books.updateOne(
  { _id: 1 },
  { $set: { description: "Fantasy Novel",  authors: "J. K. Rowling"} }
)

``` 
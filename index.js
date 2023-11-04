import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
    user:'postgres',
    host:'localhost',
    database:'booker',
    password:'371111',
    port:5432
});
db.connect();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//Get books that the user either is reading now, or finished reading from DB
async function getBooks(){
    const response = await db.query('SELECT id,name,author,img_paths,rating,currently_reading,finished_reading FROM books WHERE finished_reading = true OR currently_reading = true ORDER BY rating DESC')
    const data = response.rows;
    const books = [];
    data.forEach(b=>{
        books.push(b)
    })
    
    return books
}

//used in /book/:id
async function getBook(bookId){
    const query = await db.query('SELECT id,name,author,img_paths,rating,currently_reading,finished_reading FROM books WHERE id = $1',[bookId]);
    const book = query.rows[0];

    return book
}

//get My Notes
async function getNotes(bookId){
    const notes = await db.query('SELECT id,comment FROM notes WHERE book_id = $1',[bookId]);
    return notes.rows;

}
//simple utility function to render average rating
function getAvrg(array){
    let sum = 0.0;
    for (const num of array){
        sum += num
    }
    return (sum/array.length).toFixed(2)
}

function calc_averageRating(lib){
    const ratings = [];
    const books = lib;
    books.forEach(b=>{
        if(b.rating){
        ratings.push(b.rating)}
    })

    return getAvrg(ratings);
        
}

//get unique authors count in MYLIB
async function getAuthors(lib){
    const authors = [];
    const books = lib;
    books.forEach(b=>{
        authors.push(b.author)})

    const uniqueAuthors= [...new Set(authors)]
    console.log(uniqueAuthors);
    return uniqueAuthors
}

//search Functionality
async function searchBooks_db(userInput){
    const relevantBooks = [];
    const query = await db.query('SELECT id,name,author,img_paths,rating,currently_reading,finished_reading FROM books WHERE LOWER(name) LIKE $1 OR LOWER(author) LIKE $2 LIMIT 999', [`%${userInput}%`, `%${userInput}%`]);
    
    const data = query.rows;
    data.forEach(b=>{
        relevantBooks.push(b);
    })

    return relevantBooks
}



app.get('/',async (req,res)=>{

    const books_db = await getBooks();
    const ratingAvg = calc_averageRating(books_db);
    const authors = await getAuthors(books_db);

    res.render('index.ejs',{
        books: books_db,
        booksCount: books_db.length,
        averageRating: ratingAvg,
        authorsCount:authors.length,
    })
})


app.post('/search', async (req,res)=>{

    const userInput = req.body.searchText
    
    if (userInput.trim() === ''){
        res.redirect('/');

    }else{
     const books = await searchBooks_db(userInput.toLowerCase())

    res.render('search.ejs',{
        searchMatches:books,
        
        userInput:userInput//keep search input in search bar,
    })
}}
)


app.post('/add/:id', async (req,res)=>{
    const bookId = req.params.id;
    const query = await db.query('UPDATE books SET currently_reading = true WHERE id = $1',[bookId]);

    res.redirect(`/book/${bookId}`)
})

app.get('/book/:id', async (req,res)=>{
    const bookId = req.params.id;

    const notes = await getNotes(bookId);
    const bookToRender = await getBook(bookId)

    res.render('book.ejs',{
        book: bookToRender,
        notes: notes
    })
})

// This and /add should be integrated in the /edit route
app.post('/status',async (req,res)=>{
    const bookId = req.body.bookId;
    const query = await db.query('UPDATE books SET currently_reading = false, finished_reading = true WHERE id = $1',[bookId]);

    res.redirect(`/book/${bookId}`)

})

app.post('/edit/:id',async (req,res)=>{
    const bookId = req.params.id;
    if (req.body.bookId){
    const rating = req.body.bookId;const query = await db.query('UPDATE books SET rating = $1 WHERE id = $2',[rating,bookId]);
    }
    
    if (req.body.newComment){
    const note = req.body.newComment;
    
    if (note.trim()===''){
        console.log('ERROR creating NOTE: empty note')

    }else if(note.length > 255){
        console.log('ERROR creating NOTE: string too long')
    }
    
    else{
    const addNote = await db.query('INSERT INTO notes (comment,book_id) VALUES ($1,$2)',[note,bookId]);
    }}

    if (req.body.newStatus){
        const status = req.body.newStatus;
        if (status === 'Remove'){
            const setStatus = await db.query('UPDATE books SET currently_reading = false, finished_reading = false WHERE id =$1 ',[bookId]);
            
        }else if(status === 'Reading'){
            const setStatus = await db.query('UPDATE books SET currently_reading = true, finished_reading = false WHERE id =$1 ',[bookId]);
        
        }else{//if(status === 'Finished')
            const setStatus = await db.query('UPDATE books SET currently_reading = false, finished_reading = true WHERE id =$1 ',[bookId]);
        }
        console.log(`book id:${bookId} status change`)
    }
    
    res.redirect(`/book/${bookId}`);
})


app.get('/delete/:noteId',async (req,res)=>{

    const noteId = req.params.noteId;
    const bookId = req.query.book;
    try{
    const query = await db.query('DELETE FROM notes WHERE id = $1',[noteId]);
    }catch(err){
    console.error(err);
    res.redirect(`/book/${bookId}`)
    }
    res.redirect(`/book/${bookId}`);
})



app.listen(port,(req,res)=>{
    console.log(`Server listening on port ${port}`)
});
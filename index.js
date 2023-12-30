import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import bodyParser from "body-parser"
import session from 'express-session'
import passport from 'passport'
import {Book, User,Note} from './my_modules/db.js'
import { getBooks, getBook, getNotes, calc_averageRating, getAuthors, searchBooks_db, addBookToUser } from './my_modules/operations.js'


const ObjectId = mongoose.Types.ObjectId;

const app = express();
const port = process.env.PORT || 3000 ;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(session({
    secret: process.env.SECRETPHRASE,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())

try{
    await mongoose.connect(process.env.MONGODB_URI,)
    console.log('Mongoose set up.');
  }catch(error){
    console.log(error.message)
  }


passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err, null);
    });
});

app.get('/', (req,res)=>{
    
    if (req.isAuthenticated()){
        res.redirect('/home')
    }else{
        res.redirect('/login')
    }
})

app.get('/register', (req,res)=>{
    try{
        res.render('register')
    }catch(e){
        console.log(e);
        res.send('<h1>Page could not be rendered, try again </h1>');
    }
})

app.get('/login', (req,res)=>{
    if (req.isAuthenticated()){
        res.redirect('/home')
    }else{
        res.render('login');
    }
})


app.get('/home',async (req,res)=>{
    
if (req.isAuthenticated()){
    const userId = req.user['_id'];
    const books_db = await getBooks(userId, User);
    if (books_db){
    const ratingAvg = calc_averageRating(books_db);
    const authors = await getAuthors(books_db);
    
    res.render('index.ejs',{
        books: books_db,
        averageRating: ratingAvg,
        authorsCount:authors.length,
    })
}else{
    res.render('index.ejs',
        {books: [],
        authorsCount: 0,
        averageRating:0})
}
    }else{
        res.redirect('/login')
    }

})

app.get('/book/:id', async (req,res)=>{
    if (req.isAuthenticated()){
    const bookId = req.params.id;
    const userId = req.user['_id'];

    const notes = await getNotes(userId, bookId, Note);
    
    const bookToRender = await getBook(bookId, userId, User, Book)
    if (bookToRender !== undefined){
    res.render('book.ejs',{
        book: bookToRender,
        notes: notes
    }
        )}else{
            res.redirect('/home');
        }

    }else{
        res.redirect('/')
    }
})

app.get('/logout', (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});



app.post("/register", async function(req, res){
  
    await User.register({username: req.body.username},req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
        
        res.redirect("/home");
          
        });
      }
    });
  
  });

  app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
        res.redirect('/login')
      } else {
          passport.authenticate("local",{ failureRedirect: '/login', failureMessage: true })(req, res, function(){
          res.redirect("/home");
          req.user.loggedIn();
        });
      }
    })
});

app.post('/search', async (req,res)=>{
    const userId = req.user['_id'];
    const userInput = req.body.searchText;
    
    if (userInput.trim() === ''){
        res.redirect('/');

    }else{
     const books = await searchBooks_db(userInput.toLowerCase(),userId, Book, User)

    res.render('search.ejs',{
        searchMatches:books,
        
        userInput:userInput//keep search input in search bar,
    })
}}
) 

app.post('/add/:id', async (req,res)=>{
    if (req.isAuthenticated()){
        const bookId = new ObjectId(req.params.id);
        const userId = req.user['_id'];
        
        await addBookToUser(userId, bookId,User);

        res.redirect(`/book/${bookId}`)
    }else{
        res.redirect('/login')
    }
})

app.post('/edit/:id',async (req,res)=>{
    if (req.isAuthenticated()){
        const bookId = req.params.id;
        console.log(bookId);
        if (req.body.rating){
        const rating = req.body.rating;
        
        req.user.updateRating(bookId, rating);
        }
        
        if (req.body.newComment){
        const note = req.body.newComment;
        
        if (note.trim()===''){
            console.log('ERROR creating NOTE: empty note')

        }else if(note.length > 255){
            console.log('ERROR creating NOTE: string too long')
        }
        
        else{
            const newNote = new Note({
                body: note,
                user_id: req.user['_id'],
                book_id: new ObjectId(bookId)
            });
            await newNote.save();
        }}

        if (req.body.newStatus){
            const status = req.body.newStatus;
            
            await req.user.updateStatus(bookId,status)
        }
        
        res.redirect(`/book/${bookId}`);
    }else{
        res.redirect('/login')
    }
})


app.post('/delete/:noteId',async (req,res)=>{

    if (req.isAuthenticated()){
        const noteId = req.params.noteId;
        const bookId = req.query.book;
        try{
            await Note.deleteOne({"_id":noteId});
            
        }catch(err){
        console.error(err);
        res.redirect(`/book/${bookId}`)
        }
        res.redirect(`/book/${bookId}`);
    }else{
        res.redirect('/login')
    }


})



app.listen(port,() =>{
    console.log(`Server listening on port ${port}`)
});
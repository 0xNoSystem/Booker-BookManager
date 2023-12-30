import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId;

async function getBooks(userId, db){
    const userBooks = []; 
    try{
        const user= await db.findOne({'_id':userId},{books:1, _id:0}).populate('books.book_id');
        const userBooks = user.books;
        return userBooks
    }catch(e){
        console.log(e.message);
    }
}

async function getBook(bookId, userId, db, db2){
    
    try{
        const user = await db.findOne({ '_id': userId}).populate('books.book_id');
        
        
        const book = await user.getBook(bookId);

                if (book !== undefined){
                    return book

                }else{
                    const book =  await db2.findOne({'_id': bookId});
                
                    const newObj = {book_id: book,
                                    currently_reading: false,
                                    finished_reading: false,
                                    rating: 0}
                    return newObj
            }
            
            }catch(e){
    console.log(e.message);
  }
  }


  async function getNotes(userId, bookId, db){

    try{
        const notes = await db.find({user_id:userId, book_id: bookId},{body:1});
        return notes
    }catch(e){
        console.log(e.message);
    }

  }

function getAvrg(array){
    let sum = 0.0;
    for (const num of array){
        sum += num;
    }
    return (sum/array.length).toFixed(2)
}

function calc_averageRating(lib){
    const ratings = [];
    const books = lib;
    books.forEach(b=>{
        if(b.rating){
        ratings.push(b.rating)}
    });


    if (getAvrg(ratings) !== 'NaN'){
        return getAvrg(ratings) || 0;
    };  
};


async function getAuthors(lib){
    if (lib.length !==0){
    const authors = [];
    const books = lib;
    books.forEach(b=>{
        authors.push(b.book_id.author)})

    const uniqueAuthors= [...new Set(authors)]
    
    return uniqueAuthors 
}else{
    return []
}
};

async function searchBooks_db(userInput,userId, db, db2 /*User*/) {
    const regex = new RegExp(userInput, 'i'); // Creating a regular expression for case-insensitive matching
    const userBooks = await getBooks(userId, db2);
    const userBooks_id = [];
    
    userBooks.forEach(b=> userBooks_id.push(b.book_id.toString()))
    

    try {
        const relevantBooks = await db.find({
            $or: [
                { name: { $regex: regex } },
                { author: { $regex: regex } }
            ]
        }).select('id name author img_paths')
          .limit(999);

          const result = relevantBooks.map(b=>{
            
            if (userBooks_id.includes(b.toString())){
                
                return userBooks.find(ub => ub.book_id.toString() === b.toString()); 
                }else{
                 const book = {
                    book_id: b,
                    currently_reading: false,
                    finished_reading:false,
                    rating: null
                    }
                    return book
            
            }
            
        })

        return result;
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
}


async function addBookToUser(userId, bookId, db/*User*/){
    
    try{
        const user = await db.findOne({'_id': userId});
        user.addBook(bookId);
        await user.save();
    }catch(error){
        console.log(error);
    }
}

export { getBooks, getBook, getNotes, calc_averageRating, getAuthors, searchBooks_db, addBookToUser};
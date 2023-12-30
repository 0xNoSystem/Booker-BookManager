import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
    
	username: {type: String},

	books:[
		{book_id:{type:ObjectId, ref:'books'},
		 currently_reading: Boolean,
		 finished_reading: Boolean,
		 rating: {type: Number,
				  min:0,
				  max:5
				}
        }],

	createdAt:{type: Date,
			   default: ()=> Date.now(),
				immutable:true
			},
	
	lastLogin:{type: Date,
		default: ()=> Date.now()
		}

    })
userSchema.methods.addBook = function(bookId){
    const bookObj = {
        book_id: bookId,
        currently_reading: true,
        finished_reading: false,
        rating: null
    };
    this.books.push(bookObj);
};

userSchema.methods.getBook = function(bookId){
  
  const book = this.books.find(b=> b.book_id.id == bookId)
  
  return book
}

userSchema.methods.updateRating = async function(bookId,rating){
  const bookIndex = await this.books.findIndex(b=> b.book_id.toString() == bookId.toString());
  
  if (bookIndex !== -1){
     this.books[bookIndex].rating = rating;
  await this.save();
  }else{
    return undefined
  }
 
}


userSchema.methods.updateStatus = async function(bookId, status){
  const bookIndex = this.books.findIndex(b=> b.book_id == bookId);

  if (status === 'Remove'){
    this.books[bookIndex].currently_reading = false;
    this.books[bookIndex].finished_reading = false;
    this.books.splice(bookIndex,1);
  }else if(status === 'Reading'){
    this.books[bookIndex].currently_reading = true;
    this.books[bookIndex].finished_reading = false;
  }else{//if(status === 'Finished')
    this.books[bookIndex].currently_reading = false;
    this.books[bookIndex].finished_reading = true;
  }

  await this.save()
}

userSchema.methods.loggedIn = async function(){
  this.lastLogin = Date.now();
  await this.save();
}

userSchema.plugin(passportLocalMongoose)


const bookSchema = new mongoose.Schema({
    "name": String,
    "author": String,
    "img_paths": {type: String, immutable: true},
	'average_rating':{type:Number,
					  min:0,
					  max:5
					 }
})



const noteSchema = new mongoose.Schema({
    body: { type: String, required: true },
    user_id: { type: ObjectId, ref: 'users', required: true },
    book_id: { type: ObjectId, ref: 'books', required: true },
    createdAt:{
              type:Date,
              default: ()=>Date.now(),
              immutable: true
              }
});


const Book =mongoose.model('books',bookSchema);
const User =mongoose.model('users',userSchema);
const Note =mongoose.model('notes', noteSchema);


export {Book, User, Note}

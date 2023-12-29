
const inputElement = document.createElement('input');
inputElement.setAttribute('type','hidden');
inputElement.setAttribute('value','');
inputElement.setAttribute('name','rating');

//get bookId (I chose a random element)
const bookId = document.querySelector('.set-rating').getAttribute('type');

//This form appears when the user wants to set rating/edit rating
const ratingDiv = document.createElement('form');
ratingDiv.appendChild(inputElement);
ratingDiv.setAttribute('action',`/edit/${bookId}`);
ratingDiv.setAttribute('method','post')
ratingDiv.className = 'rating';

//add stars(button/svg) to form
for (let i = 1; i <= 5; i++) {
  const button = document.createElement('button');
  const star_svg = document.querySelector('.star-svg').cloneNode(true);
  star_svg.setAttribute('fill','white')

  button.appendChild(star_svg)
  button.id = `star${i}`;
  button.className = 'star';
  ratingDiv.appendChild(button);
}

  const parent = document.getElementById('edit-rating');
  const h3 = parent.querySelector('h3');
  
  const setButton = document.querySelector('.set-rating');//this class works on : set rating and edit rating
  
  setButton.addEventListener('click',function(){

    //replace edit tag by rating form
    parent.removeChild(h3);
    parent.appendChild(ratingDiv);

  })

  //rating form hover functionality
  ratingDiv.addEventListener('mouseover', function () {
  const stars = document.querySelectorAll('.star');
  const setRatingButton = document.querySelector('.set-rating');

  let currentRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', function () {
      fillStars(index + 1);
    });

    star.addEventListener('mouseout', function () {
      fillStars(currentRating);
    });

    star.addEventListener('click', function () {
      currentRating = index + 1;
      fillStars(currentRating);
    });
  });

  //remove form whrn user clicks and get rating input
  ratingDiv.addEventListener('click', function () {
    
    inputElement.setAttribute('value',currentRating);
    ratingDiv.submit();
    parent.removeChild(ratingDiv);
    parent.appendChild(h3);//can use replace()
  });

  function fillStars(num) {
    stars.forEach((star, index) => {
      const svg = star.querySelector('.star-svg');
      const filled_svg_data = `<svg class='star-svg' xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#FFDE59" class="bi bi-star-fill" viewBox="0 0 16 16" style="margin-bottom: 3px;"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" /></svg>`
      const empty_sv_data = `<svg class='star-svg' xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" class="bi bi-star-fill" viewBox="0 0 16 16" style="margin-bottom: 3px;"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" /></svg>`
      
      if (index < num) {
        svg.setAttribute('fill','#FFDE59')
      } else {
        svg.setAttribute('fill','white')
      }
    });
  }
});


function activate_x(){
  document.getElementById('backx').addEventListener('click',function(){
    layer.remove()
    });
}

// NEW NOTE, a layer appears with a text box and a submit button with themex length of 255
const newNoteButton = document.getElementById('new-note');

newNoteButton.addEventListener('click',function(){
    const container = document.querySelector('.container')
    
    const layer = document.createElement('div');
    layer.setAttribute('id','layer');
    container.appendChild(layer);


    const svgString_x = `
    <svg id='backx' xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>`;


    const header = document.createElement('h2');
    header.innerHTML = `${svgString_x} <h5>New Note</h5> `

    
    const formElement = document.createElement('form');
    formElement.setAttribute('id','new-note-form');
    formElement.setAttribute('action',`/edit/${bookId}`);
    formElement.setAttribute('method','post')

    const inputElement = document.createElement('textarea');
    inputElement.setAttribute('id','text-area');
    inputElement.setAttribute('name','newComment');
    inputElement.spellcheck = false;
    const submitFormInput = document.createElement('input');
    submitFormInput.setAttribute('type','submit')

    layer.appendChild(header);
    layer.appendChild(formElement);
    formElement.appendChild(inputElement);
    formElement.appendChild(submitFormInput);

    inputElement.addEventListener('keydown',function(event){
      const textLength = inputElement.value.length;
      
      if (textLength > 255){
        inputElement.style.color = 'red';
        header.innerHTML = `${svgString_x} New Note(${textLength}/255) `;
        activate_x();
        
        
      }else{
        inputElement.style.color = '#000'
        header.innerHTML = `${svgString_x} New Note(${textLength}/255)`

      activate_x();
      }
      
    });activate_x();
      });


 

const trashStr = `<svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
</svg><input type='hidden' name='book' value='${bookId}'>`

const trashIcon = document.createElement('form');

trashIcon.innerHTML= trashStr;
trashIcon.setAttribute('class','trash-icon');

const notesList = document.querySelectorAll('.note');

//delete note functionality
notesList.forEach(n=>{
  n.addEventListener('mouseover',function(){
    const noteId = n.getAttribute('id');
    trashIcon.setAttribute('action',`/delete/${noteId}`)
    
    n.appendChild(trashIcon);
    trashIcon.addEventListener('click',function(){
      trashIcon.submit();
    })
  })

  
  n.addEventListener('mouseleave',function(){
    n.removeChild(trashIcon);

    
})

})


function trashActivate(parent){

const trashButton = document.querySelector('.trash-icon');

trashButton.addEventListener('click',function(){
    trashButton.remove();
    parent.removeEventListener('mouseover');
  })


}



const changeStatusAnchor = document.getElementById('change-book-status');

const dropdown = document.createElement('form');
dropdown.classList.add('dropdown-content');
dropdown.setAttribute('action',`/edit/${bookId}`);
dropdown.setAttribute('method','post');

dropdown.innerHTML = `<input type='submit' name='newStatus' value='Remove'><input type='submit' name='newStatus' value='Reading'><input type='submit' name='newStatus' value='Finished'>`

changeStatusAnchor.addEventListener('click',function(){
  
  changeStatusAnchor.parentNode.replaceChild(dropdown,changeStatusAnchor);

})



const logoutButton = document.getElementById('logout');
const logoutForm = document.getElementById('logout-form');

logoutButton.addEventListener('click', function(){
  logoutForm.submit();
})



window.onbeforeunload = function() {
  sessionStorage.setItem("scrollPosition", window.scrollY || document.documentElement.scrollTop);
};
window.onload = function() {
  if (sessionStorage.getItem("scrollPosition") !== null) {
      window.scrollTo(0, parseInt(sessionStorage.getItem("scrollPosition")));
  }
};


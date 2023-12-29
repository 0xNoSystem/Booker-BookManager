



const pass1 = $('#pass1');
const pass2 = $('#pass2');
const submitRegister = $("#submitRegister");


function updateMessage (){
    if (pass1.val().length !== 0 || pass2.val().length !== 0){
        if(pass1.val() !== pass2.val()){
            $('.message').text("Passwords does not match").css('color','red');
            submitRegister.prop('disabled', true);
        }else{
            $('.message').text("Passwords match!").css('color','green');
            $("#submitRegister").prop('disabled', false);
        }
    }else{
        $('.message').text("==");
        submitRegister.prop('disabled', true);
    }
}


pass1.on('input',function(){updateMessage()})
pass2.on('input',function(){updateMessage()})


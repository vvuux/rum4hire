import domain from "./const.js"

$(document).ready(function(){
    function signUp(){
        $("button#signup-btn").click(function(){
            const username = $("#signup-username-input").val();
            const email = $("#signup-email-input").val();
            const password1 = $("#signup-password-input").val();
            const password2 = $("#signup-password-again-input").val();
            $.ajax({
                url: "http://localhost:8008/graphql/",
                dataType: "json",
                type:"POST",
                contentType: "application/json",
                data: JSON.stringify({
                    query: `mutation{register (email:  "${email}",username: "${username}",password1: "${password1}",password2: "${password2}"){success	errors}}`
                }),
                success: function(result){
                    var errors = result.data.register.errors;
                    if (result.data.register.success === true){
                        window.location.replace("http://localhost:8008/email-confirm.html");
                    }
                    else {
                        if ($("#signup-errors").length !== 0){
                            $("#signup-errors").empty();        
                        }
                        for (var key in errors){
                            $("#signup-errors").append(`<p class="error-message"> - ${key}: ${errors[key][0].message}</p>`);
                        }
                        $("#signup-errors").attr("hidden",false);
                        $("#signup-error-title").attr("hidden",false);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.location.href = `${domain}/500.html`
                }
            })
        })            
    }

    signUp();
})
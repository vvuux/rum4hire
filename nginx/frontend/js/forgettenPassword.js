import { domain, loginPath } from "./const.js"

$(document).ready(function(){
    function changePassword(){
        $("button#verify-email-btn").click(function(){
            const email = $("#change-password-email-input").val();
            
            $.ajax({
                url: `${domain}/graphql/`,
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    query: `mutation{sendPasswordResetEmail(email:"${email}"){success  errors}}`
                }),
                success: function(result){
                    if(result.data.sendPasswordResetEmail.success === true){
                        window.location.href = `${domain}${loginPath}`;
                    }
                    else{
                        const errors = result.data.sendPasswordResetEmail.errors;
                        
                        if ($("#signup-errors").length !== 0){
                            $("#signup-errors").empty();        
                        }
                        for (var key in errors){
                            $("#signup-errors").append(`<p class="error-message">${errors[key][0].message}</p>`);
                        }
                        $("#signup-errors").attr("hidden",false);
                        $("#signup-error-title").attr("hidden",false);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.location.href = `${domain}/500.html`;
                }
            })
        })
    }
    changePassword();
})

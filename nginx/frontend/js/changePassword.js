import {getParam} from "./function.js"
import {domain, loginPath} from "./const.js"

$(document).ready(function(){
    function changePassword(){
        $("button#change-password-btn").click(function(){
            const token = getParam("token");
            const password1 = $("#new-password-input").val();
            const password2 = $("#new-password-again-input").val();

            $.ajax({
                url: `${domain}/graphql/`,
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    query: `mutation{passwordReset(token:"${token}",newPassword1:"${password1}",newPassword2:"${password2}"){success  errors}}`
                }),
                success: function(result){
                    if(result.data.passwordReset.success === true){
                        window.location.replace(`${domain}${loginPath}`);
                    }
                    else{
                        const errors = result.data.passwordReset.errors;
                        if ($("#signup-errors").length !== 0){
                            $("#signup-errors").empty();        
                        }
                        for (var key in errors){
                            $("#signup-errors").append(`<p class="error-message">${errors[key][0].message}</p>`);
                        }
                        $("#signup-errors").attr("hidden",false);
                        $("#signup-error-title").attr("hidden",false);
                    }
                }
            })
        })
    }
    changePassword();
})

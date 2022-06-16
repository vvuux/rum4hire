import * as CONST from "./const.js"
import {getParam} from "./function.js"

$(document).ready(function(){
    function login(){
        $("button#login-btn").click(function(){
            const email = $("#login-email-input").val()
            const password = $("#login-password-input").val()
            const nextPath = getParam("next");

            $.ajax({
                url: `${CONST.domain}/graphql/`,
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    query: `mutation{tokenAuth(email: "${email}", password: "${password}"){success errors token refreshToken}}`,
                }),

                success: function(result){
                    const errors = result.data.tokenAuth.errors;
                    const accessToken = result.data.tokenAuth.token;
                    const refreshToken = result.data.tokenAuth.refreshToken;
                    
                    if (result.data.tokenAuth.success === true){
                        document.cookie = `${CONST.accessTokenKeyString}=${accessToken}`;
                        document.cookie = `${CONST.refreshTokenKeyString}=${refreshToken}`;
                        if (nextPath === null){
                            window.location.replace(`${CONST.domain}/home.html`);
                        }
                        else{
                            window.location.replace(`${CONST.domain}${nextPath}`);
                        }
                    }
                    else{
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
                    console.log("here");
                    window.location.href = `${CONST.domain}/500.html`;
                }
            })
        })
    }

    function toSignup(){
        $(document).ready(function(){
            $("button#signup-btn").click(function(){
                document.location.replace("/signup.html");
            })
        })
    }

    toSignup();
    login();
})
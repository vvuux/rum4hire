import {domain, loginPath} from "./const.js"
import {getParam} from "./function.js"

$(document).ready(function(){
    function verifyEmail(){
        const token = getParam("token");

        $.ajax({
            url: `${domain}/graphql/`,
            contentType: "application/json",
            dataType:"json",
            type: "POST",
            data: JSON.stringify({
                query: `mutation{verifyAccount(token:"${token}"){success errors}}`
            }),
            success: function(result){
                if (result.data.verifyAccount.success === true){
                    window.location.replace(`${domain}${loginPath}`);
                }
                else{
                    const error = result.data.verifyAccount.errors.nonFieldErrors[0].message;
                    window.location.replace(`${domain}/forgotten-password.html?error=${error}`)
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }

    verifyEmail();
})

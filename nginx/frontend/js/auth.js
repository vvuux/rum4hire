import { domain, refreshTokenKeyString, accessTokenKeyString, loginPath } from "./const.js";
import { getCookies } from "./function.js";


function deleteCookie(cookieName){
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function refreshAccessToken(refreshToken){
    $.ajax({
        url: `${domain}/graphql/`,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            query: `mutation{refreshToken(refreshToken:"${refreshToken}"){success    token   errors    refreshToken}}`
        }),
        success: function(result){
            var data = result.data.refreshToken;
            if(data.success === true){
                document.cookie = `${accessTokenKeyString}=${data.token}`;
                document.cookie = `${refreshTokenKeyString}=${data.refreshToken}`    
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            window.location.href = `${domain}/500.html`
        }
    })
}

function refreshTokenExpirationCheck(refreshToken){
    $.ajax({
        type: "POST",
        url: `${domain}/graphql/`,
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            query: `query{refreshTokenExpiration(refreshToken:"${refreshToken}"){isExpired}}`
        }),
        success: function(result){
            var data = result.data.refreshTokenExpiration;
            if (data.isExpired === true){
                deleteCookie(refreshTokenKeyString);
                deleteCookie(accessTokenKeyString);
                window.location.replace(`${domain}${loginPath}`);
            }
            else{
                refreshAccessToken(refreshToken);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            window.location.href = `${domain}/500.html`
        }
    })
}

function verifyToken(){
    let path = window.location.pathname;
    let accessToken = getCookies(accessTokenKeyString);
    let refreshToken = getCookies(refreshTokenKeyString);

    if((accessToken === "" || refreshToken === "")){
        window.location.replace(`${domain}${loginPath}?next=${path}`);
    }
    else{
        $.ajax({
            type: "POST",
            url: `${domain}/graphql/`,
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                query: `mutation{verifyToken(token:"${accessToken}"){success  errors  payload}}`
            }),
            success: function(result){
                let data = result.data.verifyToken;
                if (data.success === false){
                    if(data.errors.nonFieldErrors[0].message === "Invalid token."){
                        deleteCookie(refreshTokenKeyString);
                        deleteCookie(accessTokenKeyString);
                        window.location.replace(`${domain}${loginPath}`);
                    }
                    else{
                        var refreshToken = getCookies(refreshTokenKeyString);
                        refreshTokenExpirationCheck(refreshToken);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }
}

function logOut(){
    $("#log-out-button").click(function(){
        var refreshToken = getCookies(refreshTokenKeyString);
        $.ajax({
            type: "POST",
            url: `${domain}/graphql/`,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                query: `mutation{revokeToken(refreshToken:"${refreshToken}"){success  errors}}`
            }),
            success:function(result){
                deleteCookie(refreshTokenKeyString);
                deleteCookie(accessTokenKeyString);
                window.location.replace(`${domain}${loginPath}`);
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    })
}

verifyToken();
logOut();
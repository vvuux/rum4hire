import {domain, loginPath} from "./const.js"

$(document).ready(function(){
    $("#go-to-login-btn").click(function(){
        window.location.replace(`${domain}${loginPath}`)
    })
})
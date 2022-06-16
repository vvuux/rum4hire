export function getParam(paramStr){
    const url_string = document.URL;
    var url = new URL(url_string);
    const token = url.searchParams.get(paramStr);
    return token
}

export function getCookies(cookieName){
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++){
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == " "){
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0){
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

export function deleteCookie(cookieName){
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default {
    getParam, 
    getCookies, 
    deleteCookie
}
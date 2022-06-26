import { accessTokenKeyString, domain } from "./const.js"
import { getCookies } from "./function.js"

$(document).ready(function(){
    function toCreateHouse(){
        $("#to-create-house-btn").click(function(){
            window.location.href = "/create-house.html";
        })
    }

    function getCitiesList(){
        $.ajax({
            type:"POST",
            url: `${domain}/graphql/`,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                query: `query{getAllCities{id  name}}`
            }),
            success: function(result){
                var cityArray = result.data.getAllCities;
                cityArray.forEach(element => {
                    $("#city-select").append(`<option value=${element.id}>${element.name}</option>`)
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }

    function citySelectChange(){
        $("#city-select").change(function(){
            if ($("#city-select").val() === "0"){
                $("#district-select").attr("disabled",true);
                $("#ward-select").attr("disabled",true);
                $("#district-select").empty().append("<option value=0 selected>None</option>");
                $("#ward-select").empty().append("<option value=0 selected>None</option>");
            }
            else{
                getDistrictList($("#city-select").val());
                $("#district-select").attr("disabled",false);
                $("#ward-select").empty().append("<option value=0 selected>None</option>")
                $("#ward-select").attr("disabled",true);
            }
        })
    }

    function districtSelectChange(){
        $("#district-select").change(function(){
            if ($("#district-select").val() === "0"){
                $("#ward-select").attr("disabled",true);
                $("#ward-select").empty().append("<option value=0 selected>None</option>");
            }
            else{
                getWardList($("#district-select").val());
                $("#ward-select").attr("disabled",false);
            }
        })
    }

    function getDistrictList(cityId){
        $.ajax({
            type: "POST",
            url: `${domain}/graphql/`,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                query: `query{getDistrictsInCity(cityId:${cityId}){id  name}}`
            }),
            success: function(result){
                var districtArray = result.data.getDistrictsInCity;
                $("#district-select").empty().append("<option value=0 selected>None</option>");
                districtArray.forEach(element => {
                    $("#district-select").append(`<option value=${element.id}>${element.name}</option>`)
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }

    function getWardList(districtId){
        $.ajax({
            type: "POST",
            url: `${domain}/graphql/`,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                query: `query{getWardsInDistrict(districtId:${districtId}){id  name}}`
            }),
            success: function(result){
                var wardArray = result.data.getWardsInDistrict;
                $("#ward-select").empty().append("<option value=0 selected>None</option>");
                wardArray.forEach(element => {
                    $("#ward-select").append(`<option value=${element.id}>${element.name}</option>`)
                })
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }


    function getHouseList(){
        const accessToken = getCookies("accessToken");
        $.ajax({
            url : `${domain}/graphql/`,
            type: "POST",
            contentType: "application/json",
            dataType:"json",
            data: JSON.stringify({
                query: `query{getMyHouses{uuid    name numberOfFloor description area    requestStatus  fullAddress mainImage}}`
            }),
            headers:{
                "Authorization":`JWT ${accessToken}`, 
            },
            success:function(result){
                var houseArray = result.data.getMyHouses
                if (houseArray.length > 0){
                    houseArray.forEach(element => {
                        $("#house-list-wrapper").append(`
                            <div class="part row" id="house-${element.uuid}">
                                <div class="house-image-wrapper col-3">
                                    <img src="media/${element.mainImage.image}">
                                </div>
                                <div class="col">
                                    <div class="house-title-wrapper">
                                        <a href="/house-details.html?house_id=${element.uuid}"><h3 class="housename">${element.name} <span class="house-status">${element.requestStatus}</span></h3></a>
                                    </div>
                                    <div class="house-info-wrapper">
                                        <p class="field-info"><b>Address:</b> ${element.fullAddress}</p>
                                        <p class="field-info"><b>Area:</b> ${element.area} m2</p>
                                        <p class="field-info"><b>Number of room:</b> 0</p>
                                        <p class="field-info"><b>Number of floor:</b> ${element.numberOfFloor}</p>
                                        <p class="field-info"><b>Price:</b> 0 - 0</p>
                                        <p class="field-info"><b>Description:</b> ${element.description}</p>
                                    </div>
                                </div>
                            </div>
                        `)
                    });
                }
                else{
                    // No element showed
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                window.location.href = `${domain}/500.html`
            }
        })
    }

    function searchMyHousesByName(){
        $("#search-bar").keyup(function(){
            const accessToken = getCookies(accessTokenKeyString);
            $.ajax({
                url : `${domain}/graphql/`,
                type: "POST",
                contentType: "application/json",
                dataType:"json",
                data: JSON.stringify({
                    query: `query{searchMyHousesByName(name:"${$("#search-bar").val()}"){uuid    name numberOfFloor description area    requestStatus  fullAddress  mainImage}}`
                }),
                headers:{
                    "Authorization":`JWT ${accessToken}`, 
                },
                success:function(result){
                    var houseArray = result.data.searchMyHousesByName;
                    $("#house-list-wrapper").empty();
                    if (houseArray.length > 0){
                        houseArray.forEach(element => {
                            $("#house-list-wrapper").append(`
                                <div class="part row" id="house-${element.uuid}">
                                    <div class="house-image-wrapper col-3">
                                        <img src="media/${element.mainImage}">
                                    </div>
                                    <div class="col">
                                        <div class="house-title-wrapper">
                                            <a href="/update-house.html?house_id=${element.uuid}"><h3 class="housename">${element.name} <span class="house-status">${element.requestStatus}</span></h3></a>
                                        </div>
                                        <div class="house-info-wrapper">
                                            <p class="field-info"><b>Address:</b> ${element.fullAddress}</p>
                                            <p class="field-info"><b>Area:</b> ${element.area} m2</p>
                                            <p class="field-info"><b>Number of room:</b> 0</p>
                                            <p class="field-info"><b>Number of floor:</b> ${element.numberOfFloor}</p>
                                            <p class="field-info"><b>Price:</b> 0 - 0</p>
                                            <p class="field-info"><b>Description:</b> ${element.description}</p>
                                        </div>
                                    </div>
                                </div>
                            `)
                        });
                    }
                    else{
                        // No element showed
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.location.href = `${domain}/500.html`
                }
            })
        })
    }

    function advancedSearch(){
        $("#find-button").click(function(){
            const accessToken = getCookies("accessToken");
            var districtId = $("#district-select").val();
            var wardId = $("#ward-select").val();
            var cityId = $("#city-select").val();
            var area = $("#area-input").val();
            var price = $("#price-input").val();
            var numberOfRoom = $("#number-of-room-input").val();
            
            $.ajax({
                url : `${domain}/graphql/`,
                type: "POST",
                contentType: "application/json",
                dataType:"json",
                data: JSON.stringify({
                    query: `query{housesAdvancedSearch(districtId:${districtId}, cityId:${cityId}, wardId:${wardId}, area:${area}, numberOfRoom: ${numberOfRoom}, price: ${price}){id    name numberOfFloor description area    requestStatus  fullAddress minRentalFee    maxRentalFee    numberOfRoom    mainImage{image}}}`
                }),
                headers:{
                    "Authorization":`JWT ${accessToken}`, 
                },
                success:function(result){
                    var houseArray = result.data.housesAdvancedSearch;
                    $("#house-list-wrapper").empty();
                    if (houseArray.length > 0){
                        houseArray.forEach(element => {
                            $("#house-list-wrapper").append(`
                                <div class="part row" id="house-${element.id}">
                                    <div class="house-image-wrapper col-3">
                                        <img src="media/${element.mainImage.image}">
                                    </div>
                                    <div class="col">
                                        <div class="house-title-wrapper">
                                            <a href="/update-house.html?house_id=${element.id}"><h3 class="housename">${element.name} <span class="house-status">${element.requestStatus}</span></h3></a>
                                        </div>
                                        <div class="house-info-wrapper">
                                            <p class="field-info"><b>Address:</b> ${element.fullAddress}</p>
                                            <p class="field-info"><b>Area:</b> ${element.area} m2</p>
                                            <p class="field-info"><b>Number of room:</b> ${element.numberOfRoom}</p>
                                            <p class="field-info"><b>Number of floor:</b> ${element.numberOfFloor}</p>
                                            <p class="field-info"><b>Price:</b> ${element.minRentalFee} - ${element.maxRentalFee}</p>
                                            <p class="field-info"><b>Description:</b> ${element.description}</p>
                                        </div>
                                    </div>
                                </div>
                            `)
                        });
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.location.href = `${domain}/500.html`
                }
            })
        })
    }

    toCreateHouse();
    advancedSearch();
    searchMyHousesByName();
    districtSelectChange();
    citySelectChange();
    getCitiesList();
    getHouseList();
})
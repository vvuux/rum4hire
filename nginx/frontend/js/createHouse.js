import {domain, accessTokenKeyString} from "./const.js";
import {getCookies, toErrorPage} from "./function.js";


$(document).ready(function(){

    const accessToken = getCookies(accessTokenKeyString);

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
            }
        })
    }

    function uploadFile(uuid, formData){
        formData.append("uuid",uuid);
        $.ajax({
            method: "POST",
            url: `${domain}/house/upload-images/`,
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "X-CSRFToken": getCookies("csrftoken"),
                "Authorization": `JWT ${accessToken}`
            },
            success: function(result){
                if (result.success === true){
                    console.log("Success");
                    window.location.replace(`${domain}/house-list-view.html`);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                if(jqXHR.status === 400){
                    let errors = jqXHR.responseJSON.errors;
                
                    if ($("#upload-room-image-errors").length !== 0){
                        $("#upload-room-image-errors").empty();        
                    }
                    
                    for (var key in errors){
                        $("#upload-room-image-errors").append(`<p class="error-message"> - ${key}: ${errors[key][0]}</p>`);
                    }
                    $("#upload-room-image-errors").attr("hidden",false);
                    $("#upload-room-image-error-title").attr("hidden",false);
                    if (mainImage === undefined){
                        $("#create-house-errors").append(`<p class="error-message"> - Main Image: This field is required </p>`);   
                    }
                    if (images.length === 0){
                        $("#create-house-errors").append(`<p class="error-message"> - Detail Images: This field is required </p>`);
                    }
                }
                else{
                    toErrorPage(jqXHR.status);
                }
            }
        })
    }
    
    function createHouse(){
        $(document).ready(function(){
            
            $("button#create-house-btn").click(function(){
                var name = $("#housename-input").val();
                var cityId = $("#city-select").val();
                var districtId = $("#district-select").val();
                var wardId = $("#ward-select").val();
                var address = $("#address-input").val();
                var numberOfFloor = $("#number-of-floor-input").val();
                var area = $("#area-input").val();
                var description = $("#description-textarea").val();
                var mainImage = $("#main-image-input").get(0).files[0];
                var images = $("#images-input").prop("files");

                var formData = new FormData();
                formData.append("main_image",mainImage);

                for (let i = 0; i < images.length; i++){
                    formData.append('detail_images',images[i]);
                }

                $.ajax({
                    url: `${domain}/graphql/`,
                    dataType: "json",
                    type:"POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        query: `mutation {createHouse(data:{name:"${name}", cityId:${cityId}, districtId:${districtId}, wardId:${wardId}, address: "${address}", area: ${area}, numberOfFloor: ${numberOfFloor}, description: "${description}"}){success	errors  data}}`,
                    }),
                    headers: {
                        "Authorization": `JWT ${accessToken}`,
                    },
                    success: function(result){
                        var errors = JSON.parse(result.data.createHouse.errors);
                        if (result.data.createHouse.success === true){
                            const uuid = JSON.parse(result.data.createHouse.data)                         
                            uploadFile(uuid.uuid, formData);
                        }
                        else {
                            
                            if ($("#create-house-errors").length !== 0){
                                $("#create-house-errors").empty();        
                            }
                            for (var key in errors){
                                $("#create-house-errors").append(`<p class="error-message"> - ${key}: ${errors[key][0]}</p>`);
                            }
                            $("#create-house-errors").attr("hidden",false);
                            $("#create-house-error-title").attr("hidden",false);
                            if (mainImage === undefined){
                                $("#create-house-errors").append(`<p class="error-message"> - Main Image: This field is required </p>`);   
                            }
                            if (images.length === 0){
                                $("#create-house-errors").append(`<p class="error-message"> - Detail Images: This field is required </p>`);
                            }
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        toErrorPage(jqXHR.status)
                    }
                })
            })            
        })
    }

    




    createHouse();
    getCitiesList();
    citySelectChange();
    districtSelectChange();
})
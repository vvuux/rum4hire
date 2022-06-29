import {domain, accessTokenKeyString} from "./const.js";
import {getCookies} from "./function.js";


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

                // var formData = new FormData();
                // formData.append("main_image",mainImage);

                // for (let i = 0; i < images.length; i++){
                //     formData.append('images',images[i]);
                // }


                // var imageObjects = {};                
                // for (let i = 0; i < images.length; i++){
                //     imageObjects[images[i].name] = imageToBase64String(images[i]);
                // }

                // var UploadedImages = JSON.stringify({
                //     images: imageObjects
                // })
                // console.log(UploadedMainImage);
                // console.log(UploadedImages);
                // console.log(typeof(UploadedImages));

                // $.ajax({
                //     url: `${domain}/graphql/`,
                //     dataType: "json",
                //     type:"POST",
                //     contentType: "multipart/form-data",
                //     data: JSON.stringify({
                //         query: `mutation {createHouse(data:{name:"${name}", cityId:${cityId}, districtId:${districtId}, wardId:${wardId}, address: "${address}", area: ${area}, numberOfFloor: ${numberOfFloor}, description: "${description}", mainImage: $mainImage, images: $images}){success	errors  data}}`,
                //     }),
                //     headers: {
                //         "Authorization": `JWT ${accessToken}`,
                //     },
                //     success: function(result){
                //         var errors = JSON.parse(result.data.createHouse.errors);
                //         if (result.data.createHouse.success === true){
                //             uploadFile(result.data.createHouse.houseId, formData, accessToken);
                //         }
                //         else {
                //             uploadFile(-1, formData, accessToken);
                //             if ($("#create-house-errors").length !== 0){
                //                 $("#create-house-errors").empty();        
                //             }
                            
                //             for (var key in errors){
                //                 $("#create-house-errors").append(`<p class="error-message"> - ${key}: ${errors[key][0]}</p>`);
                //             }
                //             $("#create-house-errors").attr("hidden",false);
                //             $("#create-house-error-title").attr("hidden",false);
                //         }
                //     },
                // })
            })            
        })
    }



    createHouse();
    getCitiesList();
    citySelectChange();
    districtSelectChange();
})
'use strict'
const HOST = 'http://localhost:8000';

// Sort by Name
$('#createShop').submit(function (event) {
    event.preventDefault();

    // create a json and send that to server
    let payload = {items: []};
    let tempStorage = {};
    $(this).serializeArray().forEach(item => {
        if (item.name == 'storeName') {
            payload.name = item.value;
        } else if (item.name == 'inputAddress') {
            payload.address = item.value;
        } else if (item.name == 'itemName') {
            tempStorage.name = item.value;
        } else if (item.name == 'itemPrice') {
            tempStorage.price = item.value;
        } else if (item.name == 'itemDescription') {
            tempStorage.description = item.value;
        } else {
            payload[item.name] = item.value;
        }
        if (Object.keys(tempStorage).length == 3) {
            payload.items.push(tempStorage);
            tempStorage = {};
        }
    });
    console.log(payload);
    $.ajax({
        type: "POST",
        url: `${HOST}/shop/create`,
        data: JSON.stringify(payload),
        success: function(data, status) {
            $('#notifyModal').modal('show');
        },
        dataType: 'json'
    });

});

$(document).ready(function () {
    var next = 0;
    $("#add-more").click(function (e) {
        e.preventDefault();
        var addto = `#new-fields`;
        next = next + 1;

        var newIn = `
           <div id="field'${next}">
              <div class="form-row col-md-6">
                <label for="itemName">Item Name</label>
                <input type="text" class="form-control" name="itemName">
              </div>
              <div class="form-row col-md-6">
                <label for="itemDescription">Item Description</label>
                <input type="text" class="form-control" name="itemDescription">
              </div>
              <div class="form-row col-md-6">
                <label for="itemPrice">Item Price</label>
                <input type="text" class="form-control" name="itemPrice">
              </div>
           </div>
        `;
        var newInput = $(newIn);
        $(addto).after(newInput);
    });
});

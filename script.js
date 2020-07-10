'use strict'
const HOST = 'http://localhost:8000';

// Sort by Name
$('#btnSort').click(function () {
    $('.card-deck .col-md-4').sort(function (a, b) {
        return $(a).find(".card .card-title").text() > $(b).find(".card .card-title").text() ? 1 : -1;
    }).appendTo(".card-deck");
})

// toggle closed store
$("#storeStatus").click(function () {
    // show only open store
    if (this.checked) {
        $('.card-deck').find('.card .card-footer .store-status:contains("Closed")').parent().parent().parent().addClass('d-none');
    } else {
        $('.card-deck').find('.card .card-footer .store-status:contains("Closed")').parent().parent().parent().removeClass('d-none');
    }
});

$(document).ready(function () {
    $.getJSON(`${HOST}/get_listing`)
    .done(function(data) {
        if (!data) {
            console.error('nothing to see here');
            return
        }
        let deliveryData = data[0];
        let result = [];
        let defaultImage = "./assets/images/placeholder-coffee.jpeg"
        deliveryData["results"].forEach(element => {
            let card = `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${element.media_url || defaultImage}")
                            class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <div class="card-text">${_.truncate(element.tagline, { length: 80 })}</div>
                            <a href="store_page.html#${element.slug}" class="stretched-link"></a>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted store-status">${element.hours.state}</small>
                        </div>
                    </div>
                </div>
            `;
            result.push(card);
        });
        $('.card-deck').append(result);
    });
});
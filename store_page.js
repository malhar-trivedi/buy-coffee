'use strict';
const HOST = 'http://localhost:8000';

$(document).ready(function () {
    let slug = window.location.hash.substr(1);
    if (!slug) {
        console.error('slug not present');
    }
    $.getJSON(`${HOST}/store/${slug}`)
    .done(function(data) {
        if (!data) {
            console.error('nothing to see here');
            return
        }
        let result = [];
        let defaultImage = "./assets/images/placeholder-coffee.jpeg"
        data.items.forEach(element => {
            let card = `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${element.media_url || defaultImage}")
                            class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                                <div class="card-text">${_.truncate(element.tagline, {length: 80})}</div>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted item-price">${element.price}</small>
                        </div>
                    </div>
                </div>
            `;
            result.push(card);
        });
        $('.card-deck').append(result);

        $('.store-title').append(`<h1>${data.name}</h1>`)
    });
});
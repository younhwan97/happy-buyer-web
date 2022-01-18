/* products */
function checkProductStatusOption(option){
    const optionValue = option.value

    if(optionValue === 'sale'){ // 판매 중


    } else if(optionValue === 'soldOut'){ // 품절


    } else { // 전체


    }

    changeView(option)

    function changeView(option){
        let options = document.querySelectorAll('.product-status-option')

        for(let i = 0; i < options.length; i++){
            options[i].classList.add('btn-light')
            options[i].classList.remove('btn-success')
        }

        option.classList.remove('btn-light')
        option.classList.add('btn-success')
    }
}

/* add product */
function uploadFile(){
    const image = document.querySelector('#product-image').files[0]

    const fd = new FormData()
    fd.append('file', image)

    // send `POST` request
    fetch('/api/upload', {
        method: 'POST',
        body: fd
    })
        .then(res => res.json())
        .then(json => {
            if(json.status === 'success'){
                let url = json.url
                addProduct(url)
            } else {
                console.log("fail")
            }
        })
        .catch(err => console.error(err));
}

function addProduct(u){
    let status = 1

    // get product data
    if($('#product-status-1').is(':checked'))
        status = 1
    else
        status = 0
    const category = $("#product-category option:selected").val()
    const name = $('#product-name').val()
    const price = $('#product-price').val()
    const url = u

    // send `POST` request
    fetch(`/api/addproduct`, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: status || 1,
            category: category || 'not',
            name: name || "-",
            price: price || 0,
            url: url || ""
        })
    })
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if(json.status === "success"){
                location.href = '/products'
            }
        })
        .catch(err => console.error(err));

}

function createDetailPrice(self){
    let price = $(self).val()
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    $('#price-detail').text(price+'원')
}

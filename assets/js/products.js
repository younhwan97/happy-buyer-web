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
function addProduct(){
    let status = 1
    if($('#product-status-1').is(':checked'))
        status = 1
    else
        status = 0
    const category = $("#product-category option:selected").val()
    const name = $('#product-name').val()
    const price = $('#product-price').val()

    fetch(`/api/addproduct`, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: status || 1,
            category: category,
            name: name || "-",
            price: price || 0,
        })
    })
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if(json.status === "success"){
                location.href = '/products'
            }
        });


    //
    // $.NotificationApp.send(
    //     "성공!",
    //     "상품이 성공적으로 추가되었습니다.",
    //     "top-right",
    //     "#9EC600",
    //     "Icon",
    //     hideAfter = '1000'
    // )
    //
    // setTimeout(()=>{
    //     location.href = '/products'
    // }, 1000)

}

function createDetailPrice(self){
    let price = $(self).val()
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    $('#price-detail').text(price+'원')
}
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

function removeProduct(){

}

/* add product */
function uploadFile(){
    const image = document.querySelector('#product-image').files[0] // 업르드할 상품 이미지

    const fd = new FormData()
    fd.append('file', image)

    // send `POST` request
    fetch('/api/upload', {
        method: 'POST',
        body: fd
    })
        .then(res => res.json())
        .then(json => {
            if(json.status === 'success'){ // 상품 이미지가 성공적으로 업로드 되었을 때
                let uploadFileUrl = json.url
                addProduct(uploadFileUrl)
            } else if(json.status === 'fail'){ // 상품 이미지가 업로드 되지 않았을 때
                $.NotificationApp.send(
                    "오류!",
                    "상품 이미지를 업로드 해주세요",
                    "top-right",
                    "#9EC600",
                    "error",
                    "3000",
                    "ture",
                    "slide"
                )
            } else {
                $.NotificationApp.send(
                    "오류!",
                    "알 수 없는 오류 발생",
                    "top-right",
                    "#9EC600",
                    "error",
                    "3000",
                    "ture",
                    "slide"
                )
            }
        })
        .catch(err => console.error(err))
}

function addProduct(uploadFileUrl){
    let status = 0 // 상품 (판매) 상태

    // get product data
    if($('#product-status-1').is(':checked')) status = 1
    const category = $("#product-category option:selected").val() // 상품 카테고리
    const name = $('#product-name').val() // 상품 이름
    const price = $('#product-price').val() // 상품 가격

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
            url: uploadFileUrl || ""
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
        .catch(err => console.error(err))
}

function createDetailPrice(self){
    let price = $(self).val()
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    $('#price-detail').text(price+'원')
}

function readImage(input){
    const previewImage = document.querySelector('#image-preview')

    if(input.files && input.files[0]){
        // FileReader 인스턴스 생성
        const reader = new FileReader()

        reader.onload = e => {
            previewImage.src = e.target.result
        }

        // reader 가 이미지를 읽도록 하기
        reader.readAsDataURL(input.files[0])
    } else {
        previewImage.src = ""
    }
}
// products
function checkProductStatusOption(option){
    const optionValue = option.value
    let myTable = $('#basic-datatable').DataTable();

    if(optionValue === 'sale'){ // 판매 중
        myTable.columns(1)
            .search('판매중')
            .draw();
    } else if(optionValue === 'soldOut'){ // 품절
        myTable.columns(1)
            .search('품절')
            .draw();

    } else { // 전체
        myTable.columns(1)
            .search('')
            .draw();
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

function checkProductCategoryOption(self){

    changeView(self)

    const productCategoryOptions = $('.product-category-option')
    let selectedCategories = ""

    for(let i = 0; i < productCategoryOptions.length; i++){
        if($(productCategoryOptions[i]).hasClass('btn-success')){
            if(!selectedCategories)
                selectedCategories += $(productCategoryOptions[i]).text()
            else
                selectedCategories = selectedCategories + "|" +$(productCategoryOptions[i]).text()
        }
    }

    let myTable = $('#basic-datatable').DataTable();
    myTable.columns(2)
        .search(selectedCategories, true, false)
        .draw();

    function changeView(self){
        if($(self).hasClass('btn-light')){
            $(self).removeClass('btn-light')
            $(self).addClass('btn-success')
        }else{
            $(self).addClass('btn-light')
            $(self).removeClass('btn-success')
        }
    }
}

function createProductUpdateModal(){
    const body = document.querySelector('#productUpdate-modalBody')
    body.innerHTML = `
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border avatar-md" role="status"></div>
                    </div>`


}

function updateProduct(){

}


function createProductDeleteModal(productId){
    $('#productRemove-modal').attr('data-product-id', productId)
}

function deleteProduct(){
    let productId = $('#productRemove-modal').attr('data-product-id')
    productId = Number(productId)

    // 상품 삭제를 위한 API 요청
    fetch(`/products/api`, {
        method : 'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId
        })
    })
        .then((res) => {
            return res.json()
        })
        .then((json) => {
            if(json.success){
                // 상품 제거 성공
                createView(productId)

                $.NotificationApp.send(
                    "성공",
                    "상품이 성공적으로 삭제되었습니다 :)",
                    "top-right",
                    "#9EC600",
                    "success",
                    "3000",
                    "ture",
                    "slide"
                )
            } else {
                // 상품 제거 실패
                if(json.hasRole){
                    // 제거할 상품 id가 제대로 전달되지 않은 경우

                } else {
                    // 상품을 제거할 권한이 없는 경우
                    $.NotificationApp.send(
                        "에러",
                        "상품을 제거할 권한이 없습니다 :(",
                        "top-right",
                        "#9EC600",
                        "error",
                        "3000",
                        "ture",
                        "slide"
                    )
                }
            }
        })
        .catch(err => console.error(err))

    function createView(productId){
        // 데이터 테이블 업데이트
        let myTable = $('#basic-datatable').DataTable();
        let productList = $('.product')

        for(let i = 0; i< productList.length; i++){
            let id = $(productList[i]).children('.product-id').text()
            id = Number(id)

            if (id === productId){
                myTable.row(productList[i]).remove().draw()
            }
        }
    }
}

// add-products
function uploadFile(){
    const image = document.querySelector('#product-image').files[0] // 업르드할 상품 이미지

    const fd = new FormData()
    fd.append('file', image)

    // send `POST` request
    fetch('/products/api/upload', {
        method: 'POST',
        body: fd
    })
        .then(res => res.json())
        .then(json => {
            if(json.success){ // 상품 이미지가 성공적으로 업로드 되었을 때
                let uploadFileUrl = json.url
                addProduct(uploadFileUrl)
            } else { // 상품 이미지가 업로드 되지 않았을 때
                if(json.hasRole){
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
                        "상품을 업로드할 권한이 없습니다!",
                        "top-right",
                        "#9EC600",
                        "error",
                        "3000",
                        "ture",
                        "slide"
                    )
                }
            }
        })
        .catch(err => console.error(err))
}

function addProduct(uploadFileUrl){
    let status = "품절" // 상품 (판매) 상태

    // get product data
    if($('#product-status-1').is(':checked')) status = "판매중"
    const category = $("#product-category option:selected").val() // 상품 카테고리
    const name = $('#product-name').val() // 상품 이름
    const price = $('#product-price').val() // 상품 가격

    // send `POST` request
    fetch(`/products/api/add`, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: status || "품절",
            category: category || '미선택',
            name: name || "-",
            price: price || 0,
            url: uploadFileUrl || ""
        })
    })
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if(json.success){
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
/* **********************상품관리********************** */
function clickedProductStatus(self) {
    /* toggle */
    let value = self.value
    self.classList.remove('btn-light')
    self.classList.add('btn-success')
    if (value === "product-status-filter-option-1") {
        // 전체보기
        document.querySelector('#product-status-filter-option-2').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-3').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-2').classList.add('btn-light')
        document.querySelector('#product-status-filter-option-3').classList.add('btn-light')
    } else if (value === "product-status-filter-option-2") {
        // 판매중
        document.querySelector('#product-status-filter-option-1').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-3').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-1').classList.add('btn-light')
        document.querySelector('#product-status-filter-option-3').classList.add('btn-light')
    } else if (value === "product-status-filter-option-3") {
        // 품절
        document.querySelector('#product-status-filter-option-1').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-2').classList.remove('btn-success')
        document.querySelector('#product-status-filter-option-1').classList.add('btn-light')
        document.querySelector('#product-status-filter-option-2').classList.add('btn-light')
    }
}

function clickedProductCategory(self) {
    /* toggle */
    let classList = self.classList
    if (classList.contains('btn-success')) {
        classList.remove('btn-success')
        classList.add('btn-light')
    } else {
        classList.remove('btn-light')
        classList.add('btn-success')
    }
}

/*********************************************************/

/*********************************************************/
/* **********************상품추가********************** */
$('#product-category').on('change', () => {
    /* 상품 추가 페이지에서 상품의 분류가 결정되었을 때 실행 */
    let value = $("#product-category option:selected").val();
    let data = null;
    switch (value) {
        case "Fruit":
            data = datasets.Fruit
            break;
        case "Meat":
            data = datasets.Meat
            break;
        case "Vegetable":
            data = datasets.Vegetable
            break;
        case "Seafood":
            data = datasets.Seafood
            break;
        case "Rice":
            data = datasets.Rice
            break;
        case "Water":
            data = datasets.Water
            break;
        case "Coffee":
            data = datasets.Coffee
            break;
        case "Chips":
            data = datasets.Chips
            break;
        case "Seasoning":
            data = datasets.Seasoning
            break;
        case "Ramen":
            data = datasets.Ramen
            break;
        case "Milk":
            data = datasets.Milk
            break;
        case "Wash":
            data = datasets.Wash
            break;
        case "Tissue":
            data = datasets.Tissue
            break;
        case "Kitchen":
            data = datasets.Kitchen
            break;
        case "Pets":
            data = datasets.Pets
            break;
    }

    let imagesOnServer = $('#images-on-server .row .col-3');
    for (let i = 0; i < data?.length; i++) {
        let temp = i % 4;
        /* 템픞릿을 이미지 찾아보기 모달에 추가 */
        let template = `
                <div class="card border-light border border-2 existed-product-image-container mb-2" onclick="clickedExistedImage(this)" ondblclick="dbClickedExistedImage(this)">
                    <img class="card-img-top existed-product-image p-0 w-100 h-100" src="${data[i].src}" alt="${data[i].kr}">
                    <div class="card-body p-2 border-top border-1 border-light">
                        <h5 class="card-title existed-product-image-label">
                            ${data[i].kr}
                        </h5>
                    </div>
                </div>
        `;
        $(imagesOnServer[temp]).append(template)
    }
})

$('#link-to-images-on-server, #link-to-images-on-client').on('click', () => {
    /* 이미지 찾아보기 모달의 네비게이션이 클릭되었을 때 실행 */
    let searchInModal = document.querySelector('#search-in-modal');

    let linkToImagesOnServer = $('#link-to-images-on-server');
    let isActive = $(linkToImagesOnServer).hasClass('active');

    if (isActive)
        $(searchInModal).removeClass('d-none')
    else
        $(searchInModal).addClass('d-none')

})

$('#search-in-modal').on("change", (e) => {
    /* 검색 기능 */
    let items = $('.existed-product-image-container')
    let inputValue = $(e.target).val()
    if (inputValue) {
        for (let i = 0; i < items.length; i++) {
            let itemName = $(items[i]).find('.existed-product-image-label').text()

            if (itemName.match(inputValue))
                $(items[i]).fadeIn()
            else
                $(items[i]).fadeOut()
        }
    } else {
        for (let i = 0; i < items.length; i++)
            $(items[i]).fadeIn()
    }
});

function clickedExistedImage(self) {
    let containers = $('.existed-product-image-container')
    for (let i = 0; i < containers.length; i++) {
        if ($(containers[i]).has('border-secondary'))
            $(containers[i]).removeClass('border-secondary').addClass('border-light')
    }
    $(self).addClass('border-secondary').removeClass('border-light')
}

function dbClickedExistedImage(self) {
    let preview = $('#file-previews')
    let data = {
        src : $(self).children('.card-img-top').attr('src'),
        alt : $(self).children('.card-img-top').attr('alt'),
        kr: $(self).find('.existed-product-image-label').text(),

    }
    let file = `
        <!-- file preview template -->
        <div id="uploadPreviewTemplate">
            <div class="card mt-1 mb-0 shadow-none border">
                <img src="${data.src}" alt="${data.alt}">
                <div class="card-body">
                    <h5 class="card-title">${data.kr}</h5>
                </div>
            </div>
        </div>
    `;

    $(preview).html(file)
}

// <div className="p-2">
//     <div className="row align-items-center">
//         <div className="col-auto">
//             <img data-dz-thumbnail src="${data.src}" className="avatar-xl rounded bg-light" alt="${data.alt}">
//         </div>
//         <!-- <div class="col ps-0">
//             <a href="javascript:void(0);" class="text-muted fw-bold" data-dz-name>${data.kr}</a>
//             <p class="mb-0" data-dz-size></p>
//         </div>
//         -->
//         <div className="col-auto">
//             <!-- Button -->
//             <a href className="btn btn-link btn-lg text-muted" data-dz-remove>
//                 <i className="dripicons-cross"></i>
//             </a>
//         </div>
//     </div>
// </div>



/*********************************************************/

/*********************************************************/
/* **********************DataSets********************** */
const datasets = {
    Fruit: [
        {eng: 'Apple', kr: '사과', src: './images/products/fruit/apple.jpg'},
        {eng: 'Banana', kr: '바나나', src: './images/products/fruit/banana.jpg'},
        {eng: 'Kiwi', kr: '키위', src: './images/products/fruit/kiwi.jpg'},
        {eng: 'Cherry', kr: '체리', src: './images/products/fruit/cherry.jpg'},
        {eng: 'Strawberry', kr: '딸기', src: './images/products/fruit/strawberries.jpg'},
        {eng: 'Mandarin', kr: '귤', src: './images/products/fruit/mandarin.jpg'},
        {eng: 'Melon', kr: '멜론', src: './images/products/fruit/melon.jpg'},
        {eng: 'Grape', kr: '포도', src: './images/products/fruit/grapes.jpg'},

    ],
    Meat: [],
    Vegetable: [
        {eng: 'Lettuce', kr: '상추', src: ''},
        {eng: 'NapaCabbage', kr: '배추', src: ''},
    ],
    Seafood: [],
    Rice: [],
    Water: [],
    Coffee: [],
    Chips: [],
    Seasoning: [],
    Ramen: [],
    Milk: [],
    Wash: [],
    Tissue: [],
    Kitchen: [],
    Pets: []
}
/*********************************************************/
/*********************************************************/
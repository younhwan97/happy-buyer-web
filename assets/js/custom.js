/*********************************************************/
/* **********************DataSets********************** */
const datasets = {
    Fruit: [
        {eng: 'Apple', kr: '사과', src: ''},
        {eng: 'Banana', kr: '바나나', src: ''},

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

/* 상품 관리 */
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


/* 상품 추가 */
function selectedCategory() {
    /* 이미지 select 에 새롭게 추가할 option 들을 정의한다. */
    let data = null
    let imgOptions = `<option selected disabled>선택</option>`;

    /* 선택된 카테고리를 가져온다. */
    let productCategory = document.querySelector('#product-category');
    const selectedValue = productCategory.options[productCategory.selectedIndex].value;
    document.querySelector("#findToImage").innerHTML = `${selectedValue} 이미지 찾기`


    /* 선택된 카테고리를 확인한다. */
    if (selectedValue === "Fruit") data = datasets.Fruit
    else if (selectedValue === "Meat") data = datasets.Meat
    else if (selectedValue === "Vegetable") data = datasets.Vegetable
    else if (selectedValue === "Seafood") data = datasets.Seafood
    else if (selectedValue === "Rice") data = datasets.Rice
    else if (selectedValue === "Water") data = datasets.Water
    else if (selectedValue === "Coffee") data = datasets.Coffee
    else if (selectedValue === "Chips") data = datasets.Chips
    else if (selectedValue === "Seasoning") data = datasets.Seasoning
    else if (selectedValue === "Ramen") data = datasets.Ramen
    else if (selectedValue === "Milk") data = datasets.Milk
    else if (selectedValue === "Wash") data = datasets.Wash
    else if (selectedValue === "Tissue") data = datasets.Tissue
    else if (selectedValue === "Kitchen") data = datasets.Kitchen
    else if (selectedValue === "Pets") data = datasets.Pets
    else data = datasets.Fruit

    for (let i = 0; i < data.length; i++)
        imgOptions += `<option value=${data[i].eng}>${data[i].kr}</option>`

    document.querySelector('#product-image').innerHTML = imgOptions
}

function selectedBasicImage(){
    let productImage = document.querySelector('#product-image');
    const selectedValue =productImage.options[productImage.selectedIndex].value;
    let imageUrl = `./images/test/${selectedValue}.jpg`


}

/*********************************************************/
/* **********************DataSets********************** */
const datasets = {
    Fruit: [
        {eng: 'Apple', kr: '사과', src: ''},
        {eng: 'Banana', kr: '바나나', src: ''},

    ],
    Vegetable: [
        {eng: 'Lettuce', kr: '상추', src: ''},
        {eng: 'NapaCabbage', kr: '배추', src: ''},
    ],
}
/*********************************************************/



/* add product */
function selectedCategory() {
    /* 이미지 select 에 새롭게 추가할 option 들을 정의한다. */
    let data = null
    let imgOptions = `<option selected disabled>선택</option>`;

    /* 선택된 카테고리를 가져온다. */
    let productCategory = document.querySelector('#product-category');
    const selectedValue = productCategory.options[productCategory.selectedIndex].value;

    /* 선택된 카테고리를 확인한다. */
    if (selectedValue === "Fruit") data = datasets.Fruit
    else if (selectedValue === "Vegetable") data = datasets.Vegetable
    else data = datasets.Fruit

    for (let i = 0; i < data.length; i++)
        imgOptions += `<option value=${data[i].eng}>${data[i].kr}</option>`

    document.querySelector('#product-image').innerHTML = imgOptions
}

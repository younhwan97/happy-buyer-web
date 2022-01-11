/* home */
function openOrderDetailModal(id){
    const orderId = id

    /* Modal label */
    let label = document.querySelector('#orderDetail-modalLabel');
    label.innerHTML = `주문 번호: ${orderId}`

    /* Modal body */
    fetch(`/api/order?id=${orderId}`)
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            createOrderDetailView(json.data) // view 생성
        });


    function createOrderDetailView(data){
        let view  = `<ul class="list-group list-group-flush">`

        for(let i= 0; i< data.length; i++){
            view += `<li class="list-group-item">${data[i].name}</li>`
        }
        view += `</ul>`

        let body = document.querySelector("#orderDetail-modalBody")
        body.innerHTML = view
    }
}
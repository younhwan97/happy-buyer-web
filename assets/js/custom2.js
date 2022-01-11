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
            console.log(json)
            createOrderDetailView(json.data, json.user) // view 생성
        });


    function createOrderDetailView(data, user){
        let view  = `<h5>주문 목록</h5><ul class="list-group list-group-flush">`
        let totalPrice = 0
        for(let i= 0; i< data.length; i++){
            let price = data[i].price
            totalPrice += price
            price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            view += `<li class="list-group-item d-flex justify-content-between align-items-center">${data[i].name}<span class="">${price}원</span></li>`
        }
        totalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">&nbsp;<span class="fw-bold font-18">${totalPrice}원</span></li></ul>`

        view += `<h5>고객 정보</h5><ul class="list-group list-group-flush">`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">이름</div>
                        ${user.name}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">배달 주소</div>
                        ${user.shippingAddress}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">포인트 번호</div>
                        ${user.pointNumber}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">요청 사항</div>
                        벨 누르고 문 앞에 놔주세요
                    </div>
                 </li>`
        view += `</ul>`

        let body = document.querySelector("#orderDetail-modalBody")
        body.innerHTML = view
    }
}
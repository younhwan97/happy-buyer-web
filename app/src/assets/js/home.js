/* home */
"use strict";

$(function() {
    $('input[name="order"]').daterangepicker({
        locale:{
            format: 'YYYY-MM-DD',
            // applyLabel: "적용",
            // cancelLabel: "닫기",
        },
        singleDatePicker: true,
        showDropdowns: false,
        autoUpdateInput: true,
        autoApply: true,
    }, (start, end, label) => {
        let timezoneOffset = new Date().getTimezoneOffset() * 60000
        start = new Date(new Date(start) - timezoneOffset)
        start = start.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
        location.href = `?ds=delivered&date=${start}`
    })
})

function openOrderDetailModal(id){
    const orderId = id

    /* Get data from server */
    fetch(`/api/order?id=${orderId}`)
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            /* Create detail view */
            createView(json.data, json.user) // view 생성
        });

    function createView(data, user){
        /* create label view */
        let label = document.querySelector('#orderDetail-modalLabel')
        let timezoneOffset = new Date().getTimezoneOffset() * 60000;
        let date = new Date(new Date(user.date) - timezoneOffset);
        date = date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(2,16)
        label.innerHTML = `<span onclick="window.print()" style="cursor:pointer">주문 번호: ${orderId} (${date})</span>`

        /* create body view */
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

        /* create footer view */
        view = `<Button class="btn btn-danger" type="button" data-bs-dismiss="modal">주문 취소</Button>`
        view += `<div class="p-0 m-0">`

        if (user.ds === "delivered"){
            view += `<Button class="btn btn-light mx-2" type="button" data-bs-dismiss="modal" disabled>배달 완료</Button>`
            view += `<Button class="btn btn-light" type="button" data-bs-dismiss="modal" disabled>배달 준비</Button>`
        } else {
            view += `<Button class="btn btn-light mx-2" type="button" data-bs-dismiss="modal">배달 완료</Button>`
            view += `<Button class="btn btn-light mx-2" type="button" data-bs-dismiss="modal">배달 준비</Button>`
        }

        view += `</div>`
        let footer = document.querySelector("#orderDetail-modalFooter")
        footer.innerHTML = view
    }
}
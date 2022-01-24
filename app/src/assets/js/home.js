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
    }, (start) => {
        let timezoneOffset = new Date().getTimezoneOffset() * 60000
        start = new Date(new Date(start) - timezoneOffset)
        start = start.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
        location.href = `?ds=delivered&date=${start}`
    })
})

function openOrderDetailModal(id){
    const orderId = id

    /* Get data from server */
    fetch(`/api/read/order?id=${orderId}`)
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if(json.success){
                createView(json.data, json.user) // 주문 상세 뷰 생성
            } else {
                $.NotificationApp.send(
                    "오류!",
                    "주문 상세 정보를 읽어올 수 없습니다.",
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

    function createView(data, user){
        let view = ''

        /* create label view */
        let timezoneOffset = new Date().getTimezoneOffset() * 60000;
        let date = new Date(new Date(user.date) - timezoneOffset);
        date = date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(2,16)
        view = `<span onclick="window.print()" style="cursor:pointer">주문 번호: ${orderId} (${date})</span>`

        const label = document.querySelector('#orderDetail-modalLabel')
        label.innerHTML = view

        /* create body view */
        view = `<h5>주문 목록</h5><ul class="list-group list-group-flush">`
        let totalPrice = 0
        for(let i= 0; i< data.length; i++){
            let price = data[i].price
            let countedPrice = price * data[i].count
            totalPrice += (data[i].price * data[i].count)
            price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            countedPrice = countedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            ${data[i].name}&nbsp;${data[i].count}개 
                            <div class="text-muted font-12"><span class="font-10">●</span>&nbsp;1개 가격: ${price}원</div>
                        </span>
                        <span>${countedPrice}원</span>
                    </li>`
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

        const body = document.querySelector("#orderDetail-modalBody")
        body.innerHTML = view

        /* create footer view */
        view = `<Button class="btn btn-danger" type="button" data-bs-dismiss="modal">주문 취소</Button>`
        view += `<div class="p-0 m-0">`

        if (user.ds !== "delivered"){
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal">배달 완료</Button>`
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal">배달 준비</Button>`
        } else {
            // view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal">배달 완료</Button>`
            // view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal">배달 준비</Button>`
        }

        view += `</div>`
        const footer = document.querySelector("#orderDetail-modalFooter")
        footer.innerHTML = view
    }
}
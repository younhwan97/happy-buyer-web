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
                        <div class="fw-bold">결제 방식</div>
                        ${user.payment}
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
                        ${user.request}
                    </div>
                 </li>`
        view += `</ul>`

        const body = document.querySelector("#orderDetail-modalBody")
        body.innerHTML = view

        /* create footer view */
        view = `<Button class="btn btn-danger" type="button" data-bs-dismiss="modal">주문 취소</Button>`
        view += `<div class="p-0 m-0">`

        if (user.ds === "received"){
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderId},'delivered')">배달 완료</Button>`
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderId},'confirmed')">배달 준비</Button>`
        } else if (user.ds === 'confirmed'){
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderId},'delivered')">배달 완료</Button>`
        }

        view += `</div>`
        const footer = document.querySelector("#orderDetail-modalFooter")
        footer.innerHTML = view
    }
}

function updateOrderStatus(id, status){
    fetch(`/api/update/order?id=${id}&status=${status}`)
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if(json.success){
                createView()
            } else {

            }
        })
        .catch(err => console.error(err))

    function createView(){
        let myTable = $('#order-datatable').DataTable()
        let orders = $('.order')

        for(let i = 0; i<orders.length; i++){
            const orderId = Number($(orders[i]).attr('data-order-id'))

            if(orderId === id){
                if(status === 'delivered'){
                    myTable.row(orders[i]).remove().draw()
                    $.NotificationApp.send(
                        "성공",
                        "주문 배달이 완료되었습니다.",
                        "top-right",
                        "#9EC600",
                        "success",
                        "3000",
                        "ture",
                        "slide"
                    )
                } else if(status === 'confirmed'){
                    const date = $(orders[i]).children('.order-date').html()
                    const shipping_address = $(orders[i]).children('.order-shipping-address').text()
                    const name = $(orders[i]).children('.order-name').text()
                    const status = `<i class="mdi mdi-circle text-info"></i> 배달 준비`
                    const detail = $(orders[i]).children('.order-detail').html()

                    let newData = [id, date, shipping_address, name, status, detail]
                    myTable.row(orders[i]).data(newData).draw()
                    $.NotificationApp.send(
                        "성공",
                        "주문 상태가 변경되었습니다.",
                        "top-right",
                        "#9EC600",
                        "success",
                        "3000",
                        "ture",
                        "slide"
                    )
                }
            }
        }
    }
}
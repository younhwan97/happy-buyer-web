/* home */
"use strict";

const socket = io()
socket.on("connect", () => {
    console.log("connection server");
});
socket.on('hello', (data) => {
    console.log("소켓으로부터 받은 데이터:" + data)
})

$(function () {
    $('input[name="order"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
            monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
            // applyLabel: "적용",
            // cancelLabel: "닫기",
        },
        singleDatePicker: true,
        showDropdowns: false,
        autoUpdateInput: true,
        autoApply: true,
        maxDate: new Date()
    }, (start) => {
        let timezoneOffset = new Date().getTimezoneOffset() * 60000
        start = new Date(new Date(start) - timezoneOffset)
        start = start.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
        location.href = `?ds=delivered&date=${start}`
    })
})

function createOrderDetailModal(id) {
    /* 주문 상세 모달에 로딩 스피너를 생성 */
    const modalBody = document.querySelector("#orderDetail-modalBody")
    modalBody.innerHTML = `<div class="d-flex justify-content-center">
                            <div class="spinner-border avatar-md" role="status"></div>
                           </div>`

    /* 서버에서 주문에 관한 상세 정보를 가져온다 */
    fetch(`/api/detail?id=${id}`)
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if (json.success) {
                // 주문 상세 정보를 받아오는데 성공
                if(id === json.order_info.order_id){
                    createView(json.order_info, json.products)
                }
            } else {
                // 주문 상세 정보를 받아오는데 실패
                if (json.hasRole) {
                    // 권한은 있으나 오류로 실패한 경우
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
                } else {
                    // 권한이 없어서 실패한 경우
                    $.NotificationApp.send(
                        "오류!",
                        "권한이 없습니다 : (",
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

    function createView(orderInfo, products) {
        let view = ''

        // 모달 상단에 들어갈 뷰 생성
        let timezoneOffset = new Date().getTimezoneOffset() * 60000;
        let date = new Date(new Date(orderInfo.date) - timezoneOffset);
        date = date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(2, 16)
        view = `<span onclick="window.print()" style="cursor:pointer">주문 번호: ${orderInfo.order_id} (${date})</span>`

        const label = document.querySelector('#orderDetail-modalLabel')
        label.innerHTML = view

        // 모달 중앙에 들어갈 뷰 생성
        view = `<h5>주문 목록</h5><ul class="list-group list-group-flush">`
        let totalPrice = 0
        for (let i = 0; i < products.length; i++) {
            let price = products[i].price
            let countedPrice = price * products[i].count
            totalPrice += (products[i].price * products[i].count)
            countedPrice = countedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            ${products[i].name}&nbsp;&nbsp;&nbsp;<strong>${products[i].count}</strong>개 
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
                        ${orderInfo.receiver}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">배달 주소</div>
                        ${orderInfo.address}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">연락처</div>
                        ${orderInfo.phone}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">결제 방식</div>
                        ${orderInfo.payment}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">포인트 번호</div>
                        ${orderInfo.point}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">결손품 처리 방식</div>
                        ${orderInfo.detective_handling_method}
                    </div>
                 </li>`
        view += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">요청 사항</div>
                        ${orderInfo.requirement}
                    </div>
                 </li>`
        view += `</ul>`

        const body = document.querySelector("#orderDetail-modalBody")
        body.innerHTML = view

        // 모달 하단에 들어갈 뷰 생성
        view = `<Button class="btn btn-danger" type="button" data-bs-dismiss="modal" onclick="deleteOrder(${orderInfo.order_id})">주문 취소</Button>`
        view += `<div class="p-0 m-0">`

        if (orderInfo.status === "주문접수") {
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderInfo.order_id}, '배달완료')">배달완료</Button>`
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderInfo.order_id}, '주문확인')">주문확인</Button>`
        } else if (orderInfo.status === "주문확인") {
            view += `<Button class="btn btn-light mx-1" type="button" data-bs-dismiss="modal" onclick="updateOrderStatus(${orderInfo.order_id}, '배달완료')">배달완료</Button>`
        }

        view += `</div>`
        const footer = document.querySelector("#orderDetail-modalFooter")
        footer.innerHTML = view
    }
}

function updateOrderStatus(id, status) {
    fetch(`/api?id=${id}&status=${status}`, {
        method: 'PUT'
    })
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if (json.success) {
                createView()
            } else {

            }
        })
        .catch(err => console.error(err))

    function createView() {
        let myTable = $('#order-datatable').DataTable()
        let orders = $('.order')

        for (let i = 0; i < orders.length; i++) {
            const orderId = Number($(orders[i]).attr('data-order-id'))

            if (orderId === id) {
                if (status === '배달완료') {
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
                } else if (status === '주문확인') {
                    const date = $(orders[i]).children('.order-date').html()
                    const shipping_address = $(orders[i]).children('.order-shipping-address').text()
                    const name = $(orders[i]).children('.order-name').text()
                    const status = `<i class="mdi mdi-circle text-info"></i> 주문확인`
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

function deleteOrder(id) {

    const fd = new FormData()
    fd.append('id', id)

    fetch(`/api`, {
        method: 'DELETE',
        body: fd
    })
        .then((res) => {
            return res.json(); // Promise 반환
        })
        .then((json) => {
            if (json.success) {
                createView()
            } else {

            }
        })
        .catch(err => console.error(err))

    function createView() {
        let myTable = $('#order-datatable').DataTable()
        let orders = $('.order')

        for (let i = 0; i < orders.length; i++) {
            const orderId = Number($(orders[i]).attr('data-order-id'))

            if (orderId === id) {
                myTable.row(orders[i]).remove().draw()
                $.NotificationApp.send(
                    "성공",
                    "주문이 취소되었습니다.",
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
$(document).ready(function () {
    "use strict";

    $("#basic-datatable").DataTable({
        keys: !0,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>"
            },
            emptyTable: "데이터가 없습니다",
            info: "_START_ - _END_ \/ _TOTAL_",
            infoEmpty: "0 - 0 \/ 0",
            infoFiltered: "(총 _MAX_ 개)",
            infoThousands: ",",
            lengthMenu: "_MENU_ 개씩 보기",
            loadingRecords: "읽는중...",
            processing: "처리중...",
            search: "검색:",
            zeroRecords: "검색 결과가 없습니다",
        },
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded")
        },
        lengthMenu:[10,20,30,40,50,100],
        displayLength: 20,
        info: false,
        ordering: false, // 정렬 기능 숨기기
    });

    $("#order-datatable").DataTable({
        keys: !0,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>"
            },
            emptyTable: "데이터가 없습니다",
            info: "_START_ - _END_ \/ _TOTAL_",
            infoEmpty: "0 - 0 \/ 0",
            infoFiltered: "(총 _MAX_ 개)",
            infoThousands: ",",
            lengthMenu: "_MENU_ 개씩 보기",
            loadingRecords: "읽는중...",
            processing: "처리중...",
            search: "검색:",
            zeroRecords: "검색 결과가 없습니다",
        },
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded")
        },
        lengthMenu:[10,20,30,40,50,100],
        displayLength: 20,
        info: false,
        ordering: false, // 정렬 기능 숨기기
    });
});
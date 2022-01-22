$(document).ready(function () {
    "use strict";

    $("#basic-datatable").DataTable({
        keys: !0,
        language: {paginate: {previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>"}},
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
        language: {paginate: {previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>"}},
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded")
        },
        lengthMenu:[10,20,30,40,50,100],
        displayLength: 20,
        info: false,
        ordering: false, // 정렬 기능 숨기기
    });
});
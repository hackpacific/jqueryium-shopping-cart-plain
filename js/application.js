var isMobile = false;
var card;
var offsetX;
var offsetY;

var itemProperty = function (name, price) {
    this.itemName = name;
    this.itemPrice = price;
};

var itemPropertyArr = [new itemProperty("Salmon", 60)];

var createItemEntry = function (item) {
    var itemHTML = $("<tr class='item'>" +
        "<td class='product'>" + item["itemName"] + "</td>" +
        "<td class='price'>$" + item["itemPrice"].toFixed(2) + "</td>" +
        "<td class='quantity'>" +
        "<input name='quantity' type='number' placeholder='Quantity' class='form-control' />" +
        "</td>" +
        "<td class='remove'>" +
        "<button class='btn btn-danger'>Remove</button>" +
        "</td>" +
        "<td class='total'>$--.--</td>" +
        "</tr>");
    itemHTML.appendTo("#itemList tbody");
}

var convertPrice = function (price) {
    var regexp = /[\d | .]+/g;
    var float = Number(parseFloat(price.match(regexp)).toFixed(2));
    if (float) {
        return float;
    }
    return 0;
}

var calcItemTotal = function (quantity, price) {
    var priceNum = convertPrice(price);
    return quantity > 0 ? (quantity * priceNum).toFixed() : "--.--";
};

var getFullTotal = function () {
    var totals = [];
    var total = 0;

    totals = $(".total").map(function (index, element) {
        return convertPrice($(element).text());
    }).get();

    if (totals.length === 0) {
        return displayTotal(0);
    }

    total = totals.reduce((x, y) => {
        return x + y;
    });

    displayTotal(total);
};

var displayTotal = function (total) {
    $("#totalPrice").html("Total Price: $" + total);
};

var changeQuantity = function () {
    clearTimeout(timeout);
    var timeout = setTimeout(() => {
        var itemTotal = calcItemTotal($(this).val(), $(this).parent().siblings(".price").text());
        $(this).parent().siblings(".total").text("$" + itemTotal);
        getFullTotal();
    }, 1000);
};

var createItem = function () {
    event.preventDefault();
    var name = $(this).find("[name=productName]").val();
    var price = parseFloat($(this).find("[name=productCost]").val());
    createItemEntry(new itemProperty(name, price));

    $(this).find("[name=productName]").val("");
    $(this).find("[name=productCost]").val("");
};

var removeItem = function () {
    $(this).closest(".item").remove();
    getFullTotal();
};

var mouseDown = function (event) {
    card = document.getElementById("addProduct");
    offsetY = ((event.pageY) - card.offsetTop) - card.offsetHeight;
    offsetX = event.pageX - card.offsetLeft;
    $(window).on("mousemove", mouseMove);
};

var mouseMove = function () {
    card.style.left = Math.min(window.innerWidth - card.offsetWidth, (event.pageX - offsetX)) + "px";
    card.style.bottom = window.innerHeight - ((event.pageY) - parseInt(offsetY)) + "px";
};

var mouseUp = function () {
    $(window).off("mousemove", mouseMove);
};

var totalPricePosition = function() {
    if(window.innerWidth <= 768 && !isMobile) {
        $("#itemList").after($("#totalPrice"));
        isMobile = true;
    }

    if(window.innerWidth > 768 && isMobile) {
        $("#addProduct").after($("#totalPrice"));
        isMobile = false;
    }
    
}

var createEventListeners = function () {
    $(document).on("click", ".remove .btn", removeItem);
    $(document).on("input", ".quantity input", changeQuantity);
    $("#productForm").on("submit", createItem);
    $("#addProduct .card-header").on("mousedown", mouseDown);
    $("#addProduct .card-header").on("mouseup", mouseUp);
    $(window).on("resize", totalPricePosition);
};

$(document).ready(function () {
    itemPropertyArr.forEach(function (item) {
        createItemEntry(item);
    });

    totalPricePosition();
    createEventListeners();
});
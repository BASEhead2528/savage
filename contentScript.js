var Commands = {
    "GetItemLink":"GetItemLink",
    "AddItemToCart":"AddItemToCart",
    "Checkout":"Checkout"
}

//listen for commands
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.command && request.command == Commands.GetItemLink){
        sendResponse({productLink:$("img[alt='"+request.productCode+"']").parent().attr("href")})
    }

    if(request.command && request.command == Commands.AddItemToCart){
        $("input[type='submit']")[0].click();
        setTimeout(function(){
            $("a.button.checkout")[0].click()
        },600);
        sendResponse({result:"success"});
    }

    if(request.command && request.command == Commands.Checkout){
        var checkoutData = request.checkoutData;

        $("#order_billing_name").val(checkoutData.Name);
        $("#order_email").val(checkoutData.Email );
        $("#order_tel").val(checkoutData.Phone);
        $("#bo").val(checkoutData.AddressOne);
        $("#oba3").val(checkoutData.AddressTwo);
        $("#order_billing_zip").val(checkoutData.Zip);
        $("#order_billing_city").val(checkoutData.City)
        $("#order_billing_state").val(checkoutData.State);
        $("#order_billing_country").val(checkoutData.Country);
        $("#nnaerb").val(checkoutData.CC_Number);
        $("#credit_card_month").val(checkoutData.CC_Month);
        $("#credit_card_year").val(checkoutData.CC_Year);
        $("#orcer").val(checkoutData.CC_CVV);
        $(".icheckbox_minimal").click();

        setTimeout(function(){$("#pay input").click()},2000)
    }
});


var Commands = {
    "GetItemLink":"GetItemLink",
    "AddItemToCart":"AddItemToCart",
    "Checkout":"Checkout"
}

//listen for commands
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.command && request.command == Commands.GetItemLink){
        var productLink = $("img[alt='"+request.productCode+"']").parent().attr("href");
        if(productLink && productLink != null){
            sendResponse({productLink:productLink})
        }
        else{
            //We don't care to send response because we are reloading and triggering an event on event page
            window.location.reload();
        }
    }

    if(request.command && request.command == Commands.AddItemToCart){

        if($("input[type='submit']").length > 0)
        {
            $("input[type='submit']")[0].click();


            //Want to click the checkout button as fast as possible and if its not
            //there we try again we have to account for lag
            var cartButtonInterval = setInterval(waitForButton,100)

            function waitForButton(){
                //is the cart hidden
                if($("#cart.hidden").length <= 0){
                    //once cart is NOT hidden stop interval and click the cutton
                    $("a.button.checkout")[0].click();
                    clearInterval(cartButtonInterval);
                    sendResponse({result:"success"});
                }
            }

        }else{
            sendResponse({result:"failure",reason:"item sold out"});
        }
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


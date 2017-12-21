
var SavageBot = {
    "CashOutData":{},
    "ProductData":{},
    "State":"sleeping",
    "States": {
        "sleeping":"sleeping",
        "readyToGo":"readyToGo",
        "Go":"Go",
        "AddItemToCart":"AddItemToCart",
        "Checkout":"Checkout"
    },
    "Locations": {
        "main": "/shop",
        "jackets": "/shop/all/jackets",
        "tops/sweaters": "/shop/all/tops_sweaters",
        "sweatshirts": "/shop/all/sweatshirts",
        "pants": "/shop/all/pants",
        "hats": "/shop/all/hats",
        "bags": "/shop/all/bags",
        "accessories": "/shop/all/accessories",
        "skate": "/shop/all/skate"
    },
    "Errors": [],
    "ShowProductForm": "true",
    "tabId":"-1"
};

function getSavedUserDetails(callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get((userDetails) => {
    callback(chrome.runtime.lastError ? null : userDetails);
  });
}

function saveUserDetails(userDetails) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(userDetails);
}

$("#svg_save").click(function(){
    SavageBot.CashOutData.Name = $("#svg_name").val();
    SavageBot.CashOutData.Email = $("#svg_email").val();
    SavageBot.CashOutData.Phone = $("#svg_phone").val();
    SavageBot.CashOutData.AddressOne = $("#svg_adr1").val();
    SavageBot.CashOutData.AddressTwo = $("#svg_adr2").val();
    SavageBot.CashOutData.Zip = $("#svg_zip").val();
    SavageBot.CashOutData.City = $("#svg_city").val();
    SavageBot.CashOutData.State = $("#svg_state").val();
    SavageBot.CashOutData.Country = $("#svg_country").val();
    SavageBot.CashOutData.CC_Number = $("#svg_cc_number").val();
    SavageBot.CashOutData.CC_Month = $("#svg_cc_month").val();
    SavageBot.CashOutData.CC_Year = $("#svg_cc_year").val();
    SavageBot.CashOutData.CC_CVV = $("#svg_cc_cvv").val();
    SavageBot.ProductData.Code = $("#svg_product_code").val();
    SavageBot.ProductData.Size = $("#svg_size").val();
    SavageBot.ProductData.Category = $("#svg_category").val();
    $("#svg_options").hide();
    $("#svg_topButtons").show();

    chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
        SavageBot.tabId = tabs[0].id;
        SavageBot.State = SavageBot.States.readyToGo;
        saveUserDetails(SavageBot);
        if(tabs[0].url.indexOf("supremenewyork.com") == -1){
            chrome.tabs.update( tabs[0].id, { url: "https://supremenewyork.com/shop" } ); 
        }
    });
});

$("#svg_edit").click(function(){
    $("#svg_options").show();
    $("#svg_topButtons").hide();
});

$("#svg_go").click(function(){
    $("#svg_topButtons").hide();
    $("#svg_runningButtons").show();

    chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
        SavageBot.State = SavageBot.States.Go;
        saveUserDetails(SavageBot);
        chrome.tabs.update( tabs[0].id, 
            { url: "https://www.supremenewyork.com" + SavageBot.Locations[SavageBot.ProductData.Category.toLowerCase()]}
        ); 
    });


});

$("#svg_stop").click(function(){
    $("#svg_topButtons").show();
    $("#svg_runningButtons").hide();
    SavageBot.State = SavageBot.States.sleeping;
    saveUserDetails(SavageBot);
});

document.addEventListener('DOMContentLoaded', () => {
    getSavedUserDetails((userDetails) => {
        if(userDetails.CashOutData){
            SavageBot = userDetails;
            $("#svg_name").val(SavageBot.CashOutData.Name);
            $("#svg_email").val(SavageBot.CashOutData.Email);
            $("#svg_phone").val(SavageBot.CashOutData.Phone );
            $("#svg_adr1").val(SavageBot.CashOutData.AddressOne);
            $("#svg_adr2").val(SavageBot.CashOutData.AddressTwo);
            $("#svg_zip").val(SavageBot.CashOutData.Zip );
            $("#svg_city").val(SavageBot.CashOutData.City);
            $("#svg_state").val(SavageBot.CashOutData.State);
            $("#svg_country").val(SavageBot.CashOutData.Country);
            $("#svg_cc_number").val(SavageBot.CashOutData.CC_Number);
            $("#svg_cc_month").val(SavageBot.CashOutData.CC_Month);
            $("#svg_cc_year").val(SavageBot.CashOutData.CC_Year );
            $("#svg_cc_cvv").val(SavageBot.CashOutData.CC_CVV);
            $("#svg_product_code").val(SavageBot.ProductData.Code);
            $("#svg_size").val( SavageBot.ProductData.Size );
            $("#svg_category").val(SavageBot.ProductData.Category);
        }
    });
});



var SavageBot = {};

var Commands = {
    "GetItemLink":"GetItemLink",
    "AddItemToCart":"AddItemToCart",
    "Checkout":"Checkout"
}

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

// chrome.tabs.onCreated.addListener(function(data){
//     console.log(data);
    
// })

chrome.tabs.onUpdated.addListener((tabID,status,tabDetails)=>{
    //not proud of this code, just saying. built fast fuck it. 
    if(tabDetails.status == "complete"){
        getSavedUserDetails((data) =>{
            SavageBot = data
            //Content script injected on page and ready to use
            if(tabID == SavageBot.tabId && 
                (SavageBot.State == SavageBot.States.Go || SavageBot.State == SavageBot.States.AddItemToCart || SavageBot.States.Checkout)){
                
                if(SavageBot.State == SavageBot.States.Go){
                    chrome.tabs.executeScript(tabID,{ file: "contentScript.js"},function(){
                        //Get the product link from the product code and navigate
                        chrome.tabs.sendMessage(tabID, {command: Commands.GetItemLink, productCode: SavageBot.ProductData.Code}, function(response) {
                            //CatchErrors
                            //have to change state so that next time this event is fired it knows not to repeat this block
                            //again I'm not proud of this. will clean up later
                            if(response && response.productLink){
                                SavageBot.State = SavageBot.States.AddItemToCart;
                                saveUserDetails(SavageBot);
                                chrome.tabs.update( tabID, 
                                    { url: "https://www.supremenewyork.com" + response.productLink }
                                ); 
                            }
                        });
                    });
                }else if(SavageBot.State == SavageBot.States.AddItemToCart){
                     chrome.tabs.executeScript(tabID,{ file: "contentScript.js"},function(){
                        //have to change state so that next time this event is fired it knows not to repeat this block
                        //again I'm not proud of this. will clean up later
                        SavageBot.State = SavageBot.States.Checkout;
                        saveUserDetails(SavageBot);
                        //Add the item to the cart and navigate to cart
                        chrome.tabs.sendMessage(tabID, {command: Commands.AddItemToCart, size: SavageBot.ProductData.Size}, function(response) {
                            if(response && response.result === "failure")
                            {
                                SavageBot.State = SavageBot.States.sleeping;
                                saveUserDetails(SavageBot);
                            }
                        });
                    });
                }else if(SavageBot.State == SavageBot.States.Checkout){
                     chrome.tabs.executeScript(tabID,{ file: "contentScript.js"},function(){
                        //Add the item to the cart and navigate to cart
                        chrome.tabs.sendMessage(tabID, { command: Commands.Checkout, checkoutData: SavageBot.CashOutData }, function(response) {
                            SavageBot.State = SavageBot.States.sleeping;
                            saveUserDetails(SavageBot);
                        });
                    });
                }
                
            }
        });
    }
    

    

})


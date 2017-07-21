'use strict';
function printReceipt(inputs) {
  let cartItems = buildItems(inputs);
  let subtotalItems = getPromotions(cartItems);
  let Receipt = getTotal(subtotalItems);
  let printStr = printItems(Receipt);
  console.log(printStr);
}

function buildItems(inputs) {

  let allitems = loadAllItems();
  let cartItems = [];

  for (let input of inputs) {
    let inputsplit = input.split("-");
    let barcode = inputsplit[0];
    let counts = parseFloat(inputsplit[1] || 1);

    let cartitem = cartItems.find((cartitem) => cartitem.item.barcode === barcode);
    if (cartitem){
      cartitem.count += counts;
    }
    else {
      let item = allitems.find((item) => item.barcode === barcode);
      cartItems.push({item: item, count: counts});
    }
  }

  return cartItems;
}

function getPromotions(cartItems) {

  return cartItems.map(cartitem => {

    let promotion, promotionsType;
    let promotionItems = loadPromotions();

    promotion = promotionItems.find((promotion) => promotion.barcodes.includes(cartitem.item.barcode));

    if (promotion) {
      promotionsType = promotion.type;
    }
    else {
      promotionsType = '';
    }
    let saved, subtotal;
    let discount=0;
    if (promotionsType === 'BUY_TWO_GET_ONE_FREE')
      discount = parseInt(cartitem.count / 3);
    saved = cartitem.item.price * discount;
    subtotal = cartitem.item.price * (cartitem.count-discount);

    return {cartitem, saved, subtotal};
  })
}

function getTotal(subtotalItems) {
  let Total = 0;
  let savedTotal = 0;
  for (let subtotalitem of subtotalItems) {
    Total += subtotalitem.subtotal;
    savedTotal += subtotalitem.saved;
  }
  return {subtotalItems, Total, savedTotal};
}

function printItems(Receipt) {
  let receiptString = "***<没钱赚商店>收据***";
  let itemsArray = Receipt.subtotalItems;
  for (let itemArray of itemsArray) {
    receiptString += '\n名称：' + itemArray.cartitem.item.name + '，数量：' + itemArray.cartitem.count + itemArray.cartitem.item.unit + '，单价：' + itemArray.cartitem.item.price.toFixed(2) + '(元)，小计：' + itemArray.subtotal.toFixed(2) + '(元)';
  }
  receiptString += '\n----------------------' + '\n总计：' + Receipt.Total.toFixed(2) + '(元)' + '\n节省：' + Receipt.savedTotal.toFixed(2) + '(元)' + '\n**********************';
  return receiptString;
}

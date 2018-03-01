// var nodes = document.getElementsByClassName('account-table__column account-table__column--span-5');
var nodes = document.getElementsByClassName('account-table__row account-table__row--body _align-start-center _layout-row account-table__row--striped');
for (var i = 0; i < nodes.length; i++) {
  var text = nodes[i].childNodes[2].childNodes[2].innerText;
  // var text = nodes[i].childNodes[2].innerText;
  if (text.includes('+46720101555') == false) {
    // nodes[i].remove();
    nodes[i].style.display = 'none';
  }
}

function handleSubmit(){
  console.log("In handle submit");
  var value = document.getElementById('urlTarget').value;
  chrome.storage.local.get('urlMappings', function(object){
    if (!object.urlMappings) {
      object.urlMappings = [];
    }
    object.urlMappings.push(value);
    chrome.storage.local.set({ urlMappings: object.urlMappings }, function(){
      // alert('settings saved successfully!');
    })
  })
}
function deleteItem(e){
  // console.log("in loaded");
  chrome.storage.local.get('urlMappings', function(object){
    if (!object.urlMappings) {
      object.urlMappings = [];
    }
    object.urlMappings.splice(e.target.id, 1);
    chrome.storage.local.set({ urlMappings: object.urlMappings }, function(){
      // alert('settings saved successfully!');
    });
  });
}

function populateListWithItems(values) {
  var list = values || [];
  var ul = document.createElement('ul');
  list.forEach(function(v, index){
    var li = document.createElement('li');
    li.innerText = v;
    li.id = index;
    li.addEventListener('click', deleteItem)
    ul.appendChild(li);
  });
  var listEl = document.getElementById('listOfUrls');
  if (listEl.firstChild) {
    listEl.replaceChild(ul, listEl.firstChild);
  } else {
    listEl.appendChild(ul);
  }
}

chrome.storage.local.get('urlMappings', function(object){
  populateListWithItems(object.urlMappings);
})

// document.getElementsByTagName('body')[0].addEventListener('load', loaded);
document.getElementById('submit').addEventListener('click', handleSubmit);
chrome.storage.onChanged.addListener(function(object, area){
  if (area === 'local' && object.urlMappings) {
    chrome.storage.local.get('urlMappings', function(object){
      populateListWithItems(object.urlMappings);
    });
  }
})
// document.getElementById('viewUrls').addEventListener('click', viewUrls);
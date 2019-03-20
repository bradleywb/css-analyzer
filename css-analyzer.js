$('#cssProcessor').submit(function (evt) {
  evt.preventDefault();

  $('#count').text('');
  $('#results').html('');

  if (!$('#stylesheetUrl').val()) return;

  $.get($('#stylesheetUrl').val()).then(function (res) {
    let rules = processCss(res);
    let fontSizes = getProperty(rules, 'fontSize');

		$('#count').text(fontSizes.length + ' results');

    fontSizes.forEach(function (item) {
      $('#results').append('<li>' + item.selector + ' { font-size: ' + item.fontSize + ' }</li>');
    });
  });
});

function processCss(css) {
  if (!css || typeof css !== 'string') return;
  
  let doc = document.implementation.createHTMLDocument("");
  let styleElement = document.createElement("style");

  styleElement.textContent = css;
  // the style will only be parsed once it is added to a document
  doc.body.appendChild(styleElement);
    
  return styleElement.sheet.cssRules;
}

function getProperty(rules, property) {
  if (!rules || rules.length < 1 || !property || typeof property !== 'string') return;

	let ret = [];
  
  for (let i=0; i<rules.length; i++) {
    if (rules[i].selectorText && rules[i].style[property]) {
      let obj = {
        selector: rules[i].selectorText,
        fontSize: rules[i].style[property]
      };
        
      ret.push(obj);
    }
  }
  
  return ret;
}
// Google Apps Script backend for the Ethel & Niño RSVP form.
// Setup instructions are in rsvp-backend-setup.txt in this same folder.

function doPost(e) {
  var sheet = getSheet_();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.response || '',
    Number(data.guests) || 1,
    data.message || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = getSheet_();
  var result = { confirmed: [], confirmedCount: 0, totalGuests: 0 };
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    var rows = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    rows.forEach(function (row) {
      var name = row[1];
      var response = row[3];
      var guests = Number(row[4]) || 1;
      if (response === 'Accept' && name) {
        result.confirmed.push({ name: name, guests: guests });
        result.confirmedCount += 1;
        result.totalGuests += guests;
      }
    });
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RSVP');
  if (!sheet) {
    sheet = ss.insertSheet('RSVP');
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Response', 'Guests', 'Message']);
  }
  return sheet;
}

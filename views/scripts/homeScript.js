$(document).ready(function() {
    $.ajax({
      url: "/databaseName",
      success: function(response) {
        $("#databaseName").val(response);
      }
    });

    $.ajax({
      url: "/tableList",
      success: function(response) {
        var tableList = response;
        var selectOptions = "";
        for (var i = 0; i < tableList.length; i++) {
          selectOptions += "<option>" + tableList[i] + "</option>";
        }
        $("#tableList").html(selectOptions);
      }
    });
  });

  function showTableContent() {
    var selectedTable = $("#tableList").val();
    window.location.href = "/tableContent?table=" + selectedTable;
  }

  function sendQuery() {
    var query = $('#sqlQuery').val();
    $.ajax({
        url: "/executeQuery",
        method: "POST",
        data: { query: query },
        success: function(response) {
          $('#resultContainer').empty();

          if (response.error) {
            $('#resultContainer').html('<div class="alert alert-danger">' + response.error + '</div>');
          } else {
            var result = response.result;

            if (result.length === 0) {
              $('#resultContainer').html
              ('<div class="alert alert-info">No records found.</div>');
            } else {
            var table = $('<table class="table table-bordered">');
              var thead = $('<thead>');
          var headerRow = $('<tr>');
          var headers = Object.keys(result[0]);
          for (var i = 0; i < headers.length; i++) {
            headerRow.append('<th>' + headers[i] + '</th>');
          }
          thead.append(headerRow);
          table.append(thead);

          var tbody = $('<tbody>');
          for (var j = 0; j < result.length; j++) {
            var dataRow = $('<tr>');
            for (var k = 0; k < headers.length; k++) {
              dataRow.append('<td>' + result[j][headers[k]] + '</td>');
            }
            tbody.append(dataRow);
          }
          table.append(tbody);

          $('#resultContainer').append(table);
        }
      }
    },
    error: function(xhr, status, error) {
      $('#resultContainer').html('<div class="alert alert-danger">An error occurred: ' + error + '</div>');
    }
  });
}
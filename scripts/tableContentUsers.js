function populateTable() {
    $.ajax({
      url: '/api/users',
      method: 'GET',
      success: function(data) {
        $('tbody').empty();
  
        data.forEach(function(record) {
          var row = $('<tr>');
          row.append('<td>' + record.firstname + '</td>');
          row.append('<td>' + record.lastname + '</td>');
          row.append('<td>' + record.email + '</td>');
          row.append('<td>' + record.password + '</td>');
          row.append('<td>' + record.nickname + '</td>');
          row.append('<td><button type="button" class="btn btn-primary btn-edit" data-id="' + record.id + '">Edit</button> <button type="button" class="btn btn-danger btn-delete" data-id="' + record.id + '">Delete</button></td>');
          $('tbody').append(row);
        });
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
  
  function addRecord(data) {
    $.ajax({
      url: '/api/users',
      method: 'POST',
      data: data,
      success: function() {
        $('#modal-form').modal('hide');
        populateTable();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
  
  function deleteRecord(id) {
    $.ajax({
      url: '/api/users/' + id,
      method: 'DELETE',
      success: function() {
        populateTable();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
  
  function updateRecord(id, data) {
    $.ajax({
      url: '/api/users/' + id,
      method: 'PUT',
      data: data,
      success: function() {
        $('#modal-form').modal('hide');
        populateTable();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
  
  $(document).ready(function() {
    populateTable();
  
    $('.btn-add').click(function() {
      $('#modal-form').modal('show');
      $('#form-record').trigger('reset');
      $('#modal-form-label').text('Add Record');
      $('#input-record-id').val('');
    });
  
    $(document).on('click', '.btn-edit', function() {
    var id = $(this).data('id');
    $('#modal-form').modal('show');
    $('#modal-form-label').text('Edit User');
  
    $.ajax({
      url: '/api/users/' + id,
      method: 'GET',
      success: function(data) {
        $('#input-record-id').val(id); // Update the hidden input field with the ID
        $('#input-firstname').val(data.firstname);
        $('#input-lastname').val(data.lastname);
        $('#input-email').val(data.email);
        $('#input-password').val(data.password);
        $('#input-nickname').val(data.nickname);
        // Update the form action URL
        $('#form-record').attr('action', '/api/users/' + id);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
  
  
    // Add event handler for form submission
    $('#form-record').submit(function(event) {
      event.preventDefault();
     
      var id = $('#input-record-id').val();
      var data = {
        firstname: $('#input-firstname').val(),
        lastname: $('#input-lastname').val(),
        email: $('#input-email').val(),
        password: $('#input-password').val(),
        nickname: $('#input-nickname').val()
        };
       
        if (id) {
          // Update existing record
          updateRecord(id, data);
        } else {
          // Add new record
          addRecord(data);
        }
        });
  
        $(document).on('click', '.btn-delete', function() {
        var id = $(this).data('id');
        deleteRecord(id);
      });
  });
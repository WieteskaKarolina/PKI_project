function populateTable() {
    $.ajax({
      url: '/tableManage/posts',
      method: 'GET',
      success: function(data) {
        $('tbody').empty();
        data.posts.forEach(function(record) {
          var row = $('<tr>');
          row.append('<td>' + record.title + '</td>');
          row.append('<td>' + record.firstname + '</td>');
          row.append('<td>' + record.creationdate + '</td>');
          row.append('<td>' + record.content + '</td>');
          row.append('<td><button type="button" class="btn btn-primary btn-edit" data-id="' + record.id + 
            '">Edit</button> <button type="button" class="btn btn-danger btn-delete" data-id="' + record.id + 
            '">Delete</button></td>');
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
        url: '/tableManage/posts',
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
        url: '/tableManage/posts/' + id,
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
        url: '/tableManage/posts/' + id,
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

    $('.datepicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
        });

    $(document).on('click', '.btn-edit', function() {
        var id = $(this).data('id');
        $('#modal-form').modal('show');
        $('#modal-form-label').text('Edit Post');

        $.ajax({
        url: '/tableManage/posts/' + id,
        method: 'GET',
        success: function(data) {
            $('#input-record-id').val(id); 
            $('#input-title').val(data.title);
            $('#input-author').val(data.firstname);
            $('#input-date').val(data.creationdate);
            $('#input-content').val(data.content);

            $('#form-record').attr('action', '/tableManage/posts/' + id);
            
            $('.datepicker').datepicker('setDate', data.creationdate);
        },
        error: function(error) {
            console.log(error);
        }
        });
    });

    $('#form-record').submit(function(event) {
        event.preventDefault();

        var id= $('#input-record-id').val();
        var title = $('#input-title').val();
        var author = $('#input-author').val();
        var date = $('#input-date').val();
        var content = $('#input-content').val();
        var formData = {
            title: title,
            author: author,
            date: date,
            content: content
        };
        if (id) {
            updateRecord(id, formData);
        } else {
            addRecord(formData);
        }
    });

    $(document).on('click', '.btn-delete', function() {
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this record?')) {
            deleteRecord(id);
        }
    });


});
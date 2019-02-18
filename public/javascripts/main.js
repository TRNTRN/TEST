$(document).ready(function() {
    var url = ""
    $.ajax({
        type: "GET",
        url: "/recentProject",
        success: function (ResponseText) {
            $('#pagination-container').pagination({
                dataSource: ResponseText,
                pageSize: 2,
                pageNumber: 1,  //Default Page
                callback: function(data, pagination) {
                    var html = template(data);
                    $('#data-container').html(html);
                }
            });
        }
    });
    $("#Sort_strategy").change(function(){
        var Text = $("#Sort_strategy").find("option:selected").text();
		if (Text == "Project Title") {
            url = "/projectTitle";
        } else if (Text == "Recent") {
            url = "/recentProject"
        } else if (Text == "Category") {
            url = "/category"
        } else if (Text == "Username") {
            url = "/username"
        }
        $.ajax({
            type: "GET",
            url: url,
            success: function (ResponseText) {
                $('#pagination-container').pagination({
                    dataSource: ResponseText,
                    pageSize: 2,
                    pageNumber: 1,  //Default Page
                    callback: function(data, pagination) {
                        var html = template(data);
                        $('#data-container').html(html);
                    }
                });
            }
        });
    });

    function template(data) {
        var html = '<table class="table table-striped"><thead><tr><th>Project Title</th><th>Username</th><th>Category Name</th></tr></thead><tbody>';
        $.each(data, function(index, item){
            html += '<tr><td>'+ item.project_title +'</td>';
            html += '<td>'+ item.username +'</td>';
            html += '<td>'+ item.cname +'</td></tr>';
        });
        html += '</tbody></table>';
        return html;
    }
});
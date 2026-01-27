$(document).ready(function() {
  var table = $('#example').DataTable();

  $('#searchByBarkod').on('keyup', function() {
    table.column(0).search(this.value).draw(); // "Marka" sütununun sıra numarası
    
  });
  $('#searchByMarka').on('keyup', function() {
    table.column(1).search(this.value).draw(); // "Marka" sütununun sıra numarası
    
  });
  $('#searchByGerilim').on('keyup', function() {
    table.column(2).search(this.value).draw(); // "Marka" sütununun sıra numarası
    
  });
  $('#searchByKapasite').on('keyup', function() {
    table.column(3).search(this.value).draw(); // "Marka" sütununun sıra numarası
    
  });
  $('#searchByAdet').on('keyup', function() {
    table.column(4).search(this.value).draw(); // "Marka" sütununun sıra numarası
    
  });
  
});
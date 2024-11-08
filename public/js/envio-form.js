$('#login-form').submit(function(event) {
  event.preventDefault();

  var formData = $(this).serialize();
  
  $.ajax({
    url: '/login',
    method: 'POST',
    data: formData,
    success: function(response) {
      // Redireciona para a página desejada após o login bem-sucedido
      window.location.href = '/'; // Altere '/' para a página desejada
    },
    error: function(xhr, status, error) {
      // Exibe mensagem de erro no caso de credenciais inválidas
      alert(JSON.parse(xhr.responseText).message);
    }
  });
});
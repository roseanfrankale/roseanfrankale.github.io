// assets/js/hubspot-form.js

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('my-modern-form');
  const formMessage = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const portalId = '6082856';
      const formId = 'bb8fb749-8c59-4df3-9fe5-eb65fcb39797';
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

      const formData = new FormData(form);
      const data = {
        fields: Array.from(formData.keys()).map(key => ({
          name: key,
          value: formData.get(key)
        }))
      };

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          formMessage.innerHTML = '<div class="alert alert-success">Thank you for your message! I\'ll be in touch soon.</div>';
          form.reset();
        } else {
          formMessage.innerHTML = '<div class="alert alert-danger">Sorry, there was an error submitting the form. Please try again.</div>';
        }
      }).catch(error => {
        formMessage.innerHTML = '<div class="alert alert-danger">An unexpected error occurred. Please check your connection and try again.</div>';
      });
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('my-modern-form');
  const formMessage = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.classList.add('opacity-70', 'cursor-not-allowed');

      const portalId = '6082856';
      const formId = 'bb8fb749-8c59-4df3-9fe5-eb65fcb39797';
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

      // Collect data manually to match HubSpot expected fields
      // Note: Custom fields might need specific internal names (e.g., firstname, email)
      const formData = new FormData(form);
      const data = {
        fields: [
            { name: 'firstname', value: formData.get('firstname') },
            { name: 'lastname', value: formData.get('lastname') },
            { name: 'email', value: formData.get('email') },
            { name: 'message', value: formData.get('message_field') } // Mapping 'message_field' to standard 'message' if needed
        ]
      };

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          formMessage.innerHTML = '<span class="text-green-500">Thank you! I will be in touch soon.</span>';
          form.reset();
        } else {
          formMessage.innerHTML = '<span class="text-red-500">Sorry, there was an error. Please try again.</span>';
        }
      }).catch(error => {
        formMessage.innerHTML = '<span class="text-red-500">Connection error. Please try again later.</span>';
      }).finally(() => {
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
          btn.classList.remove('opacity-70', 'cursor-not-allowed');
      });
    });
  }
});
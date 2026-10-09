
document.getElementById('accommodation-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  // 1. Gather values from your form input fields
  const formData = {
    student_name: document.getElementById('student_name').value,
    address: document.getElementById('address').value,
    start_date: document.getElementById('start_date').value,
    end_date: document.getElementById('end_date').value,
    status: document.getElementById('status').value,
    payment_status: document.getElementById('payment_status').value
  };

  try {
    // 2. Send the data to your backend endpoint
    const response = await fetch('/accommodations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // 3. Read response safely as text first (to catch any HTML/Server errors cleanly)
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (err) {
      result = { error: responseText || `Server returned status ${response.status}` };
    }

    // 4. Handle server errors
    if (!response.ok) {
      throw new Error(result.error || 'Failed to save accommodation');
    }

    // 5. Success!
    alert('Accommodation saved successfully!');
    this.reset(); // Clears out the form inputs

  } catch (err) {
    console.error('Save failed:', err);
    alert('Failed to save: ' + err.message);
  }
});

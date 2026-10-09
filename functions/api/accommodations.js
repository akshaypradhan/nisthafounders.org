document.getElementById('accommodation-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  // 1. Gather values (with temporary defaults for testing)
  const formData = {
    student_name: document.getElementById('student_name').value || 'Jane Doe',
    address: document.getElementById('address').value || '123 University Ave',
    start_date: document.getElementById('start_date').value || '2026-09-01',
    end_date: document.getElementById('end_date').value || '2027-05-31',
    status: document.getElementById('status').value || 'Active',
    payment_status: document.getElementById('payment_status').value || 'Paid'
  };

  try {
    // 2. Send the data to your backend endpoint
    const response = await fetch('/api/accommodations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (err) {
      result = { error: responseText || `Server returned status ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save accommodation');
    }

    alert('Accommodation saved successfully!');
    this.reset();

  } catch (err) {
    console.error('Save failed:', err);
    alert('Failed to save: ' + err.message);
  }
});

export async function onRequest(context) {
  const { request, env } = context;
  // Note: env.DB will automatically map to your D1 database named 'nistha-db'

  // Handle POST: Insert new accommodation record
  if (request.method === "POST") {
    try {
      const data = await request.json();
      
      const query = `
        INSERT INTO accommodations (student_name, address, start_date, end_date, status, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await env.DB.prepare(query)
        .bind(
          data.student_name, 
          data.address, 
          data.start_date, 
          data.end_date, 
          data.status, 
          data.payment_status
        )
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Handle GET: Fetch all active records to display in the table
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM accommodations ORDER BY id DESC"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
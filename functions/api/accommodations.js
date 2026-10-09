// 1. Helper function to fetch recommendations from the D1 database
async function recommendations(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM accommodations ORDER BY id DESC LIMIT 5"
  ).all();
  
  return results;
}

// 2. Main Cloudflare Worker entry point
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Route: GET /accommodations/recommendations (or just checking the path)
  if (request.method === "GET" && url.pathname.includes("/recommendations")) {
    try {
      const data = await recommendations(env);
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Route: POST /accommodations (Insert new record)
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

  // Fallback for any other request types
  return new Response(JSON.stringify({ error: "Route not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
}

// worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method === "POST") {
      try {
        const data = await request.json();
        const { studentName, studentId, testType, score, total, answers } = data;
        await env.DB.prepare(
          `INSERT INTO responses (timestamp, student_name, student_id, test_type, score, total, answers) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          (/* @__PURE__ */ new Date()).toISOString(),
          studentName,
          studentId,
          testType,
          score,
          total,
          JSON.stringify(answers)
        ).run();
        return new Response(JSON.stringify({ status: "success", message: "Saved to D1 successfully" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: "error", message: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

export function exportToCSV(results: any[], prompt: string) {
  if (!results || results.length === 0) return;

  const headers = ["Model", "Response", "Latency (s)", "Tokens", "Cost ($)", "Accuracy Score", "Reasoning"];
  const rows = results.map(r => [
    r.model,
    `"${r.response.replace(/"/g, '""')}"`,
    r.latency,
    r.tokens,
    r.cost,
    r.accuracy,
    `"${r.reasoning.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    [`Prompt: "${prompt.replace(/"/g, '""')}"`],
    [],
    headers,
    ...rows
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ai-nexus-eval-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

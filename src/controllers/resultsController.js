export function handleResults(req, res) {
  const { quizId, completions } = req.body;

  if (!quizId || !Array.isArray(completions)) {
    return res.status(400).json({
      message: "Invalid request body"
    });
  }

  const topUsers = completions
    .filter((entry) => entry.correct)
    .sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate))
    .slice(0, 3);

  return res.json({ topUsers });
}

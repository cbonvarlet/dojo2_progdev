async function handler(_req: Request): Promise<Response> {
  if (_req.method === "OPTIONS") {
    return handlePreFlightRequest();
  }

  try {
    // 1. Récupérer les données envoyées par Angular (le mot du joueur)
    const body = await _req.json();
    const userWord = typeof body === "object" && body !== null ? (body.value || body.word) : body;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    // 2. Préparer la requête pour l'API distante avec le mot de l'utilisateur
    const similarityRequestBody = JSON.stringify({
      word1: "secret", // Le mot mystère cible (ou autre selon votre logique)
      word2: userWord, // Le mot entré par le joueur !
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: similarityRequestBody,
      redirect: "follow",
    };

    const response = await fetch("https://word2vec-ten.vercel.app/similarity", requestOptions);
    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}

async function handler(_req: Request): Promise<Response> {
  // Gérer correctement les requêtes préliminaires CORS (OPTIONS)
  if (_req.method === "OPTIONS") {
    return handlePreFlightRequest();
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const similarityRequestBody = JSON.stringify({
    word1: "centrale",
    word2: "supelec",
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: similarityRequestBody,
    redirect: "follow",
  };

  try {
    // Vérifiez si l'URL de l'API Vercel nécessite un chemin spécifique (ex: /api/similarity)
    const response = await fetch("https://word2vec-ten.vercel.app", requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur Vercel (${response.status}) :`, errorText);
      return new Response(JSON.stringify({ error: `API Distante Erreur: ${response.status}`, details: errorText }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Erreur interne Deno:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

Deno.serve(handler);
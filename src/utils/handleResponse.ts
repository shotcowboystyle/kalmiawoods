export function handleSuccessful(payload: any) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function handleError(error: unknown) {
  console.log("HR: An error occurred");
  console.log(JSON.stringify(error, null, 2));

  return new Response(JSON.stringify(error, null, 2), {
    status: 400,
  });
}

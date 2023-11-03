export function handleRequestSuccess(payload: any) {
	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export function handleRequestError(error: unknown) {
	// console.log("HR: An error occurred");
	// console.log(JSON.stringify(error, null, 2));

	return new Response(JSON.stringify(error, null, 2), {
		status: 400,
	});
}

export const isValidFormSubmission = (request: Request) => {
  if (!['POST', 'PUT', 'DELETE'].includes(request.method)) {
    return false;
  }
  const originHeader = request.headers.get('Origin');
  if (!originHeader || originHeader !== new URL(request.url).origin) {
    return false;
  }
  return true;
};

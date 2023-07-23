import { handleRequestError, handleRequestSuccess } from './handleResponse';

export async function handleRequest(request: Request, callable: Function) {
  // console.log("R: ", request.method, request.url);

  try {
    const result = await callable();
    return handleRequestSuccess(result);
  } catch (error) {
    return handleRequestError(error);
  }
}

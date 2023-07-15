import {
  handleError,
  handleSuccessful as handleSuccess,
} from "./handleResponse";

export async function handleRequest(request: Request, callable: Function) {
  console.log("R: ", request.method, request.url);

  try {
    const result = await callable();

    return handleSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}

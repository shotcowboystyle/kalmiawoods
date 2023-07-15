import type { ZodObject, ZodRawShape } from "zod";

export function parseRequestParams<T extends ZodRawShape>(
  request: Request,
  zodRequestObject: ZodObject<T>
) {
  return zodRequestObject.parse(
    Object.fromEntries(new URL(request.url).searchParams)
  );
}

export function parseParams<T extends ZodRawShape>(
  params: Object,
  zodRequestObject: ZodObject<T>
) {
  return zodRequestObject.parse(params);
}

export async function parseRequestBody<T extends ZodRawShape>(
  request: Request,
  zodRequestObject: ZodObject<T>
) {
  return zodRequestObject.parse(await request.json());
}

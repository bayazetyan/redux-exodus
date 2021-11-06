export async function getResponse(response: Response | Record<string, any>): Promise<{ isSuccess: boolean, data: any }> {
  let isSuccess

  if (response instanceof Response) {
    isSuccess = response.ok
  } else {
    isSuccess = response && !response.error && !response.errors
  }

  const result = response instanceof Response
    ? response.headers.get('Content-type')?.includes('json') ? await response?.json() : await response?.text()
    : response

  return { isSuccess, data: result }
}

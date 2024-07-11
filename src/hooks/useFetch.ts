export default function useFetch() {
  const callApi = async (method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH', route: string, data?: Record<string, any>) => {
    try {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
      });

      const requestOptions: RequestInit = {
        method,
        headers: myHeaders,
        ...(data ? { body: JSON.stringify(data) } : {}),
      };

      console.log(`Sending ${method} request to ${import.meta.env.VITE_API_BASE_URL}${route} with data:`, data); // Debug log

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${route}`, requestOptions);
      const result = await response.json();

      console.log(`Response from ${route}:`, result); // Debug log

      return result;
    } catch (error) {
      console.error(`Error during ${method} request to ${route}:`, error);
      return false;
    }
  };

  return {
    get: (route: string) => callApi('GET', route),
    post: (route: string, data: Record<string, any>) => callApi('POST', route, data),
    put: (route: string, data: Record<string, any>) => callApi('PUT', route, data),
    patch: (route: string, data: Record<string, any>) => callApi('PATCH', route, data),
    delete: (route: string, data?: Record<string, any>) => callApi('DELETE', route, data),
  }
}

import ExternalServiceHttpException from "#exceptions/external_service_http_exception"
import ExternalServiceNetworkException from "#exceptions/external_service_network_exception"


export class HttpClient{

    async makeRequest<T = any>(url: string, options?: RequestInit, actionMessage: string = 'performing request'): Promise<T> {
        let response: Response
        try {
            response = await fetch(url, options)
        } catch (error) {
            throw new ExternalServiceNetworkException(`Network error ${actionMessage}: ${error}`)
        }
        if (!response.ok) {
            throw new ExternalServiceHttpException(`External service responded with ${response.status}`)
        }
        
        const text = await response.text()
        return (text ? JSON.parse(text) : undefined) as T
    }
}
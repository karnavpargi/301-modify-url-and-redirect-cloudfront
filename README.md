# 301-modify-url-and-redirect-cloudfront
### **Lambda@Edge 301 Redirect Function for CloudFront**

This Lambda function is designed to handle URL redirection for a CloudFront distribution using Lambda@Edge. It intercepts incoming requests and, based on a predefined set of URL mappings, it issues a 301 permanent redirect if the requested path matches one of the specified paths. If no matching redirect rule is found, the request is allowed to proceed to its original destination.

#### **Functionality Overview:**
- **Input**: The function is triggered when CloudFront receives a viewer request.
- **Processing**: It checks the requested URI against a list of predefined mappings.
- **Output**: If a match is found, a 301 HTTP response with the new location is returned. Otherwise, the original request is passed along without modification.

#### **Key Features:**
1. **Event Handling**: The function listens for `Viewer Request` events from CloudFront, which provide details about the request made by the end-user.
   
2. **URI Matching**: The requested URI (`request.uri`) is compared to a `redirectMappings` dictionary that contains old paths as keys and new paths as values. The function currently supports the following mappings:
   - `/contact` -> `/contact-us`
   - `/about` -> `/about-us`
   - `/terms-and-conditions` -> `/terms`

3. **301 Redirect Logic**:
   - If a match is found in the `redirectMappings`:
     - A 301 status code (`Moved Permanently`) is returned, along with a `Location` header that indicates the new URL.
     - The `Cache-Control` header is set with a `max-age` of 3600 seconds (1 hour) to instruct browsers and CloudFront to cache the redirect for this duration.
   - If no match is found, the original request is allowed to proceed to the origin or cached content.

4. **Error Handling**: In case of any errors during the function's execution, the error is logged, and the function will return an error response back to the caller.

#### **Sample Behavior:**
- A request to `/contact` will be redirected to `/contact-us` with a 301 status.
- A request to `/about` will be redirected to `/about-us`.
- A request to `/terms-and-conditions` will be redirected to `/terms`.
- A request to `/other-path` will pass through normally without any redirection.

#### **Example Redirect Response:**
```json
{
  "status": "301",
  "statusDescription": "Moved Permanently",
  "headers": {
    "location": [
      {
        "key": "Location",
        "value": "/new-path"
      }
    ],
    "cache-control": [
      {
        "key": "Cache-Control",
        "value": "max-age=3600"
      }
    ]
  }
}
```

#### **Execution Flow:**
1. The function is invoked when a user makes a request through CloudFront.
2. The requested URI is extracted and checked against the `redirectMappings` dictionary.
3. If a match is found, a 301 redirect response is returned with the appropriate headers.
4. If no match is found, the original request is passed to the origin or cache.

#### **Important Notes**:
- **Caching**: The redirect responses are cached for one hour (3600 seconds). If this is too long for your application, adjust the `max-age` value in the `Cache-Control` header.
- **Error Logging**: Errors are logged to help with debugging but are not exposed to the end-user.

This Lambda@Edge function provides a simple and efficient way to implement permanent URL redirection at the edge, ensuring that users are directed to the correct location with minimal latency.
